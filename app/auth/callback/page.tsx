"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/shared";
import { supabase } from "@/lib/auth";
type CallbackResult = { error?: string; recovery?: boolean };
let exchange: Promise<CallbackResult> | null = null;
async function completeCallback(): Promise<CallbackResult> {
  if (!supabase)
    return { error: "Authentication is not configured for this preview." };
  const params = new URLSearchParams(window.location.search);
  if (params.get("error_description"))
    return { error: params.get("error_description")! };
  const code = params.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return { error: error.message };
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return {
      error:
        "This sign-in link is missing or has expired. Please request a new one.",
    };
  window.history.replaceState(null, "", window.location.pathname);
  return { recovery: params.get("recovery") === "1" };
}
export default function Callback() {
  const [error, setError] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let active = true;
    exchange ??= completeCallback();
    exchange
      .then((result) => {
        if (!active) return;
        if (result.error) setError(result.error);
        else if (result.recovery) setRecovery(true);
        else window.location.replace("/account/");
      })
      .catch(() => {
        if (active)
          setError("Sign-in could not be completed. Please try again.");
      });
    return () => {
      active = false;
    };
  }, []);
  async function reset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const f = new FormData(e.currentTarget);
    if (f.get("password") !== f.get("confirm")) {
      setError("The passwords do not match.");
      setBusy(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({
      password: String(f.get("password")),
    });
    setBusy(false);
    if (error) setError(error.message);
    else {
      setError("");
      setDone(true);
    }
  }
  return (
    <main className="account-page">
      <Brand />
      <section className="panel">
        <h1>
          {done
            ? "Password updated."
            : recovery
              ? "Choose a new password."
              : error
                ? "Let’s try that again."
                : "Signing you in…"}
        </h1>
        {error && <p role="alert">{error}</p>}
        {recovery && !done && (
          <form className="form-stack" onSubmit={reset}>
            <label>
              New password
              <input
                name="password"
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
              />
            </label>
            <label>
              Confirm password
              <input
                name="confirm"
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
              />
            </label>
            <button className="button button-blue" disabled={busy}>
              {busy ? "Saving…" : "Update password"}
            </button>
          </form>
        )}
        {done ? (
          <Link href="/account/" className="button button-blue">
            Open your account
          </Link>
        ) : (
          error && (
            <Link href="/login/" className="button button-blue">
              Back to sign-in
            </Link>
          )
        )}
      </section>
    </main>
  );
}
