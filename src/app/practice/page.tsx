import type { Metadata } from "next";
import Link from "next/link";

import { api } from "@/lib/api/endpoints";

export const metadata: Metadata = { title: "Practice" };

export default async function PracticePage() {
  const result = await api.subjects();
  return <div className="space-y-8">
    <header className="max-w-2xl space-y-3"><p className="kicker">Practice</p><h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Make knowledge stick</h1><p className="muted text-lg leading-7">Choose a subject for a short set of questions. You’ll get feedback after you submit.</p></header>
    {!result.ok ? <p className="card muted p-5 text-sm" role="status">Practice is temporarily unavailable. Please try again shortly.</p> : <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.data.subjects.map((subject) => <li key={subject.slug}><Link className="card card-hover flex h-full flex-col gap-3 p-5" href={`/practice/${encodeURIComponent(subject.slug)}`}><span aria-hidden className="grid size-10 place-items-center rounded-xl text-lg" style={{ backgroundColor: `${subject.colorHex}20`, color: subject.colorHex }}>{subject.icon}</span><h2 className="font-semibold">{subject.title}</h2><p className="muted text-sm">{subject.questionCount} questions available</p></Link></li>)}</ul>}
  </div>;
}
