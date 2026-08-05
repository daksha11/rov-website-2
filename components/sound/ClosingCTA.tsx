"use client";

// The ending the page never had. It used to run FAQ straight into the footer,
// so anyone who read to the bottom had nothing to do.
//
// Two doors, matched to the two acts: send stems (self-serve, Act 2) or book a
// call (consultative, Act 3). Deliberately not a third pitch.

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CONSULT_BOOKING_URL, checkoutHref } from "@/data/soundPricing";
import CalBookButton from "@/components/sound/CalBookButton";
import { useEffectiveRole } from "@/components/music/RoleContext";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";

export default function ClosingCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isManager = useEffectiveRole() === "manager";

  return (
    <section
      ref={ref}
      className="relative bg-black overflow-hidden"
      style={{ padding: "clamp(70px, 11vw, 130px) clamp(16px, 5vw, 60px)" }}
    >
      <div
        aria-hidden
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[900px] h-[400px] rounded-full pointer-events-none blur-[130px]"
        style={{ background: "radial-gradient(ellipse, rgba(234,154,97,0.09) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={spring}
          className="text-white text-3xl md:text-5xl font-bold italic leading-[1.05] mb-5"
          style={{ fontFamily: HEADING }}
        >
          {isManager ? "Send us one artist." : "Send us one song."}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.08 }}
          className="text-white/45 text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-9"
          style={{ fontFamily: BODY }}
        >
          {isManager
            ? "Pick the artist you'd most like to see handled properly and start there. If it works, we do the same thing across the roster."
            : "The fastest way to know if this is for you is to hear your own record come back finished. Everything else follows from that."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.16 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href={checkoutHref("mix_first")}
            className="cta-shine inline-flex items-center justify-center gap-2 text-white font-semibold transition-transform duration-300 hover:scale-105 w-full sm:w-auto"
            style={{
              fontFamily: HEADING,
              borderRadius: "41.444px",
              background: GRADIENT,
              boxShadow: GRADIENT_SHADOW,
              padding: "clamp(0.95rem, 1.4vw, 1.1rem) clamp(2rem, 3.5vw, 2.6rem)",
              fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
              letterSpacing: "0.05em",
            }}
          >
            Send your stems &rarr;
          </a>

          <CalBookButton
            calLink={CONSULT_BOOKING_URL}
            className="inline-flex items-center justify-center text-white/80 hover:text-white font-semibold rounded-full border border-white/12 hover:border-[#EA9A61]/50 hover:bg-[#EA9A61]/[0.06] transition-all duration-300 w-full sm:w-auto"
            style={{
              fontFamily: HEADING,
              padding: "clamp(0.95rem, 1.4vw, 1.1rem) clamp(2rem, 3.5vw, 2.6rem)",
              fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
              letterSpacing: "0.05em",
            }}
          >
            Book a call
          </CalBookButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ ...spring, delay: 0.26 }}
          className="text-white/25 text-xs mt-7"
          style={{ fontFamily: BODY }}
        >
          Atlanta, GA · stems@rovstudios.com
        </motion.p>
      </div>
    </section>
  );
}
