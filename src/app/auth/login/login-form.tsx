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
    try {
      const { error: authError } = await getBrowserSupabase().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;
      router.replace(safeNextPath(searchParams.get("next")));
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const configured = browserCanUseSupabase();

  return (
    <section className="card w-full p-6 shadow-sm sm:p-8">
      <div className="mb-7 space-y-2">
        <p className="text-sm font-semibold text-brand-600">Welcome back</p>
        <h2 className="text-2xl font-bold">Sign in to StudyQuest</h2>
        <p className="muted text-sm">Use the email and password associated with your account.</p>
      </div>

      {!configured ? (
        <p className="rounded-lg border border-[rgb(var(--line))] bg-[rgb(var(--surface-sunken))] p-4 text-sm muted" role="status">
          Sign-in is unavailable because Supabase is not configured. Add the public Supabase URL and anon key to the frontend environment, then redeploy.
        </p>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input
              autoComplete="email"
              className="surface w-full rounded-lg border px-3 py-2.5 text-sm"
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <input
              autoComplete="current-password"
              className="surface w-full rounded-lg border px-3 py-2.5 text-sm"
              id="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>
          {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
          <button
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-wait disabled:opacity-60"
            disabled={busy}
            type="submit"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}

      <p className="muted mt-6 text-center text-sm">
        New to StudyQuest? <Link className="font-semibold text-brand-600 hover:underline" href="/auth/signup">Create an account</Link>
      </p>
    </section>
  );
}

export function LoginForm() {
  return <Suspense fallback={<div className="card min-h-80 animate-pulse" aria-label="Loading sign in form" />}><Form /></Suspense>;
}
