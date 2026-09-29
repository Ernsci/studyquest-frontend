import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { api } from "@/lib/api/endpoints";
import { JavaExercises } from "./java-exercises";

type Props = { params: Promise<{ subjectSlug: string; lessonSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectSlug, lessonSlug } = await params;
  const result = await api.lesson(subjectSlug, lessonSlug);
  return { title: result.ok ? result.data.lesson.title : "Lesson" };
}

export default async function LessonPage({ params }: Props) {
  const { subjectSlug, lessonSlug } = await params;
  const result = await api.lesson(subjectSlug, lessonSlug);
  if (!result.ok) {
    if (result.error.code === "not_found") notFound();
    return <p className="card muted p-6" role="status">This lesson is temporarily unavailable. Please try again shortly.</p>;
  }
  const { lesson, prevLesson, nextLesson, questions, progress } = result.data;
  const subjectHref = `/subjects/${encodeURIComponent(subjectSlug)}`;
  const practiceHref = `/practice/${encodeURIComponent(subjectSlug)}?lesson=${encodeURIComponent(lessonSlug)}`;

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <nav aria-label="Breadcrumb" className="muted text-sm"><Link className="hover:text-brand-600" href="/subjects">Subjects</Link><span aria-hidden> / </span><Link className="hover:text-brand-600" href={subjectHref}>{lesson.subjectTitle}</Link><span aria-hidden> / </span><span>{lesson.title}</span></nav>
      <header className="space-y-4 border-b border-[rgb(var(--line))] pb-7">
        <p className="kicker">{lesson.moduleTitle} · {lesson.estimatedMinutes} min</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{lesson.title}</h1>
        <p className="muted text-lg leading-7">{lesson.description}</p>
        {progress?.completed ? <p className="text-sm font-medium text-green-700">Lesson completed · best score {progress.bestPercent ?? 0}%</p> : null}
      </header>

      <section aria-label="Lesson content" className="space-y-6">
        {lesson.body.split(/\n\s*\n/).map((paragraph, index) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith("## ")) return <h2 className="pt-4 text-2xl font-bold" key={index}>{trimmed.slice(3)}</h2>;
          if (trimmed.startsWith("> ")) return <blockquote className="rounded-r-xl border-l-4 border-brand-500 bg-[var(--brand-tint)] px-5 py-4 leading-7" key={index}>{trimmed.slice(2)}</blockquote>;
          return <p className="leading-8 text-[rgb(var(--text))]" key={index}>{trimmed.replaceAll("**", "")}</p>;
        })}
      </section>

      {lesson.objectives.length ? <section className="card p-5"><h2 className="font-semibold">By the end, you can</h2><ul className="muted mt-3 list-inside list-disc space-y-2 text-sm">{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></section> : null}

      {lesson.codeExamples.map((example) => <section className="card overflow-hidden" key={example.label}><div className="border-b px-4 py-3 text-sm font-semibold">{example.label}</div><pre className="overflow-x-auto bg-[rgb(var(--code-surface))] p-4 text-sm leading-6"><code>{example.code}</code></pre>{example.explanation ? <p className="muted p-4 text-sm leading-6">{example.explanation}</p> : null}</section>)}

      {lesson.subjectSlug === "java" ? <JavaExercises lessonSlug={lesson.slug} /> : null}

      {questions.length ? <section className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">Ready to check your understanding?</h2><p className="muted mt-1 text-sm">Try {questions.length} question{questions.length === 1 ? "" : "s"} from this lesson.</p></div><Link className="btn btn-primary shrink-0" href={practiceHref}>Start practice</Link></section> : null}

      <nav aria-label="Lesson navigation" className="flex items-center justify-between gap-4 border-t border-[rgb(var(--line))] pt-6 text-sm">
        {prevLesson ? <Link className="muted hover:text-brand-600" href={`${subjectHref}/lessons/${encodeURIComponent(prevLesson.slug)}`}>← {prevLesson.title}</Link> : <Link className="muted hover:text-brand-600" href={subjectHref}>← All lessons</Link>}
        {nextLesson ? <Link className="text-right font-semibold text-brand-600 hover:text-brand-700" href={`${subjectHref}/lessons/${encodeURIComponent(nextLesson.slug)}`}>{nextLesson.title} →</Link> : <Link className="text-right font-semibold text-brand-600 hover:text-brand-700" href={subjectHref}>Complete subject →</Link>}
      </nav>
    </article>
  );
}
