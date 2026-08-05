"use client";

// "Whatever's missing." The full-service claim, framed as a career gap rather
// than a product menu.
//
// This replaces the old add-on pricing grid (cover art $75, visualizer $60,
// merch $95). A price menu asks you to pick a product. This asks what's missing
// and says we fill it, which is the business the strategy doc actually
// describes. Prices moved out to one honest range line at the bottom, because
// the real number depends on the release.
//
// It also gives the cover gallery and the video showcase a job. Both used to
// sit in the back half as decoration; here they're the evidence for the claim.

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Gallery from "@/components/sections/Gallery";
import VideoShowcaseSection from "@/components/sound/VideoShowcaseSection";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

// Deliberately unpriced and deliberately uneven in weight. It should read as a
// spread of things we make, not a line-item list.
const CAPABILITIES = [
  { label: "Cover art", weight: "lg" },
  { label: "Shorts", weight: "md" },
  { label: "Lyric visualizers", weight: "md" },
  { label: "EPK", weight: "lg" },
  { label: "Website", weight: "lg" },
  { label: "Press photos", weight: "sm" },
  { label: "Merch", weight: "sm" },
  { label: "Release rollouts", weight: "md" },
  { label: "Split sheets", weight: "sm" },
  { label: "Tracklists", weight: "sm" },
] as const;

const WEIGHT_CLASS: Record<string, string> = {
  lg: "text-2xl md:text-4xl text-white",
  md: "text-xl md:text-3xl text-white/70",
  sm: "text-lg md:text-2xl text-white/40",
};

export default function CareerGaps() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="whatever-is-missing"
      className="scroll-mt-24 relative bg-black overflow-hidden"
      style={{ padding: "clamp(70px, 11vw, 130px) 0" }}
    >
      <div
        className="relative z-10 max-w-6xl mx-auto"
        style={{ padding: "0 clamp(16px, 5vw, 60px)" }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-4"
          style={{ fontFamily: BODY }}
        >
          Whatever&apos;s missing
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.08 }}
          className="text-white text-3xl md:text-5xl lg:text-6xl font-bold italic leading-[1.02] mb-6 max-w-3xl"
          style={{ fontFamily: HEADING }}
        >
          A mix is one piece.
          <br />
          We build the rest of it too.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.14 }}
          className="text-white/45 text-base md:text-lg leading-relaxed max-w-xl mb-12 md:mb-16"
          style={{ fontFamily: BODY }}
        >
          Most artists hire five people for one release and spend the whole rollout
          translating between them. Tell us what&apos;s missing and we make that part
          too, in the same room as the record.
        </motion.p>

        {/* Capability spread. Wrapping, uneven, no boxes, no prices. */}
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3 md:gap-x-9 md:gap-y-4 mb-14 md:mb-20">
          {CAPABILITIES.map((c, i) => (
            <motion.span
              key={c.label}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.2 + i * 0.04 }}
              className={`font-bold italic leading-none ${WEIGHT_CLASS[c.weight]}`}
              style={{ fontFamily: HEADING }}
            >
              {c.label}
              {i < CAPABILITIES.length - 1 && (
                <span className="text-[#EA9A61]/30 ml-6 md:ml-9 not-italic font-normal">
                  ·
                </span>
              )}
            </motion.span>
          ))}
        </div>
      </div>

      {/* ── The evidence ── */}
      <div className="relative z-10">
        <div className="bg-black">
          <Gallery />
        </div>
        <VideoShowcaseSection />
      </div>

      {/* ── One honest line where the price menu used to be ── */}
      <div
        className="relative z-10 max-w-6xl mx-auto"
        style={{ padding: "clamp(40px, 6vw, 70px) clamp(16px, 5vw, 60px) 0" }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ ...spring, delay: 0.3 }}
          className="text-white/35 text-sm md:text-base leading-relaxed max-w-2xl"
          style={{ fontFamily: BODY }}
        >
          {/* PRICING REVIEW: this range is the only number in the section, and
              it replaces the old per-item menu. Confirm the floor and ceiling
              against what these actually go out at. */}
          Most single pieces land between{" "}
          <span className="text-white/70">$40 and $300</span> depending on the release.
          We quote it with the rollout rather than off a menu, because a cover for a
          one-off and a cover for a six-single run are different jobs.
        </motion.p>
      </div>
    </section>
  );
}
