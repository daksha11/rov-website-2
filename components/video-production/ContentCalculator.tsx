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

const tierMap = [
  {
    name: "Content Capture",
    price: 2000,
    photos: 10,
    videos: 1,
    socialAssets: 5,
  },
  {
    name: "Brand Content Suite",
    price: 5000,
    photos: 25,
    videos: 2,
    socialAssets: 15,
  },
  {
    name: "Content Engine",
    price: 8000,
    photos: 50,
    videos: 4,
    socialAssets: 30,
  },
];

export default function ContentCalculator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [photosNeeded, setPhotosNeeded] = useState(20);
  const [videosNeeded, setVideosNeeded] = useState(2);
  const [photoCost, setPhotoCost] = useState(150);
  const [videoCost, setVideoCost] = useState(1500);

  const calc = useMemo(() => {
    const currentTotal = photosNeeded * photoCost + videosNeeded * videoCost;

    // Find best-fit tier
    const bestTier =
      tierMap.find(
        (t) => t.photos >= photosNeeded && t.videos >= videosNeeded
      ) || tierMap[tierMap.length - 1];

    const rovTotal = bestTier.price;
    const savings = currentTotal - rovTotal;
    const savingsPercent =
      currentTotal > 0 ? Math.round((savings / currentTotal) * 100) : 0;

    // Cost per asset
    const totalAssets = bestTier.photos + bestTier.videos + bestTier.socialAssets;
    const rovCostPerAsset = Math.round(rovTotal / totalAssets);
    const currentCostPerAsset =
      photosNeeded + videosNeeded > 0
        ? Math.round(currentTotal / (photosNeeded + videosNeeded))
        : 0;

    return {
      bestTier,
      currentTotal,
      rovTotal,
      savings,
      savingsPercent,
      rovCostPerAsset,
      currentCostPerAsset,
    };
  }, [photosNeeded, videosNeeded, photoCost, videoCost]);

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
              Content Calculator
            </span>
            <h3
              className="text-xl md:text-2xl font-bold italic text-white mt-1"
              style={{ fontFamily: HEADING }}
            >
              Cost Per Asset
            </h3>
          </div>
          {calc.savings > 0 && (
            <motion.div
              key={calc.savings}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring}
              className="text-right hidden sm:block"
            >
              <span
                className="text-[#EA9A61] text-2xl md:text-3xl font-bold italic block"
                style={{ fontFamily: HEADING }}
              >
                {fmt(calc.savings)}
              </span>
              <span
                className="text-white/30 text-[10px] uppercase tracking-[0.15em]"
                style={{ fontFamily: BODY }}
              >
                saved per project
              </span>
            </motion.div>
          )}
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {/* Photos needed */}
          <div>
            <div
              className="flex justify-between text-xs text-white/50 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              <span>Photos needed per project</span>
              <span className="text-[#EA9A61] font-bold">{photosNeeded}</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={photosNeeded}
              onChange={(e) => setPhotosNeeded(Number(e.target.value))}
              className="rov-range"
              style={{
                background: `linear-gradient(to right, #EA9A61 ${pct(photosNeeded, 5, 100)}%, rgba(255,255,255,0.08) ${pct(photosNeeded, 5, 100)}%)`,
              }}
            />
          </div>

          {/* Videos needed */}
          <div>
            <div
              className="flex justify-between text-xs text-white/50 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              <span>Videos needed per project</span>
              <span className="text-[#EA9A61] font-bold">{videosNeeded}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={videosNeeded}
              onChange={(e) => setVideosNeeded(Number(e.target.value))}
              className="rov-range"
              style={{
                background: `linear-gradient(to right, #EA9A61 ${pct(videosNeeded, 1, 10)}%, rgba(255,255,255,0.08) ${pct(videosNeeded, 1, 10)}%)`,
              }}
            />
          </div>

          {/* Current photo cost */}
          <div>
            <div
              className="flex justify-between text-xs text-white/50 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              <span>Current cost per photo</span>
              <span className="text-[#EA9A61] font-bold">
                {fmt(photoCost)}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={500}
              step={25}
              value={photoCost}
              onChange={(e) => setPhotoCost(Number(e.target.value))}
              className="rov-range"
              style={{
                background: `linear-gradient(to right, #EA9A61 ${pct(photoCost, 50, 500)}%, rgba(255,255,255,0.08) ${pct(photoCost, 50, 500)}%)`,
              }}
            />
          </div>

          {/* Current video cost */}
          <div>
            <div
              className="flex justify-between text-xs text-white/50 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              <span>Current cost per video</span>
              <span className="text-[#EA9A61] font-bold">
                {fmt(videoCost)}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={5000}
              step={250}
              value={videoCost}
              onChange={(e) => setVideoCost(Number(e.target.value))}
              className="rov-range"
              style={{
                background: `linear-gradient(to right, #EA9A61 ${pct(videoCost, 500, 5000)}%, rgba(255,255,255,0.08) ${pct(videoCost, 500, 5000)}%)`,
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/[0.06] mb-5" />

        {/* Results */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <span
              className="text-[9px] uppercase tracking-[0.2em] text-white/25 block mb-1"
              style={{ fontFamily: BODY }}
            >
              Current cost per asset
            </span>
            <span
              className="text-white/40 text-xl md:text-2xl font-bold tabular-nums"
              style={{ fontFamily: HEADING }}
            >
              {fmt(calc.currentCostPerAsset)}
            </span>
          </div>
          <div>
            <span
              className="text-[9px] uppercase tracking-[0.2em] text-[#EA9A61] block mb-1"
              style={{ fontFamily: BODY }}
            >
              ROV cost per asset
            </span>
            <span
              className="text-white text-xl md:text-2xl font-bold tabular-nums"
              style={{ fontFamily: HEADING }}
            >
              {fmt(calc.rovCostPerAsset)}
            </span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {calc.savings > 0 ? (
              <>
                <motion.span
                  key={calc.savings}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring}
                  className="text-[#EA9A61] text-2xl font-bold italic sm:hidden"
                  style={{ fontFamily: HEADING }}
                >
                  {fmt(calc.savings)}
                </motion.span>
                <span
                  className="rounded-full border border-[#EA9A61]/30 bg-[#EA9A61]/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#EA9A61]"
                  style={{ fontFamily: BODY }}
                >
                  {calc.savingsPercent}% less
                </span>
                <span
                  className="text-white/30 text-xs"
                  style={{ fontFamily: BODY }}
                >
                  Recommended:{" "}
                  <span className="text-white/60">
                    {calc.bestTier.name} ({fmt(calc.bestTier.price)})
                  </span>
                </span>
              </>
            ) : (
              <span
                className="text-white/40 text-xs"
                style={{ fontFamily: BODY }}
              >
                ROV bundles everything — adjust sliders to compare.
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
