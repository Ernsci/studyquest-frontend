import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { api } from "@/lib/api/endpoints";
import { accessToken } from "@/lib/api/server";
import { PracticeSession } from "./practice-session";

type Props = { params: Promise<{ subjectSlug: string }>; searchParams: Promise<{ lesson?: string; mode?: string; size?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectSlug } = await params;
  const result = await api.subject(subjectSlug);
  return { title: result.ok ? `Practice · ${result.data.subject.title}` : "Practice" };
}

export default async function SubjectPracticePage({ params, searchParams }: Props) {
  const [{ subjectSlug }, query] = await Promise.all([params, searchParams]);
  const sessionMode = query.mode === "test" ? "test" : query.mode === "quiz" ? "quiz" : "practice";
  const requestedSize = query.size ? Number.parseInt(query.size, 10) : undefined;
  const size = sessionMode === "test" && Number.isInteger(requestedSize) ? Math.min(Math.max(requestedSize!, 1), 25) : sessionMode === "quiz" ? 8 : undefined;
  const [session, token] = await Promise.all([api.practiceSession(subjectSlug, query.lesson, size), accessToken()]);
  if (!session.ok) {
    if (session.error.code === "not_found") notFound();
    return <p className="card muted p-6" role="status">Questions are temporarily unavailable. Please try again shortly.</p>;
  }
  return <PracticeSession session={session.data} token={token} lessonSlug={query.lesson} sessionMode={sessionMode} />;
}
