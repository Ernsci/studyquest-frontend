

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


export const publicEnv = {

  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, ""),

  supabaseUrl: normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL, ""),

  supabaseAnonKey: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim(),

  siteUrl: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL, site.url),

  themeDefault: readThemeMode(process.env.NEXT_PUBLIC_THEME_DEFAULT),

  enableDemoMode: bool(process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE, false),
} as const;


export function isSupabaseConfigured(): boolean {
  return publicEnv.supabaseUrl.length > 0 && publicEnv.supabaseAnonKey.length > 0;
}


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


export function apiBase(path: string): string {
  const base = requireApiUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
