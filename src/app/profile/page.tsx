import type { Metadata } from "next";

import { api } from "@/lib/api/endpoints";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const result = await api.me();
  return <div className="mx-auto max-w-2xl space-y-7"><header><p className="kicker">Account</p><h1 className="mt-2 text-4xl font-bold">Your profile</h1><p className="muted mt-2">Your account details and learning settings.</p></header>{!result.ok ? <p className="card muted p-5 text-sm" role="status">Your profile is temporarily unavailable.</p> : <dl className="card divide-y divide-[rgb(var(--line))] p-5">{[["Display name", result.data.profile.displayName], ["Email", result.data.profile.email], ["Username", result.data.profile.username ?? "Not set"], ["Weekly lesson goal", result.data.profile.weeklyGoalLessons], ["Role", result.data.profile.role]].map(([label, value]) => <div className="flex justify-between gap-5 py-3 first:pt-0 last:pb-0" key={label}><dt className="muted text-sm">{label}</dt><dd className="text-right text-sm font-medium">{value}</dd></div>)}</dl>}</div>;
}
