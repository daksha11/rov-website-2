"use client";

// /card — business card QR landing. One screen, email is the only required
// field, built for someone tapping a phone in the ten seconds after a
// handshake. Subscribes to the "From Cards" Klaviyo list (SQRrEK, override via
// NEXT_PUBLIC_KLAVIYO_CARD_LIST_ID) so the add is instant, and fires a
// best-effort copy to /api/leads (pinned to the same From-Cards list, not web
// leads) so the team sees the scan by email too. Visual language matches
// StartProjectForm (dark espresso card).

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const ORANGE = "#EA9A61";
const CREAM = "#FFF4E3";
const HEADING = "Norwige, sans-serif";
const LABEL = "'Neue Montreal', sans-serif";
const BODY = "'Roboto', sans-serif";

const CARD_BG = "linear-gradient(160deg, #1C1714 0%, #2A1D15 55%, #42201C 100%)";
const BTN_BG = "linear-gradient(112deg, #42201C 6%, #A64D2B 40%, #B16937 68%, #EA9A61 98%)";

const INTERESTS = ["Web", "Video", "AI Automation", "Not sure yet"];

const SOURCE = "card:qr";
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// IRL card scans go to the "ROV Business Leads (From Cards)" Klaviyo list,
// kept separate from website form leads (ROV web leads). Override via env.
const CARD_LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_CARD_LIST_ID || "SQRrEK";

const BOOKING_URL = "https://cal.com/rov-studios-imhphw/15min";

export default function CardIntake() {
  const [interest, setInterest] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  // Carried into the booking embed so they don't retype what they just gave us.
  const [submitted, setSubmitted] = useState({ name: "", email: "" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string) || "";
    const email = fd.get("email") as string;
    const company = fd.get("company") as string;
    const source = interest ? `${SOURCE}:${slug(interest)}` : SOURCE;

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/klaviyo/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source,
          company,
          listId: CARD_LIST_ID,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSubmitted({ name, email });
        setStatus("sent");
        // Best-effort heads-up in the shared leads inbox. Never blocks the
        // success state on this — the Klaviyo add is the whole point here.
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || "(no name given)",
            email,
            message: interest ? `Scanned the card. Curious about: ${interest}` : "Scanned the card.",
            source,
            page: "/card",
            company,
            // Keep card scans out of the web-leads list; they belong in From-Cards.
            klaviyoListId: CARD_LIST_ID,
          }),
        }).catch(() => {});
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
    <div
      className="card-screen"
      style={{
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "clamp(20px, 6vw, 40px)",
        paddingTop: "clamp(28px, 8vh, 56px)",
        paddingBottom: "max(clamp(20px, 6vw, 40px), env(safe-area-inset-bottom))",
      }}
    >
      <Link href="/" style={{ marginBottom: "clamp(18px, 4vw, 32px)" }}>
        <Image src="/brand/rov-logo.webp" alt="Range Of View Studios" width={140} height={36} style={{ height: "auto", width: 110 }} priority />
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: status === "sent" ? 480 : 440,
          background: CARD_BG,
          border: "1px solid rgba(234,154,97,0.22)",
          borderRadius: 20,
          padding: status === "sent" ? "clamp(20px, 4vw, 28px)" : "clamp(28px, 6vw, 40px)",
          position: "relative",
          overflow: "hidden",
          transition: "max-width 0.2s ease",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234,154,97,0.16), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <SuccessState key="sent" name={submitted.name} email={submitted.email} />
          ) : (
            <motion.div key="form" style={{ position: "relative", zIndex: 1 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <span style={{ fontFamily: LABEL, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: ORANGE }}>
                Good to meet you
              </span>
              <h1 style={{ fontFamily: HEADING, fontSize: "clamp(1.7rem, 6vw, 2.2rem)", fontWeight: 400, color: CREAM, lineHeight: 1.1, margin: "10px 0 24px" }}>
                Let&apos;s continue the conversation.
              </h1>

              <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

                {/* Primary, required field — larger, warm border, own label. This is the one action that matters. */}
                <div>
                  <label htmlFor="card-email" style={fieldLabel}>
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="card-email"
                    type="email"
                    name="email"
                    required
                    maxLength={254}
                    placeholder="you@company.com"
                    aria-label="Email"
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="card-field"
                    style={primaryInputStyle}
                  />
                </div>

                {/* Secondary, optional fields — visually quieter so they don't compete with email. */}
                <div>
                  <label htmlFor="card-name" style={{ ...fieldLabel, color: "rgba(255,244,227,0.6)" }}>
                    Name <span style={{ textTransform: "none", letterSpacing: 0, color: "rgba(255,244,227,0.4)" }}>(optional)</span>
                  </label>
                  <input id="card-name" type="text" name="name" maxLength={120} placeholder="First and last" aria-label="Name" autoComplete="name" className="card-field" style={inputStyle} />
                </div>

                <div>
                  <p style={{ ...fieldLabel, color: "rgba(255,244,227,0.85)", marginBottom: 12 }}>
                    Curious about? <span style={{ textTransform: "none", letterSpacing: 0, color: "rgba(255,244,227,0.5)" }}>(optional)</span>
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                    {INTERESTS.map((o) => {
                      const active = interest === o;
                      return (
                        <button
                          key={o}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setInterest(active ? "" : o)}
                          className={`card-chip${active ? " is-active" : ""}`}
                          style={{
                            fontFamily: LABEL,
                            fontSize: 14,
                            fontWeight: active ? 700 : 600,
                            padding: "12px 18px",
                            minHeight: 44,
                            borderRadius: 100,
                            cursor: "pointer",
                          }}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {status === "error" && <p style={{ fontFamily: BODY, fontSize: 13, color: ORANGE, margin: 0, fontWeight: 600 }}>{error}</p>}

                <div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="card-submit"
                    style={{ ...primaryBtn, opacity: status === "sending" ? 0.7 : 1, cursor: status === "sending" ? "wait" : "pointer" }}
                  >
                    {status === "sending" ? "Sending..." : "Show me the work"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .card-screen {
          min-height: 100vh;
          min-height: 100dvh;
        }
        .card-field::placeholder {
          color: rgba(255, 244, 227, 0.42);
        }
        /* Phones auto-fill saved email/name into a light box with dark
           text by default — override so autofill stays on-theme instead
           of flashing white on this dark card. */
        .card-field:-webkit-autofill,
        .card-field:-webkit-autofill:hover,
        .card-field:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff4e3;
          -webkit-box-shadow: 0 0 0 1000px #2a1d15 inset;
          box-shadow: 0 0 0 1000px #2a1d15 inset;
          caret-color: #fff4e3;
          transition: background-color 9999s ease-in-out 0s;
        }
        .card-field:focus {
          border-color: #ea9a61 !important;
          box-shadow: 0 0 0 3px rgba(234, 154, 97, 0.25);
        }
        .card-chip {
          color: rgba(255, 244, 227, 0.9);
          background: rgba(255, 244, 227, 0.07);
          border: 1.5px solid rgba(255, 244, 227, 0.3);
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        }
        .card-chip:hover {
          background: rgba(234, 154, 97, 0.14);
          border-color: rgba(234, 154, 97, 0.65);
          color: #fff4e3;
          transform: translateY(-1.5px);
          box-shadow: 0 6px 14px rgba(234, 154, 97, 0.16);
        }
        .card-chip:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(234, 154, 97, 0.14);
        }
        .card-chip.is-active {
          color: #ea9a61;
          background: rgba(234, 154, 97, 0.16);
          border-color: #ea9a61;
        }
        .card-chip.is-active:hover {
          background: rgba(234, 154, 97, 0.22);
          box-shadow: 0 6px 16px rgba(234, 154, 97, 0.28);
        }
        .card-chip:focus-visible,
        .card-submit:focus-visible {
          outline: 2px solid #ea9a61;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

function SuccessState({ name, email }: { name: string; email: string }) {
  // Pre-fill cal.com's booking form with what they just typed — no retyping.
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (email) params.set("email", email);
  const embedSrc = `${BOOKING_URL}?embed=true&layout=month_view${params.toString() ? `&${params.toString()}` : ""}`;
  const fallbackHref = `${BOOKING_URL}${params.toString() ? `?${params.toString()}` : ""}`;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "0 4px" }}>
        <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: "50%", background: "rgba(234,154,97,0.12)", border: `1.5px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontFamily: HEADING, fontSize: "clamp(1.3rem, 4.5vw, 1.6rem)", fontWeight: 400, color: CREAM, margin: 0, lineHeight: 1.15 }}>
            You&apos;re in. Grab a time?
          </h2>
        </div>
      </div>

      <div style={{ borderRadius: 14, overflow: "hidden", background: "rgba(255,244,227,0.03)", border: "1px solid rgba(255,244,227,0.12)" }}>
        <iframe
          src={embedSrc}
          title="Book a 15-minute call"
          style={{ width: "100%", height: 640, border: "none", display: "block" }}
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          loading="lazy"
        />
      </div>

      <p style={{ textAlign: "center", margin: "14px 0 0" }}>
        <a href={fallbackHref} target="_blank" rel="noopener noreferrer" style={{ fontFamily: LABEL, fontSize: 12.5, color: "rgba(255,244,227,0.5)", textDecoration: "underline" }}>
          Calendar not loading? Open it in a new tab &rarr;
        </a>
      </p>
    </motion.div>
  );
}

const fieldLabel: React.CSSProperties = {
  display: "block",
  fontFamily: LABEL,
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: ORANGE,
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,244,227,0.04)",
  border: "1.5px solid rgba(255,244,227,0.22)",
  borderRadius: 10,
  padding: "13px 16px",
  fontSize: 16,
  color: CREAM,
  fontFamily: BODY,
  outline: "none",
};

// The one field that matters — warmer border, slightly larger, so the eye
// lands here first and the optional fields read as clearly secondary.
const primaryInputStyle: React.CSSProperties = {
  ...inputStyle,
  border: `1.5px solid rgba(234,154,97,0.4)`,
  background: "rgba(234,154,97,0.06)",
  padding: "14px 16px",
  fontSize: 16,
};

const primaryBtn: React.CSSProperties = {
  background: BTN_BG,
  color: CREAM,
  padding: "14px 26px",
  borderRadius: 100,
  fontFamily: HEADING,
  fontWeight: 600,
  fontSize: 15,
  border: "none",
  cursor: "pointer",
  width: "100%",
  boxShadow: "3px 4px 4px 0 rgba(255,244,227,0.12) inset, 0 4px 4px 0 rgba(0,0,0,0.25)",
};
