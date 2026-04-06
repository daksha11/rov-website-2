"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const highlights = [
  "Full equipment selection and installation",
  "Acoustic treatment included",
  "2-hour hands-on training session",
  "Your first song mixed free",
];

const fullInclusions = [
  "Equipment selection, procurement, and installation",
  "Acoustic treatment",
  "2-hour training session",
  "R.O.V preset library",
  "stems@rovstudios.com setup + first test submission guided",
  "First song mixed free",
  "R.O.V Certified Studio digital badge",
  "Install timelapse filmed for your content",
  "Monthly check-ins for 3 months post-install",
];

export default function StudioSetup() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <section
        ref={ref}
        className="relative bg-black overflow-hidden"
        style={{ padding: "clamp(80px, 12vw, 140px) clamp(16px, 5vw, 60px)" }}
      >
        {/* Ambient golden glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(234,154,97,0.06) 0%, transparent 60%)" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Overline */}
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.05 }}
            className="inline-block rounded-full border border-[#EA9A61]/30 bg-[#EA9A61]/10 px-4 py-1.5 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-[#EA9A61] mb-6"
            style={{ fontFamily: BODY }}
          >
            For Managers &amp; Labels
          </motion.span>

          {/* Price */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.15 }}
            className="font-bold italic leading-[0.9] mb-2"
            style={{ fontFamily: HEADING, fontSize: "clamp(3rem, 10vw, 7rem)" }}
          >
            <span className="text-white">We Build</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #EA9A61 0%, #B16937 40%, #A64D2B 100%)" }}
            >
              Your Studio
            </span>
          </motion.h2>

          {/* Price tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ ...spring, delay: 0.25 }}
            className="text-white/30 text-sm mb-8"
            style={{ fontFamily: BODY }}
          >
            Starting at $2,500 &middot; One-time &middot; Atlanta metro
          </motion.p>

          {/* Highlight pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-10"
          >
            {highlights.map((h) => (
              <span
                key={h}
                className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.12em] text-white/50 border border-white/[0.08] rounded-full px-4 py-2"
                style={{ fontFamily: BODY }}
              >
                {h}
              </span>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="mailto:stems@rovstudios.com"
              className="cta-shine inline-flex items-center gap-2 text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: HEADING,
                borderRadius: "41.444px",
                background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                padding: "clamp(0.875rem, 1.5vw, 1.125rem) clamp(2rem, 3vw, 2.5rem)",
                fontSize: "clamp(0.8rem, 1vw, 0.9rem)",
                letterSpacing: "0.05em",
              }}
            >
              Talk to us about your setup &rarr;
            </a>

            <button
              onClick={() => setShowDetails(true)}
              className="text-white/40 text-sm hover:text-[#EA9A61] transition-colors duration-300 cursor-pointer underline underline-offset-4 decoration-white/15 hover:decoration-[#EA9A61]/40"
              style={{ fontFamily: BODY }}
            >
              See everything included
            </button>
          </motion.div>
        </div>
      </section>

      {/* Details modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0E0A08] p-6 md:p-8 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all duration-200 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <span className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-2" style={{ fontFamily: BODY }}>
                Studio Setup
              </span>
              <h3 className="text-white text-2xl md:text-3xl font-bold italic mb-2" style={{ fontFamily: HEADING }}>
                $2,500
                <span className="text-white/30 text-base font-normal ml-2" style={{ fontStyle: "normal" }}>one-time</span>
              </h3>
              <p className="text-white/40 text-sm mb-6 leading-relaxed" style={{ fontFamily: BODY }}>
                We come to you. Everything you need to record at home, professionally.
              </p>

              <ul className="space-y-3 mb-6">
                {fullInclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/60 text-sm" style={{ fontFamily: BODY }}>
                    <span className="text-[#EA9A61] mt-0.5 shrink-0">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="h-px w-full bg-white/[0.06] mb-6" />

              <div className="text-white/25 text-[clamp(0.7rem,1.5vw,0.75rem)] space-y-1 mb-6" style={{ fontFamily: BODY }}>
                <p>Payment: 50% deposit before equipment procurement, 50% due on install day.</p>
                <p>Currently available: Atlanta metro area only (ITP + 30-mile radius).</p>
              </div>

              <a
                href="mailto:stems@rovstudios.com"
                className="cta-shine block text-center text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03]"
                style={{
                  fontFamily: HEADING,
                  padding: "16px",
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                  background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                  boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                }}
              >
                Talk to us about your setup &rarr;
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
