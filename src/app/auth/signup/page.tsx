"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

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
    try {
      const { data, error: authError } = await getBrowserSupabase().auth.signUp({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;
      if (data.session) {
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
      setBusy(false);
    }
  }

  return (
    <section className="card mx-auto w-full max-w-md p-6 shadow-sm sm:p-8">
      <div className="mb-7 space-y-2">
        <p className="text-sm font-semibold text-brand-600">Start learning</p>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="muted text-sm">Your progress and practice history will be saved to your account.</p>
      </div>
      {!browserCanUseSupabase() ? (
        <p className="muted text-sm" role="status">Account creation is unavailable because Supabase is not configured.</p>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="signup-email">Email</label>
            <input autoComplete="email" className="surface w-full rounded-lg border px-3 py-2.5 text-sm" id="signup-email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="signup-password">Password</label>
            <input autoComplete="new-password" className="surface w-full rounded-lg border px-3 py-2.5 text-sm" id="signup-password" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            <p className="muted text-xs">Use at least 8 characters.</p>
          </div>
          {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
          {message ? <p className="text-sm text-green-700" role="status">{message}</p> : null}
          <button className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60" disabled={busy} type="submit">
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>
      )}
      <p className="muted mt-6 text-center text-sm">Already have an account? <Link className="font-semibold text-brand-600 hover:underline" href="/auth/login">Sign in</Link></p>
    </section>
  );
}

export default function SignupPage() {
  return <div className="grid min-h-[60vh] place-items-center"><Suspense fallback={<div className="card min-h-80 w-full max-w-md animate-pulse" aria-label="Loading account form" />}><SignupForm /></Suspense></div>;
}
