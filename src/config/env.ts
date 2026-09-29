/**
 * Environment access — the ONLY module in the frontend that reads `process.env`.
 *
 * Everything the browser needs is a `NEXT_PUBLIC_` value and is inlined at build
 * time. There are no secrets here at all: the service-role key, the demo
 * password and every grading rule live in the API (`backend/`). The frontend
 * authenticates against Supabase and sends the resulting access token to the API
 * as `Authorization: Bearer …`.
 */

import { site, theme, type ThemeMode } from "./app-config";

const TRUE_VALUES = ["1", "true", "yes", "on"];

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  return TRUE_VALUES.includes(value.toLowerCase());
}

function normalizeUrl(value: string | undefined, fallback: string): string {
  const raw = (value ?? "").trim().replace(/\/+$/, "");
  return raw.length > 0 ? raw : fallback;
}

function readThemeMode(value: string | undefined): ThemeMode {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : theme.defaultMode;
}

/* ------------------------------------------------------------------- public */
export const publicEnv = {
  /** Base URL of the StudyQuest API (Render in production, :8080 locally). */
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, ""),
  /** Supabase project URL — empty when the app runs in demo mode. */
  supabaseUrl: normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL, ""),
  /** Publishable anon key (RLS still applies) — empty when unset. */
  supabaseAnonKey: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim(),
  /** Canonical origin, used for auth redirects and metadata URLs. */
  siteUrl: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL, site.url),
  /** Theme used when the visitor has saved no preference. */
  themeDefault: readThemeMode(process.env.NEXT_PUBLIC_THEME_DEFAULT),
  /** Offer a demo-mode toggle even when Supabase is configured. */
  enableDemoMode: bool(process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE, false),
} as const;

/** True when a Supabase project is reachable, i.e. real accounts are in play. */
export function isSupabaseConfigured(): boolean {
  return publicEnv.supabaseUrl.length > 0 && publicEnv.supabaseAnonKey.length > 0;
}

/**
 * Demo mode means "no account system": without Supabase the only identity is the
 * demo learner the API hands out.
 */
export function isDemoModeEnabled(): boolean {
  return publicEnv.enableDemoMode || !isSupabaseConfigured();
}

export function requireSupabasePublicConfig(): { url: string; anonKey: string } {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or leave demo mode on.",
    );
  }
  return { url: publicEnv.supabaseUrl, anonKey: publicEnv.supabaseAnonKey };
}

export function requireApiUrl(): string {
  if (publicEnv.apiUrl.length === 0) {
    throw new Error(
      "Set NEXT_PUBLIC_API_URL to the address of the StudyQuest API (see .env.example).",
    );
  }
  return publicEnv.apiUrl;
}

/** Builds an absolute API URL from a path such as `/api/subjects`. */
export function apiBase(path: string): string {
  const base = requireApiUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
