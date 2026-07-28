"use client";

// End-of-article lead form for design-standard blog pages.
// Replaces the old two-button CTA card: the reader just finished an article
// about their problem, so we let them start the conversation right there
// instead of bouncing them to another page. The `source` prop silently tags
// which article generated the lead (e.g. "blog:restaurant-atlanta").
//
// Styling follows .claude/blog-design-standard.md: beige card, dark espresso
// text, rust primary button. Never a dark/gradient CTA background.

import { useState } from "react";

const CREAM = "#FFF4E3";
const ESPRESSO = "#3B2114";
const RUST = "#90422C";
const ORANGE = "#EA9A61";
const LABEL_FONT = "'Neue Montreal', sans-serif";
const HEADING_FONT = "Norwige, sans-serif";

type Props = {
  source: string;
  heading: string;
  subheading: string;
  /** Placeholder for the message box; tune it to the article's topic. */
  messagePlaceholder?: string;
  /** Optional secondary escape hatch, e.g. a booking link. */
  secondaryHref?: string;
  secondaryLabel?: string;
  /**
   * "link" (default) = quiet underlined text, current behavior everywhere.
   * "button" = equal-weight outlined pill button, for pages where booking a
   * call is the priority conversion path, not an afterthought.
   * "primary" = the booking link BECOMES the hero action (filled, on top);
   * the form's submit button shrinks to the outlined secondary spot below it.
   */
  secondaryVariant?: "link" | "button" | "primary";
  /**
   * "light" (default) = beige card for cream/light pages (blog design standard).
   * "dark" = inverted dark-brown premium gradient card for pages with a dark bg.
   */
  theme?: "light" | "dark";
  /**
   * Optional context chips shown above the name field (e.g. service pillars on
   * the homepage). The selected one is folded into the emailed message so you
   * know what they came for. Purely context; the form submits fine with none picked.
   */
  topics?: string[];
  /** Label above the topic chips. */
  topicsLabel?: string;
  /** Optional submit-button label override (default "Send it over"). */
  submitLabel?: string;
};

// Two palettes. Light follows the blog design standard (beige card, dark text,
// rust button). Dark inverts to a premium espresso gradient with an orange CTA,
// for sound/services/CTRL-A pages that sit on a dark background.
function palette(theme: "light" | "dark") {
  if (theme === "dark") {
    return {
      card: "linear-gradient(160deg, #1C1714 0%, #2A1D15 55%, #42201C 100%)",
      cardBorder: "1px solid rgba(234,154,97,0.22)",
      heading: "#FFF4E3",
      body: "rgba(255,244,227,0.9)",
      inputBg: "rgba(255,244,227,0.06)",
      inputBorder: "1.5px solid rgba(255,244,227,0.28)",
      inputText: "#FFF4E3",
      placeholder: "rgba(255,244,227,0.62)",
      button: "linear-gradient(112deg, #42201C 6%, #A64D2B 40%, #B16937 68%, #EA9A61 98%)",
      buttonText: "#FFF4E3",
      secondary: "rgba(255,244,227,0.82)",
      fine: "rgba(255,244,227,0.62)",
      successRing: ORANGE,
      successTick: ORANGE,
    };
  }
  return {
    card: CREAM,
    cardBorder: "1.5px solid rgba(59,33,20,0.15)",
    heading: ESPRESSO,
    body: "rgba(59,33,20,0.7)",
    inputBg: "#FFFFFF",
    inputBorder: "1.5px solid rgba(59,33,20,0.2)",
    inputText: ESPRESSO,
    placeholder: "rgba(59,33,20,0.55)",
    button: RUST,
    buttonText: CREAM,
    secondary: "rgba(59,33,20,0.6)",
    fine: "rgba(59,33,20,0.45)",
    successRing: RUST,
    successTick: RUST,
  };
}

export default function BlogLeadForm({
  source,
  heading,
  subheading,
  messagePlaceholder = "Tell us a little about your business and what you're trying to fix...",
  secondaryHref,
  secondaryLabel = "Prefer to talk? Book a free call",
  secondaryVariant = "link",
  theme = "light",
  topics,
  topicsLabel = "What do you need?",
  submitLabel = "Send it over",
}: Props) {
  const c = palette(theme);
  const [topic, setTopic] = useState<string>("");
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: c.inputBg,
    border: c.inputBorder,
    borderRadius: 10,
    padding: "13px 16px",
    fontSize: 15,
    color: c.inputText,
    fontFamily: "inherit",
    outline: "none",
    // Consumed by the ::placeholder rule below — browsers dim placeholders by
    // default, which kills legibility on the dark card.
    ["--rov-ph" as string]: c.placeholder,
  };
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      // Fold the picked topic into the message so it shows up in the inbox,
      // and into the source tag so the subject line carries it too.
      const rawMessage = (fd.get("message") as string) || "";
      const message = topic ? `[Looking for: ${topic}]\n\n${rawMessage}`.trim() : rawMessage;
      const taggedSource = topic
        ? `${source}:${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`
        : source;
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message,
          company: fd.get("company"),
          source: taggedSource,
          page: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <section
      style={{
        background: c.card,
        border: c.cardBorder,
        borderRadius: 16,
        padding: "48px 36px",
      }}
    >
      <style>{`.rov-lead-input::placeholder { color: var(--rov-ph); opacity: 1; }`}</style>
      {status === "sent" ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: theme === "dark" ? "rgba(234,154,97,0.12)" : "rgba(144,66,44,0.1)",
              border: `1.5px solid ${c.successRing}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c.successTick} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontFamily: HEADING_FONT, fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 400, color: c.heading, marginBottom: 12, lineHeight: 1.2 }}>
            Got it. We&apos;ll be in touch.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: c.body, maxWidth: 420, margin: "0 auto" }}>
            We read every message and reply within one business day, usually faster.
          </p>
        </div>
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: HEADING_FONT, fontSize: "clamp(32px, 5.5vw, 52px)", fontWeight: 400, marginBottom: 16, lineHeight: 1.12, letterSpacing: "-0.01em", color: c.heading }}>
              {heading}
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: c.body, maxWidth: 480, margin: "0 auto" }}>
              {subheading}
            </p>
          </div>

          <form onSubmit={onSubmit} style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Honeypot — hidden from humans, bots fill it and get silently dropped. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            {topics && topics.length > 0 && (
              <div style={{ marginBottom: 4 }}>
                <p style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: c.body, fontFamily: LABEL_FONT, marginBottom: 10, textAlign: "center" }}>
                  {topicsLabel}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {topics.map((t) => {
                    const active = topic === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTopic(active ? "" : t)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 100,
                          fontSize: 13,
                          fontFamily: LABEL_FONT,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          border: active
                            ? `1.5px solid ${theme === "dark" ? ORANGE : RUST}`
                            : c.inputBorder,
                          background: active
                            ? (theme === "dark" ? "rgba(234,154,97,0.15)" : "rgba(144,66,44,0.08)")
                            : "transparent",
                          color: active
                            ? (theme === "dark" ? ORANGE : RUST)
                            : c.body,
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              <input className="rov-lead-input" type="text" name="name" required maxLength={120} placeholder="Your name" aria-label="Your name" style={inputStyle} />
              <input className="rov-lead-input" type="email" name="email" required maxLength={254} placeholder="Email" aria-label="Email" style={inputStyle} />
            </div>
            <textarea
              className="rov-lead-input"
              name="message"
              rows={3}
              maxLength={800}
              placeholder={messagePlaceholder}
              aria-label="What are you working on?"
              style={{ ...inputStyle, resize: "vertical", minHeight: 84 }}
            />

            {status === "error" && (
              <p style={{ fontSize: 13, color: theme === "dark" ? ORANGE : RUST, margin: 0, fontWeight: 600 }}>{error}</p>
            )}

            {secondaryHref && secondaryVariant === "primary" && (
              <a
                href={secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: c.button,
                  color: c.buttonText,
                  padding: "14px 28px",
                  borderRadius: 100,
                  fontFamily: LABEL_FONT,
                  fontWeight: 700,
                  fontSize: 15,
                  boxShadow: theme === "dark" ? "3px 4px 4px 0 rgba(255,244,227,0.12) inset, 0 4px 4px 0 rgba(0,0,0,0.25)" : "none",
                }}
              >
                {secondaryLabel}
              </a>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={
                secondaryVariant === "primary"
                  ? {
                      background: "transparent",
                      color: c.secondary,
                      padding: "11px 24px",
                      borderRadius: 100,
                      fontFamily: LABEL_FONT,
                      fontWeight: 600,
                      fontSize: 13.5,
                      border: `1.5px solid ${c.inputBorder.split(" ").slice(-1)[0]}`,
                      cursor: status === "sending" ? "wait" : "pointer",
                      opacity: status === "sending" ? 0.7 : 1,
                      transition: "opacity 0.2s",
                      marginTop: 2,
                    }
                  : {
                      background: c.button,
                      color: c.buttonText,
                      padding: "14px 28px",
                      borderRadius: 100,
                      fontFamily: LABEL_FONT,
                      fontWeight: 700,
                      fontSize: 15,
                      border: "none",
                      boxShadow: theme === "dark" ? "3px 4px 4px 0 rgba(255,244,227,0.12) inset, 0 4px 4px 0 rgba(0,0,0,0.25)" : "none",
                      cursor: status === "sending" ? "wait" : "pointer",
                      opacity: status === "sending" ? 0.7 : 1,
                      transition: "opacity 0.2s",
                    }
              }
            >
              {status === "sending" ? "Sending..." : submitLabel}
            </button>

            {secondaryHref && secondaryVariant === "button" && (
              <a
                href={secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: LABEL_FONT,
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "13px 26px",
                  borderRadius: 100,
                  marginTop: 2,
                  color: theme === "dark" ? ORANGE : RUST,
                  background: theme === "dark" ? "rgba(234,154,97,0.1)" : "rgba(144,66,44,0.06)",
                  border: `1.5px solid ${theme === "dark" ? ORANGE : RUST}`,
                }}
              >
                {secondaryLabel}
              </a>
            )}

            {secondaryHref && secondaryVariant === "link" && (
              <a
                href={secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: c.secondary,
                  textDecoration: "underline",
                  fontFamily: LABEL_FONT,
                  marginTop: 4,
                }}
              >
                {secondaryLabel}
              </a>
            )}

            <p style={{ textAlign: "center", fontSize: 12, color: c.fine, margin: "4px 0 0" }}>
              No newsletter, no spam. Just a real reply from the team.
            </p>
          </form>
        </>
      )}
    </section>
  );
}
