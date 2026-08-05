"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { CONSULT_BOOKING_URL, checkout, checkoutHref, type CheckoutKey } from "@/data/soundPricing";
import CalBookButton from "@/components/sound/CalBookButton";
import { useIntake } from "@/components/music/IntakeContext";
import RoleInline from "@/components/music/RoleInline";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 120, damping: 20 };
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";

// ── Questionnaire data ──────────────────────────────────────────
const NEEDS = [
  { key: "record", label: "Record with us", sub: "Studio session, mix & master included" },
  { key: "mix", label: "Mix & master my stems", sub: "Send your stems, we finish it" },
  { key: "both", label: "Both, or not sure yet", sub: "We'll map it out together" },
] as const;

const SONGS = [
  { key: "1", label: "Just one", low: 1, high: 1 },
  { key: "2-3", label: "2 to 3", low: 2, high: 3 },
  { key: "4-6", label: "4 to 6", low: 4, high: 6 },
  { key: "7+", label: "7 or more", low: 7, high: 10 },
] as const;

const EXTRAS = [
  { key: "cover", label: "Cover art", plan: 50, standalone: 75 },
  { key: "visualizer", label: "Lyric visualizer", plan: 40, standalone: 60 },
  { key: "merch", label: "Merch design", plan: 65, standalone: 95 },
] as const;

const CADENCE = [
  { key: "oneoff", label: "Just this release", sub: "One-off project" },
  { key: "ongoing", label: "Ongoing", sub: "I drop music regularly" },
] as const;

type NeedKey = (typeof NEEDS)[number]["key"];
type SongKey = (typeof SONGS)[number]["key"];
type ExtraKey = (typeof EXTRAS)[number]["key"];
type CadenceKey = (typeof CADENCE)[number]["key"];

interface Answers {
  need: NeedKey | null;
  songs: SongKey | null;
  extras: Set<ExtraKey>;
  cadence: CadenceKey | null;
}

function money(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

// Ballpark estimate. Extras are per release (added once), matching how the
// pricing actually works. Deliberately a range, since the exact number is
// confirmed on the call.
function computeEstimate(a: Answers) {
  const s = SONGS.find((x) => x.key === a.songs);
  if (!a.need || !s || !a.cadence) return null;

  const isMix = a.need === "mix";
  const ongoing = a.cadence === "ongoing";

  // Per-song base, matching the pack rate card in data/soundPricing.ts.
  // Mixing: $50 first mix up to $65 single one-off; $40 (12-pack) to $55
  // (3-pack) when they're releasing on a cadence.
  // Recording: a finished song is roughly a 2-hour block, $120 at the block
  // rate up to $130 hourly, mix and master included either way.
  const baseLow = isMix ? (ongoing ? 40 : 50) : 120;
  const baseHigh = isMix ? (ongoing ? 55 : 65) : 130;

  const selected = EXTRAS.filter((e) => a.extras.has(e.key));
  const extrasLow = selected.reduce((sum, e) => sum + e.plan, 0);
  const extrasHigh = selected.reduce((sum, e) => sum + e.standalone, 0);

  const low = s.low * baseLow + extrasLow;
  const high = s.high * baseHigh + extrasHigh;

  // Song-only midpoints, used by the "what do you pay now" comparison.
  const songsMid = Math.round((s.low + s.high) / 2);
  const perSongMid = Math.round((baseLow + baseHigh) / 2);

  return { low, high, ongoing, isMix, songsMid, perSongMid };
}

// The estimator used to quote a number and then hand everyone a phone call.
// This maps an answered questionnaire onto the pack they can actually buy.
//
// Recording ("record") stays consultative: the room is booked, not prepaid in
// packs, so those visitors go to the booking flow instead.
function recommendedPlan(a: Answers): CheckoutKey | null {
  if (a.need === "record") return null;
  const s = SONGS.find((x) => x.key === a.songs);
  if (!s) return null;

  // Match on the top of their range, so someone saying "4 to 6" gets the
  // 6-pack rather than being under-sold a 3-pack they'd blow through.
  if (s.high <= 1) return "mix_single";
  if (s.high <= 3) return "mix_3";
  if (s.high <= 6) return "mix_6";
  return "mix_12";
}

const PLAN_BLURB: Record<string, string> = {
  mix_single: "One song, mixed and mastered, 48-hour turnaround with 2 revisions. First one is $50.",
  mix_3: "Three songs at $55 each. Prepaid, use them whenever you're ready.",
  mix_6: "Six songs at $45 each. Buying five? This costs less than five singles.",
  mix_12: "Twelve songs at $40 each, the lowest per-song rate we do. Prepaid, no expiry.",
};

export default function QuoteEstimator() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { audit, setEstimate } = useIntake();

  // If they already took the readiness audit, we know whether cover art is a
  // gap, so asking again is a wasted question. Pre-select from what they told
  // us and skip the step entirely. This is the whole point of the shared store.
  const auditKnowsExtras = !!audit;
  const extrasFromAudit = useMemo<Set<ExtraKey>>(() => {
    if (!audit) return new Set();
    const preset = new Set<ExtraKey>();
    if (audit.missing.includes("covers")) preset.add("cover");
    return preset;
  }, [audit]);

  const [step, setStep] = useState(0); // 0..3 questions, 4 = result
  const [answers, setAnswers] = useState<Answers>({
    need: null,
    songs: null,
    extras: new Set(),
    cadence: null,
  });
  const [modalOpen, setModalOpen] = useState(false);
  // "What do you pay per song now?" — powers the personalized savings reveal.
  const [payNow, setPayNow] = useState(150);

  // Apply the audit's answers once storage has loaded.
  useEffect(() => {
    if (!auditKnowsExtras) return;
    setAnswers((p) => (p.extras.size ? p : { ...p, extras: new Set(extrasFromAudit) }));
  }, [auditKnowsExtras, extrasFromAudit]);

  const est = useMemo(() => computeEstimate(answers), [answers]);

  const plan = useMemo(() => (est ? recommendedPlan(answers) : null), [answers, est]);

  // Write the finished estimate back to the shared profile, so leads and the
  // rest of the page see one picture of this visitor rather than two.
  useEffect(() => {
    if (step !== 4 || !est) return;
    setEstimate({
      need: answers.need ?? "",
      songs: answers.songs ?? "",
      extras: Array.from(answers.extras),
      cadence: answers.cadence ?? "",
      plan,
    });
  }, [step, est, answers, plan, setEstimate]);

  const savings = useMemo(() => {
    if (!est) return null;
    const theirs = est.songsMid * payNow;
    const ours = est.songsMid * est.perSongMid;
    const diff = theirs - ours;
    const pct = theirs > 0 ? Math.round((diff / theirs) * 100) : 0;
    return { diff, pct, theirs, ours };
  }, [est, payNow]);

  const setNeed = (need: NeedKey) => {
    setAnswers((p) => ({ ...p, need }));
    setStep(1);
  };
  const setSongs = (songs: SongKey) => {
    setAnswers((p) => ({ ...p, songs }));
    // Step 2 is the extras question. Skip it when the audit already told us.
    setStep(auditKnowsExtras ? 3 : 2);
  };
  const toggleExtra = (key: ExtraKey) =>
    setAnswers((p) => {
      const next = new Set(p.extras);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...p, extras: next };
    });
  const setCadence = (cadence: CadenceKey) => {
    setAnswers((p) => ({ ...p, cadence }));
    setStep(4);
  };

  const restart = () => {
    setAnswers({ need: null, songs: null, extras: new Set(), cadence: null });
    setStep(0);
  };

  // Human-readable summary carried into the inquiry email.
  const summary = useMemo(() => {
    const need = NEEDS.find((n) => n.key === answers.need)?.label || "";
    const songs = SONGS.find((n) => n.key === answers.songs)?.label || "";
    const extras =
      EXTRAS.filter((e) => answers.extras.has(e.key))
        .map((e) => e.label)
        .join(", ") || "None";
    const cadence = CADENCE.find((c) => c.key === answers.cadence)?.label || "";
    const estimate = est
      ? `${est.ongoing ? "~" : ""}${money(est.low)} to ${money(est.high)}${est.ongoing ? "/mo" : ""}`
      : "";
    return { need, songs, extras, cadence, estimate };
  }, [answers, est]);

  // Step 3 is worded as part of the release rather than an add-on menu, to
  // match how the rest of the site now talks about this work.
  const STEP_TITLES = [
    "What do you need?",
    "How many songs?",
    "Anything else for the release?",
    "How often?",
  ];

  return (
    <section
      ref={ref}
      id="quote"
      className="scroll-mt-24 relative bg-black"
      style={{ padding: "clamp(60px, 10vw, 110px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3 text-center"
          style={{ fontFamily: BODY }}
        >
          Get a quote
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.08 }}
          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-3 text-center"
          style={{ fontFamily: HEADING }}
        >
          Tell us what you&apos;re making
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.14 }}
          className="text-white/50 text-sm md:text-base mb-10 text-center max-w-lg mx-auto"
          style={{ fontFamily: BODY }}
        >
          {auditKnowsExtras ? "Three" : "Four"} quick questions and we&apos;ll ballpark your price. Every project is different, so we lock the exact number together.
        </motion.p>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.2 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 min-h-[360px] flex flex-col"
        >
          {/* Progress */}
          {step < 4 && (
            <div className="flex items-center gap-2 mb-7">
              {STEP_TITLES.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-colors duration-300"
                  style={{ background: i <= step ? "#EA9A61" : "rgba(255,255,255,0.1)" }}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── Step 0: Need ── */}
            {step === 0 && (
              <StepShell key="s0" title={STEP_TITLES[0]}>
                {NEEDS.map((n) => (
                  <OptionRow
                    key={n.key}
                    label={n.label}
                    sub={n.sub}
                    selected={answers.need === n.key}
                    onClick={() => setNeed(n.key)}
                  />
                ))}
              </StepShell>
            )}

            {/* ── Step 1: Songs ── */}
            {step === 1 && (
              <StepShell key="s1" title={STEP_TITLES[1]} onBack={() => setStep(0)}>
                <div className="grid grid-cols-2 gap-3">
                  {SONGS.map((n) => (
                    <OptionTile
                      key={n.key}
                      label={n.label}
                      selected={answers.songs === n.key}
                      onClick={() => setSongs(n.key)}
                    />
                  ))}
                </div>
              </StepShell>
            )}

            {/* ── Step 2: Extras ── */}
            {step === 2 && (
              <StepShell key="s2" title={STEP_TITLES[2]} subtitle="Pick what you don't have yet, or skip." onBack={() => setStep(1)}>
                <div className="space-y-3">
                  {EXTRAS.map((e) => (
                    <OptionRow
                      key={e.key}
                      label={e.label}
                      selected={answers.extras.has(e.key)}
                      multi
                      onClick={() => toggleExtra(e.key)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="cta-shine mt-6 block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                  style={{ fontFamily: HEADING, padding: "13px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
                >
                  {answers.extras.size > 0 ? "Continue" : "Skip extras"} &rarr;
                </button>
              </StepShell>
            )}

            {/* ── Step 3: Cadence ── */}
            {step === 3 && (
              <StepShell key="s3" title={STEP_TITLES[3]} onBack={() => setStep(auditKnowsExtras ? 1 : 2)}>
                {CADENCE.map((c) => (
                  <OptionRow
                    key={c.key}
                    label={c.label}
                    sub={c.sub}
                    selected={answers.cadence === c.key}
                    onClick={() => setCadence(c.key)}
                  />
                ))}
              </StepShell>
            )}

            {/* ── Step 4: Result ── */}
            {step === 4 && est && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={spring}
                className="flex-1 flex flex-col"
              >
                <span className="text-xs uppercase tracking-[0.25em] text-white/40 mb-2" style={{ fontFamily: BODY }}>
                  Your ballpark
                </span>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-white text-4xl md:text-5xl font-bold italic" style={{ fontFamily: HEADING }}>
                    {est.ongoing ? "~" : ""}{money(est.low)}
                  </span>
                  <span className="text-white/40 text-2xl font-bold italic" style={{ fontFamily: HEADING }}>
                    &ndash; {money(est.high)}
                  </span>
                  {est.ongoing && (
                    <span className="text-white/40 text-sm" style={{ fontFamily: BODY }}>/mo</span>
                  )}
                </div>
                <p className="text-[#EA9A61] text-sm mb-5" style={{ fontFamily: BODY }}>
                  {est.isMix && !est.ongoing ? "Your first song can start at just $50." : "Mix and master always included."}
                </p>

                {/* Recap */}
                <ul className="text-sm text-white/60 space-y-1.5 mb-6 border-t border-white/[0.08] pt-5" style={{ fontFamily: BODY }}>
                  <li className="flex justify-between gap-4"><span className="text-white/40">Need</span><span className="text-right">{summary.need}</span></li>
                  <li className="flex justify-between gap-4"><span className="text-white/40">Songs</span><span className="text-right">{summary.songs}</span></li>
                  <li className="flex justify-between gap-4"><span className="text-white/40">Extras</span><span className="text-right">{summary.extras}</span></li>
                  <li className="flex justify-between gap-4"><span className="text-white/40">Cadence</span><span className="text-right">{summary.cadence}</span></li>
                </ul>

                {/* Personalized savings — the calculator, fed by their answers */}
                {savings && (
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 md:p-5 mb-6">
                    <div className="flex items-baseline justify-between gap-3 mb-2.5">
                      <span className="text-white/60 text-xs" style={{ fontFamily: BODY }}>
                        What do you pay per song right now?
                      </span>
                      <span className="text-[#EA9A61] text-sm font-bold tabular-nums" style={{ fontFamily: BODY }}>
                        {money(payNow)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={400}
                      step={10}
                      value={payNow}
                      onChange={(e) => setPayNow(Number(e.target.value))}
                      aria-label="What you currently pay per song"
                      className="rov-range"
                      style={{
                        background: `linear-gradient(to right, #EA9A61 ${((payNow - 50) / 350) * 100}%, rgba(255,255,255,0.08) ${((payNow - 50) / 350) * 100}%)`,
                      }}
                    />
                    {/* Side-by-side comparison */}
                    <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1" style={{ fontFamily: BODY }}>
                          Elsewhere
                        </span>
                        <span className="text-white/45 text-xl md:text-2xl font-bold italic line-through decoration-white/25 tabular-nums" style={{ fontFamily: HEADING }}>
                          {money(savings.theirs)}
                        </span>
                      </div>
                      <div className="rounded-lg border border-[#EA9A61]/30 bg-[#EA9A61]/[0.06] p-3">
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EA9A61] mb-1" style={{ fontFamily: BODY }}>
                          With R.O.V
                        </span>
                        <span className="text-white text-xl md:text-2xl font-bold italic tabular-nums" style={{ fontFamily: HEADING }}>
                          {money(savings.ours)}
                        </span>
                      </div>
                    </div>

                    {/* The punchline */}
                    {savings.diff > 0 ? (
                      <div className="text-center pt-1">
                        <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1" style={{ fontFamily: BODY }}>
                          You keep
                        </span>
                        <span className="block text-[#EA9A61] text-3xl md:text-4xl font-bold italic leading-none tabular-nums" style={{ fontFamily: HEADING }}>
                          {money(savings.diff)}
                          {est.ongoing ? <span className="text-white/40 text-base">/mo</span> : null}
                        </span>
                        <span className="block text-white/50 text-xs mt-1.5" style={{ fontFamily: BODY }}>
                          {savings.pct}% less, mastering and 2 revisions included
                        </span>
                      </div>
                    ) : (
                      <p className="text-white/60 text-sm text-center" style={{ fontFamily: BODY }}>
                        We&apos;d match that rate, with the master and 2 revisions included instead of billed separately.
                      </p>
                    )}
                  </div>
                )}

                {/* The plan they just described, made buyable. Without this the
                    estimator opens a loop it can't close: it quotes the
                    subscription rate, then offers only a phone call. */}
                {plan && (
                  <div className="rounded-xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.05] p-4 md:p-5 mb-6">
                    <span
                      className="block text-[10px] uppercase tracking-[0.25em] text-[#EA9A61] mb-2"
                      style={{ fontFamily: BODY }}
                    >
                      Sounds like
                    </span>
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <span
                        className="text-white text-lg md:text-xl font-bold italic"
                        style={{ fontFamily: HEADING }}
                      >
                        {checkout[plan].label.replace(/\s*\(.*\)$/, "")}
                      </span>
                      <span
                        className="shrink-0 text-white text-xl md:text-2xl font-bold italic tabular-nums"
                        style={{ fontFamily: HEADING }}
                      >
                        {money(checkout[plan].amount)}
                        {checkout[plan].unit !== "flat" && (
                          <span className="text-white/35 text-sm font-normal not-italic">
                            /{checkout[plan].unit}
                          </span>
                        )}
                      </span>
                    </div>
                    <p
                      className="text-white/50 text-xs leading-relaxed mb-4"
                      style={{ fontFamily: BODY }}
                    >
                      {PLAN_BLURB[plan]}
                    </p>
                    <a
                      href={checkoutHref(plan)}
                      className="block w-full text-center text-white font-semibold rounded-full border border-[#EA9A61]/40 hover:bg-[#EA9A61]/[0.12] transition-all duration-300"
                      style={{
                        fontFamily: HEADING,
                        padding: "12px",
                        fontSize: "13px",
                        letterSpacing: "0.05em",
                        background: "rgba(234,154,97,0.06)",
                      }}
                    >
                      {(checkout[plan].qty ?? 1) > 1 ? "Get this pack" : "Send this song"} &rarr;
                    </a>
                  </div>
                )}

                <p className="text-white/40 text-xs mb-6 leading-relaxed" style={{ fontFamily: BODY }}>
                  Ballpark only. The exact quote depends on your stems, turnaround, and rollout, so we lock it in on a quick call or over email.
                </p>

                <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CONSULT_BOOKING_URL && (
                    <CalBookButton
                      calLink={CONSULT_BOOKING_URL}
                      className="cta-shine block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.03]"
                      style={{ fontFamily: HEADING, padding: "14px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
                    >
                      Book a call &rarr;
                    </CalBookButton>
                  )}
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className={`block w-full text-center text-white font-semibold rounded-full border border-white/12 hover:border-[#EA9A61]/50 hover:bg-[#EA9A61]/[0.06] transition-all duration-300 cursor-pointer ${
                      CONSULT_BOOKING_URL ? "" : "sm:col-span-2"
                    }`}
                    style={{ fontFamily: HEADING, padding: "14px", fontSize: "13px", letterSpacing: "0.05em", background: "rgba(255,255,255,0.03)" }}
                  >
                    Send my details &rarr;
                  </button>
                </div>

                <button
                  type="button"
                  onClick={restart}
                  className="mt-4 text-white/40 hover:text-white/70 text-xs transition-colors self-center cursor-pointer"
                  style={{ fontFamily: BODY }}
                >
                  Start over
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        context={summary}
      />
    </section>
  );
}

// ── Small building blocks ───────────────────────────────────────
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
      <div className="flex items-center gap-3 mb-5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <h4 className="text-white text-xl md:text-2xl font-bold italic" style={{ fontFamily: HEADING }}>
            {title}
          </h4>
          {subtitle && (
            <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: BODY }}>{subtitle}</p>
          )}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

function OptionRow({
  label,
  sub,
  selected,
  multi,
  onClick,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  multi?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
        selected
          ? "border-[#EA9A61]/50 bg-[#EA9A61]/[0.06]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <span
        className={`shrink-0 w-6 h-6 flex items-center justify-center transition-all duration-200 ${
          multi ? "rounded-md" : "rounded-full"
        } ${selected ? "bg-[#EA9A61] text-black" : "border border-white/25 text-transparent group-hover:border-[#EA9A61]/50"}`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-white text-base font-semibold" style={{ fontFamily: HEADING }}>{label}</span>
        {sub && <span className="block text-white/40 text-xs mt-0.5" style={{ fontFamily: BODY }}>{sub}</span>}
      </span>
    </button>
  );
}

function OptionTile({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border py-5 px-4 text-center transition-all duration-200 cursor-pointer ${
        selected ? "border-[#EA9A61]/50 bg-[#EA9A61]/[0.06]" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <span className="text-white text-base font-semibold" style={{ fontFamily: HEADING }}>{label}</span>
    </button>
  );
}

// ── Inquiry modal (book-a-call already lives on the result card) ─
type Summary = { need: string; songs: string; extras: string; cadence: string; estimate: string };
type Status = "idle" | "submitting" | "success" | "error";

function InquiryModal({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context: Summary;
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
      need: context.need,
      songs: context.songs,
      extras: context.extras,
      cadence: context.cadence,
      estimate: context.estimate,
      links: String(data.get("links") || ""),
      message: String(data.get("message") || ""),
      company: String(data.get("company") || ""), // honeypot
    };

    try {
      const res = await fetch("/api/sound/quote-inquiry", {
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
          aria-label="Send your details"
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
                <h4 className="text-white text-xl font-bold italic mb-2" style={{ fontFamily: HEADING }}>That&apos;s in.</h4>
                <p className="text-white/50 text-sm" style={{ fontFamily: BODY }}>
                  We&apos;ll reply within one business day with your exact quote.
                </p>
                <button type="button" onClick={onClose} className="mt-6 text-white/60 hover:text-white text-sm transition-colors cursor-pointer" style={{ fontFamily: BODY }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h4 className="text-white text-2xl font-bold italic mb-1" style={{ fontFamily: HEADING }}>Send your details</h4>
                <p className="text-white/50 text-sm mb-5 leading-relaxed" style={{ fontFamily: BODY }}>
                  We&apos;ll reply with your exact quote. Your answers ({context.estimate || "your estimate"}) come with it.
                </p>

                <form onSubmit={onSubmit} noValidate className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="qi-name" className={labelClass} style={{ fontFamily: BODY }}>Your name</label>
                      <input id="qi-name" name="name" type="text" required autoComplete="name" className={inputClass} style={{ fontFamily: BODY }} />
                    </div>
                    <div>
                      <label htmlFor="qi-email" className={labelClass} style={{ fontFamily: BODY }}>Email</label>
                      <input id="qi-email" name="email" type="email" required autoComplete="email" className={inputClass} style={{ fontFamily: BODY }} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="qi-links" className={labelClass} style={{ fontFamily: BODY }}>
                      Your music / socials <span className="text-white/30">(optional)</span>
                    </label>
                    <input id="qi-links" name="links" type="text" placeholder="Spotify, Instagram, SoundCloud…" className={inputClass} style={{ fontFamily: BODY }} />
                  </div>
                  <div>
                    <label htmlFor="qi-message" className={labelClass} style={{ fontFamily: BODY }}>
                      Anything else <span className="text-white/30">(optional)</span>
                    </label>
                    <textarea id="qi-message" name="message" rows={3} maxLength={800} className={`${inputClass} resize-none`} style={{ fontFamily: BODY }} />
                  </div>

                  {/* Honeypot */}
                  <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
                    <label htmlFor="qi-company">Company</label>
                    <input id="qi-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  {status === "error" && (
                    <p role="alert" className="text-[#ff8b6b] text-sm" style={{ fontFamily: BODY }}>{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="cta-shine block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.02] disabled:opacity-70 cursor-pointer"
                    style={{ fontFamily: HEADING, padding: "14px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
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
