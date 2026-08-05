"use client";

// Homepage intake: a light, two-step conversation starter. Pick the closest
// service, then leave contact details and a note. Posts to the shared
// /api/leads route with the service folded into the email so we can send a
// quick, specific reply instead of a generic "thanks for reaching out".
//
// NO PRICING HERE, deliberately. This used to show an instant ballpark, which
// created two problems. It quoted a floor on the homepage that /web pricing
// ($2,000) and /web/brief ($2,500) then contradicted, so the number climbed as
// a visitor went deeper. And it made money the second thing we talked about,
// before we knew anything about the job. Pricing lives on the service pages,
// where it has the context to mean something; the homepage's only job is to
// start the conversation.

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  attributionPayload,
  captureAttribution,
  trackBookingClick,
  trackFormError,
  trackFormStart,
  trackFormStep,
  trackFormSubmit,
  trackLead,
} from "@/lib/lead-analytics";

const ORANGE = "#EA9A61";
const CREAM = "#FFF4E3";
const HEADING = "Norwige, sans-serif";
const LABEL = "'Neue Montreal', sans-serif";
const BODY = "'Roboto', sans-serif";

const CARD_BG = "linear-gradient(160deg, #1C1714 0%, #2A1D15 55%, #42201C 100%)";
const BTN_BG = "linear-gradient(112deg, #42201C 6%, #A64D2B 40%, #B16937 68%, #EA9A61 98%)";

type Service = {
  id: string;
  label: string;
  blurb: string;
  icon: React.ReactNode;
};

const SERVICES: Service[] = [
  {
    id: "Web",
    label: "Web",
    blurb: "Sites & landing pages that convert",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18M8 18v2M16 18v2M6 20h12" />
      </svg>
    ),
  },
  {
    id: "Video",
    label: "Video",
    blurb: "Brand films, drone, music videos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="14" height="12" rx="2" />
        <path d="M17 10l4-2v8l-4-2" />
      </svg>
    ),
  },
  {
    id: "AI Automation",
    label: "AI Automation",
    blurb: "Cut the manual work that eats time",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="8" width="14" height="11" rx="2" />
        <path d="M12 8V4M12 3a1 1 0 100 .01M9 13v1M15 13v1M4 14H2M22 14h-2" />
      </svg>
    ),
  },
  {
    id: "Something else",
    label: "Something else",
    blurb: "Brand, strategy, or not sure yet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 013.9-2c1.5 1 .6 2.6-.4 3.2-.7.4-1 .8-1 1.8M12 16v.01" />
      </svg>
    ),
  },
];

const SOURCE = "home:start-project";
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Two screens: what they need, then how to reach them.
type StepKey = "service" | "contact";
const PATH: StepKey[] = ["service", "contact"];

export default function StartProjectForm() {
  const [stepKey, setStepKey] = useState<StepKey>("service");
  const [service, setService] = useState<Service | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const stepIndex = PATH.indexOf(stepKey);

  useEffect(() => {
    captureAttribution();
  }, []);

  function pickService(s: Service) {
    if (!service) trackFormStart(SOURCE);
    trackFormStep(SOURCE, 1, `service:${slug(s.label)}`);
    setService(s);
    setTimeout(() => setStepKey("contact"), 180);
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(ev.currentTarget);
    trackFormSubmit(SOURCE);
    setStatus("sending");
    setError("");

    // Kept short on purpose: the service line plus their own words is enough
    // to write a specific reply, which is the whole point of this form.
    const note = (fd.get("message") as string) || "";
    const message = [
      service ? `Service: ${service.label}` : "",
      note ? `\nWhat they said:\n${note}` : "",
    ]
      .filter(Boolean)
      .join("\n")
      .trim();

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message,
          company: fd.get("company"),
          source: service ? `${SOURCE}:${slug(service.label)}` : SOURCE,
          page: typeof window !== "undefined" ? window.location.pathname : "",
          ...attributionPayload(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        trackLead(SOURCE, { service: service?.label });
        setStatus("sent");
      } else {
        trackFormError(SOURCE, data.code || `http_${res.status}`);
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      trackFormError(SOURCE, "network");
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div
      style={{
        background: CARD_BG,
        border: "1px solid rgba(234,154,97,0.22)",
        borderRadius: 20,
        padding: "clamp(28px, 5vw, 52px) clamp(20px, 4vw, 48px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div aria-hidden style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,154,97,0.16), transparent 70%)", pointerEvents: "none" }} />

      {status === "sent" ? (
        <SuccessState service={service?.label || ""} />
      ) : (
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Progress header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(20px, 3vw, 32px)" }}>
            <span style={{ fontFamily: LABEL, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: ORANGE }}>Start a project</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: LABEL, fontSize: 12, color: "rgba(255,244,227,0.45)", letterSpacing: "0.1em" }}>
                {String(stepIndex + 1).padStart(2, "0")} / {String(PATH.length).padStart(2, "0")}
              </span>
              <div style={{ display: "flex", gap: 5, marginLeft: 6 }}>
                {PATH.map((_, i) => (
                  <span key={i} style={{ height: 3, width: i === stepIndex ? 22 : 10, borderRadius: 3, background: i <= stepIndex ? ORANGE : "rgba(255,244,227,0.2)", transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {stepKey === "service" && (
              <StepShell key="service" heading="What can we help with?" sub="Pick the closest fit. Nothing is locked in, it just tells us who should reply.">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  {SERVICES.map((s) => {
                    const active = service?.id === s.id;
                    return (
                      <button key={s.id} type="button" onClick={() => pickService(s)} style={serviceCard(active)}>
                        <span style={{ width: 26, height: 26, color: ORANGE, flexShrink: 0, marginTop: 2 }}>{s.icon}</span>
                        <span>
                          <span style={{ display: "block", fontFamily: HEADING, fontSize: 17, color: CREAM, marginBottom: 3 }}>{s.label}</span>
                          <span style={{ display: "block", fontFamily: BODY, fontSize: 13, color: "rgba(255,244,227,0.55)", lineHeight: 1.4 }}>{s.blurb}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </StepShell>
            )}

            {stepKey === "contact" && (
              <StepShell
                key="contact"
                heading="Tell us what you're after."
                sub="A couple of lines is plenty. We read every one and write back personally, within one business day."
              >
                {service && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                    <Recap items={[service.label]} />
                  </div>
                )}

                <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                    <input type="text" name="name" required maxLength={120} placeholder="Your name" aria-label="Your name" style={inputStyle} />
                    <input type="email" name="email" required maxLength={254} placeholder="Email" aria-label="Email" style={inputStyle} />
                  </div>
                  {/* The one field that shapes our reply, so it leads rather
                      than trailing as an afterthought. */}
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={800}
                    placeholder="What are you trying to build or fix?"
                    aria-label="What are you trying to build or fix?"
                    style={{ ...inputStyle, resize: "vertical", minHeight: 88 }}
                  />

                  {status === "error" && <p style={{ fontFamily: BODY, fontSize: 13, color: ORANGE, margin: 0, fontWeight: 600 }}>{error}</p>}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 4 }}>
                    <BackButton onClick={() => setStepKey("service")} />
                    <button type="submit" disabled={status === "sending"} style={{ ...primaryBtn, opacity: status === "sending" ? 0.7 : 1, cursor: status === "sending" ? "wait" : "pointer" }}>
                      {status === "sending" ? "Sending..." : "Start the conversation"}
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <a href="https://cal.com/rov-studios-imhphw/15min" target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick(SOURCE)} style={{ fontFamily: LABEL, fontSize: 13, color: "rgba(255,244,227,0.6)", textDecoration: "underline" }}>
                      Prefer to talk? Book a free call
                    </a>
                    <p style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,244,227,0.4)", margin: 0 }}>No newsletter, no spam. Just a real reply from the team.</p>
                  </div>
                </form>
              </StepShell>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function Recap({ items }: { items: string[] }) {
  return (
    <>
      {items.filter(Boolean).map((v) => (
        <span key={v} style={{ fontFamily: LABEL, fontSize: 12, color: ORANGE, background: "rgba(234,154,97,0.1)", border: "1px solid rgba(234,154,97,0.3)", borderRadius: 100, padding: "5px 12px" }}>
          {v}
        </span>
      ))}
    </>
  );
}

function StepShell({ heading, sub, children }: { heading: string; sub: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28, ease: "easeOut" }}>
      <h2 style={{ fontFamily: HEADING, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 400, color: CREAM, lineHeight: 1.1, marginBottom: 8 }}>{heading}</h2>
      <p style={{ fontFamily: BODY, fontSize: 15, color: "rgba(255,244,227,0.6)", lineHeight: 1.55, marginBottom: 24, maxWidth: 520 }}>{sub}</p>
      {children}
    </motion.div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ fontFamily: LABEL, fontSize: 13, color: "rgba(255,244,227,0.55)", background: "transparent", border: "none", cursor: "pointer", padding: "10px 4px" }}>
      &larr; Back
    </button>
  );
}

function SuccessState({ service }: { service: string }) {
  return (
    <motion.div role="status" aria-live="polite" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} style={{ textAlign: "center", padding: "20px 0", position: "relative", zIndex: 1 }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(234,154,97,0.12)", border: `1.5px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontFamily: HEADING, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 400, color: CREAM, marginBottom: 12 }}>Got it. We&apos;ll be in touch.</h2>
      <p style={{ fontFamily: BODY, fontSize: 15, color: "rgba(255,244,227,0.65)", lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
        {service ? `Thanks for the ${service.toLowerCase()} note. ` : ""}A real person is reading it now
        and will write back within one business day, usually faster.
      </p>
    </motion.div>
  );
}

function serviceCard(active: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    textAlign: "left",
    padding: "18px 18px",
    borderRadius: 14,
    cursor: "pointer",
    background: active ? "rgba(234,154,97,0.1)" : "rgba(255,244,227,0.03)",
    border: active ? `1.5px solid ${ORANGE}` : "1.5px solid rgba(255,244,227,0.12)",
    transition: "all 0.2s",
  };
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,244,227,0.04)",
  border: "1.5px solid rgba(255,244,227,0.18)",
  borderRadius: 10,
  padding: "13px 16px",
  // 16px minimum: anything smaller makes iOS Safari zoom the page on focus.
  fontSize: 16,
  color: CREAM,
  fontFamily: BODY,
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
  background: BTN_BG,
  color: CREAM,
  padding: "13px 26px",
  borderRadius: 100,
  fontFamily: HEADING,
  fontWeight: 600,
  fontSize: 15,
  border: "none",
  cursor: "pointer",
  boxShadow: "3px 4px 4px 0 rgba(255,244,227,0.12) inset, 0 4px 4px 0 rgba(0,0,0,0.25)",
};
