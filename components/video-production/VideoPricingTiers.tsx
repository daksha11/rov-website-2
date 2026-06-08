"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function VideoPricingTiers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ padding: "0 clamp(16px, 5vw, 60px) clamp(60px, 8vw, 80px)" }}
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

        {/* Absolute Cinema card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.15 }}
          className="relative rounded-2xl border border-[#EA9A61]/30 p-8 md:p-10 max-w-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,107,53,0.04) 0%, rgba(20,20,20,1) 60%)",
          }}
        >
          <span
            className="text-white text-lg font-bold italic mb-3 block"
            style={{ fontFamily: HEADING }}
          >
            Absolute Cinema
          </span>

          <p
            className="text-white text-2xl md:text-3xl font-bold italic mb-2"
            style={{ fontFamily: HEADING }}
          >
            Let&apos;s shoot.
          </p>
          <span
            className="text-white/30 text-xs mb-5 block"
            style={{ fontFamily: BODY }}
          >
            Have an idea in mind?
          </span>

          <p
            className="text-white/50 text-sm italic leading-relaxed mb-8 max-w-md"
            style={{ fontFamily: BODY }}
          >
            Brand films. Music videos. Campaign content. Product launches.
          </p>

          <a
            href="https://calendly.com/rangeofviewmusic/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-shine inline-block text-center text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03]"
            style={{
              fontFamily: HEADING,
              padding: "14px 32px",
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
    </section>
  );
}
