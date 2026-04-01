"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

function pct(val: number, min: number, max: number): number {
  return ((val - min) / (max - min)) * 100;
}

export default function AIROICalculator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [weeklyHours, setWeeklyHours] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(50);
  const [workflows, setWorkflows] = useState(3);

  const calc = useMemo(() => {
    const automationRate = 0.7; // 70% time recovery
    const annualManualCost = weeklyHours * hourlyCost * 52;
    const annualSaved = Math.round(annualManualCost * automationRate);
    const hoursReclaimed = Math.round(weeklyHours * automationRate * 52);

    // Recommend tier based on workflows
    let tierName: string, buildFee: number, retainer: number;
    if (workflows <= 1) {
      tierName = "Smart Start";
      buildFee = 3000;
      retainer = 500;
    } else if (workflows <= 3) {
      tierName = "Revenue Autopilot";
      buildFee = 7000;
      retainer = 1000;
    } else {
      tierName = "Business Operating System";
      buildFee = 12000;
      retainer = 2000;
    }

    const firstYearCost = buildFee + retainer * 11; // 1 month free
    const paybackMonths =
      annualSaved > 0
        ? Math.max(1, Math.ceil(firstYearCost / (annualSaved / 12)))
        : 0;

    return {
      tierName,
      buildFee,
      retainer,
      annualManualCost,
      annualSaved,
      hoursReclaimed,
      firstYearCost,
      paybackMonths,
    };
  }, [weeklyHours, hourlyCost, workflows]);

  return (
    <div
      ref={ref}
      className="relative bg-black"
      style={{ padding: "clamp(40px, 6vw, 60px) clamp(16px, 5vw, 60px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={spring}
        className="max-w-5xl mx-auto rounded-2xl border border-white/[0.06] p-5 md:p-8"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        {/* Header row */}
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <span
              className="text-[10px] uppercase tracking-[0.25em] text-[#EA9A61]"
              style={{ fontFamily: BODY }}
            >
              Time Saved Calculator
            </span>
            <h3
              className="text-xl md:text-2xl font-bold italic text-white mt-1"
              style={{ fontFamily: HEADING }}
            >
              Reclaim Your Hours
            </h3>
          </div>
          {calc.annualSaved > 0 && (
            <motion.div
              key={calc.annualSaved}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring}
              className="text-right hidden sm:block"
            >
              <span
                className="text-[#EA9A61] text-2xl md:text-3xl font-bold italic block"
                style={{ fontFamily: HEADING }}
              >
                {fmt(calc.annualSaved)}/yr
              </span>
              <span
                className="text-white/30 text-[10px] uppercase tracking-[0.15em]"
                style={{ fontFamily: BODY }}
              >
                saved annually
              </span>
            </motion.div>
          )}
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {/* Weekly hours */}
          <div>
            <div
              className="flex justify-between text-xs text-white/50 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              <span>Hours on repetitive tasks / week</span>
              <span className="text-[#EA9A61] font-bold">{weeklyHours}h</span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              step={5}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="rov-range"
              style={{
                background: `linear-gradient(to right, #EA9A61 ${pct(weeklyHours, 5, 80)}%, rgba(255,255,255,0.08) ${pct(weeklyHours, 5, 80)}%)`,
              }}
            />
          </div>

          {/* Hourly cost */}
          <div>
            <div
              className="flex justify-between text-xs text-white/50 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              <span>Average hourly cost of that labor</span>
              <span className="text-[#EA9A61] font-bold">
                {fmt(hourlyCost)}
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={150}
              step={5}
              value={hourlyCost}
              onChange={(e) => setHourlyCost(Number(e.target.value))}
              className="rov-range"
              style={{
                background: `linear-gradient(to right, #EA9A61 ${pct(hourlyCost, 15, 150)}%, rgba(255,255,255,0.08) ${pct(hourlyCost, 15, 150)}%)`,
              }}
            />
          </div>

          {/* Workflows */}
          <div className="md:col-span-2">
            <div
              className="flex justify-between text-xs text-white/50 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              <span>Number of workflows to automate</span>
              <span className="text-[#EA9A61] font-bold">{workflows}</span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={workflows}
              onChange={(e) => setWorkflows(Number(e.target.value))}
              className="rov-range"
              style={{
                background: `linear-gradient(to right, #EA9A61 ${pct(workflows, 1, 7)}%, rgba(255,255,255,0.08) ${pct(workflows, 1, 7)}%)`,
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/[0.06] mb-5" />

        {/* Results */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <span
              className="text-[9px] uppercase tracking-[0.2em] text-white/25 block mb-1"
              style={{ fontFamily: BODY }}
            >
              Current annual cost
            </span>
            <span
              className="text-white/40 text-lg md:text-2xl font-bold tabular-nums"
              style={{ fontFamily: HEADING }}
            >
              {fmt(calc.annualManualCost)}
            </span>
          </div>
          <div>
            <span
              className="text-[9px] uppercase tracking-[0.2em] text-[#EA9A61] block mb-1"
              style={{ fontFamily: BODY }}
            >
              Hours reclaimed / yr
            </span>
            <span
              className="text-white text-lg md:text-2xl font-bold tabular-nums"
              style={{ fontFamily: HEADING }}
            >
              {calc.hoursReclaimed.toLocaleString()}h
            </span>
          </div>
          <div>
            <span
              className="text-[9px] uppercase tracking-[0.2em] text-white/25 block mb-1"
              style={{ fontFamily: BODY }}
            >
              ROI payback
            </span>
            <span
              className="text-[#EA9A61] text-lg md:text-2xl font-bold tabular-nums"
              style={{ fontFamily: HEADING }}
            >
              {calc.paybackMonths > 0 ? `${calc.paybackMonths} mo` : "—"}
            </span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {calc.annualSaved > 0 ? (
              <>
                <motion.span
                  key={calc.annualSaved}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring}
                  className="text-[#EA9A61] text-2xl font-bold italic sm:hidden"
                  style={{ fontFamily: HEADING }}
                >
                  {fmt(calc.annualSaved)}/yr
                </motion.span>
                <span
                  className="rounded-full border border-[#EA9A61]/30 bg-[#EA9A61]/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#EA9A61]"
                  style={{ fontFamily: BODY }}
                >
                  70% time recovered
                </span>
                <span
                  className="text-white/30 text-xs"
                  style={{ fontFamily: BODY }}
                >
                  Recommended:{" "}
                  <span className="text-white/60">
                    {calc.tierName} ({fmt(calc.buildFee)} + {fmt(calc.retainer)}
                    /mo)
                  </span>
                </span>
              </>
            ) : (
              <span
                className="text-white/40 text-xs"
                style={{ fontFamily: BODY }}
              >
                Adjust sliders to see your projected savings.
              </span>
            )}
          </div>

          <a
            href="https://calendly.com/rangeofviewmusic/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-shine shrink-0 inline-flex items-center gap-2 text-white font-semibold transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: HEADING,
              borderRadius: "41.444px",
              background:
                "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
              boxShadow:
                "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
              padding: "12px 24px",
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            Book a call &rarr;
          </a>
        </div>
      </motion.div>
    </div>
  );
}
