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

const BOOKING_URL = "https://calendly.com/rangeofviewmusic/30min";
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
@media (prefers-reduced-motion: reduce) {
  .rov-qchip { transition: none; }
}
`;

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
                  className="rounded-2xl border p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  style={{
                    borderColor: hasResult
                      ? "rgba(234,154,97,0.3)"
                      : "rgba(255,255,255,0.06)",
                    background: hasResult
                      ? "linear-gradient(135deg, rgba(234,154,97,0.08) 0%, rgba(20,20,20,1) 62%)"
                      : "rgba(255,255,255,0.02)",
                  }}
                >
                  <div>
                    {hasResult ? (
                      <>
                        <span
                          className="text-[clamp(0.68rem,1.5vw,0.75rem)] uppercase tracking-[0.22em] block mb-2"
                          style={{ fontFamily: BODY, color: PILL_TEXT }}
                        >
                          {isOpportunity ? "On the table" : "Estimated leak"}
                        </span>
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span
                            className="text-4xl md:text-6xl font-bold italic tabular-nums"
                            style={{
                              fontFamily: HEADING,
                              backgroundImage: ACCENT_TEXT_GRADIENT,
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              color: "transparent",
                            }}
                          >
                            {fmtCurrency(result)}
                          </span>
                          <span
                            className="text-white/45 text-base italic"
                            style={{ fontFamily: HEADING }}
                          >
                            / year
                          </span>
                        </div>
                        <p
                          className="text-white/55 text-sm mt-2 max-w-md"
                          style={{ fontFamily: BODY }}
                        >
                          {calculator.resultLabel}
                        </p>
                      </>
                    ) : (
                      <p
                        className="text-white/55 text-sm max-w-md"
                        style={{ fontFamily: BODY }}
                      >
                        By your answers, the math nets out at zero or less. If
                        that feels off, adjust an answer or two below, or just
                        bring the real numbers to a call.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={adjustAnswers}
                      className="rov-qback block mt-4 text-white/45 text-xs tracking-[0.08em] uppercase transition-colors"
                      style={{ fontFamily: BODY, background: "none", border: "none", cursor: "pointer", padding: "4px 2px" }}
                    >
                      Adjust my answers
                    </button>
                  </div>

                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCallClick(icpSlug)}
                    className="cta-shine shrink-0 inline-flex items-center gap-2 text-white font-semibold transition-transform duration-300 hover:scale-105"
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
                    Book a call <span aria-hidden>&rarr;</span>
                  </a>
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
