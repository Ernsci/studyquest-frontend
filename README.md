# StudyQuest frontend

Next.js 16 (App Router) client for StudyQuest. It owns rendering, the theme and
the auth screens; every rule — grading, XP, review scheduling — lives in the
API, so this bundle never contains an answer key.

| | |
| --- | --- |
| Runtime | Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS v4 |
| Auth | Supabase SSR on this origin (`src/lib/supabase/`); the access token is forwarded to the API as a bearer token |
| Routing guard | `src/proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`) |
| API | [Ernsci/studyquest-backend](https://github.com/Ernsci/studyquest-backend) (Express on Render) |
| Deploy | Vercel — `vercel.json` pins the `nextjs` framework |

## Local development

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev          # http://localhost:3000
```

Start the API first (default `http://localhost:8080`); the home page renders the
subject catalogue from it and shows a clear error state when it is unreachable.
While Supabase is unconfigured the proxy asks the API for a demo session and
stores the bearer token in an httpOnly cookie (`sq_demo_token`).

`npm run typecheck` runs `tsc --noEmit`; `npm run build` produces the production
bundle.

## Environment

Only `NEXT_PUBLIC_*` values live here — every secret belongs to the API, because
anything in this project is inlined into the browser bundle.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the API. Read at build time — set it before the first deploy. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase project settings; leave empty for demo mode. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, used for auth redirects and metadata. |
| `NEXT_PUBLIC_THEME_DEFAULT` | `light` \| `dark` \| `system` default theme. |
| `NEXT_PUBLIC_ENABLE_DEMO_MODE` | Keep the demo banner available once Supabase is configured. |

## Deploying to Vercel

1. Import this repository. The repository root is the project root, so no
   Root Directory override is needed.
2. Add the variables above, pointing `NEXT_PUBLIC_API_URL` at the Render URL, and
   deploy.
3. Add the resulting `https://…` origin to `CORS_ORIGINS` on the API and redeploy
   it, otherwise the browser blocks every call.

## Current scope

The home page (subject catalogue plus live API status) is implemented, together
with the shared config (`src/config/`), the typed API client
(`src/lib/api/`), validation and the Supabase session helpers. Lesson, practice,
dashboard, profile and admin screens come next — the endpoints they need already
exist in the API.
