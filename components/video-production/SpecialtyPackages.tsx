"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const packages = [
  {
    name: "Property Showcase",
    price: "$2,000",
    priceSub: "One-time project fee",
    tagline: "Make buyers fall in love before they ever set foot inside.",
    bestFor: "Real estate agents and sellers who refuse to blend in",
    features: [
      "Cinematic walkthrough video",
      "Drone and aerial cinematography",
      "Agent personal intro clip",
      "Short-form and long-form edits for social",
      "Professionally edited listing photos",
      "48-hour delivery",
    ],
  },
  {
    name: "Event Coverage",
    price: "Let\u2019s scope it.",
    priceSub: "Custom quote",
    tagline: "Your event happens once. We make sure it lives forever.",
    bestFor:
      "Brands, launches, conferences, and moments worth capturing forever",
    recommended: true,
    features: [
      "Full-day shoot (up to 8 hours)",
      "2-3 min highlight reel",
      "Edited photo gallery",
      "Behind-the-scenes footage",
      "Clips cut and ready to post",
      "Same-day social media preview",
    ],
  },
];

export default function SpecialtyPackages() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
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
          Video / Media Production
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-4"
          style={{ fontFamily: HEADING }}
        >
          Content that stops the scroll and books the call
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.15 }}
          className="text-white/40 text-sm mb-10 max-w-xl"
          style={{ fontFamily: BODY }}
        >
          From half-day shoots to full content engines &mdash; professional
          photo, video, and social media assets that make your brand impossible
          to ignore.
        </motion.p>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.2 + i * 0.1 }}
              className={`relative rounded-2xl border p-6 md:p-8 flex flex-col ${
                pkg.recommended
                  ? "border-[#EA9A61]/30 bg-[#EA9A61]/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {pkg.recommended && (
                <span
                  className="absolute -top-3 left-6 rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/15 px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#EA9A61]"
                  style={{ fontFamily: BODY }}
                >
                  Recommended
                </span>
              )}

              {/* Name */}
              <span
                className="text-white text-lg font-bold italic mb-3"
                style={{ fontFamily: HEADING }}
              >
                {pkg.name}
              </span>

              {/* Price */}
              <span
                className="text-white text-3xl md:text-4xl font-bold italic mb-1"
                style={{ fontFamily: HEADING }}
              >
                {pkg.price}
              </span>
              <span
                className="text-white/30 text-xs mb-4"
                style={{ fontFamily: BODY }}
              >
                {pkg.priceSub}
              </span>

              {/* Tagline */}
              <p
                className="text-white/50 text-sm italic mb-5"
                style={{ fontFamily: BODY }}
              >
                {pkg.tagline}
              </p>

              <div className="h-px w-full bg-white/[0.06] mb-5" />

              {/* Features in two columns */}
              <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-6">
                {pkg.features.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-white/50 text-sm"
                    style={{ fontFamily: BODY }}
                  >
                    <span className="text-[#EA9A61] mt-0.5 shrink-0">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Best for */}
              <p
                className="text-white/30 text-xs italic mb-6 pt-5"
                style={{
                  fontFamily: BODY,
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span className="text-white/50 font-semibold">Best for:</span>{" "}
                {pkg.bestFor}
              </p>

              {/* CTA */}
              <a
                href="https://calendly.com/rangeofviewmusic/30min"
                target="_blank"
                rel="noopener noreferrer"
                className={`cta-shine block text-center text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] ${
                  pkg.recommended
                    ? ""
                    : "border border-white/10 hover:border-white/20"
                }`}
                style={{
                  fontFamily: HEADING,
                  padding: "12px",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  ...(pkg.recommended
                    ? {
                        background:
                          "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                        boxShadow:
                          "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                      }
                    : { background: "rgba(255,255,255,0.03)" }),
                }}
              >
                Book a call &rarr;
              </a>
            </motion.div>
          ))}
        </div>

        {/* Market comparison bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.45 }}
          className="flex items-center justify-center gap-6 md:gap-10 flex-wrap rounded-xl border border-white/[0.06] px-6 py-4"
          style={{ background: "rgba(255,255,255,0.02)", fontFamily: BODY }}
        >
          <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
            Market rate:{" "}
            <span className="text-white/50 font-medium">
              $3,000 &ndash; $15,000
            </span>
          </span>
          <span className="hidden md:block w-px h-4 bg-white/10" />
          <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
            ROV:{" "}
            <span className="text-[#EA9A61] font-semibold">
              $2,000 &ndash; $8,000
            </span>
          </span>
        </motion.div>
      </div>
    </div>
  );
}
