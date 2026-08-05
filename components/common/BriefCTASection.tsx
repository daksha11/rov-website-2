"use client";

// Entry point to a service's intake quiz. Sits after pricing, where a visitor
// has just seen numbers and is deciding whether to raise their hand.
//
// Replaces the old web-only BriefCTASection, which promised "three screens"
// and "budget and timeline". The quiz no longer asks for a budget at all: it
// works out the tier from how many moments are leaking and shows the real
// number on the reveal. The copy here has to match that or it sets the wrong
// expectation before the first click.

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getIntakeService } from "@/lib/intake";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";

export default function BriefCTASection({ service: slug }: { service: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const service = getIntakeService(slug);
  if (!service) return null;

  // The chips carry what we ask for, so the body copy never restates them.
  const covered = service.crawl
    ? ["Your link", "Five questions", "A real number"]
    : ["Five questions", "No budget question", "A real number"];

  return (
    <section ref={ref} className="relative bg-black px-6 py-10 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="mx-auto max-w-7xl rounded-2xl border border-white/[0.09] p-8 md:p-12"
        style={{
          background:
            "radial-gradient(120% 140% at 0% 0%, rgba(234,154,97,0.09) 0%, rgba(0,0,0,0) 55%), rgba(255,255,255,0.02)",
        }}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex-1">
            <span
              className="mb-3 block text-xs uppercase tracking-[0.3em] text-[#EA9A61]"
              style={{ fontFamily: BODY }}
            >
              Skip the sales call
            </span>
            <h2
              className="mb-4 font-bold italic leading-tight text-white"
              style={{ fontFamily: HEADING, fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)" }}
            >
              Five questions. Then we show you what&apos;s leaking, and what it costs.
            </h2>
            <p
              className="mb-6 max-w-xl leading-relaxed text-white/50"
              style={{ fontFamily: BODY, fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)" }}
            >
              {service.crawl
                ? "Paste your link and we read it on the spot. You get the answer and a real price before we ask for anything, and a person replies within one business day."
                : "About a minute. You get the answer and a real price before we ask for anything, and a person replies within one business day."}
            </p>
            <ul className="flex flex-wrap gap-2">
              {covered.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-white/[0.1] bg-white/[0.02] px-3 py-1.5 text-xs text-white/55"
                  style={{ fontFamily: BODY }}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-3 lg:w-64">
            <Link
              href={`${service.parentHref}/brief`}
              className="cta-shine block w-full rounded-full text-center font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
              style={{
                fontFamily: HEADING,
                padding: "15px",
                fontSize: "13px",
                letterSpacing: "0.05em",
                background: GRADIENT,
                boxShadow: GRADIENT_SHADOW,
              }}
            >
              {service.crawl ? "Check my site →" : "Start the brief →"}
            </Link>
            <a
              href="https://cal.com/rov-studios-imhphw/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-full border border-white/12 text-center font-semibold text-white/70 transition-all duration-300 hover:border-[#EA9A61]/50 hover:text-white"
              style={{
                fontFamily: HEADING,
                padding: "15px",
                fontSize: "13px",
                letterSpacing: "0.05em",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              Book a call instead
            </a>
            <span className="mt-1 text-center text-xs text-white/30" style={{ fontFamily: BODY }}>
              No obligation, no pitch deck
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
