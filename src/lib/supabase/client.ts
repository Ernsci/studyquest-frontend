import { createBrowserClient } from "@supabase/ssr";

import { requireSupabasePublicConfig } from "@/config/env";

/**
 * Browser Supabase client (anon key + RLS). Session is read from cookies by
 * `@supabase/ssr`, so refreshes survive reloads. Created once per tab.
 *
 * Only the two PUBLIC variables are used here. Nothing sensitive is available
 * to this client: the database will refuse anything RLS does not allow, even if
 * a learner edits this file's counterpart in their own browser.
 */
let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserSupabase() {
  if (cached) return cached;
  const { url, anonKey } = requireSupabasePublicConfig();
  cached = createBrowserClient(url, anonKey);
  return cached;
}

/** True when the browser can reach Supabase (otherwise demo mode). */
export function browserCanUseSupabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return url.trim().length > 0 && key.trim().length > 0;
}

