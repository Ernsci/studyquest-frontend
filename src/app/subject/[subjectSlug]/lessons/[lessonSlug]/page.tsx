import { redirect } from "next/navigation";

export default async function LessonAliasPage({ params }: { params: Promise<{ subjectSlug: string; lessonSlug: string }> }) {
  const { subjectSlug, lessonSlug } = await params;
  redirect(`/subjects/${encodeURIComponent(subjectSlug)}/lessons/${encodeURIComponent(lessonSlug)}`);
}
