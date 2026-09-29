import { createBrowserClient } from "@supabase/ssr";

import { requireSupabasePublicConfig } from "@/config/env";


let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserSupabase() {
  if (cached) return cached;
  const { url, anonKey } = requireSupabasePublicConfig();
  cached = createBrowserClient(url, anonKey);
  return cached;
}


export function browserCanUseSupabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return url.trim().length > 0 && key.trim().length > 0;
}

