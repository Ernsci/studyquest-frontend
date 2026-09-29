import type { Metadata } from "next";
import Link from "next/link";

import { api } from "@/lib/api/endpoints";

export const metadata: Metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const result = await api.bookmarks();
  return <div className="mx-auto max-w-3xl space-y-7"><header><p className="kicker">Your library</p><h1 className="mt-2 text-4xl font-bold">Bookmarked lessons</h1><p className="muted mt-2">Lessons you saved to come back to.</p></header>{!result.ok ? <p className="card muted p-5 text-sm" role="status">Your bookmarks are temporarily unavailable.</p> : result.data.bookmarks.length === 0 ? <p className="card muted p-5 text-sm">No bookmarks yet. Save a lesson to find it here.</p> : <ul className="space-y-3">{result.data.bookmarks.map((bookmark) => <li key={`${bookmark.subjectSlug}/${bookmark.lessonSlug}`}><Link className="card card-hover flex items-center justify-between gap-4 p-4" href={`/subjects/${encodeURIComponent(bookmark.subjectSlug)}/lessons/${encodeURIComponent(bookmark.lessonSlug)}`}><span><span className="block font-semibold">{bookmark.lessonTitle}</span><span className="muted mt-1 block text-sm">{bookmark.subjectTitle}</span></span><span aria-hidden className="muted">→</span></Link></li>)}</ul>}</div>;
}
