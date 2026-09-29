

export type ThemeMode = "light" | "dark" | "system";


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

    mark: "quest",
    wordmark: "StudyQuest",
    alt: "StudyQuest home",

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
          { label: "Security & privacy", href: "/about#security" },
        ],
      },
    ],
  },
} as const;


export const theme = {

  defaultMode: "dark" as ThemeMode,

  toggleEnabled: true,
  colors: {

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

    sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  },
} as const;


export const features = {

  darkMode: true,

  streaks: true,

  studyReminders: true,

  playground: true,

  quizzes: true,

  spacedReview: true,

  bookmarks: true,

  savedQuestions: true,

  feedback: true,

  reports: true,

  recommendations: true,

  adminPanel: true,

  demoMode: true,
} as const;

export type FeatureFlag = keyof typeof features;

export type NavItem = {
  label: string;
  href: string;

  authRequired?: boolean;

  roles?: Array<"learner" | "admin">;

  feature?: FeatureFlag;
};

export const navigation = {
  primary: [
    { label: "Subjects", href: "/subjects" },
    { label: "Practice", href: "/practice", feature: "quizzes" },
    { label: "Playground", href: "/playground", feature: "playground" },
    { label: "About", href: "/about" },
    { label: "Review", href: "/review", feature: "spacedReview", authRequired: true },
    { label: "Dashboard", href: "/dashboard", authRequired: true },
  ] satisfies NavItem[],

  account: [
    { label: "Dashboard", href: "/dashboard", authRequired: true },
    { label: "Bookmarks", href: "/bookmarks", feature: "bookmarks", authRequired: true },
    { label: "Profile & data", href: "/profile", authRequired: true },
    { label: "Admin panel", href: "/admin", feature: "adminPanel", roles: ["admin"] },
  ] satisfies NavItem[],
} as const;



export const subjectCatalog = [
  { slug: "javascript", title: "JavaScript", enabled: true, sample: true },
  { slug: "html-css", title: "HTML & CSS", enabled: true, sample: true },
  { slug: "python", title: "Python", enabled: true, sample: true },
  { slug: "sql", title: "SQL & Databases", enabled: true, sample: true },
  { slug: "web-security", title: "Web Security Basics", enabled: true, sample: true },
  { slug: "java", title: "Java", enabled: true, sample: true },
  { slug: "data-structures", title: "Data Structures", enabled: false, sample: false },
] as const;

export const subjects = {

  enabled: subjectCatalog.filter((s) => s.enabled).map((s) => s.slug),
  pageSize: 12,
} as const;



export const learning = {

  xpPerLesson: 20,

  xpPerCorrectAnswer: 5,

  quizPassBonus: 25,

  passMark: 0.7,

  dailyGoalMinutes: 20,

  heatmapDays: 91,
  streak: {
    enabled: true,

    allowFreeze: true,

    freezeXpCost: 150,

    onFireAt: 7,
  },
  spacedReview: {

    intervalsDays: [0, 1, 3, 7, 21],

    autoAddMissed: true,

    sessionSize: 12,
  },
  plan: {

    horizonDays: 14,

    defaultLessonsPerWeek: 3,
  },
} as const;


export const playground = {

  language: "javascript",

  maxOutputLines: 200,
  maxRuntimeMs: 2000,
  maxSourceLength: 20000,

  enableConsoleShim: true,
} as const;


export const practice = {

  sessionSizes: {
    quiz: 8,
    practice: 6,
    review: 12,
    lesson: 5,
  },

  maxQuestions: 25,

  explainAfterEachAnswer: true,
  shuffleOptions: true,

  masteryScore: 0.85,
} as const;


export const limits = {
  pageSize: 20,
  adminPageSize: 25,

  rateLimits: {
    "practice.submit": { max: 30, windowMs: 10 * 60 * 1000 },
    "profile.update": { max: 20, windowMs: 10 * 60 * 1000 },
    "reports.create": { max: 10, windowMs: 10 * 60 * 1000 },
    "feedback.create": { max: 5, windowMs: 10 * 60 * 1000 },
    "account.delete": { max: 3, windowMs: 60 * 60 * 1000 },
    "admin.mutation": { max: 120, windowMs: 5 * 60 * 1000 },
  } satisfies Record<string, { max: number; windowMs: number }>,

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


export const storage = {

  avatarBucket: "avatars",
  maxAvatarBytes: 512 * 1024,
  acceptedAvatarTypes: ["image/png", "image/jpeg", "image/webp"],
} as const;


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


