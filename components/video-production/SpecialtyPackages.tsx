"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import MarketRateTooltip from "@/components/common/MarketRateTooltip";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const packages = [
  {
    name: "Property Showcase",
    price: "Starting from $500",
    priceSub: "Based on sq ft",
    tagline: "Make buyers fall in love before they ever set foot inside.",
    bestFor: "Real estate agents and sellers who refuse to blend in",
    features: [
      "Drone and aerial cinematography",
      "Cinematic walkthrough video",
      "Clean shot of Agent \u2014 welcome shot, voiceover, or talking points",
      "Social-ready edits for every platform",
      "Professionally edited listing photos",
      "Fast delivery",
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
      "Full-day shoot",
      "Highlight reel",
      "Edited photos",
      "BTS footage",
      "Clips cut and ready to post",
      "Color graded",
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

        {/* Bridge text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.4 }}
          className="text-white/60 text-2xl md:text-3xl italic text-center my-14 md:my-20"
          style={{ fontFamily: HEADING }}
        >
          Or have an idea in mind?
        </motion.p>

        {/* Absolute Cinema card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.45 }}
          className="relative rounded-2xl border border-[#EA9A61]/30 py-14 md:py-20 px-8 md:px-10 w-full mb-10 text-center flex flex-col items-center overflow-hidden"
        >
          {/* Blurred background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "blur(30px) brightness(0.4) saturate(1.3)", transform: "scale(1.2)" }}
          >
            <source src="/videoprod/Laketipweb.mp4" type="video/mp4" />
          </video>
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(20,20,20,0.85) 50%, rgba(0,0,0,0.9) 100%)",
            }}
          />

          <span
            className="relative z-10 text-white/50 text-sm uppercase tracking-[0.2em] mb-4 block"
            style={{ fontFamily: BODY }}
          >
            Absolute Cinema
          </span>

          <p
            className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-bold italic mb-4"
            style={{ fontFamily: HEADING }}
          >
            Let&apos;s shoot.
          </p>

          <p
            className="relative z-10 text-white/40 text-base md:text-lg italic leading-relaxed mb-10"
            style={{ fontFamily: BODY }}
          >
            Brand films. Music videos. Campaign content. Product launches.
          </p>

          <a
            href="https://calendly.com/rangeofviewmusic/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 cta-shine inline-block text-center text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03]"
            style={{
              fontFamily: HEADING,
              padding: "14px 32px",
              fontSize: "13px",
              letterSpacing: "0.05em",
              background:
                "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
              boxShadow:
                "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
            }}
          >
            Book a call &rarr;
          </a>
        </motion.div>

        {/* Market comparison bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.45 }}
          className="flex items-center justify-center gap-6 md:gap-10 flex-wrap rounded-xl border border-white/[0.06] px-6 py-4"
          style={{ background: "rgba(255,255,255,0.02)", fontFamily: BODY }}
        >
          <MarketRateTooltip
            sources={[
              {
                name: "Wistia — State of Video Report",
                url: "https://wistia.com/learn/marketing/state-of-video",
                detail: "Reports typical professional video production costs of $1,000–$10,000+ per finished minute.",
              },
              {
                name: "HubSpot — Video Marketing Cost Guide",
                url: "https://blog.hubspot.com/marketing/video-marketing-cost",
                detail: "Breaks down production budgets by type: corporate, commercial, and social content.",
              },
              {
                name: "Clutch.co — Video Production Survey",
                url: "https://clutch.co/agencies/video-production/resources/video-production-costs",
                detail: "Survey of 500+ businesses on what they pay agencies for professional video production.",
              },
            ]}
          >
            <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
              Market rate:{" "}
              <span className="text-white/50 font-medium">
                $3,000 &ndash; $15,000
              </span>
            </span>
          </MarketRateTooltip>
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
