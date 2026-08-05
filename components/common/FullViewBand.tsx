"use client";

// "Where this fits" — the shared band that places a single service inside the
// Full View.
//
// The problem it solves: each service page sells its own practice area well,
// but nothing on the page tells a visitor that the five moments exist or that
// we handle the rest of them. So a business that arrives for a website never
// learns we could also fix the follow-up that goes cold three days later, which
// is usually the more expensive leak.
//
// Moments this service owns are lit; the others stay dim but link out, so the
// band doubles as internal linking between service pages without reading as a
// nav block. Moment names and order come from lib/pricing.ts, the same source
// the pricing page and the intake quiz use.

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { MOMENTS, type MomentKey } from "@/lib/pricing";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const ORANGE = "#EA9A61";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

/** Where a visitor goes to read about a moment this service does not own. */
const MOMENT_HOME: Record<MomentKey, string> = {
  found: "/web",
  captured: "/web",
  answered: "/ai-automation",
  nurtured: "/ai-automation",
  kept: "/brand",
};

export default function FullViewBand({
  eyebrow = "Where this fits",
  heading,
  intro,
  owns,
  /** Per-moment line describing what THIS service does at that moment. */
  detail,
  closing,
}: {
  eyebrow?: string;
  heading: string;
  intro: string;
  owns: MomentKey[];
  detail: Partial<Record<MomentKey, string>>;
  closing?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ padding: "clamp(56px, 9vw, 100px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="mb-3 block text-xs uppercase tracking-[0.3em]"
          style={{ fontFamily: BODY, color: ORANGE }}
        >
          {eyebrow}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.08 }}
          className="mb-4 max-w-3xl text-2xl font-bold italic text-white md:text-3xl lg:text-4xl"
          style={{ fontFamily: HEADING }}
        >
          {heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.14 }}
          className="mb-10 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base"
          style={{ fontFamily: BODY }}
        >
          {intro}
        </motion.p>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {MOMENTS.map((m, i) => {
            const lit = owns.includes(m.key);
            const body = detail[m.key] ?? m.blurb;
            const inner = (
              <>
                <span
                  className="mb-2 block text-[0.7rem] uppercase tracking-[0.2em]"
                  style={{ fontFamily: BODY, color: lit ? "rgba(234,154,97,0.6)" : "rgba(255,255,255,0.2)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="mb-2 block text-lg font-bold italic"
                  style={{ fontFamily: HEADING, color: lit ? ORANGE : "rgba(255,255,255,0.45)" }}
                >
                  {m.label}
                </span>
                <span
                  className="block text-[0.8125rem] leading-relaxed"
                  style={{ fontFamily: BODY, color: lit ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.32)" }}
                >
                  {body}
                </span>
                {!lit && (
                  <span
                    className="mt-3 block text-[0.7rem] uppercase tracking-[0.14em] text-white/25 transition-colors group-hover:text-[#EA9A61]/70"
                    style={{ fontFamily: BODY }}
                  >
                    We do this too &rarr;
                  </span>
                )}
              </>
            );

            return (
              <motion.li
                key={m.key}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...spring, delay: 0.18 + i * 0.06 }}
              >
                {lit ? (
                  <div
                    className="h-full rounded-xl border p-5"
                    style={{
                      borderColor: "rgba(234,154,97,0.3)",
                      background: "rgba(234,154,97,0.05)",
                    }}
                  >
                    {inner}
                  </div>
                ) : (
                  <Link
                    href={MOMENT_HOME[m.key]}
                    className="group block h-full rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 transition-colors hover:border-white/20"
                  >
                    {inner}
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ol>

        {closing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ ...spring, delay: 0.5 }}
            className="mt-8 max-w-2xl text-sm leading-relaxed text-white/40"
            style={{ fontFamily: BODY }}
          >
            {closing}{" "}
            <Link href="/pricing" className="underline underline-offset-4" style={{ color: ORANGE }}>
              See what it costs
            </Link>
            .
          </motion.p>
        )}
      </div>
    </section>
  );
}
