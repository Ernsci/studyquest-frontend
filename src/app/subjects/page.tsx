import type { Metadata } from "next";
import Link from "next/link";

import { api } from "@/lib/api/endpoints";

export const metadata: Metadata = { title: "Subjects" };

export default async function SubjectsPage() {
  const result = await api.subjects();

  return (
    <div className="space-y-8">
      <header className="max-w-2xl space-y-3">
        <p className="kicker">The catalogue</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Choose what to learn</h1>
        <p className="muted text-lg leading-7">Explore a subject, follow the lessons, and check your understanding as you go.</p>
      </header>
      {!result.ok ? (
        <p className="card muted p-5 text-sm" role="status">Subjects are temporarily unavailable. Please try again shortly.</p>
      ) : result.data.subjects.length === 0 ? (
        <p className="card muted p-5 text-sm" role="status">No published subjects are available yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.subjects.map((subject) => {
            const progress = result.data.progress?.find((item) => item.subjectSlug === subject.slug);
            return (
              <li key={subject.slug}>
                <Link className="card card-hover flex h-full flex-col gap-4 p-5" href={`/subjects/${encodeURIComponent(subject.slug)}`}>
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="grid size-11 place-items-center rounded-xl text-lg" style={{ backgroundColor: `${subject.colorHex}20`, color: subject.colorHex }}>{subject.icon}</span>
                    <div><h2 className="font-semibold">{subject.title}</h2><p className="muted mt-1 text-xs capitalize">{subject.level}</p></div>
                  </div>
                  <p className="muted text-sm leading-6">{subject.description}</p>
                  <div className="muted mt-auto flex items-center justify-between gap-2 text-xs">
                    <span>{subject.lessonCount} lessons · {subject.questionCount} questions</span>
                    {progress ? <span>{progress.percentComplete}% complete</span> : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
