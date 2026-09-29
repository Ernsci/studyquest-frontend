import { cookies } from "next/headers";

import { isSupabaseConfigured } from "@/config/env";
import { createSupabaseServer } from "@/lib/supabase/server";
import { apiFetch, type ApiRequestOptions, type ApiResult } from "./client";



export const DEMO_TOKEN_COOKIE = "sq_demo_token";

export async function accessToken(): Promise<string | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServer();
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    } catch {

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
