"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { checkoutHref } from "@/data/soundPricing";

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

  const [songs, setSongs] = useState(5);
  const [costPerSong, setCostPerSong] = useState(150);
  const [showAddOns, setShowAddOns] = useState(false);
  const [coverCost, setCoverCost] = useState(0);
  const [vizCost, setVizCost] = useState(0);
  const [merchCost, setMerchCost] = useState(0);

  const calc = useMemo(() => {
    let tierName: string, tierPrice: number;
    if (songs <= 5) {
      tierName = "Starter";
      tierPrice = 145;
    } else if (songs <= 12) {
      tierName = "Standard";
      tierPrice = 300;
    } else if (songs <= 18) {
      tierName = "Pro";
      tierPrice = 500;
    } else {
      tierName = "Custom";
      tierPrice = 500 + (songs - 18) * 30;
    }

    // Add-ons are per-release, not per-song. An artist dropping 12 tracks does
    // not commission 12 covers or 12 visualizers, so we treat each add-on as a
    // single monthly spend (like merch). Multiplying by songs overstated both
    // sides and inflated the savings number. ROV subscriber add-on prices:
    // cover $50, visualizer $40, merch $65.
    const currentMonthly =
      songs * costPerSong + coverCost + vizCost + merchCost;

    const rovMonthly =
      tierPrice +
      (coverCost > 0 ? 50 : 0) +
      (vizCost > 0 ? 40 : 0) +
      (merchCost > 0 ? 65 : 0);

    const monthlySavings = currentMonthly - rovMonthly;
    const annualSavings = monthlySavings * 12;
    const savingsPercent =
      currentMonthly > 0
        ? Math.round((monthlySavings / currentMonthly) * 100)
        : 0;
    const isCustom = songs > 18;
    const effectivePerSong = songs > 0 ? Math.round(tierPrice / songs) : 0;

    return {
      tierName,
      tierPrice,
      currentMonthly,
      rovMonthly,
      annualSavings,
      monthlySavings,
      savingsPercent,
      isCustom,
      effectivePerSong,
    };
  }, [songs, costPerSong, coverCost, vizCost, merchCost]);

  const hasSavings = calc.monthlySavings > 0;

  return (
    <div
      ref={ref}
      className="relative bg-black"
      style={{ padding: "clamp(40px, 6vw, 80px) clamp(16px, 5vw, 60px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={spring}
        className="max-w-5xl mx-auto"
      >
        {/* ── Headline ── */}
        <div className="text-center mb-10 md:mb-14">
          <span
            className="text-xs uppercase tracking-[0.3em] text-[#EA9A61] block mb-3"
            style={{ fontFamily: BODY }}
          >
            Stop Overpaying for Mixing
          </span>
          <h3
            className="text-3xl md:text-4xl lg:text-5xl font-bold italic text-white mb-3"
            style={{ fontFamily: HEADING }}
          >
            How much are you spending?
          </h3>
          <p
            className="text-white/40 text-sm md:text-base max-w-lg mx-auto"
            style={{ fontFamily: BODY }}
          >
            Drag the sliders to match your current situation.
            We&apos;ll show you exactly what R.O.V saves you.
          </p>
        </div>

        {/* ── Step 1: Your situation ── */}
        <div
          className="rounded-2xl border border-white/[0.06] p-6 md:p-8 mb-4"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Songs slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-white/60 text-sm"
                  style={{ fontFamily: BODY }}
                >
                  How many songs do you drop per month?
                </span>
                <span
                  className="text-[#EA9A61] text-2xl font-bold italic tabular-nums"
                  style={{ fontFamily: HEADING }}
                >
                  {songs}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={songs}
                onChange={(e) => setSongs(Number(e.target.value))}
                className="rov-range"
                style={{
                  background: `linear-gradient(to right, #EA9A61 ${pct(songs, 1, 20)}%, rgba(255,255,255,0.08) ${pct(songs, 1, 20)}%)`,
                }}
              />
              <div
                className="flex justify-between text-[clamp(0.7rem,1.5vw,0.75rem)] text-white/45 mt-1.5 px-0.5"
                style={{ fontFamily: BODY }}
              >
                <span>1</span>
                <span>5</span>
                <span>12</span>
                <span>20</span>
              </div>
            </div>

            {/* Cost slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-white/60 text-sm"
                  style={{ fontFamily: BODY }}
                >
                  What do you pay per song right now?
                </span>
                <span
                  className="text-[#EA9A61] text-2xl font-bold italic tabular-nums"
                  style={{ fontFamily: HEADING }}
                >
                  {fmt(costPerSong)}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={350}
                step={10}
                value={costPerSong}
                onChange={(e) => setCostPerSong(Number(e.target.value))}
                className="rov-range"
                style={{
                  background: `linear-gradient(to right, #EA9A61 ${pct(costPerSong, 50, 350)}%, rgba(255,255,255,0.08) ${pct(costPerSong, 50, 350)}%)`,
                }}
              />
              <div
                className="flex justify-between text-[clamp(0.7rem,1.5vw,0.75rem)] text-white/45 mt-1.5 px-0.5"
                style={{ fontFamily: BODY }}
              >
                <span>$50</span>
                <span>$200</span>
                <span>$350</span>
              </div>
            </div>
          </div>

          {/* Add-ons toggle */}
          <button
            onClick={() => setShowAddOns((p) => !p)}
            className="flex items-center gap-2 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.15em] text-white/30 hover:text-white/50 transition-colors mt-6 cursor-pointer"
            style={{ fontFamily: BODY }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="currentColor"
              className={`transition-transform duration-200 ${showAddOns ? "rotate-90" : ""}`}
            >
              <path d="M3 1l4 4-4 4" />
            </svg>
            {showAddOns ? "Hide add-ons" : "I also pay for cover art, visuals, or merch"}
          </button>

          <AnimatePresence>
            {showAddOns && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-4 overflow-hidden"
              >
                <div>
                  <div
                    className="flex justify-between text-xs text-white/40 mb-1.5"
                    style={{ fontFamily: BODY }}
                  >
                    <span>Monthly cover art cost</span>
                    <span className="text-[#EA9A61] font-bold">
                      {coverCost === 0 ? "—" : fmt(coverCost)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={25}
                    value={coverCost}
                    onChange={(e) => setCoverCost(Number(e.target.value))}
                    className="rov-range"
                    style={{
                      background: `linear-gradient(to right, #EA9A61 ${pct(coverCost, 0, 500)}%, rgba(255,255,255,0.08) ${pct(coverCost, 0, 500)}%)`,
                    }}
                  />
                </div>
                <div>
                  <div
                    className="flex justify-between text-xs text-white/40 mb-1.5"
                    style={{ fontFamily: BODY }}
                  >
                    <span>Monthly visualizer cost</span>
                    <span className="text-[#EA9A61] font-bold">
                      {vizCost === 0 ? "—" : fmt(vizCost)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={400}
                    step={25}
                    value={vizCost}
                    onChange={(e) => setVizCost(Number(e.target.value))}
                    className="rov-range"
                    style={{
                      background: `linear-gradient(to right, #EA9A61 ${pct(vizCost, 0, 400)}%, rgba(255,255,255,0.08) ${pct(vizCost, 0, 400)}%)`,
                    }}
                  />
                </div>
                <div>
                  <div
                    className="flex justify-between text-xs text-white/40 mb-1.5"
                    style={{ fontFamily: BODY }}
                  >
                    <span>Monthly merch cost</span>
                    <span className="text-[#EA9A61] font-bold">
                      {merchCost === 0 ? "—" : fmt(merchCost)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={300}
                    step={25}
                    value={merchCost}
                    onChange={(e) => setMerchCost(Number(e.target.value))}
                    className="rov-range"
                    style={{
                      background: `linear-gradient(to right, #EA9A61 ${pct(merchCost, 0, 300)}%, rgba(255,255,255,0.08) ${pct(merchCost, 0, 300)}%)`,
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Step 2: The comparison — visual side-by-side ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* What you pay now */}
          <div
            className="rounded-2xl border border-white/[0.06] p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <span
              className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.25em] text-white/30 block mb-4"
              style={{ fontFamily: BODY }}
            >
              What you pay now
            </span>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={calc.currentMonthly}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="text-white/50 text-3xl md:text-4xl font-bold italic tabular-nums line-through decoration-white/20"
                style={{ fontFamily: HEADING }}
              >
                {fmt(calc.currentMonthly)}
              </motion.span>
              <span className="text-white/45 text-sm" style={{ fontFamily: BODY }}>/mo</span>
            </div>
            <p className="text-white/50 text-xs mt-2" style={{ fontFamily: BODY }}>
              {songs} songs &times; {fmt(costPerSong)} each
              {showAddOns && (coverCost > 0 || vizCost > 0 || merchCost > 0) ? " + add-ons" : ""}
            </p>
          </div>

          {/* With R.O.V */}
          <div
            className="rounded-2xl border border-[#EA9A61]/20 p-6 md:p-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(234,154,97,0.08) 0%, rgba(20,20,20,1) 70%)",
            }}
          >
            <span
              className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.25em] text-[#EA9A61] block mb-4"
              style={{ fontFamily: BODY }}
            >
              With R.O.V
            </span>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={calc.rovMonthly}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="text-white text-3xl md:text-4xl font-bold italic tabular-nums"
                style={{ fontFamily: HEADING }}
              >
                {fmt(calc.rovMonthly)}
              </motion.span>
              <span className="text-white/40 text-sm" style={{ fontFamily: BODY }}>/mo</span>
            </div>
            <p className="text-white/30 text-xs mt-2" style={{ fontFamily: BODY }}>
              {calc.tierName} plan &middot; ~{fmt(calc.effectivePerSong)}/song &middot; {songs <= 18 ? "48hr" : "custom"} turnaround
            </p>
          </div>
        </div>

        {/* ── Step 3: The punchline ── */}
        <motion.div
          key={calc.annualSavings}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          className="rounded-2xl border p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            borderColor: hasSavings ? "rgba(234,154,97,0.3)" : "rgba(255,255,255,0.06)",
            background: hasSavings
              ? "linear-gradient(135deg, rgba(234,154,97,0.06) 0%, rgba(20,20,20,1) 60%)"
              : "rgba(255,255,255,0.02)",
          }}
        >
          <div>
            {hasSavings ? (
              <>
                <span
                  className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.25em] text-[#EA9A61] block mb-2"
                  style={{ fontFamily: BODY }}
                >
                  You save
                </span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="text-[#EA9A61] text-4xl md:text-5xl font-bold italic tabular-nums"
                    style={{ fontFamily: HEADING }}
                  >
                    {fmt(calc.annualSavings)}
                  </span>
                  <span className="text-white/30 text-lg italic" style={{ fontFamily: HEADING }}>
                    per year
                  </span>
                  <span
                    className="rounded-full border border-[#EA9A61]/30 bg-[#EA9A61]/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-[#EA9A61]"
                    style={{ fontFamily: BODY }}
                  >
                    {calc.savingsPercent}% less
                  </span>
                </div>
              </>
            ) : (
              <p className="text-white/40 text-sm" style={{ fontFamily: BODY }}>
                R.O.V matches your spend, with faster turnaround and pro mixing included.
              </p>
            )}
          </div>

          <a
            href={
              calc.isCustom
                ? "https://www.instagram.com/rangeofviewstudios/"
                : checkoutHref("intro")
            }
            target={calc.isCustom ? "_blank" : undefined}
            rel={calc.isCustom ? "noopener noreferrer" : undefined}
            className="cta-shine shrink-0 inline-flex items-center gap-2 text-white font-semibold transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: HEADING,
              borderRadius: "41.444px",
              background:
                "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
              boxShadow:
                "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
              padding: "14px 28px",
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            {calc.isCustom ? "DM us \u2192" : "Send your stems \u2192"}
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
