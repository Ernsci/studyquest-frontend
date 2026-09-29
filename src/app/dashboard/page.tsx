import type { Metadata } from "next";
import Link from "next/link";

import { api } from "@/lib/api/endpoints";

export const metadata: Metadata = { title: "My learning" };

export default async function DashboardPage() {
  const result = await api.progress();
  if (!result.ok) return <div className="space-y-4"><p className="kicker">My learning</p><h1 className="text-3xl font-bold">Your dashboard</h1><p className="card muted p-5 text-sm" role="status">Your progress is temporarily unavailable. Please try again shortly.</p></div>;
  const { stats, subjects, recentAttempts } = result.data;
  return <div className="space-y-8">
    <header><p className="kicker">My learning</p><h1 className="mt-2 text-4xl font-bold">Your progress</h1><p className="muted mt-2">A little progress adds up. Keep going at your own pace.</p></header>
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Level", stats.level], ["Experience", `${stats.xp} XP`], ["Lessons completed", stats.lessonsCompleted], ["Current streak", `${stats.streakCurrent} days`]].map(([label, value]) => <div className="card p-5" key={label}><dt className="muted text-sm">{label}</dt><dd className="mt-2 text-2xl font-bold">{value}</dd></div>)}</dl>
    <section className="space-y-4"><div className="flex items-end justify-between"><h2 className="text-xl font-bold">Your subjects</h2><Link className="text-sm font-semibold text-brand-600" href="/subjects">Browse all →</Link></div><ul className="space-y-3">{subjects.map((subject) => <li className="card flex items-center gap-4 p-4" key={subject.subjectSlug}><span aria-hidden className="grid size-10 place-items-center rounded-xl" style={{ backgroundColor: `${subject.colorHex}20`, color: subject.colorHex }}>{subject.icon}</span><div className="min-w-0 flex-1"><Link className="font-semibold hover:text-brand-600" href={`/subjects/${encodeURIComponent(subject.subjectSlug)}`}>{subject.title}</Link><div className="mt-2 h-2 overflow-hidden rounded-full bg-[rgb(var(--surface-sunken))]"><div className="h-full rounded-full bg-brand-500" style={{ width: `${subject.percentComplete}%` }} /></div></div><span className="muted text-sm">{subject.percentComplete}%</span></li>)}</ul></section>
    <section className="card p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">Recent practice</h2><Link className="text-sm font-semibold text-brand-600" href="/practice">Practice more →</Link></div>{recentAttempts.length ? <ul className="mt-4 divide-y divide-[rgb(var(--line))]">{recentAttempts.map((attempt) => <li className="flex justify-between gap-3 py-3 text-sm" key={attempt.id}><span>{attempt.subjectSlug ?? "Practice"} · {attempt.mode}</span><span className="font-semibold">{attempt.percent}%</span></li>)}</ul> : <p className="muted mt-3 text-sm">Your completed practice sessions will appear here.</p>}</section>
  </div>;
}
