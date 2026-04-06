"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function IntroOffer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative bg-black overflow-hidden"
      style={{ padding: "clamp(60px, 10vw, 120px) clamp(16px, 5vw, 60px)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(234,154,97,0.06) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.05 }}
          className="inline-block rounded-full border border-[#EA9A61]/30 bg-[#EA9A61]/10 px-4 py-1.5 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-[#EA9A61] mb-6"
          style={{ fontFamily: BODY }}
        >
          Intro offer
        </motion.span>

        {/* Price */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.15 }}
          className="font-bold italic leading-[0.9] mb-4"
          style={{
            fontFamily: HEADING,
            fontSize: "clamp(5rem, 15vw, 12rem)",
            background: "linear-gradient(135deg, #EA9A61 0%, #B16937 40%, #A64D2B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          $50
          <span
            className="text-white/60"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              WebkitTextFillColor: "rgba(255,255,255,0.5)",
            }}
          >
            /song
          </span>
        </motion.h2>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.25 }}
          className="text-white text-xl md:text-2xl lg:text-3xl font-bold italic mb-4"
          style={{ fontFamily: HEADING }}
        >
          Mix &amp; master. First 3 songs. No commitment.
        </motion.p>

        {/* Supporting */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ ...spring, delay: 0.35 }}
          className="text-white/50 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed"
          style={{ fontFamily: BODY }}
        >
          Send us your stems. Hear what R.O.V sounds like before you spend another dollar on studio time.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.45 }}
        >
          <a
            href="mailto:stems@rovstudios.com"
            className="cta-shine inline-flex items-center gap-2 text-white font-semibold transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: HEADING,
              borderRadius: "41.444px",
              background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
              boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
              padding: "clamp(1rem, 1.5vw, 1.25rem) clamp(2rem, 3.5vw, 3rem)",
              fontSize: "clamp(0.875rem, 1.2vw, 1.1rem)",
              letterSpacing: "0.05em",
            }}
          >
            Send your stems &rarr;
          </a>
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ ...spring, delay: 0.55 }}
          className="text-white/25 text-[clamp(0.7rem,1.5vw,0.75rem)] md:text-xs max-w-md mx-auto mt-6 leading-relaxed"
          style={{ fontFamily: BODY }}
        >
          First 3 songs only, per artist. Same 48hr turnaround and 1 revision as all paid work. Full mix &amp; master, not just mastering.
        </motion.p>
      </div>
    </section>
  );
}
