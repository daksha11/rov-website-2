"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { checkoutHref } from "@/data/soundPricing";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };
const ILLO_STROKE = "#EA9A61";

// Cover Art — square frame with a paint-stroke splash
const CoverArtIllo = (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    stroke={ILLO_STROKE}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="14" y="14" width="68" height="68" rx="4" />
    <path
      d="M26 62 Q36 36 48 50 T74 38"
      strokeWidth="2.25"
    />
    <circle cx="64" cy="28" r="4" fill={ILLO_STROKE} fillOpacity="0.2" />
    <circle cx="64" cy="28" r="4" />
    <path d="M22 74 L34 60" strokeWidth="2" />
  </svg>
);

// Lyric Visualizer — monitor frame with waveform + lyric lines
const VisualizerIllo = (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    stroke={ILLO_STROKE}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="10" y="18" width="76" height="52" rx="3" />
    <line x1="26" y1="78" x2="70" y2="78" strokeWidth="2" />
    <line x1="48" y1="70" x2="48" y2="78" />
    {/* waveform */}
    <line x1="22" y1="40" x2="22" y2="48" strokeWidth="2" />
    <line x1="28" y1="34" x2="28" y2="54" strokeWidth="2" />
    <line x1="34" y1="28" x2="34" y2="60" strokeWidth="2" />
    <line x1="40" y1="36" x2="40" y2="52" strokeWidth="2" />
    <line x1="46" y1="30" x2="46" y2="58" strokeWidth="2" />
    <line x1="52" y1="38" x2="52" y2="50" strokeWidth="2" />
    <line x1="58" y1="32" x2="58" y2="56" strokeWidth="2" />
    <line x1="64" y1="36" x2="64" y2="52" strokeWidth="2" />
    <line x1="70" y1="40" x2="70" y2="48" strokeWidth="2" />
  </svg>
);

// Merch Design — t-shirt with a print graphic
const MerchIllo = (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    stroke={ILLO_STROKE}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M30 20 L38 14 Q48 22 58 14 L66 20 L78 28 L70 40 L64 36 L64 80 L32 80 L32 36 L26 40 L18 28 Z" />
    <circle cx="48" cy="52" r="8" />
    <path d="M42 52 L48 58 L54 46" strokeWidth="2" />
  </svg>
);

interface AddOn {
  name: string;
  description: string;
  subPrice: number;
  oneOff: number;
  turnaround: string;
  illustration: React.ReactNode;
}

const addons: AddOn[] = [
  {
    name: "Cover Art",
    description: "Release-ready square artwork built for streaming platforms and social.",
    subPrice: 50,
    oneOff: 75,
    turnaround: "3–5 days",
    illustration: CoverArtIllo,
  },
  {
    name: "Lyric Visualizer",
    description: "Social-cut video with synced lyrics, ready to drop straight to Reels and TikTok.",
    subPrice: 40,
    oneOff: 60,
    turnaround: "5–7 days",
    illustration: VisualizerIllo,
  },
  {
    name: "Merch Design",
    description: "Print-ready graphic for tees, hoodies, and posters. Delivered as vector files.",
    subPrice: 65,
    oneOff: 95,
    turnaround: "3–5 days",
    illustration: MerchIllo,
  },
];

const packInclusions = [
  "2 cover arts per month",
  "2 lyric visualizers per month",
  "1 merch design per month",
  "Priority revisions on every asset",
  "Unused credits roll one month",
];

export default function CreativeAddOns() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3"
          style={{ fontFamily: BODY }}
        >
          Creative Add-Ons
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-white text-3xl md:text-4xl font-bold italic mb-3"
          style={{ fontFamily: HEADING }}
        >
          Everything else you need to drop
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.15 }}
          className="text-white/40 text-sm md:text-base mb-12 max-w-xl"
          style={{ fontFamily: BODY }}
        >
          Cover art, lyric visuals, and merch. Add any of these to your mix &amp; master subscription or grab them one-off.
        </motion.p>

        {/* Add-on cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-8">
          {addons.map((a, i) => {
            const savings = a.oneOff - a.subPrice;
            return (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...spring, delay: 0.2 + i * 0.08 }}
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-7 flex flex-col overflow-hidden"
              >
                {/* Illustration — top right, decorative */}
                <div
                  className="absolute -top-2 -right-2 w-28 h-28 opacity-[0.08] pointer-events-none"
                  aria-hidden="true"
                >
                  {a.illustration}
                </div>

                {/* Icon chip */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    border: "1px solid rgba(234,154,97,0.2)",
                    background:
                      "linear-gradient(160deg, rgba(234,154,97,0.08) 0%, rgba(234,154,97,0.02) 100%)",
                  }}
                >
                  <div className="w-7 h-7">{a.illustration}</div>
                </div>

                {/* Name */}
                <span
                  className="text-white text-lg font-bold italic mb-2"
                  style={{ fontFamily: HEADING }}
                >
                  {a.name}
                </span>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ fontFamily: BODY, color: "rgba(255,255,255,0.5)" }}
                >
                  {a.description}
                </p>

                <div className="h-px w-full bg-white/[0.06] mb-5" />

                {/* Price block — subscriber price emphasized */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className="text-white text-3xl md:text-[2rem] font-bold italic leading-none"
                    style={{ fontFamily: HEADING }}
                  >
                    ${a.subPrice}
                  </span>
                  <span
                    className="text-[#EA9A61] text-xs uppercase tracking-[0.15em]"
                    style={{ fontFamily: BODY }}
                  >
                    as add-on
                  </span>
                </div>

                {/* One-off anchor with savings */}
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="text-white/30 text-xs line-through"
                    style={{ fontFamily: BODY }}
                  >
                    ${a.oneOff} one-off
                  </span>
                  <span
                    className="text-[#EA9A61] text-[11px] font-semibold"
                    style={{ fontFamily: BODY }}
                  >
                    save ${savings}
                  </span>
                </div>

                {/* Turnaround pill */}
                <div className="mt-auto">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-white/50"
                    style={{ fontFamily: BODY }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {a.turnaround}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Creative Pack — hero bundle */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.45 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            padding: 1,
            background:
              "linear-gradient(135deg, rgba(234,154,97,0.5) 0%, rgba(234,154,97,0.08) 45%, rgba(234,154,97,0.02) 100%)",
          }}
        >
          <div
            className="relative rounded-[15px] p-7 md:p-10"
            style={{
              background:
                "linear-gradient(160deg, rgba(30,26,23,1) 0%, rgba(12,10,9,1) 100%)",
            }}
          >
            {/* Background glow */}
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(234,154,97,0.45) 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-center">
              {/* Left: name + inclusions */}
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <span
                    className="rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#EA9A61] font-semibold"
                    style={{ fontFamily: BODY }}
                  >
                    Best Value
                  </span>
                  <span
                    className="text-white/30 text-xs uppercase tracking-[0.2em]"
                    style={{ fontFamily: BODY }}
                  >
                    Monthly Bundle
                  </span>
                </div>

                <h4
                  className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-3 leading-[1.05]"
                  style={{ fontFamily: HEADING }}
                >
                  Creative Pack
                </h4>

                <p
                  className="text-white/50 text-sm md:text-base mb-6 max-w-md"
                  style={{ fontFamily: BODY }}
                >
                  Add every creative asset to your mix &amp; master plan. One monthly fee, everything you need to ship a full release cycle.
                </p>

                {/* Inclusions checklist */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {packInclusions.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-white/60 text-sm"
                      style={{ fontFamily: BODY }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#EA9A61"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: price stack + CTA */}
              <div className="flex flex-col items-start lg:items-end">
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className="text-white text-5xl md:text-6xl font-bold italic leading-none"
                    style={{ fontFamily: HEADING }}
                  >
                    $125
                  </span>
                  <span
                    className="text-white/40 text-sm"
                    style={{ fontFamily: BODY }}
                  >
                    /mo
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-6">
                  <span
                    className="text-sm line-through"
                    style={{ fontFamily: BODY, color: "rgba(255,255,255,0.45)" }}
                  >
                    $245 à la carte
                  </span>
                  <span
                    className="rounded-full bg-[#EA9A61]/15 border border-[#EA9A61]/30 text-[#EA9A61] text-[11px] font-bold px-2.5 py-0.5 uppercase tracking-[0.1em]"
                    style={{ fontFamily: BODY }}
                  >
                    Save $120/mo
                  </span>
                </div>

                <a
                  href={checkoutHref("creative_pack")}
                  className="cta-shine inline-flex items-center justify-center gap-2 text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] w-full lg:w-auto"
                  style={{
                    fontFamily: HEADING,
                    padding: "14px 32px",
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background:
                      "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                    boxShadow:
                      "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Add to plan
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
