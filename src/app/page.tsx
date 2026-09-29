import { api } from "@/lib/api/endpoints";
import { publicEnv } from "@/config/env";
import { learning } from "@/config/app-config";
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
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Learn by doing, one quest at a time.
        </h1>
        <p className="muted max-w-2xl text-base">
          Short lessons, real practice and honest feedback. The catalogue below is served by the
          StudyQuest API ({publicEnv.apiUrl || "API URL not set"}).
        </p>
        <dl className="muted flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium">Content source</dt>
            <dd>{contentMode}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium">Pass mark</dt>
            <dd>{passMark}%</dd>
          </div>
        </dl>
      </section>

      {subjectsResult.ok ? (
        <SubjectGrid
          subjects={subjectsResult.data.subjects}
          progress={subjectsResult.data.progress}
        />
      ) : (
        <section className="card p-6" role="alert">
          <h2 className="text-lg font-semibold">We could not load the catalogue</h2>
          <p className="muted mt-2 text-sm">{subjectsResult.error.message}</p>
          <p className="muted mt-2 text-xs">
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
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Subjects</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const row = progress?.find((item) => item.subjectSlug === subject.slug) ?? null;
          const done = percent(row?.percentComplete ?? 0, 100);

          return (
            <li key={subject.slug} className="card flex flex-col gap-3 p-5">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-lg text-lg"
                  style={{ backgroundColor: `${subject.colorHex}1a`, color: subject.colorHex }}
                >
                  {subject.icon}
                </span>
                <div>
                  <h3 className="font-semibold">{subject.title}</h3>
                  <p className="muted text-xs capitalize">
                    {subject.level} · {subject.lessonCount} lessons · {subject.questionCount} questions
                  </p>
                </div>
              </div>

              <p className="muted text-sm">{subject.description}</p>

              {row ? (
                <div className="mt-auto space-y-2">
                  <div
                    className="h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--surface-sunken))]"
                    role="progressbar"
                    aria-valuenow={done}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${subject.title} progress`}
                  >
                    <div
                      className="h-full rounded-full bg-brand-500"
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
