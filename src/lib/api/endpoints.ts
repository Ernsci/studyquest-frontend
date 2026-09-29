import { apiFetch, type ApiResult } from "./client";
import { accessToken } from "./server";
import type {
  AttemptResult,
  AttemptSummary,
  Bookmark,
  DailyActivity,
  LearnerStats,
  Lesson,
  Profile,
  Question,
  QuestionSolution,
  SavedQuestion,
  StudyPlan,
  SubjectDetail,
  SubjectProgress,
  SubjectSummary,
} from "@/lib/types";



export type ApiMeta = {
  site: { name: string; shortName: string; tagline: string; locale: string };
  features: Record<string, boolean>;
  subjects: { enabled: string[]; pageSize: number };
  learning: {
    xpPerLesson: number;
    xpPerCorrectAnswer: number;
    quizPassBonus: number;
    passMark: number;
    dailyGoalMinutes: number;
    heatmapDays: number;
    streak: { enabled: boolean; allowFreeze: boolean; freezeXpCost: number; onFireAt: number };
    spacedReview: { intervalsDays: number[]; autoAddMissed: boolean; sessionSize: number };
    plan: { horizonDays: number; defaultLessonsPerWeek: number };
  };
  practice: {
    sessionSizes: Record<string, number>;
    maxQuestions: number;
    explainAfterEachAnswer: boolean;
    shuffleOptions: boolean;
    masteryScore: number;
  };
  demo: { contentMode: "demo" | "supabase"; accountsEnabled: boolean };
};

export type SubjectListResponse = {
  subjects: Array<SubjectSummary & { progress: SubjectProgress | null }>;
  progress: SubjectProgress[] | null;
};

export type SubjectDetailResponse = {
  subject: SubjectDetail;
  completedLessons: Array<{ slug: string; percent: number | null; completedAt: string | null }>;
};

export type PracticeSessionResponse = {
  subject: { slug: string; title: string; colorHex: string };
  questions: Question[];
  totalAvailable: number;
};

export type LessonResponse = {
  lesson: Lesson;
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
  questions: Question[];
  progress: { bestPercent: number | null; completed: boolean } | null;
};

export type ProgressResponse = {
  stats: LearnerStats;
  subjects: SubjectProgress[];
  recentAttempts: AttemptSummary[];
};

export type MeResponse = { profile: Profile; stats: LearnerStats; demo: boolean };

export type BookmarkToggleResponse = { bookmarked: boolean; lessonSlug: string; message: string };

export type ReviewResponse = { items: SavedQuestion[]; questions: Question[] };


export type AdminContentResponse = {
  subjects: Array<SubjectSummary & { updatedAt: string }>;
  lessons: unknown[];
  questions: Array<QuestionSolution & { updatedAt: string }>;
};

export type AdminOverviewResponse = {
  overview: {
    learners: number;
    admins: number;
    attempts: number;
    lessonsCompleted: number;
    openReports: number;
    feedbackEntries: number;
    subjects: number;
    lessons: number;
    questions: number;
  };
  recentReports: unknown[];
  recentFeedback: unknown[];
  audit: unknown[];
};

export type PracticeSubmitResponse = {
  attempt: AttemptResult;
  profile: Profile;
  stats: LearnerStats;
  lessonCompleted: boolean;
  reviewQueued: number;
};

export type SessionState = { signedIn: boolean; profile: Profile | null; demo?: boolean };



const withToken = async <T,>(
  path: string,
  options: Parameters<typeof apiFetch<T>>[1] = {},
): Promise<ApiResult<T>> => {
  const token = await accessToken();
  return apiFetch<T>(path, { ...options, token });
};

export const api = {
  meta: () => apiFetch<ApiMeta>("/api/meta"),
  session: () => withToken<SessionState>("/api/auth/session"),
  subjects: () => withToken<SubjectListResponse>("/api/subjects"),
  subject: (slug: string) => withToken<SubjectDetailResponse>(`/api/subjects/${slug}`),
  practiceSession: (slug: string, lessonSlug?: string | null, size?: number) =>
    withToken<PracticeSessionResponse>(
      `/api/subjects/${encodeURIComponent(slug)}/practice?${new URLSearchParams({ ...(lessonSlug ? { lesson: lessonSlug } : {}), ...(size ? { size: String(size) } : {}) }).toString()}`,
    ),
  lesson: (subjectSlug: string, lessonSlug: string) =>
    withToken<LessonResponse>(`/api/subjects/${subjectSlug}/lessons/${lessonSlug}`),
  me: () => withToken<MeResponse>("/api/me"),
  progress: () => withToken<ProgressResponse>("/api/progress"),
  attempts: () => withToken<{ attempts: AttemptSummary[] }>("/api/attempts"),
  attempt: (id: string) => withToken<{ attempt: AttemptResult }>(`/api/attempts/${id}`),
  bookmarks: () => withToken<{ bookmarks: Bookmark[] }>("/api/bookmarks"),
  review: (includeMastered = false) =>
    withToken<ReviewResponse>(`/api/review${includeMastered ? "?all=true" : ""}`),
  plan: () => withToken<{ plan: StudyPlan; subjects: SubjectProgress[] }>("/api/plan"),
  submitPractice: (body: {
    mode: "practice" | "quiz" | "lesson" | "review";
    subjectSlug?: string;
    lessonSlug?: string;
    durationSeconds?: number;
    answers: Array<{ questionId: string; answer: import("@/lib/types").StudentAnswer }>;
  }) => withToken<PracticeSubmitResponse>("/api/practice/submit", {
    method: "POST",
    body,
  }),
  heatmap: (stats: LearnerStats): DailyActivity[] => stats.heatmap,
};
