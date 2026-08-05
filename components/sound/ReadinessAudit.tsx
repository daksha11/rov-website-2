"use client";

// The Artist Readiness Audit. Six questions, about twenty seconds.
//
// The mechanic that makes it land: "yes" advances instantly, "no" stops and
// shows you what that costs before you can continue. So the quiz moves fast
// everywhere except the exact moments that hurt, and by the end you've felt
// four or five small losses rather than read one summary of them.
//
// Managers get a shorter version (two roster questions, four gap items) and a
// different result: roster economics, not a personal score.

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  FOUNDATION_PRICE,
  ROSTER_SIZES,
  ROSTER_STAGES,
  hasUnpricedGaps,
  itemsFor,
  piecemealTotal,
  tierFor,
  type ReadinessItem,
} from "@/data/artistReadiness";
import { CONSULT_BOOKING_URL } from "@/data/soundPricing";
import CalBookButton from "@/components/sound/CalBookButton";
import { useEffectiveRole, useIntake } from "@/components/music/IntakeContext";
import RoleInline from "@/components/music/RoleInline";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 120, damping: 20 };
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";

function money(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export default function ReadinessAudit() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const role = useEffectiveRole();
  const isManager = role === "manager";
  const { setAudit, setRoster } = useIntake();

  const items = useMemo(() => itemsFor(role), [role]);
  // Managers answer roster size and stage before the gap items.
  const preSteps = isManager ? 2 : 0;
  const totalSteps = preSteps + items.length;

  const [step, setStep] = useState(0);
  const [have, setHave] = useState<Set<string>>(new Set());
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [size, setSize] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [planOpen, setPlanOpen] = useState(false);

  const missing = useMemo(
    () => items.filter((i) => answered.has(i.key) && !have.has(i.key)),
    [items, answered, have]
  );
  const missingKeys = useMemo(() => missing.map((m) => m.key), [missing]);
  const haveCount = have.size;
  const tier = tierFor(haveCount, items.length);
  const cost = piecemealTotal(missingKeys);
  const approx = hasUnpricedGaps(missingKeys);
  const multiplier = ROSTER_SIZES.find((r) => r.key === size)?.multiplier ?? 1;

  const finish = (nextHave: Set<string>, nextAnswered: Set<string>) => {
    setAudit({
      have: Array.from(nextHave),
      missing: items.filter((i) => !nextHave.has(i.key)).map((i) => i.key),
      score: nextHave.size,
      total: items.length,
    });
    if (isManager && size && stage) setRoster({ size, stage });
    setStep(totalSteps);
  };

  const answer = (item: ReadinessItem, hasIt: boolean) => {
    const nextHave = new Set(have);
    const nextAnswered = new Set(answered);
    if (hasIt) nextHave.add(item.key);
    else nextHave.delete(item.key);
    nextAnswered.add(item.key);
    setHave(nextHave);
    setAnswered(nextAnswered);

    // "Yes" has nothing to say, so it moves on immediately. "No" holds the
    // screen so the sting gets read before they continue.
    if (hasIt) {
      if (step + 1 >= totalSteps) finish(nextHave, nextAnswered);
      else setStep(step + 1);
    }
  };

  const advanceFromSting = () => {
    if (step + 1 >= totalSteps) finish(have, answered);
    else setStep(step + 1);
  };

  const restart = () => {
    setHave(new Set());
    setAnswered(new Set());
    setSize(null);
    setStage(null);
    setStep(0);
  };

  const itemIndex = step - preSteps;
  const current = items[itemIndex];
  const currentAnsweredNo = current && answered.has(current.key) && !have.has(current.key);
  const isResult = step >= totalSteps;

  return (
    <section
      ref={ref}
      id="audit"
      className="scroll-mt-24 relative bg-black"
      style={{ padding: "clamp(60px, 10vw, 110px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* ── Header ── */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3 text-center"
          style={{ fontFamily: BODY }}
        >
          {totalSteps} questions &middot; 20 seconds
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.08 }}
          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-3 text-center"
          style={{ fontFamily: HEADING }}
        >
          {isManager ? "What's your roster missing?" : "What are you missing?"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.14 }}
          className="text-white/50 text-sm md:text-base mb-3 text-center max-w-lg mx-auto"
          style={{ fontFamily: BODY }}
        >
          A mix makes one song better. These are the things that decide whether a
          catalog is worth anything, and most artists don&apos;t have them.
        </motion.p>
        <div className="flex justify-center mb-9">
          <RoleInline />
        </div>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.2 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 min-h-[340px] flex flex-col"
        >
          {!isResult && (
            <div className="flex items-center gap-1.5 mb-8">
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
            {/* ── Manager: roster size ── */}
            {isManager && step === 0 && (
              <Shell key="size" title="How many artists do you manage?">
                <div className="grid grid-cols-2 gap-3">
                  {ROSTER_SIZES.map((r) => (
                    <Tile
                      key={r.key}
                      label={r.label}
                      selected={size === r.key}
                      onClick={() => {
                        setSize(r.key);
                        setStep(1);
                      }}
                    />
                  ))}
                </div>
              </Shell>
            )}

            {/* ── Manager: roster stage ── */}
            {isManager && step === 1 && (
              <Shell key="stage" title="Where are most of them?" onBack={() => setStep(0)}>
                <div className="flex flex-col gap-3">
                  {ROSTER_STAGES.map((s) => (
                    <Row
                      key={s.key}
                      label={s.label}
                      sub={s.sub}
                      selected={stage === s.key}
                      onClick={() => {
                        setStage(s.key);
                        setStep(2);
                      }}
                    />
                  ))}
                </div>
              </Shell>
            )}

            {/* ── Gap items, one at a time ── */}
            {!isResult && current && (
              <Shell
                key={current.key}
                title={current.label}
                sub={current.hint}
                onBack={step > 0 ? () => setStep(step - 1) : undefined}
                counter={`${itemIndex + 1} of ${items.length}`}
              >
                <div className="grid grid-cols-2 gap-3">
                  <YesNo
                    label="I have this"
                    tone="yes"
                    selected={have.has(current.key)}
                    onClick={() => answer(current, true)}
                  />
                  <YesNo
                    label="Not yet"
                    tone="no"
                    selected={currentAnsweredNo}
                    onClick={() => answer(current, false)}
                  />
                </div>

                {/* The sting. Only appears on "not yet", and holds the screen. */}
                <AnimatePresence>
                  {currentAnsweredNo && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 rounded-xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.05] p-4">
                        <p
                          className="text-[#EA9A61] text-sm md:text-base leading-relaxed"
                          style={{ fontFamily: HEADING, fontStyle: "italic" }}
                        >
                          {current.sting}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={advanceFromSting}
                        className="cta-shine mt-4 block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                        style={{
                          fontFamily: HEADING,
                          padding: "13px",
                          fontSize: "13px",
                          letterSpacing: "0.05em",
                          background: GRADIENT,
                          boxShadow: GRADIENT_SHADOW,
                        }}
                      >
                        {itemIndex + 1 >= items.length ? "See the damage" : "Next"} &rarr;
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Shell>
            )}

            {/* ── Result ── */}
            {isResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-5 mb-6">
                  <Dial have={haveCount} total={items.length} />
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
                  {isManager && size && (
                    <>
                      {" "}
                      Across {ROSTER_SIZES.find((r) => r.key === size)?.label.toLowerCase()} artists,
                      that&apos;s roughly{" "}
                      <span className="text-white">{missing.length * multiplier} gaps</span> sitting
                      open on your roster right now.
                    </>
                  )}
                </p>

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
                          <p
                            className="mt-2.5 pl-3 border-l text-[#EA9A61]/85 text-xs leading-relaxed"
                            style={{ fontFamily: BODY, borderColor: "rgba(234,154,97,0.28)" }}
                          >
                            {m.deliverable}
                          </p>
                        </li>
                      ))}
                    </ul>

                    {cost > 0 && (
                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 md:p-5 mb-6">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                            <span
                              className="block text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1"
                              style={{ fontFamily: BODY }}
                            >
                              Piece by piece
                            </span>
                            <span
                              className="text-white/45 text-xl md:text-2xl font-bold italic tabular-nums"
                              style={{ fontFamily: HEADING }}
                            >
                              {approx && (
                                <span className="text-xs not-italic font-normal text-white/30">
                                  at least{" "}
                                </span>
                              )}
                              <span className="line-through decoration-white/25">
                                {money(cost * (isManager ? multiplier : 1))}
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
                              {money(FOUNDATION_PRICE * (isManager ? multiplier : 1))}
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
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.05] p-5 mb-7">
                    <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: BODY }}>
                      Nothing missing. That&apos;s rare, and it means you&apos;re past the setup
                      conversation entirely. The useful thing now is cadence: keeping all of it
                      current across every release without it eating your week.
                    </p>
                  </div>
                )}

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
          score: `${haveCount}/${items.length}`,
          tier: tier.headline,
          have: items.filter((i) => have.has(i.key)).map((i) => i.label).join("; "),
          missing: missing.map((m) => m.label).join("; "),
          piecemeal: cost > 0 ? `${approx ? "at least " : ""}${money(cost)}` : "",
          roster: isManager
            ? [
                ROSTER_SIZES.find((r) => r.key === size)?.label,
                ROSTER_STAGES.find((s) => s.key === stage)?.label,
              ]
                .filter(Boolean)
                .join(", ")
            : "",
        }}
      />
    </section>
  );
}

// ── Score dial ───────────────────────────────────────────────────
function Dial({ have, total }: { have: number; total: number }) {
  const pct = total > 0 ? have / total : 0;
  const size = 84;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#EA9A61"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xl font-bold italic tabular-nums" style={{ fontFamily: HEADING }}>
          {have}
          <span className="text-white/30 text-sm">/{total}</span>
        </span>
      </div>
    </div>
  );
}

// ── Building blocks ──────────────────────────────────────────────
function Shell({
  title,
  sub,
  counter,
  onBack,
  children,
}: {
  title: string;
  sub?: string;
  counter?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.22 }}
      className="flex-1 flex flex-col"
    >
      <div className="flex items-start gap-3 mb-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="mt-1.5 text-white/40 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="min-w-0">
          {counter && (
            <span className="block text-[11px] uppercase tracking-[0.2em] text-white/30 mb-2" style={{ fontFamily: BODY }}>
              {counter}
            </span>
          )}
          <h3 className="text-white text-xl md:text-2xl font-bold italic leading-snug" style={{ fontFamily: HEADING }}>
            {title}
          </h3>
          {sub && (
            <p className="text-white/40 text-xs mt-1.5 leading-relaxed" style={{ fontFamily: BODY }}>
              {sub}
            </p>
          )}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}

function YesNo({
  label,
  tone,
  selected,
  onClick,
}: {
  label: string;
  tone: "yes" | "no";
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border py-5 px-4 text-center transition-all duration-200 cursor-pointer ${
        selected
          ? tone === "yes"
            ? "border-white/30 bg-white/[0.06]"
            : "border-[#EA9A61]/50 bg-[#EA9A61]/[0.08]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/25"
      }`}
    >
      <span className="text-white text-base font-semibold" style={{ fontFamily: HEADING }}>
        {label}
      </span>
    </button>
  );
}

function Tile({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border py-5 px-4 text-center transition-all duration-200 cursor-pointer ${
        selected ? "border-[#EA9A61]/50 bg-[#EA9A61]/[0.06]" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <span className="text-white text-base font-semibold" style={{ fontFamily: HEADING }}>
        {label}
      </span>
    </button>
  );
}

function Row({
  label,
  sub,
  selected,
  onClick,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
        selected ? "border-[#EA9A61]/50 bg-[#EA9A61]/[0.06]" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <span className="block text-white text-base font-semibold" style={{ fontFamily: HEADING }}>
        {label}
      </span>
      {sub && (
        <span className="block text-white/40 text-xs mt-0.5" style={{ fontFamily: BODY }}>
          {sub}
        </span>
      )}
    </button>
  );
}

// ── Email-the-plan capture ───────────────────────────────────────
// The score shows free. The written plan is the trade for an email, the same
// bargain the visibility report already makes.
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
      setErrorMsg(json.error || "Something went wrong. Please try again, or email stems@rovstudios.com.");
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {status === "success" ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#EA9A61]/15 border border-[#EA9A61]/30 flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EA9A61" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="text-white text-xl font-bold italic mb-2" style={{ fontFamily: HEADING }}>
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
                <h4 className="text-white text-2xl font-bold italic mb-1" style={{ fontFamily: HEADING }}>
                  Send me the plan
                </h4>
                <p className="text-white/50 text-sm mb-5 leading-relaxed" style={{ fontFamily: BODY }}>
                  Your {context.score} and every gap, written up in the order we&apos;d close
                  them. No call required.
                </p>

                <form onSubmit={onSubmit} noValidate className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="ra-name" className={labelClass} style={{ fontFamily: BODY }}>
                        Your name
                      </label>
                      <input id="ra-name" name="name" type="text" required autoComplete="name" className={inputClass} style={{ fontFamily: BODY }} />
                    </div>
                    <div>
                      <label htmlFor="ra-email" className={labelClass} style={{ fontFamily: BODY }}>
                        Email
                      </label>
                      <input id="ra-email" name="email" type="email" required autoComplete="email" className={inputClass} style={{ fontFamily: BODY }} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ra-artist" className={labelClass} style={{ fontFamily: BODY }}>
                      Artist name or link <span className="text-white/30">(optional)</span>
                    </label>
                    <input id="ra-artist" name="artist" type="text" placeholder="Spotify, Instagram, or just the name" className={inputClass} style={{ fontFamily: BODY }} />
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
