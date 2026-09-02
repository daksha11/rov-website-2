"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — SIGN-IN GATE
// The hard gate for things that count: building a kit, marking a piece
// finished, submitting. Reading is always free; this only wraps actions.
//
// Editorial, not a card: a kicker, one big line, the reason, one Google
// button. It checks the session itself, so wrap the action and forget it.
// While the session is unknown it renders nothing, never a flash of the
// gate for someone who is already in.
// ═══════════════════════════════════════════════════════

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { signInWithGoogle } from "@/lib/ctrla/sync";
import { ed, edLight } from "./editorial";

export function useSession() {
  const [state, setState] = useState<"unknown" | "in" | "out">("unknown");
  useEffect(() => {
    const supabase = createClient();
    let alive = true;
    supabase.auth.getSession().then(({ data: { session } }) => alive && setState(session?.user ? "in" : "out"));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => alive && setState(session?.user ? "in" : "out"));
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return state;
}

export default function SignInGate({
  children,
  theme = "dark",
  title = "Sign in to keep this.",
  reason = "Your path, your kit, and your progress follow you once you sign in. Reading is free, always.",
  cta = "Continue with Google",
}: {
  children: ReactNode;
  theme?: "dark" | "light";
  title?: string;
  reason?: string;
  cta?: string;
}) {
  const session = useSession();
  const t = theme === "light" ? edLight : ed;
  if (session === "unknown") return null;
  if (session === "in") return <>{children}</>;
  const small = theme === "light" ? t.plum : ed.gold;
  return (
    <div style={{ padding: "clamp(28px,4vw,56px) 0", borderTop: `1px solid ${t.hair}`, borderBottom: `1px solid ${t.hair}` }}>
      <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: small }}>CTRL·A · your path</span>
      <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4.6vw,64px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: t.ink, margin: "14px 0 14px", maxWidth: 720 }}>
        {title}
      </h2>
      <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(17px,1.9vw,23px)", lineHeight: 1.4, color: t.ink, margin: "0 0 26px", maxWidth: 560 }}>{reason}</p>
      <button
        type="button"
        onClick={() => void signInWithGoogle()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "13px 22px",
          background: theme === "light" ? t.ink : ed.gold,
          color: theme === "light" ? t.paper : ed.void,
          border: 0,
          fontFamily: ed.mono,
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {cta} <span aria-hidden>→</span>
      </button>
    </div>
  );
}
