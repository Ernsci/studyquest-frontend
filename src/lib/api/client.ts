import { apiBase } from "@/config/env";

/**
 * Isomorphic HTTP client for the StudyQuest API.
 *
 * Every screen goes through this so that one place decides how the bearer token
 * is attached, how failures are shaped and how long a request may take. Nothing
 * throws: callers get `{ ok: true, data }` or `{ ok: false, error }` and must
 * render the error — a blank screen is never an acceptable outcome.
 */

export type ApiErrorBody = {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiErrorBody };

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = body.code;
    this.fieldErrors = body.fieldErrors;
  }
}

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Supabase access token, or a `demo.<userId>` token while demo mode is on. */
  token?: string | null;
  cache?: RequestCache;
  timeoutMs?: number;
  signal?: AbortSignal;
};

const DEFAULT_TIMEOUT_MS = 10_000;
const NETWORK_MESSAGE =
  "We could not reach the StudyQuest API. Check your connection and try again.";
const TIMEOUT_MESSAGE = "The StudyQuest API took too long to answer. Please try again.";

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function readError(payload: unknown, status: number): ApiErrorBody {
  const body = payload as { error?: Partial<ApiErrorBody> } | null;
  const error = body?.error;
  if (error && typeof error.message === "string" && error.message.length > 0) {
    return {
      code: typeof error.code === "string" ? error.code : `http_${status}`,
      message: error.message,
      ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
    };
  }
  return {
    code: `http_${status}`,
    message:
      status === 404
        ? "We could not find that resource."
        : "Something went wrong while loading this page.",
  };
}

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  try {
    const response = await fetch(apiBase(path), {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: options.cache ?? "no-store",
      signal: options.signal ?? controller.signal,
    });

    const text = await response.text();
    const payload = text.length > 0 ? parseJson(text) : null;
    if (!response.ok) return { ok: false, error: readError(payload, response.status) };
    return { ok: true, data: payload as T };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return {
      ok: false,
      error: { code: aborted ? "timeout" : "network_error", message: aborted ? TIMEOUT_MESSAGE : NETWORK_MESSAGE },
    };
  } finally {
    clearTimeout(timeout);
  }
}

/** Message for the first field the API rejected — used next to form inputs. */
export function fieldError(
  error: ApiErrorBody,
  field: string,
): string | null {
  return error.fieldErrors?.[field]?.[0] ?? null;
}
