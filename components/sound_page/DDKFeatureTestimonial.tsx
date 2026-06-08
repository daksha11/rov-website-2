"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const HEADING = "Norwige, sans-serif";
const MONO = "'DM Mono', monospace";
const BODY = "'Roboto', sans-serif";

const spring = { type: "spring" as const, stiffness: 72, damping: 18 };

function MusicNoteIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
      <path
        d="M3.5 9.5V2.5L10.5 1V8"
        stroke="#EA9A61"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="2" cy="9.5" r="1.8" fill="#EA9A61" opacity="0.85" />
      <circle cx="9" cy="7.8" r="1.8" fill="#EA9A61" opacity="0.85" />
    </svg>
  );
}

const DELIVERABLES = [
  "Full mix & master",
  "Stem organisation & cleanup",
  "Revision turned in under 24 hrs",
];

const BADGES = ["Fastest Engineer", "On The Radar", "Mixed by ROV Studios"];

export default function DDKFeatureTestimonial() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-[#080807] overflow-hidden"
      style={{ padding: "clamp(80px, 12vw, 140px) clamp(16px, 5vw, 80px)" }}
    >
      {/* Ambient glow — left, behind video */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-8%",
          top: "15%",
          width: "55%",
          height: "70%",
          background:
            "radial-gradient(ellipse, rgba(234,154,97,0.055) 0%, transparent 68%)",
          filter: "blur(72px)",
        }}
      />

      {/* Waveform bars — top right decoration */}
      <svg
        className="absolute top-0 right-0 opacity-[0.035] pointer-events-none"
        width="420"
        height="180"
        viewBox="0 0 420 180"
        aria-hidden
      >
        {Array.from({ length: 64 }).map((_, i) => {
          const x = (i / 64) * 420;
          const h =
            12 +
            Math.sin(i * 0.52) * 28 +
            Math.sin(i * 0.27 + 1) * 18 +
            Math.cos(i * 0.18) * 10;
          return (
            <rect
              key={i}
              x={x}
              y={90 - h / 2}
              width={3.5}
              height={h}
              rx={1.75}
              fill="#EA9A61"
            />
          );
        })}
      </svg>

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
            className="text-[11px] uppercase tracking-[0.3em]"
            style={{
              fontFamily: MONO,
              color: "rgba(234,154,97,0.55)",
            }}
          >
            Featured Artist · Client Spotlight
          </span>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">

          {/* ── LEFT — YouTube embed ── */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...spring, delay: 0.08 }}
            className="relative"
          >
            {/* Soft glow behind frame */}
            <div
              className="absolute -inset-6 rounded-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(234,154,97,0.07) 0%, transparent 68%)",
              }}
            />

            {/* Video card */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(234,154,97,0.13)",
                boxShadow:
                  "0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,244,227,0.04)",
              }}
            >
              {/* Track pill overlay */}
              <div
                className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(8,8,7,0.75)",
                  border: "1px solid rgba(234,154,97,0.22)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                <MusicNoteIcon />
                <span
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{ fontFamily: MONO, color: "#EA9A61" }}
                >
                  On The Radar
                </span>
              </div>

              {/* YouTube iframe */}
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/fZQ8AywmXrI?rel=0&modestbranding=1&color=white"
                  title="DDK — On The Radar (Mixed by ROV Studios)"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ display: "block" }}
                />
              </div>
            </div>

            {/* Below-video meta */}
            <div className="flex items-center justify-between mt-3.5 px-0.5">
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{
                  fontFamily: MONO,
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                Mixed &amp; Mastered · ROV Studios
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{
                  fontFamily: MONO,
                  color: "rgba(255,255,255,0.15)",
                }}
              >
                2024
              </span>
            </div>
          </motion.div>

          {/* ── RIGHT — Testimonial copy ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...spring, delay: 0.16 }}
            className="flex flex-col gap-8"
          >
            {/* Artist identity */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: "2px solid rgba(234,154,97,0.22)" }}
              >
                <img
                  src="/clients/ddk.webp"
                  alt="DDK"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <div>
                <p
                  className="text-white font-medium text-base tracking-wide"
                  style={{ fontFamily: BODY }}
                >
                  DDK
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.2em] mt-0.5"
                  style={{
                    fontFamily: MONO,
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Recording Artist
                </p>
              </div>
            </div>

            {/* Quote block */}
            <div className="relative pl-1">
              {/* Decorative opening mark */}
              <span
                className="absolute -top-8 -left-1 text-7xl leading-none select-none pointer-events-none"
                style={{
                  fontFamily: HEADING,
                  fontStyle: "italic",
                  color: "rgba(234,154,97,0.1)",
                }}
                aria-hidden
              >
                &ldquo;
              </span>
              <p
                className="text-[clamp(1.35rem,2.4vw,1.8rem)] leading-snug"
                style={{
                  fontFamily: HEADING,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                Basu is one of the fastest engineers ever. What he was doing
                with this setup back then amused me.{" "}
                <span style={{ color: "#EA9A61" }}>
                  My biggest songs are mixed by Basu.
                </span>
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {BADGES.map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] uppercase tracking-[0.16em] px-3 py-1 rounded-full"
                  style={{
                    fontFamily: MONO,
                    border: "1px solid rgba(234,154,97,0.18)",
                    color: "rgba(234,154,97,0.65)",
                    background: "rgba(234,154,97,0.04)",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div
              className="w-full h-px"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            />

            {/* Work delivered */}
            <div className="flex flex-col gap-4">
              <p
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{
                  fontFamily: MONO,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                Work delivered
              </p>
              <div className="flex flex-col gap-2.5">
                {DELIVERABLES.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "rgba(234,154,97,0.5)" }}
                    />
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: BODY,
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
