"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useRef } from "react";
import MarketRateTooltip from "@/components/common/MarketRateTooltip";

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
          Pricing
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

        {/* Tier cards — stacked vertically, custom build first */}
        <div className="flex flex-col gap-5 mb-10 max-w-4xl mx-auto">

          {/* Card 1: Revenue Leak Fix — CUSTOM BUILD (hero) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              padding: 1,
              background:
                "linear-gradient(135deg, rgba(234,154,97,0.55) 0%, rgba(234,154,97,0.12) 45%, rgba(234,154,97,0.02) 100%)",
            }}
          >
            <div
              className="relative rounded-[15px] p-6 md:p-9 flex flex-col"
              style={{
                background:
                  "linear-gradient(160deg, rgba(30,26,23,1) 0%, rgba(12,10,9,1) 100%)",
              }}
            >
              <div
                className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-25 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(234,154,97,0.45) 0%, transparent 65%)",
                }}
              />

              <div className="relative z-10 flex flex-col">
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#EA9A61] font-semibold"
                    style={{ fontFamily: BODY }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#EA9A61]" />
                    Custom build
                  </span>
                  <span
                    className="text-white/30 text-[10px] uppercase tracking-[0.2em]"
                    style={{ fontFamily: BODY }}
                  >
                    Scoped to your business
                  </span>
                </div>

                <span
                  className="text-white text-2xl md:text-3xl lg:text-[2.25rem] font-bold italic leading-[1.05] mb-2"
                  style={{ fontFamily: HEADING }}
                >
                  Revenue Leak Fix
                </span>
                <p
                  className="text-sm md:text-base italic leading-snug mb-6 max-w-lg"
                  style={{ fontFamily: HEADING, color: "rgba(255,255,255,0.6)" }}
                >
                  We audit your workflows, find the leaks, and build AI systems
                  to fix them — tailored to exactly what your business needs.
                </p>

                <span
                  className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-3"
                  style={{ fontFamily: BODY }}
                >
                  Examples of what we build
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
                  {[
                    { icon: "⚡", label: "Lead routing & instant response" },
                    { icon: "📧", label: "Email & follow-up sequences" },
                    { icon: "🔗", label: "CRM sync & data pipelines" },
                    { icon: "🧠", label: "Internal AI assistants" },
                    { icon: "📊", label: "Dashboards & reporting" },
                    { icon: "⚙️", label: "Custom workflow engines" },
                  ].map((cap) => (
                    <div
                      key={cap.label}
                      className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.015] px-3 py-2"
                    >
                      <span className="text-sm">{cap.icon}</span>
                      <span
                        className="text-white/70 text-[13px]"
                        style={{ fontFamily: BODY }}
                      >
                        {cap.label}
                      </span>
                    </div>
                  ))}
                </div>

                <p
                  className="text-white/40 text-xs italic mb-6"
                  style={{ fontFamily: BODY }}
                >
                  Or something completely different — tell us the pain, we&apos;ll
                  design the system.
                </p>

                <div className="h-px w-full bg-[#EA9A61]/10 mb-5" />

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
                  <div>
                    <span
                      className="text-white/40 text-[10px] uppercase tracking-[0.2em] block mb-1"
                      style={{ fontFamily: BODY }}
                    >
                      Investment
                    </span>
                    <span
                      className="text-white text-3xl md:text-4xl font-bold italic leading-none block"
                      style={{ fontFamily: HEADING }}
                    >
                      From $500
                    </span>
                    <span
                      className="text-xs block mt-1"
                      style={{ fontFamily: BODY, color: "rgba(255,255,255,0.4)" }}
                    >
                      Build fee &middot; scoped per project &middot; + value-based retainer
                    </span>
                  </div>

                  <span
                    className="inline-flex items-center self-start sm:self-auto gap-1.5 rounded-full border border-[#EA9A61]/30 bg-[#EA9A61]/10 px-3 py-1.5 text-[11px] text-[#EA9A61] font-semibold"
                    style={{ fontFamily: BODY }}
                  >
                    First month free
                  </span>
                </div>

                <a
                  href="https://cal.com/rov-studios-imhphw/15min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-shine inline-flex items-center justify-center gap-2 text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] w-full"
                  style={{
                    fontFamily: HEADING,
                    padding: "15px",
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background:
                      "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                    boxShadow:
                      "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Book a free discovery call
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Card 2: AI Chatbot — PACKAGED PRODUCT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.3 }}
            className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 flex flex-col"
          >
            <span
              className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/50 mb-4"
              style={{ fontFamily: BODY }}
            >
              <span className="w-1 h-1 rounded-full bg-white/50" />
              Off-the-shelf product
            </span>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Left: name + price */}
              <div className="flex-1">
                <span
                  className="text-white text-2xl md:text-3xl font-bold italic leading-[1.05] block"
                  style={{ fontFamily: HEADING }}
                >
                  AI Chatbot
                </span>
                <span
                  className="text-sm italic block mb-4"
                  style={{ fontFamily: HEADING, color: "rgba(255,255,255,0.5)" }}
                >
                  Your 24/7 front desk.
                </span>

                <div className="flex items-baseline gap-3 mb-1">
                  <span
                    className="text-white text-4xl md:text-[2.75rem] font-bold italic leading-none"
                    style={{ fontFamily: HEADING }}
                  >
                    $500
                  </span>
                  <span
                    className="text-sm line-through"
                    style={{ fontFamily: BODY, color: "rgba(255,255,255,0.3)" }}
                  >
                    $2,000
                  </span>
                </div>
                <span
                  className="text-white/40 text-xs block mb-3"
                  style={{ fontFamily: BODY }}
                >
                  Fixed setup fee &middot; deploy in days
                </span>
                <div className="flex items-center flex-wrap gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#EA9A61]/25 bg-[#EA9A61]/[0.06] px-3 py-1 text-xs text-[#EA9A61] font-semibold"
                    style={{ fontFamily: BODY }}
                  >
                    + $200/mo
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ fontFamily: BODY, color: "rgba(255,255,255,0.4)" }}
                  >
                    Monitoring &amp; optimization
                  </span>
                </div>
              </div>

              {/* Right: features */}
              <div className="flex-1">
                <span
                  className="text-[10px] uppercase tracking-[0.2em] block mb-3"
                  style={{ fontFamily: BODY, color: "rgba(255,255,255,0.4)" }}
                >
                  What&rsquo;s included
                </span>
                <ul className="space-y-2">
                  {[
                    "Handles every inquiry with your brand\u2019s voice",
                    "Answers the questions your customers always ask",
                    "Available 24/7, no days off",
                    "Qualifies leads and books calls to your calendar",
                    "Escalates to a human when it matters",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-snug"
                      style={{ fontFamily: BODY, color: "rgba(255,255,255,0.6)" }}
                    >
                      <span className="text-[#EA9A61] mt-0.5 shrink-0">
                        &#10003;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <p
                className="text-[11px] italic"
                style={{ fontFamily: BODY, color: "rgba(255,255,255,0.4)" }}
              >
                <span
                  className="font-semibold not-italic"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  vs. $35K/yr for a receptionist.
                </span>{" "}
                $2,900/yr for a bot that never sleeps.
              </p>
              <a
                href="https://cal.com/rov-studios-imhphw/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 block text-center text-white font-semibold rounded-full border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-300"
                style={{
                  fontFamily: HEADING,
                  padding: "12px 28px",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                Deploy my chatbot &rarr;
              </a>
            </div>
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
            <MarketRateTooltip
              sources={[
                {
                  name: "Bureau of Labor Statistics — Receptionists",
                  url: "https://www.bls.gov/ooh/office-and-administrative-support/receptionists.htm",
                  detail: "BLS reports median annual wage for receptionists at ~$36,000; varies by metro area.",
                },
                {
                  name: "Indeed — Receptionist Salary Data",
                  url: "https://www.indeed.com/career/receptionist/salaries",
                  detail: "Aggregated salary data from thousands of reported positions across the U.S.",
                },
              ]}
            >
              <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
                Receptionist:{" "}
                <span className="text-white/50 font-medium">$35K+/year</span>
              </span>
            </MarketRateTooltip>
            <span className="hidden md:block w-px h-4 bg-white/10" />
            <MarketRateTooltip
              sources={[
                {
                  name: "Bureau of Labor Statistics — Secretaries & Admin Assistants",
                  url: "https://www.bls.gov/ooh/office-and-administrative-support/secretaries-and-administrative-assistants.htm",
                  detail: "BLS data on administrative assistant wages, comparable to virtual assistant roles.",
                },
                {
                  name: "Glassdoor — Virtual Assistant Salaries",
                  url: "https://www.glassdoor.com/Salaries/virtual-assistant-salary-SRCH_KO0,17.htm",
                  detail: "Self-reported salary data from virtual assistants across industries.",
                },
              ]}
            >
              <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
                VA:{" "}
                <span className="text-white/50 font-medium">$36K–$48K/year</span>
              </span>
            </MarketRateTooltip>
            <span className="hidden md:block w-px h-4 bg-white/10" />
            <MarketRateTooltip
              sources={[
                {
                  name: "HubSpot — Marketing Agency Pricing Report",
                  url: "https://blog.hubspot.com/marketing/marketing-agency-pricing",
                  detail: "Survey-based guide covering retainer, project, and hourly pricing across agency tiers.",
                },
                {
                  name: "Clutch.co — Digital Marketing Agency Costs",
                  url: "https://clutch.co/agencies/digital-marketing/resources/cost-digital-marketing",
                  detail: "Annual survey of businesses reporting $2,500–$12,000/mo for mid-tier agency retainers.",
                },
              ]}
            >
              <span className="text-white/30 text-xs uppercase tracking-[0.15em]">
                Marketing agency:{" "}
                <span className="text-white/50 font-medium">$60K+/year</span>
              </span>
            </MarketRateTooltip>
          </div>
          <span className="text-[#EA9A61] text-sm font-semibold mt-1">
            ROV Revenue OS: $5,000 build + $12,000/year = $17,000 total
          </span>
        </motion.div>
      </div>
    </section>
  );
}
