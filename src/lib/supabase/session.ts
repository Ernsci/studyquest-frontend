import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { isSupabaseConfigured, publicEnv } from "@/config/env";

/**
 * Session handling in the split architecture.
 *
 * Supabase owns the session cookie *on this origin only* (the frontend), which is
 * why no cross-site cookie is needed: pages render on the server and forward the
 * access token to the API as a bearer token. See `src/lib/api/server.ts`.
 *
 * While Supabase is not configured the API hands out a demo bearer token instead;
 * it is stored in an httpOnly cookie and stops working as soon as the API sees
 * Supabase configuration.
 */

export const DEMO_TOKEN_COOKIE = "sq_demo_token";

const DEMO_ACCOUNT = "demo-learner";
const DEMO_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

/** Routes that must never bounce through the auth redirect loop. */
const PUBLIC_ROUTE_PREFIXES = ["/auth", "/api/health", "/icon", "/favicon"];

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/" || pathname === "/about") return true;
  return PUBLIC_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Asks the API for a demo bearer token; returns null when the API is unreachable. */
async function requestDemoToken(): Promise<string | null> {
  if (publicEnv.apiUrl.length === 0) return null;
  try {
    const response = await fetch(`${publicEnv.apiUrl}/api/auth/demo-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account: DEMO_ACCOUNT }),
      cache: "no-store",
    });
    if (!response.ok) {
      console.warn(
        `[studyquest:proxy] demo session refused by the API (HTTP ${response.status})`,
      );
      return null;
    }
    const payload = (await response.json()) as { token?: string };
    return payload.token ?? null;
  } catch (error) {
    console.warn(
      "[studyquest:proxy] StudyQuest API unreachable:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    if (!request.cookies.get(DEMO_TOKEN_COOKIE)?.value) {
      const token = await requestDemoToken();
      if (token) {
        response.cookies.set(DEMO_TOKEN_COOKIE, token, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: DEMO_TOKEN_MAX_AGE,
          secure: publicEnv.siteUrl.startsWith("https://"),
        });
      }
    }
    return response;
  }

  const { url, anonKey } = {
    url: publicEnv.supabaseUrl,
    anonKey: publicEnv.supabaseAnonKey,
  };

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // `getUser()` verifies the JWT with Supabase instead of trusting the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("next", `${pathname}${search}`);
    const redirected = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) => redirected.cookies.set(cookie));
    return redirected;
  }

  if (user && (pathname === "/auth/login" || pathname === "/auth/signup")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
