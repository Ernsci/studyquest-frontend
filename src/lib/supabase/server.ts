import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { requireSupabasePublicConfig } from "@/config/env";

/**
 * Server-side Supabase client for the **current learner**.
 *
 * It uses the anon key plus the session cookie, so every query is filtered by
 * Row Level Security — the same rules a tampered client would hit. This is the
 * only Supabase client used by pages, route handlers and server actions.
 * There is deliberately no service-role/secret-key client in `src/`.
 *
 * Safe to call from a Server Component, but only reads: never mutate from a
 * Server Component (Next 16 forbids it) — do writes in server actions.
 */
export async function createSupabaseServer() {
  const { url, anonKey } = requireSupabasePublicConfig();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component where cookies are read-only.
          // `src/lib/supabase/session.ts` refreshes the session instead.
        }
      },
    },
  });
}

/** Tables whose `snake_case` column names we map to camelCase in src/lib/db.ts. */
export const TABLE = {
  profiles: "profiles",
  subjects: "subjects",
  modules: "modules",
  lessons: "lessons",
  questions: "questions",
  questionSolutions: "question_solutions",
  lessonCompletions: "lesson_completions",
  quizAttempts: "quiz_attempts",
  quizAnswers: "quiz_attempt_answers",
  bookmarks: "bookmarks",
  savedQuestions: "saved_questions",
  activity: "daily_activity",
  planItems: "plan_items",
  reports: "content_reports",
  feedback: "feedback",
  audit: "audit_logs",
} as const;
