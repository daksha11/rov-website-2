"use client";

// The Artist Readiness Audit.
//
// Ten yes/no taps grouped into three pillars, then a score, the named gaps,
// and what those gaps cost. This is the section the role gate walks people
// down to, and the reason the gate is worth its interruption: it turns the
// internal "Artist Backend" doc into something the visitor does rather than
// reads.
//
// Interaction model is lifted from QuoteEstimator on purpose. That pattern
// (progress bar, back nav, AnimatePresence steps, result card) already works
// on this page and re-teaching a second one would cost more than it's worth.

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  FOUNDATION_PRICE,
  PILLARS,
  READINESS_ITEMS,
  TOTAL_ITEMS,
  hasUnpricedGaps,
  piecemealTotal,
  tierFor,
} from "@/data/artistReadiness";
import { CONSULT_BOOKING_URL } from "@/data/soundPricing";
import CalBookButton from "@/components/sound/CalBookButton";
import { useEffectiveRole } from "@/components/music/RoleContext";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 120, damping: 20 };
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";

const ROSTER = [
  { key: "1", label: "Just one", multiplier: 1 },
  { key: "2-4", label: "2 to 4", multiplier: 3 },
  { key: "5-9", label: "5 to 9", multiplier: 7 },
  { key: "10+", label: "10 or more", multiplier: 12 },
] as const;

type RosterKey = (typeof ROSTER)[number]["key"];

function money(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export default function ReadinessAudit() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const role = useEffectiveRole();
  const isManager = role === "manager";

  // Managers answer one extra question up front, so their step indices shift.
  const rosterStep = isManager ? 1 : 0;
  const pillarStepCount = PILLARS.length;
  const totalSteps = rosterStep + pillarStepCount;
  const resultStep = totalSteps;

  const [step, setStep] = useState(0);
  const [have, setHave] = useState<Set<string>>(new Set());
  const [roster, setRoster] = useState<RosterKey | null>(null);
  const [planOpen, setPlanOpen] = useState(false);

  const toggle = (key: string) =>
    setHave((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const restart = () => {
    setHave(new Set());
    setRoster(null);
    setStep(0);
  };

  const missing = useMemo(
    () => READINESS_ITEMS.filter((i) => !have.has(i.key)),
    [have]
  );
  const missingKeys = useMemo(() => missing.map((m) => m.key), [missing]);
  const haveCount = have.size;
  const tier = tierFor(haveCount);
  const cost = piecemealTotal(missingKeys);
  const approx = hasUnpricedGaps(missingKeys);
  const rosterMultiplier =
    ROSTER.find((r) => r.key === roster)?.multiplier ?? 1;

  const pillarIndex = step - rosterStep;
  const activePillar = PILLARS[pillarIndex];

  return (
    <section
      ref={ref}
      id="audit"
      className="scroll-mt-24 relative bg-black"
      style={{ padding: "clamp(60px, 10vw, 110px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* ── Header ── */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3 text-center"
          style={{ fontFamily: BODY }}
        >
          Free audit
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.08 }}
          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-3 text-center"
          style={{ fontFamily: HEADING }}
        >
          {isManager ? "How built out is your roster?" : "What are you missing?"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.14 }}
          className="text-white/50 text-sm md:text-base mb-10 text-center max-w-xl mx-auto"
          style={{ fontFamily: BODY }}
        >
          {isManager
            ? "Answer for one artist on your roster. Ten questions, about forty seconds, and we'll show you the gap across everyone you manage."
            : "A mix makes one song better. This is everything else that decides whether a catalog is worth anything. Ten questions, about forty seconds."}
        </motion.p>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.2 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 min-h-[420px] flex flex-col"
        >
          {step < resultStep && (
            <div className="flex items-center gap-2 mb-7">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-colors duration-300"
                  style={{ background: i <= step ? "#EA9A61" : "rgba(255,255,255,0.1)" }}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── Manager only: roster size ── */}
            {isManager && step === 0 && (
              <StepShell key="roster" title="How many artists do you manage?">
                <div className="grid grid-cols-2 gap-3">
                  {ROSTER.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => {
                        setRoster(r.key);
                        setStep(1);
                      }}
                      aria-pressed={roster === r.key}
                      className={`rounded-xl border py-5 px-4 text-center transition-all duration-200 cursor-pointer ${
                        roster === r.key
                          ? "border-[#EA9A61]/50 bg-[#EA9A61]/[0.06]"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <span
                        className="text-white text-base font-semibold"
                        style={{ fontFamily: HEADING }}
                      >
                        {r.label}
                      </span>
                    </button>
                  ))}
                </div>
              </StepShell>
            )}

            {/* ── Pillar steps ── */}
            {step >= rosterStep && step < resultStep && activePillar && (
              <StepShell
                key={activePillar.key}
                title={activePillar.title}
                subtitle={activePillar.blurb}
                onBack={step > 0 ? () => setStep(step - 1) : undefined}
              >
                <div className="space-y-2.5">
                  {READINESS_ITEMS.filter((i) => i.pillar === activePillar.key).map((item) => (
                    <CheckRow
                      key={item.key}
                      label={item.label}
                      hint={item.hint}
                      checked={have.has(item.key)}
                      onClick={() => toggle(item.key)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="cta-shine mt-6 block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                  style={{
                    fontFamily: HEADING,
                    padding: "13px",
                    fontSize: "13px",
                    letterSpacing: "0.05em",
                    background: GRADIENT,
                    boxShadow: GRADIENT_SHADOW,
                  }}
                >
                  {pillarIndex === pillarStepCount - 1 ? "See my score" : "Next"} &rarr;
                </button>

                <p
                  className="mt-3 text-center text-white/25 text-[11px]"
                  style={{ fontFamily: BODY }}
                >
                  Check what you already have. Leave the rest.
                </p>
              </StepShell>
            )}

            {/* ── Result ── */}
            {step === resultStep && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={spring}
                className="flex-1 flex flex-col"
              >
                {/* Score */}
                <div className="flex items-center gap-5 mb-6">
                  <ScoreDial have={haveCount} total={TOTAL_ITEMS} />
                  <div className="min-w-0">
                    <span
                      className="block text-xs uppercase tracking-[0.25em] text-white/40 mb-1.5"
                      style={{ fontFamily: BODY }}
                    >
                      Readiness
                    </span>
                    <h3
                      className="text-white text-2xl md:text-3xl font-bold italic leading-tight"
                      style={{ fontFamily: HEADING }}
                    >
                      {tier.headline}
                    </h3>
                  </div>
                </div>

                <p
                  className="text-white/50 text-sm leading-relaxed mb-7 border-b border-white/[0.08] pb-7"
                  style={{ fontFamily: BODY }}
                >
                  {tier.body}
                </p>

                {/* Gaps */}
                {missing.length > 0 ? (
                  <>
                    <span
                      className="block text-xs uppercase tracking-[0.25em] text-[#EA9A61] mb-4"
                      style={{ fontFamily: BODY }}
                    >
                      {missing.length} {missing.length === 1 ? "gap" : "gaps"}
                    </span>
                    <ul className="space-y-4 mb-7">
                      {missing.map((m) => (
                        <li
                          key={m.key}
                          className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
                        >
                          <div className="flex items-baseline justify-between gap-3 mb-1.5">
                            <span
                              className="text-white text-sm md:text-base font-semibold"
                              style={{ fontFamily: HEADING }}
                            >
                              {m.label}
                            </span>
                            {m.piecemeal !== null && (
                              <span
                                className="shrink-0 text-white/30 text-xs tabular-nums"
                                style={{ fontFamily: BODY }}
                              >
                                {money(m.piecemeal)} alone
                              </span>
                            )}
                          </div>
                          <p
                            className="text-white/45 text-xs md:text-sm leading-relaxed"
                            style={{ fontFamily: BODY }}
                          >
                            {m.consequence}
                          </p>
                          {/* Every gap answers itself. Without this the audit
                              is a diagnosis with no fix attached. */}
                          <p
                            className="mt-2.5 pl-3 border-l text-[#EA9A61]/85 text-xs leading-relaxed"
                            style={{ fontFamily: BODY, borderColor: "rgba(234,154,97,0.28)" }}
                          >
                            {m.deliverable}
                          </p>
                        </li>
                      ))}
                    </ul>

                    {/* The money math */}
                    {cost > 0 && (
                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 md:p-5 mb-6">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                            <span
                              className="block text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1"
                              style={{ fontFamily: BODY }}
                            >
                              Bought piece by piece
                            </span>
                            <span
                              className="text-white/45 text-xl md:text-2xl font-bold italic tabular-nums"
                              style={{ fontFamily: HEADING }}
                            >
                              {approx && (
                                <span className="text-sm not-italic font-normal text-white/30">
                                  at least{" "}
                                </span>
                              )}
                              <span className="line-through decoration-white/25">
                                {money(cost * (isManager ? rosterMultiplier : 1))}
                              </span>
                            </span>
                          </div>
                          <div className="rounded-lg border border-[#EA9A61]/30 bg-[#EA9A61]/[0.06] p-3">
                            <span
                              className="block text-[10px] uppercase tracking-[0.2em] text-[#EA9A61] mb-1"
                              style={{ fontFamily: BODY }}
                            >
                              Foundation
                            </span>
                            <span
                              className="text-white text-xl md:text-2xl font-bold italic tabular-nums"
                              style={{ fontFamily: HEADING }}
                            >
                              {money(FOUNDATION_PRICE * (isManager ? rosterMultiplier : 1))}
                            </span>
                          </div>
                        </div>
                        <p
                          className="text-white/45 text-xs leading-relaxed text-center"
                          style={{ fontFamily: BODY }}
                        >
                          {approx
                            ? "And that's only the parts with a price on them. Split sheets, metadata, and a stem vault don't get sold separately, which is exactly why nobody has them."
                            : "One build, covering all of it, and you own it forever."}
                          {isManager && roster && (
                            <>
                              {" "}
                              Figures scaled across your roster, assuming this artist is typical.
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.05] p-5 mb-7">
                    <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: BODY }}>
                      Nothing missing. That&apos;s rare and it means you&apos;re past the setup
                      conversation entirely. The useful thing now is cadence: keeping this
                      current across every release without it eating your week. That&apos;s the
                      Development retainer, and it&apos;s worth a call rather than a checkout page.
                    </p>
                  </div>
                )}

                {/* CTAs */}
                <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlanOpen(true)}
                    className="cta-shine block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
                    style={{
                      fontFamily: HEADING,
                      padding: "14px",
                      fontSize: "13px",
                      letterSpacing: "0.05em",
                      background: GRADIENT,
                      boxShadow: GRADIENT_SHADOW,
                    }}
                  >
                    Email me the plan &rarr;
                  </button>
                  {CONSULT_BOOKING_URL && (
                    <CalBookButton
                      calLink={CONSULT_BOOKING_URL}
                      className="block w-full text-center text-white font-semibold rounded-full border border-white/12 hover:border-[#EA9A61]/50 hover:bg-[#EA9A61]/[0.06] transition-all duration-300"
                      style={{
                        fontFamily: HEADING,
                        padding: "14px",
                        fontSize: "13px",
                        letterSpacing: "0.05em",
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      {isManager ? "Book a roster call" : "Talk it through"}
                    </CalBookButton>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <a
                    href="#foundation"
                    className="text-[#EA9A61]/80 hover:text-[#EA9A61] text-xs transition-colors"
                    style={{ fontFamily: BODY }}
                  >
                    See what Foundation covers &rarr;
                  </a>
                  <button
                    type="button"
                    onClick={restart}
                    className="text-white/40 hover:text-white/70 text-xs transition-colors cursor-pointer"
                    style={{ fontFamily: BODY }}
                  >
                    Start over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <PlanModal
        open={planOpen}
        onClose={() => setPlanOpen(false)}
        context={{
          role,
          score: `${haveCount}/${TOTAL_ITEMS}`,
          tier: tier.headline,
          have: READINESS_ITEMS.filter((i) => have.has(i.key))
            .map((i) => i.label)
            .join("; "),
          missing: missing.map((m) => m.label).join("; "),
          piecemeal: cost > 0 ? `${approx ? "at least " : ""}${money(cost)}` : "",
          roster: isManager ? ROSTER.find((r) => r.key === roster)?.label || "" : "",
        }}
      />
    </section>
  );
}

// ── Email-the-plan capture ───────────────────────────────────────
// The score shows free. The written plan is the trade for an email, which is
// the same bargain the visibility report already makes.
type PlanContext = {
  role: string;
  score: string;
  tier: string;
  have: string;
  missing: string;
  piecemeal: string;
  roster: string;
};
type Status = "idle" | "submitting" | "success" | "error";

function PlanModal({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context: PlanContext;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      artist: String(data.get("artist") || ""),
      ...context,
      company: String(data.get("company") || ""), // honeypot
    };

    try {
      const res = await fetch("/api/sound/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({ ok: false }));
      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      setStatus("error");
      setErrorMsg(
        json.error || "Something went wrong. Please try again, or email stems@rovstudios.com."
      );
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again, or email stems@rovstudios.com.");
    }
  }

  const inputClass =
    "w-full rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-white text-sm placeholder-white/30 focus:border-[#EA9A61]/60 focus:outline-none focus:ring-2 focus:ring-[#EA9A61]/20 transition-colors";
  const labelClass = "block text-white/60 text-xs mb-1.5";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Email me the plan"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-white/10 p-6 md:p-7 max-h-[90vh] overflow-y-auto"
            style={{ background: "linear-gradient(160deg, rgba(24,20,18,1) 0%, rgba(12,10,9,1) 100%)" }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {status === "success" ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#EA9A61]/15 border border-[#EA9A61]/30 flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#EA9A61"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4
                  className="text-white text-xl font-bold italic mb-2"
                  style={{ fontFamily: HEADING }}
                >
                  That&apos;s in.
                </h4>
                <p className="text-white/50 text-sm" style={{ fontFamily: BODY }}>
                  Your plan comes back within one business day, with the gaps in the order
                  we&apos;d close them.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                  style={{ fontFamily: BODY }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h4
                  className="text-white text-2xl font-bold italic mb-1"
                  style={{ fontFamily: HEADING }}
                >
                  Send me the plan
                </h4>
                <p
                  className="text-white/50 text-sm mb-5 leading-relaxed"
                  style={{ fontFamily: BODY }}
                >
                  Your {context.score} and every gap, written up in the order we&apos;d close
                  them. No call required.
                </p>

                <form onSubmit={onSubmit} noValidate className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="ra-name" className={labelClass} style={{ fontFamily: BODY }}>
                        Your name
                      </label>
                      <input
                        id="ra-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className={inputClass}
                        style={{ fontFamily: BODY }}
                      />
                    </div>
                    <div>
                      <label htmlFor="ra-email" className={labelClass} style={{ fontFamily: BODY }}>
                        Email
                      </label>
                      <input
                        id="ra-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={inputClass}
                        style={{ fontFamily: BODY }}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ra-artist" className={labelClass} style={{ fontFamily: BODY }}>
                      Artist name or link <span className="text-white/30">(optional)</span>
                    </label>
                    <input
                      id="ra-artist"
                      name="artist"
                      type="text"
                      placeholder="Spotify, Instagram, or just the name"
                      className={inputClass}
                      style={{ fontFamily: BODY }}
                    />
                  </div>

                  {/* Honeypot */}
                  <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
                    <label htmlFor="ra-company">Company</label>
                    <input id="ra-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  {status === "error" && (
                    <p role="alert" className="text-[#ff8b6b] text-sm" style={{ fontFamily: BODY }}>
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="cta-shine block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.02] disabled:opacity-70 cursor-pointer"
                    style={{
                      fontFamily: HEADING,
                      padding: "14px",
                      fontSize: "13px",
                      letterSpacing: "0.05em",
                      background: GRADIENT,
                      boxShadow: GRADIENT_SHADOW,
                    }}
                  >
                    {status === "submitting" ? "Sending…" : "Send it over →"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Score dial ───────────────────────────────────────────────────
function ScoreDial({ have, total }: { have: number; total: number }) {
  const pct = total > 0 ? have / total : 0;
  const size = 84;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#EA9A61"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-white text-xl font-bold italic tabular-nums"
          style={{ fontFamily: HEADING }}
        >
          {have}
          <span className="text-white/30 text-sm">/{total}</span>
        </span>
      </div>
    </div>
  );
}

// ── Building blocks ──────────────────────────────────────────────
function StepShell({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col"
    >
      <div className="flex items-start gap-3 mb-5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="mt-1 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <h3
            className="text-white text-xl md:text-2xl font-bold italic"
            style={{ fontFamily: HEADING }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-white/40 text-xs mt-1" style={{ fontFamily: BODY }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}

function CheckRow({
  label,
  hint,
  checked,
  onClick,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`group w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
        checked
          ? "border-[#EA9A61]/50 bg-[#EA9A61]/[0.06]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <span
        className={`shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
          checked
            ? "bg-[#EA9A61] text-black"
            : "border border-white/25 text-transparent group-hover:border-[#EA9A61]/50"
        }`}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="flex-1 min-w-0">
        <span
          className="block text-white text-sm md:text-base font-semibold leading-snug"
          style={{ fontFamily: HEADING }}
        >
          {label}
        </span>
        {hint && (
          <span
            className="block text-white/35 text-xs mt-1 leading-relaxed"
            style={{ fontFamily: BODY }}
          >
            {hint}
          </span>
        )}
      </span>
    </button>
  );
}
