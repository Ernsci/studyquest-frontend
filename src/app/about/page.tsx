import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About StudyQuest",
  description:
    "Learn how StudyQuest turns technical topics into clear lessons, practice, and steady progress.",
};

const principles = [
  {
    number: "01",
    title: "Learn in small steps",
    description:
      "Focused lessons break broad subjects into ideas you can understand, revisit, and build on.",
  },
  {
    number: "02",
    title: "Practice with purpose",
    description:
      "Questions and coding examples help you apply an idea while it is still fresh.",
  },
  {
    number: "03",
    title: "Make progress visible",
    description:
      "Feedback and learning progress help you decide what to review and what to explore next.",
  },
];

export default function AboutPage() {
  return (
    <article className="space-y-20 sm:space-y-28">
      <header className="max-w-3xl space-y-6 pt-4 sm:pt-10">
        <p className="kicker">About StudyQuest</p>
        <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
          A clearer path from <span className="text-gradient">curiosity to confidence.</span>
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[rgb(var(--text-muted))]">
          StudyQuest is a place to learn technical skills through concise explanations, practical
          examples, and questions that help ideas stick. Move at your own pace, revisit the parts
          that take practice, and build understanding one session at a time.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link className="btn btn-primary" href="/subjects">Explore subjects</Link>
          <Link className="btn btn-ghost" href="/about#security">How we approach security</Link>
        </div>
      </header>

      <section aria-labelledby="approach-heading" className="space-y-7">
        <div className="max-w-2xl space-y-2">
          <p className="kicker">The approach</p>
          <h2 className="text-2xl font-bold sm:text-3xl" id="approach-heading">
            Built around how people learn
          </h2>
          <p className="muted leading-7">
            Reading is a start. Understanding grows when you can use an idea, see where you went
            wrong, and try again.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <li className="card card-hover p-6" key={principle.number}>
              <span className="font-mono text-sm text-brand-600">{principle.number}</span>
              <h3 className="mt-5 text-lg font-semibold">{principle.title}</h3>
              <p className="muted mt-2 text-sm leading-6">{principle.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="security-heading" className="scroll-mt-28 space-y-8" id="security">
        <div className="max-w-2xl space-y-3">
          <p className="kicker">Trust &amp; safety</p>
          <h2 className="text-3xl font-bold sm:text-4xl" id="security-heading">
            Security is part of the foundation.
          </h2>
          <p className="muted leading-7">
            StudyQuest uses separate access controls for public learning content, learner data, and
            administrative actions. The protections below describe the safeguards implemented in
            the application and database.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SecurityCard
            title="Account authentication"
            body="Accounts and sign-in sessions are handled by Supabase Auth. The application verifies signed-in users on the server before serving protected API features."
          />
          <SecurityCard
            title="Private learner records"
            body="Database Row Level Security policies scope profiles, progress, attempts, bookmarks, and review items to their owner. Administrative access is checked separately."
          />
          <SecurityCard
            title="Server-only credentials"
            body="The privileged Supabase key is used by the backend and is not part of the browser configuration. The frontend uses the public key, with database policies still applying to user requests."
          />
          <SecurityCard
            title="Abuse monitoring and limits"
            body="The API applies request limits to selected sensitive operations and records administrative changes for accountability."
          />
        </div>

        <aside className="rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-sunken))] p-5 sm:p-6">
          <h3 className="font-semibold">A note on security claims</h3>
          <p className="muted mt-2 max-w-3xl text-sm leading-6">
            These controls reduce risk, but no online service can promise perfect security. StudyQuest
            has not been independently security-audited. Do not submit passwords or sensitive
            personal information that you use elsewhere.
          </p>
        </aside>
      </section>

      <section className="card flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-xl font-bold">Ready to learn something new?</h2>
          <p className="muted mt-1 text-sm">Choose a subject and take the first small step.</p>
        </div>
        <Link className="btn btn-primary shrink-0" href="/subjects">Browse subjects</Link>
      </section>
    </article>
  );
}

function SecurityCard({ title, body }: { title: string; body: string }) {
  return (
    <section className="card p-5 sm:p-6">
      <h3 className="font-semibold">{title}</h3>
      <p className="muted mt-2 text-sm leading-6">{body}</p>
    </section>
  );
}
