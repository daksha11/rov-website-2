"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — SIGNUP
// One email-capture component, used everywhere on the magazine.
// Theme-aware (dark void + cream light), real submit state machine
// (idle -> submitting -> success | error), inline validation, a
// honeypot for bots, aria-live status, and Klaviyo onsite identify
// on success. Posts to /api/klaviyo/subscribe.
//
// Variants:
//   inline   — underline field + inline button (default)
//   band     — big headline layout for the monthly-drop section
//   stacked  — label, field, button stacked (tight columns, footers)
// ═══════════════════════════════════════════════════════

import { useId, useState } from "react";
import type { CSSProperties } from "react";
import { trackFormError, trackFormSubmit, trackLead } from "@/lib/lead-analytics";

type Theme = "dark" | "light";
type Variant = "inline" | "band" | "stacked";
type Status = "idle" | "submitting" | "success" | "error";

const MONO = "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif";
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";
const GROT = "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif";

function palette(theme: Theme, accent?: string) {
  if (theme === "light") {
    return {
      text: "#160C28",
      soft: "rgba(22,12,40,0.72)",
      faint: "rgba(22,12,40,0.5)",
      line: "rgba(22,12,40,0.4)",
      lineErr: "#A6432C",
      accent: accent || "#4E3D73",
      onAccent: "#F0E6E0",
    };
  }
  return {
    text: "#F0E6E0",
    soft: "rgba(240,230,224,0.72)",
    faint: "rgba(240,230,224,0.5)",
    line: "rgba(240,230,224,0.4)",
    lineErr: "#D98C74",
    accent: accent || "#E3C24A",
    onAccent: "#0F0820",
  };
}

// Fire Klaviyo onsite identify so the profile is tied to the browser
// session too (in addition to the server-side list subscribe).
function klaviyoIdentify(email: string, source?: string) {
  try {
    const w = window as unknown as { _learnq?: unknown[] };
    if (!Array.isArray(w._learnq)) return;
    w._learnq.push(["identify", { $email: email, ...(source ? { ctrla_source: source } : {}) }]);
    w._learnq.push(["track", "CTRL-A Signup", { source: source || "unknown" }]);
  } catch {
    /* tracking is best-effort */
  }
}

export default function CtrlASignup({
  source,
  theme = "dark",
  accent,
  variant = "inline",
  title,
  note = "No spam. Unsubscribe anytime.",
  cta = "Subscribe",
  placeholder = "your@email.com",
  successTitle = "You are on the list.",
  successBody = "Watch your inbox. The next drop is on its way.",
  showName = false,
  listId,
  style,
  onSuccess,
}: {
  source: string;
  theme?: Theme;
  accent?: string;
  variant?: Variant;
  title?: string;
  note?: string;
  cta?: string;
  placeholder?: string;
  successTitle?: string;
  successBody?: string;
  showName?: boolean;
  listId?: string;
  style?: CSSProperties;
  // Fires after a confirmed subscribe. A gate uses this to unlock content.
  onSuccess?: (email: string) => void;
}) {
  const p = palette(theme, accent);
  const uid = useId();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const submitting = status === "submitting";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }
    trackFormSubmit(source);
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/klaviyo/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, name: name.trim() || undefined, source, company, listId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        klaviyoIdentify(value, source);
        trackLead(source);
        setStatus("success");
        onSuccess?.(value);
        return;
      }
      trackFormError(source, data.code || `http_${res.status}`);
      setStatus("error");
      setError(data.error || "Something went wrong. Please try again.");
    } catch {
      trackFormError(source, "network");
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  // ── Success state (shared by all variants) ──
  if (status === "success") {
    return (
      <div className="ctrla-signup" data-theme={theme} style={style} aria-live="polite">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span
            aria-hidden
            className="ctrla-signup-check"
            style={{ color: p.onAccent, background: p.accent }}
          >
            ✓
          </span>
          <div>
            <p style={{ fontFamily: GROT, fontWeight: 800, fontSize: "clamp(17px,2vw,22px)", letterSpacing: "-0.02em", color: p.text, margin: 0 }}>
              {successTitle}
            </p>
            <p style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.5, color: p.soft, margin: "6px 0 0" }}>
              {successBody}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isError = status === "error";
  const label = (
    <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: p.accent, display: "block", marginBottom: variant === "band" ? 0 : 12 }}>
      {title}
    </span>
  );

  const hiddenHoneypot = (
    <input
      type="text"
      name="company"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
      style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
    />
  );

  const fieldRow = (
    <div
      className="ctrla-signup-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        borderBottom: `1px solid ${isError ? p.lineErr : p.line}`,
        maxWidth: variant === "band" ? "min(100%, 400px)" : 460,
        transition: "border-color 0.25s ease",
      }}
    >
      <input
        id={`${uid}-email`}
        type="email"
        required
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (isError) setStatus("idle"); }}
        placeholder={placeholder}
        aria-label="Email address"
        aria-invalid={isError}
        disabled={submitting}
        style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: p.text, fontFamily: MONO, fontSize: 15, padding: "13px 4px" }}
      />
      <button
        type="submit"
        disabled={submitting}
        className="ctrla-signup-btn"
        style={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: p.accent,
          background: "transparent",
          border: "none",
          cursor: submitting ? "default" : "pointer",
          padding: "13px 4px",
          whiteSpace: "nowrap",
          opacity: submitting ? 0.6 : 1,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {submitting ? (
          <>
            <span className="ctrla-signup-spin" style={{ borderColor: p.accent, borderTopColor: "transparent" }} aria-hidden />
            Sending
          </>
        ) : (
          <>{cta} →</>
        )}
      </button>
    </div>
  );

  const nameRow = showName ? (
    <div
      style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${p.line}`, maxWidth: 460, marginBottom: 14 }}
    >
      <input
        id={`${uid}-name`}
        type="text"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="First name (optional)"
        aria-label="First name"
        disabled={submitting}
        style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: p.text, fontFamily: MONO, fontSize: 15, padding: "13px 4px" }}
      />
    </div>
  ) : null;

  const statusLine = (
    <div aria-live="polite" style={{ minHeight: 18, marginTop: 12 }}>
      {isError ? (
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.02em", color: p.lineErr }}>{error}</span>
      ) : (
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", color: p.faint }}>{note}</span>
      )}
    </div>
  );

  // ── Band variant: headline sits to the left, provided by the caller. ──
  if (variant === "band") {
    return (
      <form onSubmit={onSubmit} className="ctrla-signup" data-theme={theme} style={{ minWidth: "min(100%, 340px)", flex: "0 1 400px", ...style }}>
        {hiddenHoneypot}
        {title && label}
        {nameRow}
        {fieldRow}
        {statusLine}
      </form>
    );
  }

  // ── Stacked / inline ──
  return (
    <form onSubmit={onSubmit} className="ctrla-signup" data-theme={theme} style={style}>
      {hiddenHoneypot}
      {title && label}
      {nameRow}
      {fieldRow}
      {statusLine}
    </form>
  );
}
