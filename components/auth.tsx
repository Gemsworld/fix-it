"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Github,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Brand, Toolbox } from "./shared";
import { supabase } from "@/lib/auth";
export default function Auth({
  mode,
}: {
  mode: "login" | "signup" | "forgot";
}) {
  const [visible, setVisible] = useState(false);
  const [role, setRole] = useState("customer");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("role") === "artisan")
      setRole("artisan");
  }, []);
  async function oauth(provider: "google" | "github") {
    setNotice("");
    setOk(false);
    if (!supabase) {
      setNotice(
        "Social sign-in is ready to connect. The site owner needs to add the authentication credentials. You can explore the dashboard demo below.",
      );
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback/` },
    });
    if (error) {
      setNotice(error.message);
      setBusy(false);
    }
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice("");
    setOk(false);
    if (!supabase) {
      setNotice(
        "Account access is not connected yet. Add the authentication credentials to enable secure sign-in. Use the dashboard demo to preview the app.",
      );
      return;
    }
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password") || "");
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback/?recovery=1`,
        });
        if (error) throw error;
        setOk(true);
        setNotice(
          "If this email has an account, a reset link will arrive shortly.",
        );
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: f.get("name"), account_type: role },
            emailRedirectTo: `${window.location.origin}/auth/callback/`,
          },
        });
        if (error) throw error;
        if (data.session) window.location.assign("/account/");
        else {
          setOk(true);
          setNotice("Check your inbox to confirm your email, then sign in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.assign("/account/");
      }
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <aside className="auth-story pattern-dark">
        <Brand light />
        <div className="auth-story-main">
          <span className="eyebrow mint-text">
            A LITTLE HELP GOES A LONG WAY.
          </span>
          <h2>
            Home feels better
            <br />
            when it’s handled.
          </h2>
          <Toolbox />
          <div className="auth-quote">
            <span className="clay-icon mint">
              <ShieldCheck size={25} />
            </span>
            <div>
              <strong>Good people. Good repairs.</strong>
              <p>Let’s take one more thing off your list.</p>
            </div>
          </div>
        </div>
        <span className="auth-story-foot">
          Everyday repairs. Expert hands. Fix-it.
        </span>
      </aside>
      <section className="auth-main">
        <div className="auth-mobile-brand">
          <Brand />
        </div>
        <Link href="/" className="back-link">
          <ArrowLeft size={17} /> Back to home
        </Link>
        <div className="auth-form-wrap">
          <span className="eyebrow">
            {mode === "signup"
              ? "MAKE YOURSELF AT HOME"
              : mode === "forgot"
                ? "LET’S GET YOU BACK IN"
                : "GOOD TO HAVE YOU BACK"}
          </span>
          <h1>
            {mode === "signup"
              ? "A fresh start, right here."
              : mode === "forgot"
                ? "Forgot your password?"
                : "Hello again."}
          </h1>
          <p>
            {mode === "signup"
              ? "Get a little help. Or lend your skilled hands."
              : mode === "forgot"
                ? "Enter your email and we’ll send you a reset link."
                : "Sign in and pick up where you left off."}
          </p>
          {mode === "signup" && (
            <div className="role-picker">
              <button
                className={role === "customer" ? "selected" : ""}
                onClick={() => setRole("customer")}
              >
                I need a repair
              </button>
              <button
                className={role === "artisan" ? "selected" : ""}
                onClick={() => setRole("artisan")}
              >
                I’m an artisan
              </button>
            </div>
          )}
          {mode !== "forgot" && (
            <>
              <div className="social-buttons">
                <button onClick={() => oauth("google")} disabled={busy}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.2h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c2-1.8 2.9-4.4 2.9-7.6Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 22c2.7 0 5-.9 6.7-2.4L15.4 17c-.9.6-2 1-3.4 1a6 6 0 0 1-5.6-4.1H3v2.7A10 10 0 0 0 12 22Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.4 13.9a6 6 0 0 1 0-3.8V7.4H3a10 10 0 0 0 0 9.2Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 6c1.5 0 2.8.5 3.8 1.5L18.6 4A10 10 0 0 0 3 7.4l3.4 2.7A6 6 0 0 1 12 6Z"
                    />
                  </svg>{" "}
                  Google
                </button>
                <button onClick={() => oauth("github")} disabled={busy}>
                  <Github size={19} /> GitHub
                </button>
              </div>
              <div className="divider">
                <span>or continue with email</span>
              </div>
            </>
          )}
          <form className="form-stack" onSubmit={submit}>
            {mode === "signup" && (
              <label>
                Full name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                />
              </label>
            )}
            <label>
              Email address
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </label>
            {mode !== "forgot" && (
              <label>
                <span className="label-row">
                  Password
                  {mode === "login" && (
                    <Link href="/forgot-password/">Forgot password?</Link>
                  )}
                </span>
                <span className="password-field">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    minLength={8}
                    required
                    placeholder={
                      mode === "signup"
                        ? "At least 8 characters"
                        : "Your password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    aria-label={visible ? "Hide password" : "Show password"}
                  >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
            )}
            {mode === "signup" && (
              <label className="checkbox-row">
                <input type="checkbox" required />
                <span>
                  I agree to the{" "}
                  <Link href="/legal/">Terms & Privacy Policy</Link>.
                </span>
              </label>
            )}
            {notice && (
              <div
                className={ok ? "form-notice success" : "form-notice"}
                role="status"
              >
                {notice}
              </div>
            )}
            <button className="button button-blue auth-submit" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "signup"
                  ? "Create my account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : "Sign in"}
              <ArrowRight size={18} />
            </button>
          </form>
          <p className="auth-switch">
            {mode === "signup"
              ? "Already part of Fix-it?"
              : mode === "forgot"
                ? "Remember your password?"
                : "New around here?"}{" "}
            <Link href={mode === "login" ? "/signup/" : "/login/"}>
              {mode === "login" ? "Create an account" : "Sign in"}
            </Link>
          </p>
          <Link href="/dashboard/" className="demo-link">
            Explore the dashboard demo <ArrowUpRightIcon />
          </Link>
          <div className="auth-secure">
            <ShieldCheck size={15} /> Your space. Your peace of mind.
          </div>
        </div>
        <div className="auth-bottom">
          © {new Date().getFullYear()} Fix-it{" "}
          <Link href="/legal/">Privacy & terms</Link>
        </div>
      </section>
    </main>
  );
}
function ArrowUpRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}
