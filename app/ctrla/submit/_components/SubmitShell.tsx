"use client";

/**
 * SubmitShell · the frame every submit page shares.
 * Masthead + accent bar, an auth check (Google sign-in, the site pattern),
 * and a centered column. Children render only once signed in; signed-out
 * visitors get a warm sign-in prompt instead of a dead form.
 */

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { C, NEUE, NORWIGE, card } from "./theme";

const supabase = createClient();

export default function SubmitShell({
  eyebrow = "Contribute",
  title,
  children,
  backHref = "/ctrla/submit",
  backLabel = "All the ways to contribute",
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  const [auth, setAuth] = useState<"checking" | "in" | "out">("checking");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setAuth(session ? "in" : "out"));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) =>
      setAuth(session ? "in" : "out"),
    );
    return () => subscription.unsubscribe();
  }, []);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
    });
  }

  return (
    <main className="dash-ground" style={{ minHeight: "100vh", color: C.cream, fontFamily: NEUE }}>
      <div aria-hidden style={{ height: 3, background: C.gold }} />

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "14px clamp(18px,5vw,40px) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/ctrla" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cream, textDecoration: "none", fontWeight: 500 }}>
          <span style={{ color: C.gold }}>←</span> CTRL-A
        </Link>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>{eyebrow}</span>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(20px,5vw,36px) clamp(18px,5vw,40px) 80px" }}>
        <h1 style={{ margin: "0 0 6px", fontFamily: NORWIGE, fontWeight: 700, fontSize: "clamp(28px,5vw,44px)", lineHeight: 1.02, color: C.cream }}>
          {title}
        </h1>
        {backHref && (
          <Link href={backHref} style={{ fontSize: 12.5, fontWeight: 600, color: C.gold, textDecoration: "none" }}>
            {backLabel} →
          </Link>
        )}

        <div style={{ marginTop: 24 }}>
          {auth === "checking" && (
            <p style={{ fontSize: 12, color: C.faint, letterSpacing: "0.18em", textTransform: "uppercase" }}>Loading…</p>
          )}

          {auth === "out" && (
            <section style={{ ...card, padding: "clamp(24px,5vw,34px)" }}>
              <h2 style={{ margin: 0, fontFamily: NORWIGE, fontWeight: 700, fontSize: 20 }}>Sign in to contribute</h2>
              <p style={{ margin: "10px 0 20px", fontSize: 14, color: C.faint, lineHeight: 1.6 }}>
                Contributions are tied to your profile so we can credit you and track your work. It takes a second.
              </p>
              <button
                type="button"
                onClick={signIn}
                style={{ font: "inherit", fontFamily: NEUE, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#160C28", background: C.gold, border: "none", borderRadius: 999, padding: "13px 26px", cursor: "pointer" }}
              >
                Continue with Google
              </button>
            </section>
          )}

          {auth === "in" && children}
        </div>
      </div>
    </main>
  );
}
