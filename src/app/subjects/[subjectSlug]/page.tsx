import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { api } from "@/lib/api/endpoints";

type Props = { params: Promise<{ subjectSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectSlug } = await params;
  const result = await api.subject(subjectSlug);
  return { title: result.ok ? result.data.subject.title : "Subject" };
}

export default async function SubjectPage({ params }: Props) {
  const { subjectSlug } = await params;
  const result = await api.subject(subjectSlug);
  if (!result.ok) {
    if (result.error.code === "not_found") notFound();
    return <div className="card mx-auto max-w-2xl p-6" role="status"><h1 className="text-xl font-semibold">Subject temporarily unavailable</h1><p className="muted mt-2 text-sm">We couldn’t load this subject right now. Please try again shortly.</p><Link className="mt-4 inline-block text-sm font-semibold text-brand-600" href="/subjects">Back to subjects</Link></div>;
  }
  const { subject, completedLessons } = result.data;
  const completed = new Set(completedLessons.map((lesson) => lesson.slug));

  return (
    <div className="space-y-10">
      <nav aria-label="Breadcrumb" className="muted text-sm"><Link className="hover:text-brand-600" href="/subjects">Subjects</Link><span aria-hidden> / </span><span>{subject.title}</span></nav>
      <header className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
        <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-2xl text-2xl" style={{ backgroundColor: `${subject.colorHex}20`, color: subject.colorHex }}>{subject.icon}</span>
        <div className="flex-1">
          <p className="kicker capitalize">{subject.level} path</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{subject.title}</h1>
          <p className="muted mt-2 max-w-2xl leading-7">{subject.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn btn-ghost shrink-0" href={`/practice/${encodeURIComponent(subject.slug)}`}>Practice</Link>
          <Link className="btn btn-primary shrink-0" href={`/practice/${encodeURIComponent(subject.slug)}?mode=quiz`}>Take a quiz</Link>
          <Link className="btn btn-ghost shrink-0" href={`/practice/${encodeURIComponent(subject.slug)}?mode=test&size=20`}>20-question test</Link>
        </div>
      </header>

      {subject.modules.map((module) => (
        <section aria-labelledby={`module-${module.id}`} className="space-y-4" key={module.id}>
          <div><p className="kicker">Module {module.sortOrder}</p><h2 className="mt-1 text-xl font-bold" id={`module-${module.id}`}>{module.title}</h2><p className="muted mt-1 text-sm">{module.description}</p></div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {module.lessons.map((lesson) => {
              const done = completed.has(lesson.slug);
              return <li key={lesson.id}><Link className="card card-hover flex h-full items-center gap-4 p-4" href={`/subjects/${encodeURIComponent(subject.slug)}/lessons/${encodeURIComponent(lesson.slug)}`}>
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-[rgb(var(--surface-sunken))] text-sm font-semibold">{done ? "✓" : lesson.sortOrder}</span>
                <span className="min-w-0 flex-1"><span className="block font-semibold">{lesson.title}</span><span className="muted mt-1 block text-xs">{lesson.estimatedMinutes} min · {lesson.difficulty}</span></span>
                <span aria-hidden className="muted">→</span>
              </Link></li>;
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
