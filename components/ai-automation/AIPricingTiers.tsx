"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function AIPricingTiers({ onUnlock }: { onUnlock?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          AI Systems
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-4"
          style={{ fontFamily: HEADING }}
        >
          Stop being the glue. Build the system.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.15 }}
          className="text-white/40 text-sm mb-12 max-w-lg"
          style={{ fontFamily: BODY }}
        >
          Your business has revenue leaks &mdash; slow follow-ups, lost leads,
          manual work eating your hours. We find them and build AI-powered
          systems that fix them permanently.
        </motion.p>

        {/* Tier cards — 2 column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10">
          {/* Card 1: AI Chatbot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.2 }}
            className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8 flex flex-col"
          >
            <span
              className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/40 mb-4"
              style={{ fontFamily: BODY }}
            >
              Your 24/7 front desk
            </span>

            <span
              className="text-white text-lg font-bold italic mb-4"
              style={{ fontFamily: HEADING }}
            >
              AI Chatbot
            </span>

            {/* Price with strikethrough */}
            <div className="flex items-baseline gap-4 mb-1">
              <span
                className="text-white text-4xl md:text-5xl font-bold italic"
                style={{ fontFamily: HEADING }}
              >
                $500
              </span>
              <span
                className="text-white/30 text-sm line-through"
                style={{ fontFamily: BODY }}
              >
                $2,000
              </span>
            </div>
            <span
              className="text-white/30 text-xs mb-3"
              style={{ fontFamily: BODY }}
            >
              One-time setup fee
            </span>

            {/* Retainer pill */}
            <span
              className="inline-flex items-center self-start gap-1.5 rounded-full border border-[#EA9A61]/20 bg-[#EA9A61]/[0.06] px-3 py-1 text-xs text-[#EA9A61] font-semibold mb-1.5"
              style={{ fontFamily: BODY }}
            >
              + $200/mo management
            </span>
            <span
              className="text-[#EA9A61]/60 text-[clamp(0.7rem,1.5vw,0.75rem)] mb-6"
              style={{ fontFamily: BODY }}
            >
              We monitor, optimize, and report monthly
            </span>

            {/* Features */}
            <ul className="flex-1 space-y-2 mb-6">
              {[
                "Trained on your brand and voice",
                "Qualifies leads before they reach you",
                "Books calls to your calendar automatically",
                "Every conversation logged to your CRM",
                "Escalates to a human when it matters",
                "Available 24/7, no days off",
              ].map((item) => (
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

            {/* Best for */}
            <p
              className="text-white/30 text-xs italic mb-6"
              style={{ fontFamily: BODY }}
            >
              <span className="text-white/50 font-semibold">$35K/year for a receptionist.</span>{" "}
              $2,900/year for this. It never sleeps.
            </p>

            {/* CTA */}
            <a
              href="https://calendly.com/rangeofviewmusic/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-shine block text-center text-white font-semibold rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.03]"
              style={{
                fontFamily: HEADING,
                padding: "14px",
                fontSize: "13px",
                letterSpacing: "0.05em",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              Book a call &rarr;
            </a>
          </motion.div>

          {/* Card 2: Revenue Operating System */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.3 }}
            className="relative rounded-2xl border border-[#EA9A61]/30 bg-[#EA9A61]/[0.04] md:scale-[1.02] p-6 md:p-8 flex flex-col"
          >
            <span
              className="absolute -top-3 left-6 rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/15 px-3 py-0.5 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-[#EA9A61]"
              style={{ fontFamily: BODY }}
            >
              Recommended
            </span>

            <span
              className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/40 mb-4"
              style={{ fontFamily: BODY }}
            >
              Your business runs itself
            </span>

            <span
              className="text-white text-lg font-bold italic mb-4"
              style={{ fontFamily: HEADING }}
            >
              Revenue Operating System
            </span>

            {/* Price range */}
            <span
              className="text-white text-4xl md:text-5xl font-bold italic mb-1"
              style={{ fontFamily: HEADING }}
            >
              $500 &ndash; $5,000
            </span>
            <span
              className="text-white/30 text-xs mb-3"
              style={{ fontFamily: BODY }}
            >
              Build fee &mdash; scoped to your workflows and impact
            </span>

            {/* Retainer pill */}
            <span
              className="inline-flex items-center self-start gap-1.5 rounded-full border border-[#EA9A61]/20 bg-[#EA9A61]/[0.06] px-3 py-1 text-xs text-[#EA9A61] font-semibold mb-1.5"
              style={{ fontFamily: BODY }}
            >
              + monthly management priced on value delivered
            </span>
            <span
              className="text-[#EA9A61]/60 text-[clamp(0.7rem,1.5vw,0.75rem)] mb-6"
              style={{ fontFamily: BODY }}
            >
              First month free &middot; retainer based on system complexity
            </span>

            {/* Includes prefix */}
            <p
              className="text-sm text-white/50 mb-4"
              style={{ fontFamily: BODY }}
            >
              <span className="text-[#EA9A61] font-semibold">AI Chatbot included</span>, plus:
            </p>

            {/* Features */}
            <ul className="flex-1 space-y-2 mb-6">
              {[
                "Audit every workflow that\u2019s costing you money",
                "Automate the repetitive tasks your team hates doing",
                "Recover revenue that was falling through the cracks",
                "Lead gen, outreach, and follow-up on autopilot",
                "All your tools connected into one system",
                "No lead goes cold at day 3, 7, 14, or 30",
                "60-day onboarding and team training included",
              ].map((item) => (
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

            {/* Best for */}
            <p
              className="text-white/30 text-xs italic mb-6"
              style={{ fontFamily: BODY }}
            >
              <span className="text-white/50 font-semibold">A VA costs $4K/mo and quits.</span>{" "}
              This doesn&apos;t.
            </p>

            {/* CTA */}
            <a
              href="https://calendly.com/rangeofviewmusic/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-shine block text-center text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03]"
              style={{
                fontFamily: HEADING,
                padding: "14px",
                fontSize: "13px",
                letterSpacing: "0.05em",
                background:
                  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                boxShadow:
                  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
              }}
            >
              Book a call &rarr;
            </a>
          </motion.div>
        </div>

        {/* Market comparison bar — what you'd pay without us */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.45 }}
          className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] px-6 py-5"
          style={{ background: "rgba(255,255,255,0.02)", fontFamily: BODY }}
        >
          <span className="text-white/30 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.15em] font-semibold">
            What you&apos;d pay without us
          </span>
          <div
            className="flex items-center justify-center gap-6 md:gap-10 flex-wrap cursor-default select-none"
            onClick={handleSecretClick}
          >
            <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
              Receptionist:{" "}
              <span className="text-white/50 font-medium">$35K+/year</span>
            </span>
            <span className="hidden md:block w-px h-4 bg-white/10" />
            <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
              VA:{" "}
              <span className="text-white/50 font-medium">$36K–$48K/year</span>
            </span>
            <span className="hidden md:block w-px h-4 bg-white/10" />
            <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
              Marketing agency:{" "}
              <span className="text-white/50 font-medium">$60K+/year</span>
            </span>
          </div>
          <span className="text-[#EA9A61] text-sm font-semibold mt-1">
            ROV Revenue OS: $5,000 build + $12,000/year = $17,000 total
          </span>
        </motion.div>
      </div>
    </section>
  );
}
