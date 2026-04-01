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

export default function SavingsCalculator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [songs, setSongs] = useState(3);
  const [costPerSong, setCostPerSong] = useState(200);
  const [coverCost, setCoverCost] = useState(0);
  const [vizCost, setVizCost] = useState(0);
  const [merchCost, setMerchCost] = useState(0);

  const calc = useMemo(() => {
    let tierName: string, tierPrice: number;
    if (songs <= 5) { tierName = "Starter"; tierPrice = 145; }
    else if (songs <= 8) { tierName = "Standard"; tierPrice = 300; }
    else if (songs <= 12) { tierName = "Pro"; tierPrice = 400; }
    else { tierName = "Custom"; tierPrice = 400 + (songs - 12) * 35; }

    const currentTotal =
      songs * costPerSong * 12 +
      (coverCost > 0 ? songs * coverCost * 12 : 0) +
      (vizCost > 0 ? songs * vizCost * 12 : 0) +
      (merchCost > 0 ? merchCost * 12 : 0);

    const rovTotal =
      tierPrice * 12 +
      (coverCost > 0 ? songs * 50 * 12 : 0) +
      (vizCost > 0 ? songs * 40 * 12 : 0) +
      (merchCost > 0 ? 65 * 12 : 0);

    const annualSavings = currentTotal - rovTotal;
    const savingsPercent = currentTotal > 0 ? Math.round((annualSavings / currentTotal) * 100) : 0;
    const isCustom = songs > 12;

    return { tierName, tierPrice, currentTotal, rovTotal, annualSavings, savingsPercent, isCustom };
  }, [songs, costPerSong, coverCost, vizCost, merchCost]);

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
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#EA9A61]" style={{ fontFamily: BODY }}>
              Savings Calculator
            </span>
            <h3 className="text-xl md:text-2xl font-bold italic text-white mt-1" style={{ fontFamily: HEADING }}>
              See What You Save
            </h3>
          </div>
          {calc.annualSavings > 0 && (
            <motion.span
              key={calc.annualSavings}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring}
              className="text-[#EA9A61] text-2xl md:text-3xl font-bold italic hidden sm:block"
              style={{ fontFamily: HEADING }}
            >
              {fmt(calc.annualSavings)}/yr
            </motion.span>
          )}
        </div>

        {/* Sliders grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {/* Songs */}
          <div>
            <div className="flex justify-between text-xs text-white/50 mb-1.5" style={{ fontFamily: BODY }}>
              <span>Songs per month</span>
              <span className="text-[#EA9A61] font-bold">{songs}</span>
            </div>
            <input type="range" min={1} max={15} value={songs} onChange={(e) => setSongs(Number(e.target.value))} className="rov-range" style={{ background: `linear-gradient(to right, #EA9A61 ${pct(songs, 1, 15)}%, rgba(255,255,255,0.08) ${pct(songs, 1, 15)}%)` }} />
          </div>

          {/* Cost per song */}
          <div>
            <div className="flex justify-between text-xs text-white/50 mb-1.5" style={{ fontFamily: BODY }}>
              <span>Current cost per song</span>
              <span className="text-[#EA9A61] font-bold">{fmt(costPerSong)}</span>
            </div>
            <input type="range" min={50} max={300} step={10} value={costPerSong} onChange={(e) => setCostPerSong(Number(e.target.value))} className="rov-range" style={{ background: `linear-gradient(to right, #EA9A61 ${pct(costPerSong, 50, 300)}%, rgba(255,255,255,0.08) ${pct(costPerSong, 50, 300)}%)` }} />
          </div>

          {/* Cover art cost */}
          <div>
            <div className="flex justify-between text-xs text-white/50 mb-1.5" style={{ fontFamily: BODY }}>
              <span>Current cover art cost</span>
              <span className="text-[#EA9A61] font-bold">{coverCost === 0 ? "None" : fmt(coverCost)}</span>
            </div>
            <input type="range" min={0} max={500} step={25} value={coverCost} onChange={(e) => setCoverCost(Number(e.target.value))} className="rov-range" style={{ background: `linear-gradient(to right, #EA9A61 ${pct(coverCost, 0, 500)}%, rgba(255,255,255,0.08) ${pct(coverCost, 0, 500)}%)` }} />
          </div>

          {/* Visualizer cost */}
          <div>
            <div className="flex justify-between text-xs text-white/50 mb-1.5" style={{ fontFamily: BODY }}>
              <span>Current visualizer cost</span>
              <span className="text-[#EA9A61] font-bold">{vizCost === 0 ? "None" : fmt(vizCost)}</span>
            </div>
            <input type="range" min={0} max={400} step={25} value={vizCost} onChange={(e) => setVizCost(Number(e.target.value))} className="rov-range" style={{ background: `linear-gradient(to right, #EA9A61 ${pct(vizCost, 0, 400)}%, rgba(255,255,255,0.08) ${pct(vizCost, 0, 400)}%)` }} />
          </div>

          {/* Merch cost */}
          <div className="md:col-span-2">
            <div className="flex justify-between text-xs text-white/50 mb-1.5" style={{ fontFamily: BODY }}>
              <span>Current monthly merch design cost</span>
              <span className="text-[#EA9A61] font-bold">{merchCost === 0 ? "None" : fmt(merchCost)}</span>
            </div>
            <input type="range" min={0} max={300} step={25} value={merchCost} onChange={(e) => setMerchCost(Number(e.target.value))} className="rov-range" style={{ background: `linear-gradient(to right, #EA9A61 ${pct(merchCost, 0, 300)}%, rgba(255,255,255,0.08) ${pct(merchCost, 0, 300)}%)` }} />
          </div>
        </div>

        {/* Compact results */}
        <div className="h-px w-full bg-white/[0.06] mb-5" />

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/25 block mb-1" style={{ fontFamily: BODY }}>You currently pay</span>
            <span className="text-white/40 text-xl md:text-2xl font-bold tabular-nums" style={{ fontFamily: HEADING }}>
              {fmt(Math.round(calc.currentTotal / 12))}<span className="text-white/20 text-xs font-normal">/mo</span>
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#EA9A61] block mb-1" style={{ fontFamily: BODY }}>With R.O.V</span>
            <span className="text-white text-xl md:text-2xl font-bold tabular-nums" style={{ fontFamily: HEADING }}>
              {fmt(Math.round(calc.rovTotal / 12))}<span className="text-white/40 text-xs font-normal">/mo</span>
            </span>
          </div>
        </div>

        {/* Bottom row: savings + CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {calc.annualSavings > 0 ? (
              <>
                <motion.span
                  key={calc.annualSavings}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring}
                  className="text-[#EA9A61] text-2xl md:text-3xl font-bold italic sm:hidden"
                  style={{ fontFamily: HEADING }}
                >
                  {fmt(calc.annualSavings)}/yr
                </motion.span>
                <span className="rounded-full border border-[#EA9A61]/30 bg-[#EA9A61]/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#EA9A61]" style={{ fontFamily: BODY }}>
                  {calc.savingsPercent}% less
                </span>
                <span className="text-white/30 text-xs" style={{ fontFamily: BODY }}>
                  Recommended: <span className="text-white/60">{calc.tierName} ({fmt(calc.tierPrice)}/mo)</span>
                </span>
              </>
            ) : (
              <span className="text-white/40 text-xs" style={{ fontFamily: BODY }}>
                R.O.V matches your spend with faster turnaround included.
              </span>
            )}
          </div>

          <a
            href={calc.isCustom ? "https://www.instagram.com/rangeofviewstudios/" : "mailto:stems@rovstudios.com"}
            target={calc.isCustom ? "_blank" : undefined}
            rel={calc.isCustom ? "noopener noreferrer" : undefined}
            className="cta-shine shrink-0 inline-flex items-center gap-2 text-white font-semibold transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: HEADING,
              borderRadius: "41.444px",
              background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
              boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
              padding: "12px 24px",
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            {calc.isCustom ? "DM us \u2192" : "Send your stems \u2192"}
          </a>
        </div>
      </motion.div>
    </div>
  );
}
