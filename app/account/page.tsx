"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/shared";
import { supabase } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";
export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user);
        setLoading(false);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  return (
    <main className="account-page">
      <Brand />
      {loading ? (
        <h1>Opening your space…</h1>
      ) : user ? (
        <>
          <h1>
            Hello,{" "}
            {user.user_metadata.full_name || user.user_metadata.name || "there"}
            .
          </h1>
          <div className="panel">
            <h2>Your Fix-it account</h2>
            <p>Signed in as {user.email}. Your secure account is connected.</p>
            <p>
              The repair marketplace backend is the next integration. Requests
              in this version are saved locally; no artisan is dispatched and no
              payment is taken.
            </p>
            <Link href="/#services" className="button button-blue">
              Explore repairs
            </Link>
          </div>
          <button
            className="button button-white"
            onClick={async () => {
              await supabase?.auth.signOut();
              window.location.replace("/login/");
            }}
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <h1>Make yourself at home.</h1>
          <p>Please sign in to open your account.</p>
          <Link href="/login/" className="button button-blue">
            Sign in
          </Link>
        </>
      )}
      <Link href="/" className="back-link">
        ← Back to home
      </Link>
    </main>
  );
}
