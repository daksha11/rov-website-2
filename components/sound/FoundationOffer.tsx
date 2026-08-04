"use client";

// Foundation, Release Cycle, Development. The three products from the internal
// "Artist Backend" doc, and the missing rung between a $149 finished single and
// full artist development.
//
// This is where the readiness audit sends people, so it has to answer the
// question the audit just raised: you named my gaps, now what closes them.

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CONSULT_BOOKING_URL, checkoutHref } from "@/data/soundPricing";
import { FOUNDATION_PRICE } from "@/data/artistReadiness";
import CalBookButton from "@/components/sound/CalBookButton";
import { useEffectiveRole } from "@/components/music/RoleContext";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";

const FOUNDATION_INCLUDES = [
  "Split sheet system, signed the day the song is made",
  "Metadata master sheet: every code, every exact spelling",
  "Release hub on your own domain, with email capture",
  "Cover art system, not one-off covers",
  "EPK, live page plus a PDF you can forward",
  "Tech rider, input list, and stage plot",
  "Session and stem vault, held and backed up",
];

// What we deliberately don't sell. Saying it plainly is the differentiator.
const NOT_OURS = [
  "Label services",
  "Radio promo",
  "Booking agency",
  "Publishing administration",
];

export default function FoundationOffer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const role = useEffectiveRole();
  const isManager = role === "manager";

  return (
    <section
      ref={ref}
      id="foundation"
      className="scroll-mt-24 relative bg-[#080807] overflow-hidden"
      style={{ padding: "clamp(70px, 11vw, 130px) clamp(16px, 5vw, 60px)" }}
    >
      {/* Warm bloom */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[420px] rounded-full pointer-events-none blur-[130px]"
        style={{ background: "radial-gradient(ellipse, rgba(234,154,97,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Header ── */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3 text-center"
          style={{ fontFamily: BODY }}
        >
          The artist backend
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.08 }}
          className="text-white text-3xl md:text-5xl font-bold italic mb-4 text-center leading-[1.05]"
          style={{ fontFamily: HEADING }}
        >
          A mix makes one song better.
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(112deg, #EA9A61 0%, #B16937 50%, #A64D2B 100%)" }}
          >
            This makes a catalog worth something.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.14 }}
          className="text-white/45 text-sm md:text-base mb-12 md:mb-16 text-center max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: BODY }}
        >
          {isManager
            ? "Engineers sell songs. What makes an artist manageable is the operating system underneath. We build that, per artist, and it's the same system across your whole roster."
            : "Engineers sell songs. Almost nobody at this price sells the thing underneath: the paperwork, the owned audience, and the presentation that makes you look like a real act. That's what this is."}
        </motion.p>

        {/* ── Three products ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-10">
          {/* Foundation — featured */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.2 }}
            className="relative rounded-2xl border border-[#EA9A61]/30 bg-[#EA9A61]/[0.04] p-6 md:p-8 flex flex-col lg:row-span-2"
          >
            <span
              className="absolute -top-3 left-6 rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/15 px-3 py-0.5 text-[11px] uppercase tracking-[0.2em] text-[#EA9A61]"
              style={{ fontFamily: BODY }}
            >
              Start here
            </span>
            <span
              className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-4"
              style={{ fontFamily: BODY }}
            >
              Foundation · one time
            </span>
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="text-white text-4xl md:text-5xl font-bold italic"
                style={{ fontFamily: HEADING }}
              >
                ${FOUNDATION_PRICE}
              </span>
            </div>
            <span
              className="text-[#EA9A61] text-xs uppercase tracking-[0.15em] mb-6"
              style={{ fontFamily: BODY }}
            >
              Yours forever
            </span>

            <ul className="flex-1 space-y-2.5 mb-7">
              {FOUNDATION_INCLUDES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-white/60 text-sm leading-relaxed"
                  style={{ fontFamily: BODY }}
                >
                  <span className="text-[#EA9A61] mt-0.5 shrink-0">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={checkoutHref("foundation")}
              className="cta-shine block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.03]"
              style={{
                fontFamily: HEADING,
                padding: "14px",
                fontSize: "13px",
                letterSpacing: "0.05em",
                background: GRADIENT,
                boxShadow: GRADIENT_SHADOW,
              }}
            >
              Start Foundation &rarr;
            </a>
          </motion.div>

          {/* Release Cycle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.28 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-7 flex flex-col"
          >
            <span
              className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3"
              style={{ fontFamily: BODY }}
            >
              Release Cycle · per release
            </span>
            <h3
              className="text-white text-xl md:text-2xl font-bold italic mb-3"
              style={{ fontFamily: HEADING }}
            >
              Every drop, handled
            </h3>
            <p
              className="text-white/45 text-sm leading-relaxed flex-1 mb-5"
              style={{ fontFamily: BODY }}
            >
              Rollout calendar, cover art, clips, presave and links, DSP pitch, email flows,
              and credits filed before the song is out. Priced per release once Foundation
              is in place.
            </p>
            <CalBookButton
              calLink={CONSULT_BOOKING_URL}
              className="block w-full text-center text-white/80 hover:text-white text-sm font-semibold rounded-full border border-white/10 hover:border-[#EA9A61]/40 transition-all duration-300"
              style={{ fontFamily: HEADING, padding: "12px", letterSpacing: "0.04em" }}
            >
              Get a release quote
            </CalBookButton>
          </motion.div>

          {/* Development */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.34 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-7 flex flex-col"
          >
            <span
              className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3"
              style={{ fontFamily: BODY }}
            >
              Development · monthly
            </span>
            <h3
              className="text-white text-xl md:text-2xl font-bold italic mb-3"
              style={{ fontFamily: HEADING }}
            >
              The whole pipeline
            </h3>
            <p
              className="text-white/45 text-sm leading-relaxed flex-1 mb-5"
              style={{ fontFamily: BODY }}
            >
              Release Cycle on a cadence, plus a quarterly report on where streams actually
              come from and a strategy call. This is what we run for Sam Suen.
            </p>
            <CalBookButton
              calLink={CONSULT_BOOKING_URL}
              className="block w-full text-center text-white/80 hover:text-white text-sm font-semibold rounded-full border border-white/10 hover:border-[#EA9A61]/40 transition-all duration-300"
              style={{ fontFamily: HEADING, padding: "12px", letterSpacing: "0.04em" }}
            >
              {isManager ? "Book a roster call" : "Talk about development"}
            </CalBookButton>
          </motion.div>
        </div>

        {/* ── What we don't sell ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.4 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 md:gap-8"
        >
          <div className="shrink-0">
            <span
              className="block text-[11px] uppercase tracking-[0.25em] text-white/35 mb-1.5"
              style={{ fontFamily: BODY }}
            >
              What we don&apos;t do
            </span>
            <span
              className="text-white text-lg md:text-xl font-bold italic"
              style={{ fontFamily: HEADING }}
            >
              And won&apos;t pretend to
            </span>
          </div>
          <div className="h-px md:h-14 md:w-px w-full bg-white/[0.08] shrink-0" />
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              {NOT_OURS.map((n) => (
                <span
                  key={n}
                  className="text-[11px] uppercase tracking-[0.14em] px-3 py-1 rounded-full border border-white/10 text-white/40"
                  style={{ fontFamily: BODY }}
                >
                  {n}
                </span>
              ))}
            </div>
            <p className="text-white/40 text-xs leading-relaxed" style={{ fontFamily: BODY }}>
              We refer out for publishing admin and anything contractual. You want a lawyer
              for that, not a studio.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
