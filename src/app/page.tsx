import Link from "next/link";

import { learning } from "@/config/app-config";
import { publicEnv } from "@/config/env";
import { api } from "@/lib/api/endpoints";
import { percent } from "@/lib/utils";

/**
 * Home page: proves the split works end to end — the catalogue below is fetched
 * from the API at request time (`/api/subjects`), and a failure is shown instead
 * of an empty page.
 */
export default async function HomePage() {
  const [metaResult, subjectsResult] = await Promise.all([api.meta(), api.subjects()]);

  const contentMode = metaResult.ok ? metaResult.data.demo.contentMode : "unknown";
  const passMark = metaResult.ok
    ? Math.round(metaResult.data.learning.passMark * 100)
    : Math.round(learning.passMark * 100);

  return (
    <div className="space-y-14">
      <section className="max-w-3xl pt-2 sm:pt-6">
        <div className="stagger space-y-6">
          <span className="chip">
            <span aria-hidden className="pulse-dot" />
            Catalogue served live · {contentMode}
          </span>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Learn by doing, <span className="text-gradient">one quest at a time.</span>
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-[rgb(var(--text-muted))]">
            Short lessons, real practice and honest feedback. The catalogue below is served by the
            StudyQuest API ({publicEnv.apiUrl || "API URL not set"}).
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link className="btn btn-primary" href="/auth/signup">
              Start your first quest
            </Link>
            <a className="btn btn-ghost" href="#subjects">
              Browse the catalogue
            </a>
          </div>

          <dl className="flex flex-wrap gap-3 text-sm">
            <div className="chip">
              <dt className="text-[rgb(var(--text-muted))]">Content source</dt>
              <dd className="font-semibold">{contentMode}</dd>
            </div>
            <div className="chip">
              <dt className="text-[rgb(var(--text-muted))]">Pass mark</dt>
              <dd className="font-semibold">{passMark}%</dd>
            </div>
          </dl>
        </div>
      </section>

      {subjectsResult.ok ? (
        <SubjectGrid
          subjects={subjectsResult.data.subjects}
          progress={subjectsResult.data.progress}
        />
      ) : (
        <section className="card animate-rise p-6" role="alert">
          <p className="kicker">Connection problem</p>
          <h2 className="mt-2 text-xl font-semibold">We could not load the catalogue</h2>
          <p className="muted mt-2 text-sm">{subjectsResult.error.message}</p>
          <p className="muted mt-2 break-all text-xs">
            API: {publicEnv.apiUrl || "NEXT_PUBLIC_API_URL is not set"} · code:{" "}
            {subjectsResult.error.code}
          </p>
        </section>
      )}
    </div>
  );
}

type SubjectGridProps = {
  subjects: Array<{
    slug: string;
    title: string;
    description: string;
    icon: string;
    colorHex: string;
    level: string;
    lessonCount: number;
    questionCount: number;
  }>;
  progress: Array<{ subjectSlug: string; percentComplete: number; lessonsCompleted: number }> | null;
};

function SubjectGrid({ subjects, progress }: SubjectGridProps) {
  if (subjects.length === 0) {
    return (
      <p className="card muted p-6 text-sm" role="status">
        The API returned no published subjects yet.
      </p>
    );
  }

  return (
    <section className="scroll-mt-24 space-y-5" id="subjects">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="kicker">Catalogue</p>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Subjects</h2>
        </div>
        <p className="muted hidden text-sm sm:block">{subjects.length} available</p>
      </div>

      <ul className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const row = progress?.find((item) => item.subjectSlug === subject.slug) ?? null;
          const done = percent(row?.percentComplete ?? 0, 100);

          return (
            <li className="card card-hover group flex flex-col gap-3.5 p-5" key={subject.slug}>
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-xl text-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                  style={{ backgroundColor: `${subject.colorHex}1f`, color: subject.colorHex }}
                >
                  {subject.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-tight">{subject.title}</h3>
                  <p className="muted mt-1 text-xs capitalize">
                    {subject.level} · {subject.lessonCount} lessons · {subject.questionCount}{" "}
                    questions
                  </p>
                </div>
              </div>

              <p className="muted text-sm leading-6">{subject.description}</p>

              {row ? (
                <div className="mt-auto space-y-2">
                  <div
                    aria-label={`${subject.title} progress`}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={done}
                    className="h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--surface-sunken))]"
                    role="progressbar"
                  >
                    <div
                      className="progress-fill h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                      style={{ width: `${done}%` }}
                    />
                  </div>
                  <p className="muted text-xs">
                    {row.lessonsCompleted} of {subject.lessonCount} lessons complete ({done}%)
                  </p>
                </div>
              ) : (
                <p className="muted mt-auto text-xs">
                  Progress appears here once a session is stored.
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
