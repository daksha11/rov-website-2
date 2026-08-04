"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const HEADING = "Norwige, sans-serif";
const MONO = "'DM Mono', monospace";
const BODY = "'Roboto', sans-serif";

const spring = { type: "spring" as const, stiffness: 72, damping: 18 };

// Premium brown gradient for primary buttons: caramel → rust → espresso.
const BROWN_GRADIENT =
  "linear-gradient(135deg, #EA9A61 0%, #A9522F 55%, #5C2E1A 100%)";
const BROWN_SHADOW =
  "0 12px 34px rgba(92,46,26,0.45), inset 0 1px 0 rgba(255,244,227,0.22)";

// In-house artist development proof. DDKFeatureTestimonial is the client
// spotlight; this is the deeper cut: an artist we develop end to end.
// Full story lives at /sound/sam-suen (rovmusic.com/sam-suen on the music host).

const STATS = [
  { value: "20k+", label: "New followers · Summer '26" },
  { value: "100k+", label: "Total streams" },
  { value: "20k", label: "Streams · Stars Collide" },
];

const PILLARS = [
  "Socials grown in-house",
  "Brand built from zero",
  "Website designed & shipped",
  "Records mixed & released",
  "Festival stage, produced",
];

export default function SamSuenFeature() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-[#080807] overflow-hidden"
      style={{ padding: "clamp(80px, 12vw, 140px) clamp(16px, 5vw, 80px)" }}
    >
      {/* Ambient glow — right, behind photo */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-8%",
          top: "20%",
          width: "50%",
          height: "65%",
          background:
            "radial-gradient(ellipse, rgba(234,154,97,0.055) 0%, transparent 68%)",
          filter: "blur(72px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0 }}
          className="flex items-center gap-3 mb-14 md:mb-20"
        >
          <div
            className="w-5 h-px"
            style={{ backgroundColor: "rgba(234,154,97,0.4)" }}
          />
          <span
            className="text-[12px] uppercase tracking-[0.3em]"
            style={{ fontFamily: MONO, color: "rgba(234,154,97,0.55)" }}
          >
            Artist Development · Built In-House
          </span>
        </motion.div>

        {/* Main grid — copy left, photo right (mirrors DDK, which is video-left) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-20 items-center">
          {/* ── LEFT — story + stats ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...spring, delay: 0.08 }}
            className="flex flex-col gap-8 order-2 lg:order-1"
          >
            {/* Artist identity */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: "2px solid rgba(234,154,97,0.22)" }}
              >
                <Image
                  src="/teammembers/samsuentm.webp"
                  alt="Sam Suen"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <div>
                <p
                  className="text-white font-medium text-base tracking-wide"
                  style={{ fontFamily: BODY }}
                >
                  Sam Suen
                </p>
                <p
                  className="text-[12px] uppercase tracking-[0.2em] mt-0.5"
                  style={{ fontFamily: MONO, color: "rgba(255,255,255,0.35)" }}
                >
                  Korean-Chinese Hip-Hop · ROV Artist
                </p>
              </div>
            </div>

            {/* Headline copy */}
            <h2
              className="text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-white"
              style={{ fontFamily: HEADING }}
            >
              One artist. Every lane.{" "}
              <span style={{ color: "#EA9A61" }}>
                Brand, site, sound, stage.
              </span>
            </h2>
            <p
              className="text-sm md:text-base leading-relaxed -mt-3"
              style={{ fontFamily: BODY, color: "rgba(255,255,255,0.5)" }}
            >
              Sam is our proof of concept. We grow his socials, built his brand
              from scratch, designed his website, mix and release his records,
              and put him on a festival stage. No outsourcing, no hand-offs.
              This is what artist development looks like when one team runs the
              whole pipeline.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-1.5">
                  <span
                    className="text-[clamp(1.5rem,2.6vw,2.1rem)] leading-none"
                    style={{ fontFamily: HEADING, color: "#EA9A61" }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-[11px] uppercase tracking-[0.14em] leading-snug"
                    style={{ fontFamily: MONO, color: "rgba(255,255,255,0.35)" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              className="w-full h-px"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            />

            {/* Pillars */}
            <div className="flex flex-wrap gap-2">
              {PILLARS.map((p) => (
                <span
                  key={p}
                  className="text-[12px] uppercase tracking-[0.16em] px-3 py-1 rounded-full"
                  style={{
                    fontFamily: MONO,
                    border: "1px solid rgba(234,154,97,0.3)",
                    color: "#EA9A61",
                    background: "rgba(234,154,97,0.08)",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>

            {/* CTA → full case study */}
            <div>
              {/* Stays /sound/sam-suen on purpose. On the music host this 308s
                  to /sam-suen (one hop), but /sam-suen only exists there, so
                  linking direct would 404 in dev and on rovstudios. */}
              <Link
                href="/sound/sam-suen"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full transition-opacity hover:opacity-90"
                style={{ background: BROWN_GRADIENT, boxShadow: BROWN_SHADOW }}
              >
                <span
                  className="text-[13px] uppercase tracking-[0.22em] font-medium"
                  style={{ fontFamily: MONO, color: "#FFF4E3" }}
                >
                  See the full story
                </span>
                <span aria-hidden style={{ color: "#FFF4E3" }}>
                  →
                </span>
              </Link>
            </div>
          </motion.div>

          {/* ── RIGHT — festival photo ── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...spring, delay: 0.16 }}
            className="relative order-1 lg:order-2"
          >
            <div
              className="absolute -inset-6 rounded-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(234,154,97,0.07) 0%, transparent 68%)",
              }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(234,154,97,0.13)",
                boxShadow:
                  "0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,244,227,0.04)",
              }}
            >
              <Image
                src="/ctrla/VOL1/dreamasiacover.webp"
                alt="Sam Suen headlining DreamAsia Fest"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                draggable={false}
              />
              {/* Caption pill */}
              <div
                className="absolute bottom-3.5 left-3.5 flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(8,8,7,0.75)",
                  border: "1px solid rgba(234,154,97,0.22)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                <span
                  className="text-[12px] uppercase tracking-[0.22em]"
                  style={{ fontFamily: MONO, color: "#EA9A61" }}
                >
                  DreamAsia Fest · Headliner
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3.5 px-0.5">
              <span
                className="text-[12px] uppercase tracking-[0.2em]"
                style={{ fontFamily: MONO, color: "rgba(255,255,255,0.2)" }}
              >
                Developed · ROV Studios
              </span>
              <span
                className="text-[12px] uppercase tracking-[0.18em]"
                style={{ fontFamily: MONO, color: "rgba(255,255,255,0.15)" }}
              >
                2026
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
