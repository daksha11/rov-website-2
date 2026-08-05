"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IndustryCalculator as IndustryCalculatorType } from "@/lib/types";
import {
  HEADING,
  BODY,
  BLACK,
  CREAM,
  PILL_TEXT,
  ACCENT_TEXT_GRADIENT,
  CTA_GRADIENT,
  CTA_GLOW,
} from "./shared";
import { trackCalcEngage, trackCallClick } from "./analytics";
import { saveEstimate } from "./estimate-store";

const BOOKING_URL = "https://cal.com/rov-studios-imhphw/15min";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

/**
 * Safe declarative formula evaluator. Recursive-descent over + - * / and
 * parentheses, with numbers and input-key identifiers only. There is NO eval
 * of arbitrary strings: any character that is not a number, key, operator, or
 * paren is skipped, so a malformed formula degrades to a number rather than
 * executing anything.
 */
function evalFormula(expr: string, vars: Record<string, number>): number {
  const s = expr;
  let i = 0;
  const skip = () => {
    while (i < s.length && s[i] === " ") i++;
  };

  function parseExpr(): number {
    let v = parseTerm();
    skip();
    while (i < s.length && (s[i] === "+" || s[i] === "-")) {
      const op = s[i++];
      const r = parseTerm();
      v = op === "+" ? v + r : v - r;
      skip();
    }
    return v;
  }
  function parseTerm(): number {
    let v = parseFactor();
    skip();
    while (i < s.length && (s[i] === "*" || s[i] === "/")) {
      const op = s[i++];
      const r = parseFactor();
      v = op === "*" ? v * r : r === 0 ? 0 : v / r;
      skip();
    }
    return v;
  }
  function parseFactor(): number {
    skip();
    if (s[i] === "(") {
      i++;
      const v = parseExpr();
      skip();
      if (s[i] === ")") i++;
      return v;
    }
    if (s[i] === "-") {
      i++;
      return -parseFactor();
    }
    const rest = s.slice(i);
    const num = /^[0-9]*\.?[0-9]+/.exec(rest);
    if (num) {
      i += num[0].length;
      return parseFloat(num[0]);
    }
    const id = /^[a-zA-Z_][a-zA-Z0-9_]*/.exec(rest);
    if (id) {
      i += id[0].length;
      return vars[id[0]] ?? 0;
    }
    // Unknown character: skip it so nothing arbitrary runs.
    i++;
    return 0;
  }

  const result = parseExpr();
  return Number.isFinite(result) ? result : 0;
}

function fmtCurrency(n: number): string {
  const rounded = Math.round(n);
  return "$" + rounded.toLocaleString("en-US");
}

/** Hover/focus styles for the answer chips (hydration-safe inline <style>). */
const CHIP_CSS = `
.rov-qchip { transition: border-color .2s ease, background-color .2s ease, transform .2s ease; }
.rov-qchip:hover { border-color: rgba(234,154,97,0.55) !important; }
.rov-qchip:focus-visible { outline: 2px solid #EA9A61; outline-offset: 2px; }
.rov-qback:hover { color: rgba(255,255,255,0.85); }
.rov-qback:focus-visible { outline: 2px solid #EA9A61; outline-offset: 2px; border-radius: 4px; }
@keyframes rov-dot-on { from { transform: scale(0.2); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.rov-dot { width: 11px; height: 11px; border-radius: 50%; background: rgba(255,255,255,0.11); }
.rov-dot.on { background: #EA9A61; box-shadow: 0 0 0 2px rgba(234,154,97,0.22); animation: rov-dot-on .32s cubic-bezier(.2,.8,.2,1) both; }
.rov-flowcell { transition: background-color .2s ease; }
.rov-flowcell:hover { background: rgba(234,154,97,0.10) !important; }
.rov-flowcell:hover .rov-flowedit { color: #EA9A61; }
.rov-flowcell:focus-visible { outline: 2px solid #EA9A61; outline-offset: -2px; }
.rov-flowedit { transition: color .2s ease; }
/* Narrowing chain (outreach-report funnel, adapted to the dark page). */
.rov-fcon { position: relative; display: flex; align-items: baseline; flex-wrap: wrap; gap: 7px; margin: 0; padding: 13px 0 13px 26px; font-size: 0.86rem; color: rgba(255,255,255,0.6); }
.rov-fcon::before { content: ''; position: absolute; left: 10px; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.16); }
.rov-fcon.end::before { background: #EA9A61; }
.rov-fcon-op { font-size: 1.3rem; font-weight: 700; line-height: 1; color: #EA9A61; }
.rov-fcon b { font-size: 1rem; font-weight: 700; color: #fff; font-variant-numeric: tabular-nums; }
.rov-fcon-note { color: rgba(255,255,255,0.4); }
.rov-fstep { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.09); border-radius: 13px; padding: 15px 17px 17px; }
.rov-fn { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; margin: 0 0 6px; font-family: ${HEADING}; font-style: italic; font-weight: 700; font-size: 1.75rem; line-height: 1; color: #fff; font-variant-numeric: tabular-nums; }
.rov-fsub { font-family: ${BODY}; font-style: normal; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
.rov-fl { font-family: ${BODY}; font-size: 0.86rem; line-height: 1.45; color: rgba(255,255,255,0.6); margin: 0 0 12px; }
.rov-ftrack { height: 5px; background: rgba(255,255,255,0.10); border-radius: 99px; overflow: hidden; }
.rov-ffill { height: 100%; border-radius: 99px; background: ${ACCENT_TEXT_GRADIENT}; transition: width .6s cubic-bezier(.2,.8,.2,1); }
.rov-fstep.end { background: rgba(234,154,97,0.07); border: 1px dashed rgba(234,154,97,0.6); }
.rov-fstep.end .rov-fn { color: #EA9A61; }
.rov-fstep.end .rov-fl { color: rgba(255,255,255,0.85); }
.rov-fstep.end .rov-fsub { color: #EA9A61; }
@media (max-width: 640px) {
  .rov-flow { grid-template-columns: 1fr 1fr !important; }
}
@media (prefers-reduced-motion: reduce) {
  .rov-qchip { transition: none; }
  .rov-dot.on { animation: none; }
  .rov-flowcell { transition: none; }
  .rov-ffill { transition: none; }
}
`;

/**
 * Counts a number up from zero once the result panel is on screen. The point is
 * the accrual: watching the figure climb reads as "this is piling up", which a
 * static number never does. Instant under reduced motion.
 */
function useCountUp(target: number, active: boolean, reduce: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const DURATION = 900;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / DURATION);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, reduce]);
  return value;
}

export default function IndustryCalculator({
  calculator,
  icpSlug,
}: {
  calculator: IndustryCalculatorType;
  icpSlug: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  const total = calculator.inputs.length;
  // step 0..total-1 = questions; step === total = result panel.
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // 1 forward, -1 back (slide direction)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const engagedRef = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const selectAnswer = (key: string, value: number) => {
    if (!engagedRef.current) {
      engagedRef.current = true;
      trackCalcEngage(icpSlug);
    }
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setDir(1);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (reduce) {
      setStep((s) => Math.min(s + 1, total));
    } else {
      // Brief pause so the selected chip's ember border registers first.
      advanceTimer.current = setTimeout(() => {
        setStep((s) => Math.min(s + 1, total));
      }, 180);
    }
  };

  const goBack = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const adjustAnswers = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setDir(-1);
    setStep(0);
  };

  const result = useMemo(() => {
    const vars: Record<string, number> = {};
    calculator.inputs.forEach((inp) => {
      vars[inp.key] = answers[inp.key] ?? inp.default;
    });
    return evalFormula(calculator.formula, vars);
  }, [calculator.formula, calculator.inputs, answers]);

  const isOpportunity = calculator.frame === "opportunity";
  const atResult = step >= total;
  const hasResult = atResult && result > 0;
  const counted = useCountUp(result, hasResult, !!reduce);
  const perWeek = result / 52;
  const perMonth = result / 12;

  // Hand the number to the lead form. Someone who fills the form after running
  // this has effectively told us what the problem is worth to them, and that is
  // the most useful line in the email. See ./estimate-store.
  useEffect(() => {
    if (!hasResult) return;
    saveEstimate({
      icpSlug,
      value: fmtCurrency(result),
      label: calculator.resultLabel,
    });
  }, [hasResult, result, icpSlug, calculator.resultLabel]);

  /**
   * The "N in 100" dot grid, lifted from the Beltline visibility report. It
   * only renders when the calculator has exactly one plain-percent input, so a
   * page with two rates (or a per-month rate) degrades to no grid rather than
   * to a grid that means something other than what it says.
   */
  const rateInput = (() => {
    const pct = calculator.inputs.filter((i) => i.suffix?.trim() === "%");
    return pct.length === 1 ? pct[0] : null;
  })();
  const ratePct = rateInput
    ? (answers[rateInput.key] ?? rateInput.default)
    : null;
  const litDots =
    ratePct === null ? 0 : Math.min(100, Math.max(1, Math.round(ratePct)));

  /** Jump straight back to one question from the answer recap. */
  const jumpTo = (index: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setDir(-1);
    setStep(index);
  };

  /** The chosen option label per question, for the recap row. */
  const recap = calculator.inputs.map((inp, i) => {
    const chosen = (inp.options ?? []).find((o) => o.value === answers[inp.key]);
    return { index: i, label: inp.label, answer: chosen?.label ?? null };
  });

  /** Every input key resolved to the reader's answer (or its default). */
  const vars = useMemo(() => {
    const v: Record<string, number> = {};
    calculator.inputs.forEach((inp) => {
      v[inp.key] = answers[inp.key] ?? inp.default;
    });
    return v;
  }, [calculator.inputs, answers]);

  /**
   * The narrowing chain, matching the funnel in the outreach visibility report.
   * Each rung evaluates its own declarative formula through the same safe
   * parser, so the arithmetic lives in content and never drifts from the
   * headline figure.
   */
  const chain = (calculator.chain ?? []).map((s, i) => {
    const value = evalFormula(s.formula, vars);
    const width = s.widthFormula
      ? Math.min(100, Math.max(2, evalFormula(s.widthFormula, vars)))
      : 100;
    // An opKey operand shows the reader's own answer, not a generic number.
    const keyed = s.opKey
      ? calculator.inputs.find((inp) => inp.key === s.opKey)
      : undefined;
    const chosen = keyed
      ? (keyed.options ?? []).find((o) => o.value === vars[keyed.key])
      : undefined;
    // An operand that is not a single answer (e.g. the gap between two rates).
    const computedOperand = s.opFormula
      ? `${Math.round(evalFormula(s.opFormula, vars) * 10) / 10}${s.opSuffix ?? ""}`
      : null;
    return {
      i,
      value: s.currency ? fmtCurrency(value) : Math.round(value).toLocaleString("en-US"),
      label: s.label,
      sub: s.sub,
      op: s.op,
      operand: computedOperand ?? chosen?.label ?? s.opValue ?? null,
      opNote: s.opNote,
      width,
      end: s.end === true,
    };
  });

  const enter = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: spring,
      };

  // Slide/fade between steps: 350ms ease, instant under reduced motion.
  const slide = reduce
    ? {
        initial: { opacity: 1, x: 0 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 1, x: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, x: dir >= 0 ? 28 : -28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: dir >= 0 ? -28 : 28 },
        transition: { duration: 0.35, ease: "easeInOut" as const },
      };

  const current = atResult ? null : calculator.inputs[step];
  const progressPct = Math.min(100, (step / total) * 100);

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        background: BLACK,
        padding: "clamp(28px, 5vw, 56px) clamp(16px, 5vw, 60px)",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CHIP_CSS }} />
      <motion.div {...enter} className="max-w-4xl mx-auto">
        {/* Heading (unchanged, left-aligned) */}
        <div className="mb-7 md:mb-9">
          <span
            className="text-[clamp(0.68rem,1.5vw,0.75rem)] uppercase tracking-[0.3em] block mb-3"
            style={{ fontFamily: BODY, color: PILL_TEXT }}
          >
            {calculator.eyebrow ?? "Run the numbers"}
          </span>
          <h3
            className="text-2xl md:text-3xl lg:text-4xl font-bold italic text-white"
            style={{ fontFamily: HEADING }}
          >
            {calculator.heading}
          </h3>
        </div>

        {/* Questionnaire card */}
        <div
          className="rounded-2xl border p-5 md:p-8 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderColor: "rgba(255,255,255,0.06)",
            minHeight: 320,
          }}
        >
          {/* Progress */}
          <div className="mb-6">
            <div
              className="flex items-center justify-between mb-2"
              style={{ fontFamily: BODY }}
            >
              <span className="text-white/45 text-xs tracking-[0.12em] uppercase">
                {atResult ? "Your estimate" : `${step + 1} of ${total}`}
              </span>
              {!atResult && step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="rov-qback text-white/45 text-xs tracking-[0.08em] uppercase transition-colors"
                  style={{ fontFamily: BODY, background: "none", border: "none", cursor: "pointer", padding: "4px 2px" }}
                >
                  &larr; Back
                </button>
              )}
            </div>
            <div
              className="w-full rounded-full"
              style={{ height: 3, background: "rgba(255,255,255,0.08)" }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={Math.min(step, total)}
              aria-label="Questionnaire progress"
            >
              <div
                className="rounded-full"
                style={{
                  height: 3,
                  width: `${atResult ? 100 : progressPct}%`,
                  background: ACCENT_TEXT_GRADIENT,
                  transition: reduce ? "none" : "width 0.35s ease",
                }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {current ? (
              <motion.div key={step} {...slide}>
                <p
                  className="text-xl md:text-2xl font-bold italic mb-6 text-left"
                  style={{ fontFamily: HEADING, color: CREAM }}
                >
                  {current.question ?? current.label}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(current.options ?? []).map((opt) => {
                    const selected = answers[current.key] === opt.value;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => selectAnswer(current.key, opt.value)}
                        aria-pressed={selected}
                        className="rov-qchip w-full text-left rounded-xl border"
                        style={{
                          fontFamily: BODY,
                          fontSize: "1rem",
                          color: selected ? "#fff" : "rgba(255,255,255,0.75)",
                          padding: "18px 20px",
                          minHeight: 56,
                          cursor: "pointer",
                          background: selected
                            ? "rgba(234,154,97,0.10)"
                            : "rgba(255,255,255,0.03)",
                          borderColor: selected
                            ? "rgba(234,154,97,0.7)"
                            : "rgba(255,255,255,0.10)",
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" {...slide}>
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    borderColor: hasResult
                      ? "rgba(234,154,97,0.3)"
                      : "rgba(255,255,255,0.06)",
                    background: hasResult
                      ? `radial-gradient(ellipse 720px 520px at 12% 0%, rgba(234,154,97,0.20) 0%, transparent 62%),
                         radial-gradient(ellipse 640px 520px at 92% 100%, rgba(177,105,55,0.16) 0%, transparent 62%),
                         linear-gradient(150deg, rgba(234,154,97,0.06) 0%, rgba(14,14,14,1) 55%)`
                      : "rgba(255,255,255,0.02)",
                  }}
                >
                  {hasResult ? (
                    <>
                      {/* The figure, counting up so it reads as accrual. */}
                      <div className="p-6 md:p-8 pb-5 md:pb-6">
                        <span
                          className="text-[clamp(0.68rem,1.5vw,0.75rem)] uppercase tracking-[0.22em] block mb-3"
                          style={{ fontFamily: BODY, color: PILL_TEXT }}
                        >
                          {isOpportunity
                            ? "On the table every year"
                            : "Walking out the door every year"}
                        </span>
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span
                            className="text-5xl md:text-7xl font-bold italic tabular-nums leading-none"
                            style={{
                              fontFamily: HEADING,
                              backgroundImage: ACCENT_TEXT_GRADIENT,
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              color: "transparent",
                            }}
                            aria-label={`${fmtCurrency(result)} per year`}
                          >
                            {fmtCurrency(counted)}
                          </span>
                          <span
                            className="text-white/40 text-base italic"
                            style={{ fontFamily: HEADING }}
                            aria-hidden
                          >
                            / year
                          </span>
                        </div>
                        <p
                          className="text-white/55 text-sm mt-3 max-w-lg"
                          style={{ fontFamily: BODY, lineHeight: 1.6 }}
                        >
                          {calculator.resultLabel}
                        </p>
                      </div>

                      {/* Demand-flow strip — the report's numbered flow, with
                          the last cell filled in the brand gradient. Shows the
                          math as a chain instead of a black box, and each of
                          their answers is a live cell: tap it to change it. */}
                      {/* The narrowing chain, when the page declares one. Same
                          device as the outreach report's funnel: the operation
                          on a spine, then the number it produced, then a bar
                          whose width is the share that survived. */}
                      {chain.length > 0 && (
                        <div
                          className="px-6 md:px-8 py-6"
                          style={{
                            borderTop: "1px solid rgba(255,255,255,0.09)",
                            background: "rgba(0,0,0,0.28)",
                          }}
                        >
                          {chain.map((s) => (
                            <div key={s.i}>
                              {s.op && (
                                <p
                                  className={`rov-fcon${s.end ? " end" : ""}`}
                                  style={{ fontFamily: BODY }}
                                >
                                  <span className="rov-fcon-op">{s.op}</span>
                                  <b>{s.operand}</b>
                                  <span className="rov-fcon-note">{s.opNote}</span>
                                </p>
                              )}
                              <div className={`rov-fstep${s.end ? " end" : ""}`}>
                                <p className="rov-fn">
                                  <span>{s.value}</span>
                                  {s.sub && (
                                    <span className="rov-fsub">{s.sub}</span>
                                  )}
                                </p>
                                <p className="rov-fl">{s.label}</p>
                                <div className="rov-ftrack">
                                  <div
                                    className="rov-ffill"
                                    style={{ width: `${s.width}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Compact answer strip. Only carries the chain's job when
                          no chain is declared; otherwise it is the edit control. */}
                      <div
                        className="rov-flow grid"
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.09)",
                          borderBottom: "1px solid rgba(255,255,255,0.09)",
                          gridTemplateColumns: `repeat(${recap.length + 1}, minmax(0, 1fr))`,
                        }}
                      >
                        {recap.map((r) => (
                          <button
                            key={r.index}
                            type="button"
                            onClick={() => jumpTo(r.index)}
                            className="rov-flowcell text-left"
                            style={{
                              padding: "18px 16px",
                              background: "rgba(255,255,255,0.02)",
                              border: "none",
                              borderRight: "1px solid rgba(255,255,255,0.09)",
                              cursor: "pointer",
                            }}
                          >
                            <span
                              className="block text-[0.62rem] uppercase tracking-[0.16em] mb-2"
                              style={{
                                fontFamily: BODY,
                                color: "rgba(255,255,255,0.38)",
                              }}
                            >
                              {r.label}
                            </span>
                            <span
                              className="block text-xl md:text-2xl italic font-bold leading-tight"
                              style={{ fontFamily: HEADING, color: PILL_TEXT }}
                            >
                              {r.answer ?? "default"}
                            </span>
                            <span
                              className="rov-flowedit block text-[0.62rem] uppercase tracking-[0.14em] mt-2"
                              style={{
                                fontFamily: BODY,
                                color: "rgba(255,255,255,0.28)",
                              }}
                            >
                              Change
                            </span>
                          </button>
                        ))}
                        <div
                          style={{
                            padding: "18px 16px",
                            background: CTA_GRADIENT,
                          }}
                        >
                          <span
                            className="block text-[0.62rem] uppercase tracking-[0.16em] mb-2"
                            style={{
                              fontFamily: BODY,
                              color: "rgba(255,244,227,0.75)",
                            }}
                          >
                            {isOpportunity ? "Adds up to" : "Costs you"}
                          </span>
                          <span
                            className="block text-xl md:text-2xl italic font-bold leading-tight tabular-nums"
                            style={{ fontFamily: HEADING, color: CREAM }}
                          >
                            {fmtCurrency(result)}
                          </span>
                          <span
                            className="block text-[0.62rem] uppercase tracking-[0.14em] mt-2"
                            style={{
                              fontFamily: BODY,
                              color: "rgba(255,244,227,0.6)",
                            }}
                          >
                            a year
                          </span>
                        </div>
                      </div>

                      {/* "N in 100" dot grid — the visibility report's device.
                          A hundred people walk past; this many is the whole
                          difference. Only on single-rate calculators. */}
                      {litDots > 0 && (
                        <div
                          className="px-6 md:px-8 py-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center"
                          style={{
                            borderTop: "1px solid rgba(255,255,255,0.07)",
                            background: "rgba(0,0,0,0.28)",
                          }}
                        >
                          <div
                            className="grid gap-[5px]"
                            style={{
                              gridTemplateColumns: "repeat(10, 1fr)",
                              width: 150,
                            }}
                            aria-hidden
                          >
                            {Array.from({ length: 100 }).map((_, i) => (
                              <span
                                key={i}
                                className={`rov-dot${i < litDots ? " on" : ""}`}
                                style={
                                  i < litDots && !reduce
                                    ? { animationDelay: `${i * 18}ms` }
                                    : undefined
                                }
                              />
                            ))}
                          </div>
                          <div>
                            <p
                              className="text-3xl md:text-4xl italic font-bold leading-none m-0"
                              style={{ fontFamily: HEADING, color: PILL_TEXT }}
                            >
                              {litDots} in 100
                            </p>
                            <p
                              className="text-white/60 text-sm mt-2 max-w-md"
                              style={{ fontFamily: BODY, lineHeight: 1.55 }}
                            >
                              {isOpportunity ? (
                                <>
                                  That is the whole difference. The rest keep
                                  walking either way. Earning{" "}
                                  <strong style={{ color: "#fff", fontWeight: 600 }}>
                                    {litDots} in every 100
                                  </strong>{" "}
                                  is what the figure above is built on.
                                </>
                              ) : (
                                <>
                                  <strong style={{ color: "#fff", fontWeight: 600 }}>
                                    {litDots} in every 100
                                  </strong>{" "}
                                  is the share this turns on. Small on the grid,
                                  large on the year.
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Time-scale tiles — the report's big-numeral tile. */}
                      <div
                        className="px-6 md:px-8 py-6 grid gap-3 sm:grid-cols-3"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        {[
                          { n: fmtCurrency(result / 365), l: "every day", w: 3 },
                          { n: fmtCurrency(perWeek), l: "every week", w: 23 },
                          { n: fmtCurrency(perMonth), l: "every month", w: 100 },
                        ].map((t) => (
                          <div
                            key={t.l}
                            className="rounded-xl border p-4"
                            style={{
                              borderColor: "rgba(255,255,255,0.09)",
                              borderTop: `3px solid ${PILL_TEXT}`,
                              background: "rgba(234,154,97,0.05)",
                            }}
                          >
                            <span
                              className="block text-[0.62rem] uppercase tracking-[0.16em] mb-2"
                              style={{
                                fontFamily: BODY,
                                color: "rgba(255,255,255,0.38)",
                              }}
                            >
                              {t.l}
                            </span>
                            <span
                              className="block text-2xl md:text-[2.1rem] italic font-bold leading-none tabular-nums"
                              style={{ fontFamily: HEADING, color: PILL_TEXT }}
                            >
                              {t.n}
                            </span>
                            {/* Bar length is the share of a month, so the three
                                tiles read as one scale rather than three. */}
                            <div
                              aria-hidden
                              className="mt-3 rounded-full overflow-hidden"
                              style={{
                                height: 5,
                                background: "rgba(255,255,255,0.09)",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${t.w}%`,
                                  borderRadius: 999,
                                  background: ACCENT_TEXT_GRADIENT,
                                  transition: reduce
                                    ? "none"
                                    : "width .7s cubic-bezier(.2,.8,.2,1)",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                    </>
                  ) : (
                    <div className="p-6 md:p-8">
                      <p
                        className="text-white/55 text-sm max-w-md"
                        style={{ fontFamily: BODY }}
                      >
                        By your answers, the math nets out at zero or less. If
                        that feels off, adjust an answer or two below, or just
                        bring the real numbers to a call.
                      </p>
                    </div>
                  )}

                  <div
                    className="px-6 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(0,0,0,0.25)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={adjustAnswers}
                      className="rov-qback text-white/45 text-xs tracking-[0.08em] uppercase transition-colors self-start"
                      style={{ fontFamily: BODY, background: "none", border: "none", cursor: "pointer", padding: "4px 2px" }}
                    >
                      Start over
                    </button>
                    {/* Two ways out, not one. This panel is peak motivation:
                        they just watched a number count up. Booking a call was
                        the only offered action, which is the highest-friction
                        step on the page and loses everyone not ready to put
                        time on a calendar. The form is the softer path, and it
                        carries this number into the lead. */}
                    <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:items-center">
                      <a
                        href="#lead"
                        className="inline-flex items-center justify-center gap-2 font-semibold transition-colors"
                        style={{
                          fontFamily: HEADING,
                          borderRadius: 9999,
                          border: "1px solid rgba(255,255,255,0.25)",
                          color: "rgba(255,255,255,0.85)",
                          padding: "12px 24px",
                          fontSize: "13px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Send me the breakdown
                      </a>
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackCallClick(icpSlug)}
                        className="cta-shine shrink-0 inline-flex items-center justify-center gap-2 text-white font-semibold transition-transform duration-300 hover:scale-105"
                        style={{
                          fontFamily: HEADING,
                          borderRadius: 9999,
                          background: CTA_GRADIENT,
                          boxShadow: CTA_GLOW,
                          padding: "13px 26px",
                          fontSize: "13px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {isOpportunity ? "Go get it" : "Stop the leak"}{" "}
                        <span aria-hidden>&rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Honest footnote */}
        {calculator.note && (
          <p
            className="text-white/35 text-xs mt-4 max-w-2xl"
            style={{ fontFamily: BODY, lineHeight: 1.6 }}
          >
            {calculator.note}
          </p>
        )}
      </motion.div>
    </div>
  );
}
