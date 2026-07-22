"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { checkoutHref, type CheckoutKey } from "@/data/soundPricing";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const tiers: {
  name: string;
  price: number;
  songs: number;
  effective: number;
  turnaround: string;
  tagline: string;
  featured: boolean;
  checkoutKey: CheckoutKey;
}[] = [
  {
    name: "Starter",
    price: 145,
    songs: 5,
    effective: 29,
    turnaround: "48hr",
    tagline: "5 songs a month. Under $30 each.",
    featured: false,
    checkoutKey: "sub_starter",
  },
  {
    name: "Standard",
    price: 300,
    songs: 12,
    effective: 25,
    turnaround: "48hr",
    tagline: "The consistent dropper. Three a week.",
    featured: true,
    checkoutKey: "sub_standard",
  },
  {
    name: "Pro",
    price: 500,
    songs: 18,
    effective: 27.78,
    turnaround: "24hr priority",
    tagline: "Album mode. 18 songs. 24 hours, not 48.",
    featured: false,
    checkoutKey: "sub_pro",
  },
];

const inclusions = [
  "Professional mix + master (both)",
  "2 revisions per song",
  "Social media optimized versions",
];

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function PricingTiers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ padding: "clamp(20px, 4vw, 40px) clamp(16px, 5vw, 60px) clamp(60px, 10vw, 100px)" }}
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
          Pricing
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-12"
          style={{ fontFamily: HEADING }}
        >
          Pick Your Lane
        </motion.h2>

        {/* One-off — no subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.15 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-7 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
        >
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-5">
            <div className="flex items-baseline gap-2">
              <span className="text-white text-3xl md:text-4xl font-bold italic" style={{ fontFamily: HEADING }}>
                $120
              </span>
              <span className="text-white/30 text-sm" style={{ fontFamily: BODY }}>/song</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/80 text-sm font-semibold" style={{ fontFamily: BODY }}>
                One song, no subscription
              </span>
              <span className="text-white/40 text-xs" style={{ fontFamily: BODY }}>
                Full mix + master &middot; 72hr turnaround &middot; 2 revisions
              </span>
            </div>
          </div>
          <a
            href={checkoutHref("oneoff")}
            className="shrink-0 text-center text-white font-semibold rounded-full border border-white/10 hover:border-white/25 transition-all duration-300 hover:scale-[1.03]"
            style={{ fontFamily: HEADING, padding: "12px 28px", fontSize: "13px", letterSpacing: "0.05em", background: "rgba(255,255,255,0.03)" }}
          >
            Send one song &rarr;
          </a>
        </motion.div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-10">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.15 + i * 0.1 }}
              className={`relative rounded-2xl border p-6 md:p-8 flex flex-col ${
                tier.featured
                  ? "border-[#EA9A61]/30 bg-[#EA9A61]/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {/* Featured badge */}
              {tier.featured && (
                <span
                  className="absolute -top-3 left-6 rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/15 px-3 py-0.5 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-[#EA9A61]"
                  style={{ fontFamily: BODY }}
                >
                  Most Popular
                </span>
              )}

              {/* Tier name */}
              <span
                className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/40 mb-4"
                style={{ fontFamily: BODY }}
              >
                {tier.name}
              </span>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-white text-4xl md:text-5xl font-bold italic" style={{ fontFamily: HEADING }}>
                  {fmt(tier.price)}
                </span>
                <span className="text-white/30 text-sm" style={{ fontFamily: BODY }}>/mo</span>
              </div>

              {/* Effective rate */}
              <span className="text-white/30 text-xs mb-4" style={{ fontFamily: BODY }}>
                {tier.songs} songs/month &middot; ${tier.effective.toFixed(tier.effective % 1 === 0 ? 0 : 2)}/song
              </span>

              {/* Turnaround */}
              <span className="text-[#EA9A61] text-xs uppercase tracking-[0.15em] mb-6" style={{ fontFamily: BODY }}>
                {tier.turnaround} turnaround
              </span>

              {/* Inclusions */}
              <ul className="flex-1 space-y-2 mb-6">
                {inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-white/50 text-sm" style={{ fontFamily: BODY }}>
                    <span className="text-[#EA9A61] mt-0.5 shrink-0">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Tagline */}
              <p className="text-white/30 text-xs italic mb-6" style={{ fontFamily: BODY }}>
                {tier.tagline}
              </p>

              {/* CTA */}
              <a
                href={checkoutHref(tier.checkoutKey)}
                className={`cta-shine block text-center text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] ${
                  tier.featured ? "" : "border border-white/10 hover:border-white/20"
                }`}
                style={{
                  fontFamily: HEADING,
                  padding: "14px",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  ...(tier.featured
                    ? {
                        background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                        boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                      }
                    : { background: "rgba(255,255,255,0.03)" }),
                }}
              >
                Start {tier.name} &rarr;
              </a>
            </motion.div>
          ))}
        </div>

        {/* Fine print */}
        <div className="text-white/55 text-[clamp(0.7rem,1.5vw,0.75rem)] leading-relaxed space-y-1" style={{ fontFamily: BODY }}>
          <p>Overages beyond your tier cap: $65/song. Unused songs don&apos;t roll over.</p>
          <p>Cancel anytime, effective end of billing cycle. Same rate guaranteed if you reactivate within 90 days.</p>
          <p>Payments via Stripe.</p>
        </div>
      </div>
    </section>
  );
}
