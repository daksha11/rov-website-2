"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const tiers = [
  {
    name: "Digital Storefront",
    price: 2000,
    pages: "3-page website",
    featured: false,
    tagline: "Your professional foundation — live in weeks, not months.",
    bestFor: "Businesses that need a professional online presence now",
    support: "30-day post-launch support",
    revisions: "1 revision round",
    features: [
      "Custom 3-page website",
      "Mobile-responsive design",
      "Basic SEO setup",
      "Contact form + Calendly integration",
      "Google Analytics",
      "Sub-3-second load speed",
    ],
  },
  {
    name: "Conversion Engine",
    price: 5000,
    pages: "10-page website",
    featured: true,
    tagline: "Designed to capture leads and close deals while you sleep.",
    bestFor: "Growth-stage businesses that need their site to generate leads",
    support: "60-day post-launch support",
    revisions: "2 revision rounds",
    features: [
      "Custom 10-page website",
      "Scroll-triggered animations (GSAP)",
      "Lead capture system",
      "Blog / CMS integration",
      "Core Web Vitals optimized",
      "CRM integration",
      "Conversion tracking",
    ],
  },
  {
    name: "Revenue Platform",
    price: 10000,
    pages: "Full platform",
    featured: false,
    tagline: "Your website becomes a revenue machine with real analytics.",
    bestFor: "Businesses ready to turn their website into a revenue machine",
    support: "90-day support + monthly reports",
    revisions: "Unlimited revisions",
    features: [
      "Everything in Conversion Engine",
      "E-commerce or booking system",
      "Custom 3D / motion / parallax effects",
      "Advanced analytics dashboard",
      "A/B testing framework",
      "API integrations",
      "SEO strategy (5 target keywords)",
    ],
  },
];

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export default function WebPricingTiers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
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
          Investment
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-12"
          style={{ fontFamily: HEADING }}
        >
          Built to Convert
        </motion.h2>

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
                  ? "border-[#EA9A61]/30 bg-[#EA9A61]/[0.04] md:scale-[1.02]"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {/* Recommended badge */}
              {tier.featured && (
                <span
                  className="absolute -top-3 left-6 rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/15 px-3 py-0.5 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-[#EA9A61]"
                  style={{ fontFamily: BODY }}
                >
                  Recommended
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
                <span
                  className="text-white text-4xl md:text-5xl font-bold italic"
                  style={{ fontFamily: HEADING }}
                >
                  {fmt(tier.price)}
                </span>
              </div>
              <span
                className="text-white/30 text-xs mb-2"
                style={{ fontFamily: BODY }}
              >
                one-time project fee
              </span>

              {/* Page count accent */}
              <span
                className="text-[#EA9A61] text-xs uppercase tracking-[0.15em] mb-6"
                style={{ fontFamily: BODY }}
              >
                {tier.pages}
              </span>

              {/* Features */}
              <ul className="flex-1 space-y-2 mb-6">
                {tier.features.map((item) => (
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

              {/* Support & revisions */}
              <div
                className="text-white/25 text-[clamp(0.7rem,1.5vw,0.75rem)] space-y-1 mb-6"
                style={{ fontFamily: BODY }}
              >
                <p>{tier.revisions}</p>
                <p>{tier.support}</p>
              </div>

              {/* Best for */}
              <p
                className="text-white/30 text-xs italic mb-6"
                style={{ fontFamily: BODY }}
              >
                {tier.bestFor}
              </p>

              {/* CTA */}
              <a
                href="https://calendly.com/rangeofviewmusic/30min"
                target="_blank"
                rel="noopener noreferrer"
                className={`cta-shine block text-center text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] ${
                  tier.featured
                    ? ""
                    : "border border-white/10 hover:border-white/20"
                }`}
                style={{
                  fontFamily: HEADING,
                  padding: "14px",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  ...(tier.featured
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

        {/* Market comparison bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.5 }}
          className="flex items-center justify-center gap-6 md:gap-10 flex-wrap rounded-xl border border-white/[0.06] px-6 py-4"
          style={{ background: "rgba(255,255,255,0.02)", fontFamily: BODY }}
        >
          <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
            Market rate:{" "}
            <span className="text-white/50 font-medium">$3,000 – $20,000</span>
          </span>
          <span className="hidden md:block w-px h-4 bg-white/10" />
          <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
            ROV:{" "}
            <span className="text-[#EA9A61] font-semibold">
              $2,000 – $10,000
            </span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
