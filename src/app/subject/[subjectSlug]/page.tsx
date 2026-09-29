import { redirect } from "next/navigation";

export default async function SubjectAliasPage({ params }: { params: Promise<{ subjectSlug: string }> }) {
  const { subjectSlug } = await params;
  redirect(`/subjects/${encodeURIComponent(subjectSlug)}`);
}
