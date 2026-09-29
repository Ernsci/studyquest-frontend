import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { requireSupabasePublicConfig } from "@/config/env";


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


        }
      },
    },
  });
}


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
