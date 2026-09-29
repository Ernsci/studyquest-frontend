import { cookies } from "next/headers";

import { isSupabaseConfigured } from "@/config/env";
import { createSupabaseServer } from "@/lib/supabase/server";
import { apiFetch, type ApiRequestOptions, type ApiResult } from "./client";

/**
 * Server-side API access for Server Components, route handlers and server
 * actions.
 *
 * The bearer token comes from one of two places:
 *  - the Supabase session cookie (normal operation), or
 *  - the `sq_demo_token` cookie that `lib/supabase/session.ts` fills in while
 *    Supabase is not configured.
 *
 * Only the token travels: the API re-derives identity from it, so a tampered
 * cookie can at worst impersonate the shared demo learner.
 */

export const DEMO_TOKEN_COOKIE = "sq_demo_token";

export async function accessToken(): Promise<string | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServer();
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    } catch {
      // No session, or cookies were read-only: treat the visitor as anonymous.
      return null;
    }
  }

  const store = await cookies();
  return store.get(DEMO_TOKEN_COOKIE)?.value ?? null;
}

export async function serverApi<T>(
  path: string,
  options: Omit<ApiRequestOptions, "token"> = {},
): Promise<ApiResult<T>> {
  return apiFetch<T>(path, { ...options, token: await accessToken() });
}
