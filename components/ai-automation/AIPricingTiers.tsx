"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const tiers = [
  {
    name: "Smart Start",
    buildFee: 3000,
    retainer: 500,
    workflows: "1 workflow",
    integrations: "3 tool integrations",
    featured: false,
    tagline: "Automate your first repetitive process and see the ROI.",
    bestFor: "Businesses automating their first repetitive process",
    features: [
      "1 automated workflow",
      "3 tool integrations",
      "AI-powered component",
      "Documentation + training video",
    ],
    support: "1 month free management",
  },
  {
    name: "Revenue Autopilot",
    buildFee: 7000,
    retainer: 1000,
    workflows: "3 connected workflows",
    integrations: "7 tool integrations",
    featured: true,
    tagline: "Connect your systems. Let AI handle the middle.",
    bestFor:
      "Teams ready to connect multiple systems and let AI handle the middle",
    features: [
      "3 connected workflows",
      "AI in each workflow",
      "7 tool integrations",
      "Human-in-the-loop checkpoints",
      "Weekly performance reports",
      "2 training sessions",
    ],
    support: "60-day support + 1 month free management",
  },
  {
    name: "Business Operating System",
    buildFee: 12000,
    retainer: 2000,
    workflows: "7 workflows",
    integrations: "All tool integrations",
    featured: false,
    tagline: "AI running your back-office so you can run your business.",
    bestFor: "Businesses that want AI running their back-office operations",
    features: [
      "Full operations audit + 7 workflows",
      "AI decision-making layer",
      "Custom analytics dashboard",
      "All tool integrations",
      "Quarterly optimization review",
    ],
    support: "90-day support + 1 month free management",
  },
];

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export default function AIPricingTiers({ onUnlock }: { onUnlock?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Triple-click the market bar ROV text to reveal the calculator
  const handleSecretClick = useCallback(() => {
    clickCount.current++;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      onUnlock?.();
    } else {
      clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 600);
    }
  }, [onUnlock]);

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
          AI Investment
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-4"
          style={{ fontFamily: HEADING }}
        >
          Automate the Grind
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.15 }}
          className="text-white/40 text-sm mb-12 max-w-lg"
          style={{ fontFamily: BODY }}
        >
          All tiers include 1 month free management. Retainer is optional after
          the free period.
        </motion.p>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-10">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.2 + i * 0.1 }}
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

              {/* ── Dual-price block ── */}
              {/* Row 1: Build fee (dominant) */}
              <div className="flex items-baseline gap-1 mb-1">
                <span
                  className="text-white text-4xl md:text-5xl font-bold italic"
                  style={{ fontFamily: HEADING }}
                >
                  {fmt(tier.buildFee)}
                </span>
              </div>
              <span
                className="text-white/30 text-xs mb-3"
                style={{ fontFamily: BODY }}
              >
                one-time build fee
              </span>

              {/* Row 2: Retainer pill */}
              <span
                className="inline-flex items-center self-start gap-1.5 rounded-full border border-[#EA9A61]/20 bg-[#EA9A61]/[0.06] px-3 py-1 text-xs text-[#EA9A61] font-semibold mb-1.5"
                style={{ fontFamily: BODY }}
              >
                + {fmt(tier.retainer)}/mo retainer
              </span>

              {/* Row 3: Free month hook */}
              <span
                className="text-[#EA9A61]/60 text-[clamp(0.7rem,1.5vw,0.75rem)] mb-6"
                style={{ fontFamily: BODY }}
              >
                1 month free &middot; retainer optional after
              </span>

              {/* Workflow + integration stats */}
              <div
                className="flex items-center gap-3 mb-6 text-xs"
                style={{ fontFamily: BODY }}
              >
                <span className="text-white/50 uppercase tracking-[0.1em]">
                  {tier.workflows}
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span className="text-[#EA9A61] uppercase tracking-[0.1em]">
                  {tier.integrations}
                </span>
              </div>

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

              {/* Support */}
              <div
                className="text-white/25 text-[clamp(0.7rem,1.5vw,0.75rem)] mb-6"
                style={{ fontFamily: BODY }}
              >
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
          transition={{ ...spring, delay: 0.55 }}
          className="flex items-center justify-center gap-6 md:gap-10 flex-wrap rounded-xl border border-white/[0.06] px-6 py-4"
          style={{ background: "rgba(255,255,255,0.02)", fontFamily: BODY }}
        >
          <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
            Market rate:{" "}
            <span className="text-white/50 font-medium">
              $5,000 – $25,000+
            </span>
          </span>
          <span className="hidden md:block w-px h-4 bg-white/10" />
          <span
            className="text-white/30 text-xs uppercase tracking-[0.15em] cursor-default select-none"
            onClick={handleSecretClick}
          >
            ROV:{" "}
            <span className="text-[#EA9A61] font-semibold">
              $3,000 – $12,000
            </span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
