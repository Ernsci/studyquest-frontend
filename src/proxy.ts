import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/session";

/**
 * Refreshes the Supabase session cookie on every request so server components
 * see a valid session, and sends unauthenticated visitors to /auth/login for
 * protected routes. Runs on the edge runtime.
 *
 * Next.js 16 renamed the `middleware` convention to `proxy`; the behaviour is
 * unchanged (`config.matcher` still applies).
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image files.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
