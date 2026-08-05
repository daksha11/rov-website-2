"use client";

// /pricing — the studio-wide price list.
//
// Deliberately organised by the Full View, not by the four practice areas. A
// buyer landing on four separate price lists has to assemble the offer
// themselves, which is the exact thing we say other shops make them do. Here
// the tier follows from how many of the five moments are leaking, and the
// practice areas become how a tier gets delivered.
//
// Every number on this page comes from lib/pricing.ts. Nothing is written
// inline, so this page can never drift from the service pages or the intake
// quiz the way the old per-component numbers did.

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import ServiceLeadSection from "@/components/sections/ServiceLeadSection";
import {
  MOMENTS,
  TIERS,
  RETAINER,
  MEDIA,
  FLOOR,
  OVER_CEILING_NOTE,
  fmt,
} from "@/lib/pricing";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const ORANGE = "#EA9A61";
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const CAL_URL = "https://cal.com/rov-studios-imhphw/15min";

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section
      ref={ref}
      className={`relative bg-black ${className}`}
      style={{ padding: "clamp(56px, 9vw, 100px) clamp(16px, 5vw, 60px)" }}
      data-inview={inView ? "true" : "false"}
    >
      {children}
    </section>
  );
}

export default function PricingContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroIn = useInView(heroRef, { once: true, margin: "-80px" });

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden bg-black"
        style={{ padding: "clamp(110px, 16vw, 170px) clamp(16px, 5vw, 60px) clamp(40px, 6vw, 70px)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: -160,
            right: -120,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234,154,97,0.14), transparent 70%)",
          }}
        />
        <div ref={heroRef} className="relative mx-auto max-w-4xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={heroIn ? { opacity: 1 } : {}}
            transition={spring}
            className="mb-4 block text-xs uppercase tracking-[0.3em]"
            style={{ fontFamily: BODY, color: ORANGE }}
          >
            Pricing
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroIn ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.08 }}
            className="mb-6 text-4xl font-bold italic leading-[1.08] md:text-5xl lg:text-6xl"
            style={{ fontFamily: HEADING }}
          >
            What it costs, before you ask.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={heroIn ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.15 }}
            className="max-w-2xl text-base leading-relaxed text-white/60 md:text-lg"
            style={{ fontFamily: BODY }}
          >
            Most studios make you sit through a call to find out whether you can afford them. Here are
            the actual numbers. Projects start at {fmt(FLOOR)} and we would rather sell you the smaller
            correct job than the bigger wrong one.
          </motion.p>
        </div>
      </section>

      {/* ── THE FIVE MOMENTS ── */}
      <Section>
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-3 max-w-2xl text-2xl font-bold italic md:text-3xl lg:text-4xl"
            style={{ fontFamily: HEADING }}
          >
            We price the problem, not the deliverable
          </h2>
          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-white/45" style={{ fontFamily: BODY }}>
            A customer meets your business at five moments. Most businesses have one or two that leak,
            and they are rarely the ones getting the attention. What you need from us, and what it
            costs, follows from how many of these are broken.
          </p>

          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {MOMENTS.map((m, i) => (
              <li
                key={m.key}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
              >
                <span
                  className="mb-2 block text-[0.7rem] uppercase tracking-[0.2em] text-white/25"
                  style={{ fontFamily: BODY }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="mb-2 block text-lg font-bold italic"
                  style={{ fontFamily: HEADING, color: ORANGE }}
                >
                  {m.label}
                </span>
                <span
                  className="block text-[0.8125rem] leading-relaxed text-white/50"
                  style={{ fontFamily: BODY }}
                >
                  {m.blurb}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ── PROJECT TIERS ── */}
      <Section>
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-3 text-2xl font-bold italic md:text-3xl lg:text-4xl"
            style={{ fontFamily: HEADING }}
          >
            Two ways in
          </h2>
          <p className="mb-10 max-w-xl text-sm text-white/45" style={{ fontFamily: BODY }}>
            We tell you which one you need after the audit, and the audit is free.
          </p>

          <div className="mb-8 flex flex-col gap-4">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl border p-6 md:p-8 ${
                  tier.recommended
                    ? "border-[#EA9A61]/30 bg-[#EA9A61]/[0.04]"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                {tier.recommended && (
                  <span
                    className="absolute -top-3 left-6 rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/15 px-3 py-0.5 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em]"
                    style={{ fontFamily: BODY, color: ORANGE }}
                  >
                    Most common
                  </span>
                )}

                <span className="mb-1 text-lg font-bold italic" style={{ fontFamily: HEADING }}>
                  {tier.name}
                </span>
                <span
                  className="mb-4 text-xs uppercase tracking-[0.15em]"
                  style={{ fontFamily: BODY, color: ORANGE }}
                >
                  {tier.kicker}
                </span>

                <div className="mb-1 flex items-baseline gap-2">
                  <span
                    className="text-4xl font-bold italic md:text-5xl"
                    style={{ fontFamily: HEADING }}
                  >
                    {fmt(tier.priceFrom)}
                  </span>
                  <span className="text-lg text-white/35" style={{ fontFamily: HEADING }}>
                    to {fmt(tier.priceTo)}
                  </span>
                </div>
                <span className="mb-5 text-xs text-white/30" style={{ fontFamily: BODY }}>
                  {tier.priceSub}
                </span>

                <p className="mb-5 text-sm italic text-white/50" style={{ fontFamily: BODY }}>
                  {tier.tagline}
                </p>

                <div className="mb-5 h-px w-full bg-white/[0.06]" />

                {tier.includesPrefix && (
                  <p className="mb-4 text-sm text-white/50" style={{ fontFamily: BODY }}>
                    <span className="font-semibold" style={{ color: ORANGE }}>
                      {tier.includesPrefix}
                    </span>
                    , plus:
                  </p>
                )}

                <ul className="mb-6 grid flex-1 grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  {tier.features.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-white/50"
                      style={{ fontFamily: BODY }}
                    >
                      <span className="mt-0.5 shrink-0" style={{ color: ORANGE }}>
                        &#10003;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <p
                  className="mb-1 pt-5 text-xs italic text-white/30"
                  style={{ fontFamily: BODY, borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <span className="font-semibold text-white/50">Best for:</span> {tier.bestFor}
                </p>
                <p className="mb-6 text-xs text-white/25" style={{ fontFamily: BODY }}>
                  {tier.support}
                </p>

                <Link
                  href="/web/brief"
                  className={`cta-shine block rounded-full text-center font-semibold text-white transition-all duration-300 hover:scale-[1.02] ${
                    tier.recommended ? "" : "border border-white/10 hover:border-white/20"
                  }`}
                  style={{
                    fontFamily: HEADING,
                    padding: "14px",
                    fontSize: "13px",
                    letterSpacing: "0.05em",
                    ...(tier.recommended
                      ? { background: GRADIENT, boxShadow: GRADIENT_SHADOW }
                      : { background: "rgba(255,255,255,0.03)" }),
                  }}
                >
                  Get a free audit &rarr;
                </Link>
              </div>
            ))}
          </div>

          {/* The honest answer for anything past the ceiling. */}
          <div
            className="rounded-xl border border-white/[0.07] p-5 text-sm leading-relaxed text-white/50"
            style={{ background: "rgba(255,255,255,0.02)", fontFamily: BODY }}
          >
            {OVER_CEILING_NOTE}
          </div>
        </div>
      </Section>

      {/* ── RETAINER ── */}
      <Section>
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-3 text-2xl font-bold italic md:text-3xl lg:text-4xl"
            style={{ fontFamily: HEADING }}
          >
            After the build
          </h2>
          <p className="mb-8 max-w-xl text-sm text-white/45" style={{ fontFamily: BODY }}>
            Not required, and we bring it up during scoping rather than at handoff so it is never a
            surprise.
          </p>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
            <span className="mb-1 block text-lg font-bold italic" style={{ fontFamily: HEADING }}>
              {RETAINER.name}
            </span>
            <span
              className="mb-4 block text-xs uppercase tracking-[0.15em]"
              style={{ fontFamily: BODY, color: ORANGE }}
            >
              {RETAINER.kicker}
            </span>

            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-4xl font-bold italic md:text-5xl" style={{ fontFamily: HEADING }}>
                {fmt(RETAINER.priceFrom)}
              </span>
              <span className="text-lg text-white/35" style={{ fontFamily: HEADING }}>
                to {fmt(RETAINER.priceTo)}
              </span>
            </div>
            <span className="mb-5 block text-xs text-white/30" style={{ fontFamily: BODY }}>
              {RETAINER.priceSub}
            </span>

            <p className="mb-6 text-sm italic text-white/50" style={{ fontFamily: BODY }}>
              {RETAINER.tagline}
            </p>

            <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {RETAINER.features.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-white/50"
                  style={{ fontFamily: BODY }}
                >
                  <span className="mt-0.5 shrink-0" style={{ color: ORANGE }}>
                    &#10003;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── MEDIA ── */}
      <Section>
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-3 text-2xl font-bold italic md:text-3xl lg:text-4xl"
            style={{ fontFamily: HEADING }}
          >
            Media, by the day
          </h2>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-white/45" style={{ fontFamily: BODY }}>
            A shoot day is a different product from a project, so it is priced like one. This is the one
            thing on this page that sits below our {fmt(FLOOR)} project floor, and that is on purpose.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {MEDIA.map((m) => (
              <div key={m.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <span className="mb-3 block text-base font-bold italic" style={{ fontFamily: HEADING }}>
                  {m.name}
                </span>
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold italic" style={{ fontFamily: HEADING }}>
                    {fmt(m.priceFrom)}
                  </span>
                </div>
                <span className="mb-4 block text-xs text-white/30" style={{ fontFamily: BODY }}>
                  {m.priceSub}
                </span>
                <p className="text-sm leading-relaxed text-white/50" style={{ fontFamily: BODY }}>
                  {m.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── HOW WE WORK / OBJECTIONS ── */}
      <Section>
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-8 text-2xl font-bold italic md:text-3xl lg:text-4xl"
            style={{ fontFamily: HEADING }}
          >
            The parts people ask about
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              {
                q: "Why is there a floor?",
                a: `Below ${fmt(FLOOR)} we cannot do the research, design, and testing that makes the work pay for itself, and a cheap job that does not work is more expensive than no job. We would rather point you somewhere honest than take it.`,
              },
              {
                q: "What decides where in the range I land?",
                a: "How many moments are leaking, how many surfaces the brand has to reach, and whether the content and photography exist yet. The audit answers all three before we quote.",
              },
              {
                q: "Do I have to take the retainer?",
                a: "No. Every build ends with a working thing you own and a recorded walkthrough. The retainer is for businesses that would rather not maintain it themselves.",
              },
              {
                q: "What if I only need one thing?",
                a: "Then you want The Fix, and we will say so. Selling you a Build you do not need is how a studio gets one project instead of a decade of them.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <dt
                  className="mb-2 text-base font-bold italic text-white"
                  style={{ fontFamily: HEADING }}
                >
                  {item.q}
                </dt>
                <dd className="text-sm leading-relaxed text-white/50" style={{ fontFamily: BODY }}>
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/12 px-6 py-3.5 text-center text-[13px] font-semibold tracking-[0.05em] text-white/70 transition-all duration-300 hover:border-[#EA9A61]/50 hover:text-white"
              style={{ fontFamily: HEADING, background: "rgba(255,255,255,0.03)" }}
            >
              Book a 15-minute call
            </a>
            <Link
              href="/report"
              className="rounded-full border border-white/12 px-6 py-3.5 text-center text-[13px] font-semibold tracking-[0.05em] text-white/70 transition-all duration-300 hover:border-[#EA9A61]/50 hover:text-white"
              style={{ fontFamily: HEADING, background: "rgba(255,255,255,0.03)" }}
            >
              Get a free visibility report
            </Link>
          </div>
        </div>
      </Section>

      {/* ── CLOSING LEAD FORM ── */}
      <ServiceLeadSection
        source="pricing"
        heading="Not sure which one you are?"
        subheading="Tell us what is going on and we will tell you which tier it is, or that you do not need us yet. Both answers are free."
        messagePlaceholder="What is happening now, and what you wish were happening instead..."
        submitLabel="Tell us what you need"
      />

      <NavigationDock />
      <Footer />
    </main>
  );
}
