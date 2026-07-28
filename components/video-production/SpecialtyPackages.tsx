"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import MarketRateTooltip from "@/components/common/MarketRateTooltip";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const BROWN_GRADIENT =
  "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

type PackageCategory = "real-estate" | "events";

interface Package {
  id: PackageCategory;
  categoryLabel: string;
  name: string;
  price: string;
  priceSub: string;
  tagline: string;
  bestFor: string;
  recommended?: boolean;
  features: string[];
}

const packages: Package[] = [
  {
    id: "real-estate",
    categoryLabel: "Real Estate",
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
    id: "events",
    categoryLabel: "Events",
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
  const [activeCategory, setActiveCategory] =
    useState<PackageCategory>("real-estate");
  const activePkg = packages.find((p) => p.id === activeCategory)!;

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

        {/* Category toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.18 }}
          className="flex justify-center mb-8"
        >
          <div
            className="inline-flex items-center gap-1 p-1 rounded-full border border-white/[0.1] bg-black/40"
            role="tablist"
            aria-label="Package category"
          >
            {packages.map((pkg) => {
              const isActive = activeCategory === pkg.id;
              return (
                <button
                  key={pkg.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(pkg.id)}
                  className="relative px-5 md:px-6 py-2.5 text-xs md:text-sm uppercase tracking-[0.2em] rounded-full transition-all duration-300"
                  style={{
                    fontFamily: BODY,
                    color: isActive ? "#FFF4E3" : "rgba(255,244,227,0.5)",
                    background: isActive ? BROWN_GRADIENT : "transparent",
                    boxShadow: isActive
                      ? "0 0 20px rgba(234,154,97,0.35), inset 0 1px 0 rgba(255,244,227,0.15)"
                      : "none",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {isActive && (
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                      style={{ background: "#FFF4E3" }}
                    />
                  )}
                  {pkg.categoryLabel}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Active package card */}
        <div className="max-w-3xl mx-auto mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8 flex flex-col"
            >

              {/* Name */}
              <span
                className="text-white text-lg font-bold italic mb-3"
                style={{ fontFamily: HEADING }}
              >
                {activePkg.name}
              </span>

              {/* Price */}
              <span
                className="text-white text-3xl md:text-4xl font-bold italic mb-1"
                style={{ fontFamily: HEADING }}
              >
                {activePkg.price}
              </span>
              <span
                className="text-white/30 text-xs mb-4"
                style={{ fontFamily: BODY }}
              >
                {activePkg.priceSub}
              </span>

              {/* Tagline */}
              <p
                className="text-white/50 text-sm italic mb-5"
                style={{ fontFamily: BODY }}
              >
                {activePkg.tagline}
              </p>

              <div className="h-px w-full bg-white/[0.06] mb-5" />

              {/* Features in two columns */}
              <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-6">
                {activePkg.features.map((item) => (
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
                {activePkg.bestFor}
              </p>

              {/* CTA */}
              <a
                href="https://cal.com/rov-studios-imhphw/15min"
                target="_blank"
                rel="noopener noreferrer"
                className={`cta-shine block text-center text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] ${
                  activePkg.recommended
                    ? ""
                    : "border border-white/10 hover:border-white/20"
                }`}
                style={{
                  fontFamily: HEADING,
                  padding: "12px",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  ...(activePkg.recommended
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
          </AnimatePresence>
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
            href="https://cal.com/rov-studios-imhphw/15min"
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
