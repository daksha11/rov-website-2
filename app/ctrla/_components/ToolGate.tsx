"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — TOOL GATE
// A soft, email-unlock gate for lead generation. Wrap any valuable
// takeaway (a download, a premium section) in <ToolGate> and it shows
// a teaser + email form until the visitor subscribes. On success the
// email goes to Klaviyo (via CtrlASignup) and the content reveals.
//
// "Remember" is global: once a visitor unlocks anything, every other
// gate on the site is already open (we never nag a known lead). We
// still fire a Klaviyo track event per gate for attribution.
//
// This is a soft gate (client-side), the right tool for lead magnets.
// It is not hard security; genuinely private content needs a server
// check against a Supabase session instead.
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import CtrlASignup from "./CtrlASignup";
import { COSTS, type CostItem } from "@/lib/credits/config";

type Theme = "dark" | "light";
type Gate = "email" | "credits";

const UNLOCK_KEY = "ctrla_unlocked";
const EMAIL_KEY = "ctrla_lead_email";

function palette(theme: Theme, accent?: string) {
  if (theme === "light") {
    return {
      text: "#160C28",
      soft: "rgba(22,12,40,0.72)",
      faint: "rgba(22,12,40,0.5)",
      panel: "rgba(22,12,40,0.03)",
      line: "rgba(22,12,40,0.16)",
      accent: accent || "#4E3D73",
    };
  }
  return {
    text: "#F0E6E0",
    soft: "rgba(240,230,224,0.72)",
    faint: "rgba(240,230,224,0.5)",
    panel: "rgba(240,230,224,0.03)",
    line: "rgba(240,230,224,0.14)",
    accent: accent || "#E3C24A",
  };
}

// Track an unlock event for attribution (best-effort onsite).
function trackUnlock(source: string) {
  try {
    const w = window as unknown as { _learnq?: unknown[] };
    if (Array.isArray(w._learnq)) w._learnq.push(["track", "CTRL-A Tool Unlocked", { source }]);
  } catch {
    /* best-effort */
  }
}

// Onsite guide-unlock signal, fired when a gated guide reveals (email gate).
// The reliable server counterpart for completion is fired by /api/credits/earn.
function trackGuideUnlocked(guideSlug: string, toolkit?: string) {
  try {
    const w = window as unknown as { _learnq?: unknown[] };
    if (Array.isArray(w._learnq))
      w._learnq.push(["track", "CTRL-A Guide Unlocked", { guide: guideSlug, toolkit: toolkit ?? "general" }]);
  } catch {
    /* best-effort */
  }
}

export default function ToolGate({
  gateId,
  source,
  theme = "dark",
  accent,
  title = "Unlock the files",
  blurb = "Drop your email and the download opens right here, plus you get every new drop.",
  bullets,
  cta = "Unlock it",
  note = "No spam. Unsubscribe anytime.",
  children,
  preview,
  gate = "email",
  guideSlug,
  toolkit,
  costItem = "premium-course",
}: {
  gateId: string;
  source: string;
  theme?: Theme;
  accent?: string;
  title?: string;
  blurb?: string;
  bullets?: string[];
  cta?: string;
  note?: string;
  children: ReactNode;
  // Optional teaser shown blurred behind the lock (defaults to the children).
  preview?: ReactNode;
  // "email" (default) captures a lead; "credits" spends credits to unlock.
  // Flipping a single guide is just this prop, per lib/ctrla/guides.ts.
  gate?: Gate;
  // When set, fire the onsite Guide Unlocked signal on reveal.
  guideSlug?: string;
  toolkit?: string;
  // Which cost to charge in credits mode (defaults to premium-course).
  costItem?: CostItem;
}) {
  const p = palette(theme, accent);
  // Start locked so server and first client render match; reveal in effect.
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [spending, setSpending] = useState(false);
  const [spendError, setSpendError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // The global email-lead unlock only opens email gates. Credit gates are
      // per-item and must be paid, so they never auto-open from the lead flag.
      if (gate === "email" && localStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
    } catch {
      /* private mode, etc. */
    }
    setReady(true);
  }, [gate]);

  function handleUnlock(email: string) {
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
      localStorage.setItem(EMAIL_KEY, email);
    } catch {
      /* ignore */
    }
    trackUnlock(source);
    if (guideSlug) trackGuideUnlocked(guideSlug, toolkit);
    setUnlocked(true);
  }

  // Credits gate: spend server-side, reveal on success. Not used at launch
  // (all guides are email), but wired so a single guide can flip to credits.
  async function handleSpend() {
    if (spending) return;
    setSpending(true);
    setSpendError(null);
    try {
      const res = await fetch("/api/credits/spend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ item: costItem }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        if (guideSlug) trackGuideUnlocked(guideSlug, toolkit);
        setUnlocked(true);
        return;
      }
      if (res.status === 401) setSpendError("Sign in to unlock this with credits.");
      else if (res.status === 402) setSpendError("Not enough credits yet. Earn a few more and come back.");
      else setSpendError("Could not unlock right now. Please try again.");
    } catch {
      setSpendError("Could not unlock right now. Please try again.");
    } finally {
      setSpending(false);
    }
  }

  // Before hydration settles, render the locked shell without the form to
  // avoid a flash of the form for already-unlocked visitors.
  if (unlocked) return <>{children}</>;

  const creditCost = COSTS[costItem];

  return (
    <div className="ctrla-gate" data-theme={theme}>
      {/* Blurred teaser of what is behind the gate */}
      <div className="ctrla-gate-peek" aria-hidden style={{ borderColor: p.line }}>
        <div className="ctrla-gate-peek-inner">{preview ?? children}</div>
        <div className="ctrla-gate-veil" data-theme={theme} />
      </div>

      {/* The ask */}
      <div className="ctrla-gate-card" style={{ background: p.panel, borderColor: p.line }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span className="ctrla-gate-lock" aria-hidden style={{ color: p.accent, borderColor: p.accent }}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <h4 style={{ margin: 0, fontFamily: "'Neue Montreal','Helvetica Neue',Arial,sans-serif", fontWeight: 800, fontSize: "clamp(18px,2.2vw,24px)", letterSpacing: "-0.02em", color: p.text }}>{title}</h4>
        </div>

        <p style={{ margin: "0 0 14px", fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.5, color: p.soft }}>{blurb}</p>

        {bullets && bullets.length > 0 && (
          <ul style={{ listStyle: "none", margin: "0 0 18px", padding: 0, display: "grid", gap: 8 }}>
            {bullets.map((b) => (
              <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontFamily: "'Neue Montreal','Helvetica Neue',Arial,sans-serif", fontSize: "clamp(13px,1.5vw,15px)", lineHeight: 1.45, color: p.soft }}>
                <span aria-hidden style={{ color: p.accent, flexShrink: 0 }}>→</span>
                {b}
              </li>
            ))}
          </ul>
        )}

        {ready && gate === "email" && (
          <CtrlASignup
            theme={theme}
            accent={accent}
            source={source}
            cta={cta}
            note={note}
            onSuccess={handleUnlock}
          />
        )}

        {ready && gate === "credits" && (
          <div>
            <button
              type="button"
              onClick={handleSpend}
              disabled={spending}
              style={{
                width: "100%",
                font: "inherit",
                fontFamily: "'Neue Montreal','Helvetica Neue',Arial,sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.02em",
                color: "#160C28",
                background: p.accent,
                border: "none",
                borderRadius: 12,
                padding: "13px 18px",
                cursor: spending ? "default" : "pointer",
                opacity: spending ? 0.7 : 1,
              }}
            >
              {spending ? "Unlocking..." : `${cta} · ${creditCost} credits`}
            </button>
            {spendError && (
              <p style={{ margin: "10px 0 0", fontSize: 13, color: p.soft }}>{spendError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
