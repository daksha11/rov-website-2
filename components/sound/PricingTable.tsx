"use client";

// The full rate card, in one place.
//
// The home page sells across four acts and prices appear in four different
// sections, which is fine for someone being walked through it but useless for
// someone who just wants to compare. This is that page.
//
// Everything here reads from data/soundPricing.ts, so the rate card has exactly
// one source of truth and this page can never drift from what the CTAs charge.

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  CONSULT_BOOKING_URL,
  CAL_LINKS,
  checkout,
  checkoutHref,
  unitRate,
  type CheckoutKey,
} from "@/data/soundPricing";
import { FOUNDATION_PRICE } from "@/data/artistReadiness";
import CalBookButton from "@/components/sound/CalBookButton";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";

function money(n: number) {
  return "$" + n.toLocaleString("en-US");
}

interface Row {
  key: CheckoutKey;
  name: string;
  note: string;
  /** Rendered with the accent border and a tag. */
  featured?: boolean;
  tag?: string;
  /** Booked rather than bought, so the CTA is a Cal event. */
  calLink?: string;
}

const MIXING: Row[] = [
  { key: "mix_first", name: "Your first mix", note: "One song, so you can hear it before committing to anything. Once per artist.", featured: true, tag: "Start here" },
  { key: "mix_single", name: "Single song", note: "Mix and master, 48-hour turnaround, 2 revisions." },
  { key: "mix_3", name: "3-pack", note: "Prepaid, no expiry. Use them whenever you're ready." },
  { key: "mix_6", name: "6-pack", note: "Buying five singles? This costs less than that." },
  { key: "mix_12", name: "12-pack", note: "The lowest per-song rate we do." },
];

const RECORDING: Row[] = [
  { key: "rec_hour", name: "Hourly", note: "Room, engineer, and every stem from the session.", calLink: CAL_LINKS.hourlySession },
  { key: "rec_2hr", name: "2-hour block", note: "Enough for one song, start to finished.", calLink: CAL_LINKS.hourlySession },
  { key: "rec_4hr", name: "4-hour block", note: "Usually two to three finished songs. Our lowest hourly rate.", featured: true, tag: "Best value", calLink: CAL_LINKS.finishedSingle },
];

const CREATIVE: Row[] = [
  { key: "cover_system", name: "Cover art system + first cover", note: "We design the rule once: type, position, color, photo treatment. Every future cover comes from it.", featured: true, tag: "Do this first" },
  { key: "cover_extra", name: "Each cover after that", note: "An hour's work once the system exists, so it's priced like one." },
  { key: "shorts", name: "Content run", note: "20 shorts plus 5 lyric videos, planned and cut. More on request." },
];

export default function PricingTable() {
  return (
    <div className="bg-black">
      <Hero />
      <Section
        eyebrow="Mixing"
        title="Send us your stems"
        blurb="Everything includes the master and two revisions. Packs are prepaid and never expire, so you're buying a rate, not a deadline."
        rows={MIXING}
        anchor="mixing"
      />
      <Section
        eyebrow="Recording"
        title="Come to the room"
        blurb="Every rate below includes the full mix and master. Most rooms in Atlanta charge you for the hour and then bill mixing separately. You leave here finished."
        rows={RECORDING}
        anchor="recording"
        footnote="Students may be eligible for additional discounts. Get in touch."
      />
      <Section
        eyebrow="Creative"
        title="The rest of the release"
        blurb="Cover art is sold as a system rather than one image at a time, because six singles that look like they belong together is what makes a page read as a catalog."
        rows={CREATIVE}
        anchor="creative"
      />
      <FoundationRow />
      <Closer />
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: "clamp(90px, 13vw, 150px) clamp(16px, 5vw, 60px) clamp(40px, 6vw, 70px)" }}
    >
      <div
        aria-hidden
        className="absolute left-1/2 -top-20 -translate-x-1/2 w-[900px] h-[420px] rounded-full pointer-events-none blur-[130px]"
        style={{ background: "radial-gradient(ellipse, rgba(234,154,97,0.10) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <span
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-4"
          style={{ fontFamily: BODY }}
        >
          Pricing
        </span>
        <h1
          className="text-white text-4xl md:text-6xl font-bold italic leading-[1.02] mb-5"
          style={{ fontFamily: HEADING }}
        >
          Every rate, on one page.
        </h1>
        <p
          className="text-white/45 text-base md:text-lg leading-relaxed max-w-xl mx-auto"
          style={{ fontFamily: BODY }}
        >
          No quote required to see a number, no discount you have to negotiate for. The
          price drops when you buy more, and the table below is the whole table.
        </p>
      </div>
    </section>
  );
}

function Section({
  eyebrow,
  title,
  blurb,
  rows,
  anchor,
  footnote,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  rows: Row[];
  anchor: string;
  footnote?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      id={anchor}
      className="scroll-mt-24 relative"
      style={{ padding: "clamp(40px, 7vw, 80px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3"
          style={{ fontFamily: BODY }}
        >
          {eyebrow}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.06 }}
          className="text-white text-2xl md:text-4xl font-bold italic mb-3"
          style={{ fontFamily: HEADING }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-white/45 text-sm md:text-base leading-relaxed max-w-2xl mb-9"
          style={{ fontFamily: BODY }}
        >
          {blurb}
        </motion.p>

        <div className="flex flex-col gap-2.5">
          {rows.map((row, i) => (
            <PriceRow key={row.key} row={row} delay={0.14 + i * 0.05} inView={inView} />
          ))}
        </div>

        {footnote && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ ...spring, delay: 0.4 }}
            className="text-white/40 text-xs md:text-sm mt-6"
            style={{ fontFamily: BODY }}
          >
            {footnote}
          </motion.p>
        )}
      </div>
    </section>
  );
}

function PriceRow({ row, delay, inView }: { row: Row; delay: number; inView: boolean }) {
  const item = checkout[row.key];
  const per = unitRate(row.key);
  const showPer = (item.qty ?? 1) > 1;
  const perLabel = item.unit === "hr" || row.key.startsWith("rec_") ? "hr" : "song";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay }}
      className={`relative rounded-2xl border p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 ${
        row.featured
          ? "border-[#EA9A61]/30 bg-[#EA9A61]/[0.04]"
          : "border-white/[0.07] bg-white/[0.02]"
      }`}
    >
      {row.tag && (
        <span
          className="absolute -top-2.5 left-5 rounded-full border border-[#EA9A61]/40 bg-[#120D0A] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#EA9A61]"
          style={{ fontFamily: BODY }}
        >
          {row.tag}
        </span>
      )}

      <div className="flex-1 min-w-0">
        <h3
          className="text-white text-lg md:text-xl font-bold italic mb-1"
          style={{ fontFamily: HEADING }}
        >
          {row.name}
        </h3>
        <p className="text-white/45 text-xs md:text-sm leading-relaxed" style={{ fontFamily: BODY }}>
          {row.note}
        </p>
      </div>

      <div className="shrink-0 sm:text-right">
        <div className="flex items-baseline gap-1.5 sm:justify-end">
          <span
            className="text-white text-2xl md:text-3xl font-bold italic tabular-nums"
            style={{ fontFamily: HEADING }}
          >
            {money(item.amount)}
          </span>
          {item.unit === "hr" && (
            <span className="text-white/30 text-sm" style={{ fontFamily: BODY }}>
              /hr
            </span>
          )}
          {item.unit === "song" && (
            <span className="text-white/30 text-sm" style={{ fontFamily: BODY }}>
              /song
            </span>
          )}
        </div>
        {showPer && per !== null && (
          <span
            className="block text-[#EA9A61] text-xs mt-0.5 tabular-nums"
            style={{ fontFamily: BODY }}
          >
            {money(per)} a {perLabel}
          </span>
        )}
      </div>

      <div className="shrink-0 w-full sm:w-auto">
        {row.calLink ? (
          <CalBookButton
            calLink={row.calLink}
            className={`block w-full sm:w-auto text-center whitespace-nowrap font-semibold rounded-full transition-all duration-300 ${
              row.featured
                ? "cta-shine text-white hover:scale-[1.03]"
                : "text-white/80 hover:text-white border border-white/12 hover:border-[#EA9A61]/50"
            }`}
            style={{
              fontFamily: HEADING,
              padding: "11px 22px",
              fontSize: "13px",
              letterSpacing: "0.04em",
              ...(row.featured
                ? { background: GRADIENT, boxShadow: GRADIENT_SHADOW }
                : { background: "rgba(255,255,255,0.03)" }),
            }}
          >
            Book
          </CalBookButton>
        ) : (
          <a
            href={checkoutHref(row.key)}
            className={`block w-full sm:w-auto text-center whitespace-nowrap font-semibold rounded-full transition-all duration-300 ${
              row.featured
                ? "cta-shine text-white hover:scale-[1.03]"
                : "text-white/80 hover:text-white border border-white/12 hover:border-[#EA9A61]/50"
            }`}
            style={{
              fontFamily: HEADING,
              padding: "11px 22px",
              fontSize: "13px",
              letterSpacing: "0.04em",
              ...(row.featured
                ? { background: GRADIENT, boxShadow: GRADIENT_SHADOW }
                : { background: "rgba(255,255,255,0.03)" }),
            }}
          >
            Get it
          </a>
        )}
      </div>
    </motion.div>
  );
}

function FoundationRow() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      id="foundation"
      className="scroll-mt-24 relative"
      style={{ padding: "clamp(40px, 7vw, 80px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={spring}
          className="rounded-2xl border border-[#EA9A61]/30 bg-[#EA9A61]/[0.04] p-6 md:p-9"
        >
          <span
            className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3"
            style={{ fontFamily: BODY }}
          >
            The backend
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6">
            <h2
              className="text-white text-2xl md:text-4xl font-bold italic leading-tight max-w-lg"
              style={{ fontFamily: HEADING }}
            >
              Foundation. Everything a career needs that a mix doesn&apos;t cover.
            </h2>
            <div className="shrink-0">
              <span
                className="text-white text-4xl md:text-5xl font-bold italic tabular-nums"
                style={{ fontFamily: HEADING }}
              >
                {money(FOUNDATION_PRICE)}
              </span>
              <span className="block text-white/35 text-xs mt-1" style={{ fontFamily: BODY }}>
                one time, yours forever
              </span>
            </div>
          </div>

          <p
            className="text-white/50 text-sm md:text-base leading-relaxed max-w-2xl mb-7"
            style={{ fontFamily: BODY }}
          >
            Website, EPK, release hub with email capture, booking and lead forms, your
            metadata and split sheet system, tech rider, and a stem vault we hold for you.
            Bought piece by piece this runs well over a thousand dollars, and most artists
            never buy any of it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <CalBookButton
              calLink={CONSULT_BOOKING_URL}
              className="cta-shine block text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.03]"
              style={{
                fontFamily: HEADING,
                padding: "13px 30px",
                fontSize: "13px",
                letterSpacing: "0.05em",
                background: GRADIENT,
                boxShadow: GRADIENT_SHADOW,
              }}
            >
              Start with a call &rarr;
            </CalBookButton>
            <Link
              href="/#audit"
              className="block text-center text-white/80 hover:text-white font-semibold rounded-full border border-white/12 hover:border-[#EA9A61]/50 transition-all duration-300"
              style={{
                fontFamily: HEADING,
                padding: "13px 30px",
                fontSize: "13px",
                letterSpacing: "0.05em",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              See what you&apos;re missing
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Closer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{ padding: "clamp(30px, 5vw, 50px) clamp(16px, 5vw, 60px) clamp(80px, 11vw, 130px)" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={spring}
        className="max-w-4xl mx-auto rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 md:p-7"
      >
        <span
          className="block text-[11px] uppercase tracking-[0.25em] text-white/35 mb-3"
          style={{ fontFamily: BODY }}
        >
          What we don&apos;t sell
        </span>
        <p className="text-white/45 text-sm leading-relaxed mb-4" style={{ fontFamily: BODY }}>
          No label services, no radio promo, no booking agency, no publishing
          administration. We refer out for publishing admin and anything contractual,
          because you want a lawyer for that, not a studio.
        </p>
        <p className="text-white/35 text-xs leading-relaxed" style={{ fontFamily: BODY }}>
          Full projects, EPs, and roster work are quoted rather than listed. If your
          release doesn&apos;t look like anything above, that&apos;s normal, just{" "}
          <a
            href="mailto:stems@rovstudios.com"
            className="text-[#EA9A61]/80 hover:text-[#EA9A61] underline underline-offset-4 transition-colors"
          >
            email us
          </a>
          .
        </p>
      </motion.div>
    </section>
  );
}
