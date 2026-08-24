"use client";

// "Whatever's missing." The full-service claim, framed as a career gap rather
// than a product menu.
//
// This replaced the old add-on pricing grid. A price menu asks you to pick a
// product; this asks what's missing and says we fill it, which is the business
// the strategy doc actually describes.
//
// The capability list used to be static words at three sizes, which read as
// placeholder rather than design. It's now two counter-scrolling marquees of
// kinetic type, which suits a studio and turns a list into a thing you watch.
// Pricing lives on /pricing, linked from the header, so no stray numbers float
// around after the visuals.

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import Gallery from "@/components/sections/Gallery";
import VideoShowcaseSection from "@/components/sound/VideoShowcaseSection";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

// Split across two rows that travel in opposite directions. Ordered so the
// heaviest hitters lead each row rather than clustering.
const ROW_A = [
  "Cover art systems",
  "Short-form content",
  "Lyric visualizers",
  "Release rollouts",
  "Press photos",
];

const ROW_B = [
  "Artist websites",
  "EPKs",
  "Split sheets",
  "Merch design",
  "Tracklists",
  "Email flows",
];

function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: string[];
  reverse?: boolean;
  duration: number;
}) {
  return (
    <div className="rov-marquee relative overflow-hidden">
      <div
        className={`rov-marquee-track ${reverse ? "rov-marquee-track--reverse" : ""}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {/* Rendered twice so the -50% translate loops seamlessly. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {items.map((label) => (
              <span key={`${copy}-${label}`} className="flex items-center shrink-0">
                <span
                  className="whitespace-nowrap font-bold italic leading-none text-[clamp(1.75rem,5vw,3.75rem)] text-transparent bg-clip-text px-[clamp(0.6rem,1.6vw,1.4rem)]"
                  style={{
                    fontFamily: HEADING,
                    backgroundImage:
                      "linear-gradient(180deg, #FFF4E3 0%, rgba(255,244,227,0.62) 100%)",
                  }}
                >
                  {label}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 rounded-full bg-[#EA9A61]"
                  style={{ width: "7px", height: "7px" }}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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
      {/* Warm bloom behind the type, so the marquee sits on something */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[1100px] h-[460px] rounded-full pointer-events-none blur-[150px]"
        style={{ background: "radial-gradient(ellipse, rgba(234,154,97,0.09) 0%, transparent 70%)" }}
      />

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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.14 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-14 md:mb-20"
        >
          <p
            className="text-white/45 text-base md:text-lg leading-relaxed max-w-xl"
            style={{ fontFamily: BODY }}
          >
            Most artists hire five people for one release and spend the whole rollout
            translating between them. Tell us what&apos;s missing and we make that part
            too, in the same room as the record.
          </p>
          {/* The pricing line used to float alone below the visuals, reading as a
              stray paragraph. It belongs here, as a link to the real card. */}
          <Link
            href="/pricing"
            className="group shrink-0 inline-flex items-center gap-2 text-[#EA9A61]/85 hover:text-[#EA9A61] text-sm font-semibold transition-colors whitespace-nowrap"
            style={{ fontFamily: HEADING, letterSpacing: "0.03em" }}
          >
            See what it costs
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </motion.div>
      </div>

      {/* ── The kinetic capability spread ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ ...spring, delay: 0.2 }}
        className="relative z-10 flex flex-col gap-2 md:gap-4"
        style={{
          // Fade both ends so the type slides out of the page rather than
          // stopping at a hard edge.
          maskImage:
            "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)",
        }}
      >
        <MarqueeRow items={ROW_A} duration={46} />
        <MarqueeRow items={ROW_B} duration={58} reverse />
      </motion.div>

      {/* ── The evidence ── */}
      <div className="relative z-10 mt-14 md:mt-20">
        <div className="bg-black">
          <Gallery />
        </div>
        <VideoShowcaseSection />
      </div>
    </section>
  );
}
