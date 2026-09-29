/**
 * ============================================================================
 * StudyQuest — central application configuration
 * ============================================================================
 * This is the single place to change the app's identity, theme, navigation,
 * enabled subjects, feature flags and learning rules. Values here are safe to
 * read from both server and browser code.
 *
 * Secrets never live here. Anything private belongs in environment variables
 * and is read only in `src/config/env.ts`.
 *
 * Contents: 1 site · 2 theme · 3 navigation+features · 4 subjects · 5 learning
 *           6 playground · 7 practice · 8 limits · 9 storage · helpers
 * ============================================================================
 */

export type ThemeMode = "light" | "dark" | "system";

/* ------------------------------------------------------------------- 1. site */
export const site = {
  name: "StudyQuest",
  shortName: "SQ",
  tagline: "Learn by doing, one quest at a time.",
  description:
    "StudyQuest is an interactive learning platform for programming and technical skills: structured lessons, a code playground, quizzes with explanations, and progress that follows you across devices.",
  url: "http://localhost:3000",
  locale: "en",
  keywords: [
    "learn programming",
    "interactive lessons",
    "coding exercises",
    "javascript tutorial",
    "sql practice",
    "quizzes",
  ],
  logo: {
    /** Rendered as an inline SVG mark (components/logo.tsx) — no binary asset needed. */
    mark: "quest",
    wordmark: "StudyQuest",
    alt: "StudyQuest home",
    /** Emoji fallback; the favicon itself is generated in app/icon.tsx. */
    fallback: "📘",
  },
  footer: {
    blurb:
      "An original learning experience: short lessons, real practice, and honest feedback.",
    columns: [
      {
        title: "Learn",
        links: [
          { label: "Subjects", href: "/subjects" },
          { label: "Practice", href: "/practice" },
          { label: "Review queue", href: "/review" },
          { label: "Playground", href: "/playground" },
        ],
      },
      {
        title: "Account",
        links: [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Bookmarks", href: "/bookmarks" },
          { label: "Profile", href: "/profile" },
          { label: "Sign in", href: "/auth/login" },
        ],
      },
      {
        title: "About",
        links: [
          { label: "How StudyQuest works", href: "/about" },
          { label: "Security notes", href: "/about#security" },
          { label: "Report a problem", href: "/dashboard#reports" },
        ],
      },
    ],
  },
} as const;

/* ------------------------------------------------------------------ 2. theme */
export const theme = {
  /** Default for first-time visitors: light | dark | system. */
  defaultMode: "system" as ThemeMode,
  /** Show the light/dark toggle in the header. */
  toggleEnabled: true,
  colors: {
    /** Brand scale, exposed to Tailwind as `bg-brand-500`, `text-brand-600`, … */
    brand: {
      50: "#f2f1ff",
      100: "#e6e3ff",
      200: "#cfc9ff",
      300: "#b1a4ff",
      400: "#9079f8",
      500: "#7157ec",
      600: "#5b3fd1",
      700: "#4a33aa",
      800: "#3d2b88",
      900: "#2b1f61",
    },
    /** Accent used for streaks, XP and highlights. */
    accent: {
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
    },
    state: {
      success: "#15803d",
      danger: "#b91c1c",
      info: "#0369a1",
    },
  },
  fonts: {
    /** System-first stacks: no external font request, works offline, CSP friendly. */
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  },
} as const;

/* ------------------------------------------------- 3. navigation + features */
export const features = {
  /** Light/dark toggle + persisted theme preference. */
  darkMode: true,
  /** Consecutive-day streaks and the activity heatmap. */
  streaks: true,
  /** Daily reminder time + email-verification nudge on the profile page. */
  studyReminders: true,
  /** Inline code playground on lessons and /playground. */
  playground: true,
  /** Quizzes and practice sessions. */
  quizzes: true,
  /** Leitner-style spaced review for saved questions and missed answers. */
  spacedReview: true,
  /** Bookmark lessons. */
  bookmarks: true,
  /** Save practice questions to review later. */
  savedQuestions: true,
  /** Learner feedback form. */
  feedback: true,
  /** Learners can flag confusing or wrong content. */
  reports: true,
  /** Personalised study plan + next-best-lesson recommendations. */
  recommendations: true,
  /** Admin area (/admin). Access is ALSO enforced by server checks + RLS. */
  adminPanel: true,
  /** In-memory sample content when Supabase is not configured, or as a toggle. */
  demoMode: true,
} as const;

export type FeatureFlag = keyof typeof features;

export type NavItem = {
  label: string;
  href: string;
  /** Only shown to signed-in users. */
  authRequired?: boolean;
  /** Only shown to users with one of these roles. */
  roles?: Array<"learner" | "admin">;
  /** Requires this feature flag to be on. */
  feature?: FeatureFlag;
};

export const navigation = {
  primary: [
    { label: "Subjects", href: "/subjects" },
    { label: "Practice", href: "/practice", feature: "quizzes" },
    { label: "Playground", href: "/playground", feature: "playground" },
    { label: "Review", href: "/review", feature: "spacedReview", authRequired: true },
    { label: "Dashboard", href: "/dashboard", authRequired: true },
  ] satisfies NavItem[],
  /** Shown in the avatar menu on desktop, and at the end of the mobile menu. */
  account: [
    { label: "Dashboard", href: "/dashboard", authRequired: true },
    { label: "Bookmarks", href: "/bookmarks", feature: "bookmarks", authRequired: true },
    { label: "Profile & data", href: "/profile", authRequired: true },
    { label: "Admin panel", href: "/admin", feature: "adminPanel", roles: ["admin"] },
  ] satisfies NavItem[],
} as const;

/* ---------------------------------------------------------------- 4. subjects */
/**
 * Which subjects are enabled. Slugs must match `subjects.slug` in Supabase.
 * `enabled: false` hides a subject everywhere without deleting content.
 * `sample: true` marks subjects that ship with built-in sample lessons so the
 * app is fully usable before you add your own content.
 */
export const subjectCatalog = [
  { slug: "javascript", title: "JavaScript", enabled: true, sample: true },
  { slug: "html-css", title: "HTML & CSS", enabled: true, sample: true },
  { slug: "python", title: "Python", enabled: true, sample: true },
  { slug: "sql", title: "SQL & Databases", enabled: true, sample: true },
  { slug: "web-security", title: "Web Security Basics", enabled: true, sample: true },
  { slug: "data-structures", title: "Data Structures", enabled: false, sample: false },
] as const;

export const subjects = {
  /** Ordered slugs of enabled subjects (derived from `subjectCatalog`). */
  enabled: subjectCatalog.filter((s) => s.enabled).map((s) => s.slug),
  pageSize: 12,
} as const;

/* ---------------------------------------------------------------- 5. learning */
/**
 * Display defaults only. The API (`backend/src/config/app-config.ts`) is the
 * authority for pass marks, XP and session sizes: it reads them from
 * `GET /api/meta` so a scoring change never needs a frontend redeploy. These
 * copies keep static pages rendering before the API answers.
 */
export const learning = {
  /** XP awarded for finishing a lesson. */
  xpPerLesson: 20,
  /** XP awarded per correct practice answer. */
  xpPerCorrectAnswer: 5,
  /** Bonus XP for passing a quiz. */
  quizPassBonus: 25,
  /** Fraction of points needed to pass a quiz (0.7 = 70%). */
  passMark: 0.7,
  /** Default daily target shown on the dashboard. */
  dailyGoalMinutes: 20,
  /** Days rendered in the activity heatmap. */
  heatmapDays: 91,
  streak: {
    enabled: true,
    /** Freeze tokens let a learner miss one day without losing the streak. */
    allowFreeze: true,
    /** XP cost of one freeze token. */
    freezeXpCost: 150,
    /** A streak of this length is described as "on fire". */
    onFireAt: 7,
  },
  spacedReview: {
    /** Leitner intervals in days, indexed by review box (box 0 = review now). */
    intervalsDays: [0, 1, 3, 7, 21],
    /** Automatically queue a missed practice question for review. */
    autoAddMissed: true,
    /** Maximum items surfaced per review session. */
    sessionSize: 12,
  },
  plan: {
    /** Days covered by the generated study plan. */
    horizonDays: 14,
    /** Lessons suggested per week when the learner has set no weekly goal. */
    defaultLessonsPerWeek: 3,
  },
} as const;

/* -------------------------------------------------------------- 6. playground */
export const playground = {
  /** Only JavaScript runs, and only inside the browser. See components/code-runner.tsx. */
  language: "javascript",
  /** Limits that keep the sandboxed runner from hanging the tab. */
  maxOutputLines: 200,
  maxRuntimeMs: 2000,
  maxSourceLength: 20000,
  /** Inject a tiny console/date helper (no network, no DOM access). */
  enableConsoleShim: true,
} as const;

/* ---------------------------------------------------------------- 7. practice */
export const practice = {
  /** Questions per session, by mode. */
  sessionSizes: {
    quiz: 8,
    practice: 6,
    review: 12,
    lesson: 5,
  },
  /** Hard cap on questions assembled for one attempt. */
  maxQuestions: 25,
  /** Show the explanation right after each answer (false = reveal at the end). */
  explainAfterEachAnswer: true,
  shuffleOptions: true,
  /** Score (0-1) at which a saved question counts as "mastered". */
  masteryScore: 0.85,
} as const;

/* -------------------------------------------------------------------- 8. limits */
export const limits = {
  pageSize: 20,
  adminPageSize: 25,
  /** Per-user (or per-IP) limits enforced by src/lib/rate-limit.ts. */
  rateLimits: {
    "practice.submit": { max: 30, windowMs: 10 * 60 * 1000 },
    "profile.update": { max: 20, windowMs: 10 * 60 * 1000 },
    "reports.create": { max: 10, windowMs: 10 * 60 * 1000 },
    "feedback.create": { max: 5, windowMs: 10 * 60 * 1000 },
    "account.delete": { max: 3, windowMs: 60 * 60 * 1000 },
    "admin.mutation": { max: 120, windowMs: 5 * 60 * 1000 },
  } satisfies Record<string, { max: number; windowMs: number }>,
  /** Input lengths; mirrored by the zod schemas in src/lib/validation.ts. */
  input: {
    displayNameMin: 2,
    displayNameMax: 60,
    bioMax: 400,
    slugMin: 2,
    slugMax: 60,
    titleMax: 140,
    descriptionMax: 500,
    bodyMax: 40000,
    objectiveMax: 240,
    optionsMin: 2,
    optionsMax: 8,
    messageMax: 2000,
    codeMax: 20000,
  },
} as const;

/* ------------------------------------------------------------------ 9. storage */
export const storage = {
  /** Public bucket for learner avatars (created by the SQL migration). */
  avatarBucket: "avatars",
  maxAvatarBytes: 512 * 1024,
  acceptedAvatarTypes: ["image/png", "image/jpeg", "image/webp"],
} as const;

/* ------------------------------------------------------------- helpers */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return features[flag] === true;
}

export function navVisible(
  item: NavItem,
  ctx: { signedIn: boolean; role: "learner" | "admin" | null },
): boolean {
  if (item.feature && !isFeatureEnabled(item.feature)) return false;
  if (item.authRequired && !ctx.signedIn) return false;
  if (item.roles && (!ctx.role || !item.roles.includes(ctx.role))) return false;
  return true;
}

export const appConfig = {
  site,
  theme,
  navigation,
  subjectCatalog,
  subjects,
  features,
  learning,
  playground,
  practice,
  limits,
  storage,
} as const;

export default appConfig;


