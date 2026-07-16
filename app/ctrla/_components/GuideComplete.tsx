"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — GUIDE COMPLETE
// The "I finished this" claim at the end of a gated guide. Awards the
// guide-complete credits once per guide (server-deduped by slug) and fires
// the reliable "CTRL-A Guide Completed" event so the nurture flow exits.
//
// Credits need an account, so if the reader is not signed in this asks for
// Google sign-in first, then they can claim. Reuse across any guide by
// passing its slug from lib/ctrla/guides.ts.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useCredits } from "@/hooks/useCredits";
import { REWARDS } from "@/lib/credits/config";

const supabase = createClient();
const AWARD = REWARDS["guide-complete"].points;

type Theme = "dark" | "light";

function palette(theme: Theme, accent?: string) {
  if (theme === "light") {
    return { text: "#160C28", soft: "rgba(22,12,40,0.7)", line: "rgba(22,12,40,0.16)", accent: accent || "#4E3D73", on: "#FFF4E3" };
  }
  return { text: "#F0E6E0", soft: "rgba(240,230,224,0.7)", line: "rgba(240,230,224,0.14)", accent: accent || "#E3C24A", on: "#160C28" };
}

export default function GuideComplete({
  guideSlug,
  theme = "dark",
  accent,
  title = "Finished the course?",
  blurb,
}: {
  guideSlug: string;
  theme?: Theme;
  accent?: string;
  title?: string;
  blurb?: string;
}) {
  const p = palette(theme, accent);
  const { signedIn, earn } = useCredits();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
    });
  }

  async function claim() {
    if (busy) return;
    setBusy(true);
    setMsg(null);
    const res = await earn("guide-complete", { guide: guideSlug });
    setBusy(false);
    if (res.ok) {
      setDone(true);
      setMsg(res.alreadyClaimed ? "Already claimed. Nice work." : `+${AWARD} credits. Nice work.`);
    } else {
      setMsg(res.error || "Could not claim right now. Try again.");
    }
  }

  return (
    <div
      style={{
        border: `1px solid ${p.line}`,
        borderRadius: 16,
        padding: "clamp(20px,3vw,28px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontFamily: "'Neue Montreal','Helvetica Neue',Arial,sans-serif", fontWeight: 800, fontSize: "clamp(17px,2.2vw,22px)", letterSpacing: "-0.01em", color: p.text }}>
          {title}
        </p>
        <p style={{ margin: "6px 0 0", fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 16, lineHeight: 1.45, color: p.soft }}>
          {blurb || `Mark it done and claim ${AWARD} credits for finishing.`}
        </p>
        {msg && (
          <p aria-live="polite" style={{ margin: "8px 0 0", fontFamily: "'Neue Montreal',Arial,sans-serif", fontSize: 13, fontWeight: 600, color: p.accent }}>
            {msg}
          </p>
        )}
      </div>

      {done ? (
        <span style={{ flexShrink: 0, fontFamily: "'Neue Montreal',Arial,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: p.on, background: p.accent, borderRadius: 999, padding: "12px 20px" }}>
          Completed
        </span>
      ) : signedIn ? (
        <button
          type="button"
          onClick={claim}
          disabled={busy}
          style={{ flexShrink: 0, font: "inherit", fontFamily: "'Neue Montreal',Arial,sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: p.on, background: p.accent, border: "none", borderRadius: 999, padding: "13px 22px", cursor: busy ? "default" : "pointer" }}
        >
          {busy ? "Claiming..." : `Mark complete · +${AWARD}`}
        </button>
      ) : (
        <button
          type="button"
          onClick={signIn}
          style={{ flexShrink: 0, font: "inherit", fontFamily: "'Neue Montreal',Arial,sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: p.on, background: p.accent, border: "none", borderRadius: 999, padding: "13px 22px", cursor: "pointer" }}
        >
          Sign in to claim +{AWARD}
        </button>
      )}
    </div>
  );
}
