import type { Metadata } from "next";
import Link from "next/link";

import { api } from "@/lib/api/endpoints";

export const metadata: Metadata = { title: "Review" };

export default async function ReviewPage() {
  const result = await api.review();
  return <div className="mx-auto max-w-3xl space-y-7"><header><p className="kicker">Keep it fresh</p><h1 className="mt-2 text-4xl font-bold">Review queue</h1><p className="muted mt-2">Questions you have saved for another look.</p></header>{!result.ok ? <p className="card muted p-5 text-sm" role="status">Your review queue is temporarily unavailable.</p> : result.data.items.length === 0 ? <p className="card muted p-5 text-sm">Your queue is clear. Questions you miss in practice can appear here for review.</p> : <ul className="space-y-3">{result.data.items.map((item) => <li className="card p-5" key={item.questionId}><p className="text-sm font-semibold">{item.prompt}</p><p className="muted mt-2 text-xs">{item.kind.replaceAll("_", " ")} · review box {item.reviewBox}</p><Link className="mt-3 inline-block text-sm font-semibold text-brand-600" href={`/practice/${encodeURIComponent(item.subjectSlug)}`}>Practice this subject →</Link></li>)}</ul>}</div>;
}
