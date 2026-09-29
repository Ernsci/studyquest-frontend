import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-5xl items-center gap-10 md:grid-cols-[1fr_0.9fr]">
      <section className="hidden space-y-5 md:block">
        <span className="inline-flex rounded-full border border-[rgb(var(--line))] px-3 py-1 text-sm muted">
          Your learning, in one place
        </span>
        <h1 className="max-w-lg text-4xl font-bold tracking-tight lg:text-5xl">
          Pick up where your curiosity left off.
        </h1>
        <p className="muted max-w-md leading-7">
          Sign in to save your progress, revisit tricky questions, and keep building your skills.
        </p>
      </section>
      <LoginForm />
    </div>
  );
}
