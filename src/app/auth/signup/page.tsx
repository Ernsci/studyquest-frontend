"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

import { AuthVisual } from "@/components/auth-visual";
import { browserCanUseSupabase, getBrowserSupabase } from "@/lib/supabase/client";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    let redirecting = false;
    try {
      const { data, error: authError } = await getBrowserSupabase().auth.signUp({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;
      if (data.session) {
        redirecting = true;
        const next = params.get("next");
        const destination = next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/";
        router.replace(destination);
        router.refresh();
      } else {
        setMessage("Check your inbox for a confirmation link to finish creating your account.");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Account creation failed. Please try again.");
    } finally {
      if (!redirecting) setBusy(false);
    }
  }

  return (
    <section className="card animate-rise mx-auto w-full max-w-md p-6 shadow-[0_28px_60px_-36px_rgb(0_0_0/0.5)] sm:p-8 md:max-w-none">
      <div className="stagger mb-7">
        <p className="kicker">Start learning</p>
        <h2 className="mt-2 text-2xl font-bold">Create your account</h2>
        <p className="muted mt-1.5 text-sm">
          Your progress and practice history will be saved to your account.
        </p>
      </div>
      {!browserCanUseSupabase() ? (
        <p className="muted text-sm" role="status">
          Account creation is unavailable because Supabase is not configured.
        </p>
      ) : (
        <form aria-busy={busy} className="space-y-4" onSubmit={submit}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="signup-email">Email</label>
            <input
              autoComplete="email"
              className="input"
              disabled={busy}
              id="signup-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="signup-password">Password</label>
            <input
              autoComplete="new-password"
              className="input"
              disabled={busy}
              id="signup-password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
              type="password"
              value={password}
            />
            <p className="muted text-xs">Use at least 8 characters.</p>
          </div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          {message ? <p className="form-success" role="status">{message}</p> : null}
          <button className="btn btn-primary flex w-full items-center justify-center gap-2" disabled={busy} type="submit">
            {busy ? <><svg aria-hidden="true" className="size-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeLinecap="round" strokeWidth="4" /></svg><span>Creating account...</span></> : "Create account"}
          </button>
          {busy ? <p aria-live="polite" className="muted text-center text-sm" role="status">Creating your account and preparing your learning space...</p> : null}
        </form>
      )}
      <p className="muted mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link className="link-underline font-semibold text-brand-600 dark:text-brand-300" href="/auth/login">
          Sign in
        </Link>
      </p>
    </section>
  );
}

export default function SignupPage() {
  return (
    <div className="mx-auto grid min-h-[64vh] max-w-5xl items-center gap-8 md:grid-cols-[1fr_0.9fr] lg:gap-12">
      <AuthVisual
        blurb="Save your progress, collect XP for every lesson, and let spaced review do the remembering for you."
        headline="Create your account,"
        headlineAccent="start your quest."
        kicker="Two minutes, then you're in"
        points={[
          { icon: "→", title: "XP and streaks", detail: "Every completed lesson moves your level." },
          { icon: "→", title: "Practice that adapts", detail: "Quizzes target the topics you get wrong." },
          { icon: "→", title: "Nothing to install", detail: "Works in any browser, on any device." },
        ]}
      />
      <Suspense
        fallback={
          <div
            aria-label="Loading account form"
            className="card animate-shimmer mx-auto min-h-80 w-full max-w-md rounded-2xl"
            role="status"
          />
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}
