"use client";

import { motion } from "framer-motion";

export function BlogPostCTA() {
  return (
    <section className="py-16 md:py-24 px-4 bg-black">
      <div className="flex flex-col items-center gap-4">
        <p
          className="text-white/40 text-sm uppercase tracking-[0.2em]"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          Have questions?
        </p>
        <motion.a
          href="https://calendly.com/rangeofviewmusic/30min"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="cta-shine inline-flex items-center gap-3 text-white font-semibold cursor-pointer uppercase tracking-wide"
          style={{
            fontFamily: "Norwige, sans-serif",
            borderRadius: "41.444px",
            background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
            boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
            padding: "clamp(1rem, 1.5vw, 1.25rem) clamp(2rem, 3vw, 3rem)",
            fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
            letterSpacing: "0.08em",
          }}
        >
          Book a Call
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
