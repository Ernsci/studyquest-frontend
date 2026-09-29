"use client";

import Link from "next/link";
import { useState } from "react";

import { apiFetch } from "@/lib/api/client";
import type { PracticeSessionResponse } from "@/lib/api/endpoints";
import type { PracticeSubmitResponse } from "@/lib/api/endpoints";
import type { StudentAnswer } from "@/lib/types";

export function PracticeSession({ session, token, lessonSlug, sessionMode }: { session: PracticeSessionResponse; token: string | null; lessonSlug?: string; sessionMode: "practice" | "quiz" | "test" }) {
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [result, setResult] = useState<PracticeSubmitResponse | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function choose(questionId: string, value: StudentAnswer) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  async function submit() {
    setBusy(true);
    setError("");
    const response = await apiFetch<PracticeSubmitResponse>("/api/practice/submit", {
      method: "POST",
      token,
      body: {
        mode: lessonSlug ? "lesson" : sessionMode === "practice" ? "practice" : "quiz",
        subjectSlug: session.subject.slug,
        ...(lessonSlug ? { lessonSlug } : {}),
        answers: session.questions.map((question) => ({ questionId: question.id, answer: answers[question.id] ?? null })),
      },
    });
    if (response.ok) setResult(response.data);
    else setError(response.error.message);
    setBusy(false);
  }

  return <div className="mx-auto max-w-3xl space-y-7">
    <header><p className="kicker">{session.subject.title}{lessonSlug ? " · lesson practice" : ` · ${sessionMode}`}</p><h1 className="mt-2 text-3xl font-bold">{sessionMode === "test" ? "Knowledge check" : sessionMode === "quiz" ? "Quick quiz" : "Practice questions"}</h1><p className="muted mt-2 text-sm">{sessionMode === "test" ? "A longer 20-question check across the subject. Submit when you’re ready to see your score and explanations." : "Take your time. Submit when you’re ready to see your score and explanations."}</p></header>
    {result ? <section className="card space-y-5 p-6" aria-live="polite"><div><p className="kicker">Practice complete</p><h2 className="mt-1 text-3xl font-bold">{result.attempt.percent}%</h2><p className="muted mt-1">{result.attempt.score} of {result.attempt.total} points · {result.attempt.xpAwarded} XP earned</p>{lessonSlug && result.lessonCompleted ? <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-800">Lesson completed! Your progress is saved.</p> : lessonSlug && result.attempt.passed ? <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800">You passed this lesson practice. Lesson completion was already recorded.</p> : lessonSlug ? <p className="muted mt-3 text-sm">Pass this practice to complete the lesson. You can retry any time.</p> : null}</div><ol className="space-y-4">{result.attempt.answers.map((answer, index) => <li className="rounded-xl border p-4" key={answer.questionId}><p className="font-medium">{index + 1}. {answer.prompt}</p><p className={`mt-2 text-sm ${answer.correct ? "text-green-700" : "text-red-700"}`}>{answer.correct ? "Correct" : "Not quite"}</p><p className="muted mt-1 text-sm leading-6">{answer.explanation}</p></li>)}</ol><div className="flex flex-wrap gap-3"><Link className="btn btn-primary" href={lessonSlug ? `/subjects/${encodeURIComponent(session.subject.slug)}/lessons/${encodeURIComponent(lessonSlug)}` : `/practice/${encodeURIComponent(session.subject.slug)}`}>{lessonSlug ? "Return to lesson" : "Try another set"}</Link><Link className="btn btn-ghost" href={lessonSlug ? "/dashboard" : `/subjects/${encodeURIComponent(session.subject.slug)}`}>{lessonSlug ? "View dashboard" : "Back to subject"}</Link></div></section> : <>
      <ol className="space-y-4">{session.questions.map((question, index) => <li className="card p-5 sm:p-6" key={question.id}><fieldset className="space-y-3"><legend className="font-semibold leading-6">{index + 1}. {question.prompt}</legend>{question.hint ? <p className="muted text-sm">Hint: {question.hint}</p> : null}
        {question.kind === "short_answer" || question.kind === "code" ? <textarea aria-label={`Answer ${index + 1}`} className="surface min-h-24 w-full rounded-lg border p-3 text-sm" onChange={(event) => choose(question.id, event.target.value)} placeholder={question.kind === "code" ? "Write your answer…" : "Type your answer…"} /> : question.kind === "true_false" ? <div className="flex gap-3">{[true, false].map((value) => <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm hover:bg-[rgb(var(--surface-sunken))]" key={String(value)}><input checked={answers[question.id] === value} className="accent-[var(--brand-600)]" name={question.id} onChange={() => choose(question.id, value)} type="radio" />{value ? "True" : "False"}</label>)}</div> : <div className="space-y-2">{question.options.map((option, optionIndex) => <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm hover:bg-[rgb(var(--surface-sunken))]" key={`${question.id}-${optionIndex}`}><input checked={question.kind === "multiple" ? Array.isArray(answers[question.id]) && (answers[question.id] as number[]).includes(optionIndex) : answers[question.id] === optionIndex} className="mt-0.5 accent-[var(--brand-600)]" name={question.id} onChange={(event) => { if (question.kind === "multiple") { const previous = Array.isArray(answers[question.id]) ? answers[question.id] as number[] : []; choose(question.id, event.target.checked ? [...previous, optionIndex] : previous.filter((item) => item !== optionIndex)); } else choose(question.id, optionIndex); }} type={question.kind === "multiple" ? "checkbox" : "radio"} /><span>{option}</span></label>)}</div>}
      </fieldset></li>)}</ol>
      {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
      {!token ? <p className="card muted p-4 text-sm" role="status">Sign in to submit practice and save your score.</p> : <button className="btn btn-primary" disabled={busy} onClick={submit} type="button">{busy ? "Checking your answers…" : "Submit answers"}</button>}
    </>}
  </div>;
}
