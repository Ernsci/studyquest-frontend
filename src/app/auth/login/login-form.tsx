"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

import { browserCanUseSupabase } from "@/lib/supabase/client";
import { getBrowserSupabase } from "@/lib/supabase/client";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  return value;
}

function Form() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    let redirecting = false;
    try {
      const { error: authError } = await getBrowserSupabase().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;
      redirecting = true;
      router.replace(safeNextPath(searchParams.get("next")));
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign in failed. Please try again.");
    } finally {
      if (!redirecting) setBusy(false);
    }
  }

  const configured = browserCanUseSupabase();

  return (
    <section className="card animate-rise w-full p-6 shadow-[0_28px_60px_-36px_rgb(0_0_0/0.5)] sm:p-8">
      <div className="stagger mb-7">
        <p className="kicker">Welcome back</p>
        <h2 className="mt-2 text-2xl font-bold">Sign in to StudyQuest</h2>
        <p className="muted mt-1.5 text-sm">Use the email and password associated with your account.</p>
      </div>

      {!configured ? (
        <p className="rounded-lg border border-[rgb(var(--line))] bg-[rgb(var(--surface-sunken))] p-4 text-sm muted" role="status">
          Sign-in is unavailable because Supabase is not configured. Add the public Supabase URL and anon key to the frontend environment, then redeploy.
        </p>
      ) : (
        <form aria-busy={busy} className="space-y-4" onSubmit={submit}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input
              autoComplete="email"
              className="input"
              disabled={busy}
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <input
              autoComplete="current-password"
              className="input"
              disabled={busy}
              id="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button
            className="btn btn-primary flex w-full items-center justify-center gap-2"
            disabled={busy}
            type="submit"
          >
            {busy ? <><svg aria-hidden="true" className="size-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeLinecap="round" strokeWidth="4" /></svg><span>Signing in…</span></> : "Sign in"}
          </button>
          {busy ? <p aria-live="polite" className="muted text-center text-sm" role="status">Checking your account and opening your learning space...</p> : null}
        </form>
      )}

      <p className="muted mt-6 text-center text-sm">
        New to StudyQuest?{" "}
        <Link className="link-underline font-semibold text-brand-600 dark:text-brand-300" href="/auth/signup">
          Create an account
        </Link>
      </p>
    </section>
  );
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Loading sign in form"
          className="card animate-shimmer min-h-80 w-full rounded-2xl"
          role="status"
        />
      }
    >
      <Form />
    </Suspense>
  );
}
