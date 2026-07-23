"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { checkoutHref } from "@/data/soundPricing";
import TiltedCard from "@/components/effects/TiltedCard";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

// Karina designed the flyer. The hover credit links to her portfolio.
const KARINA_PORTFOLIO_URL = "https://karinasosaalmanzar.weebly.com/";

export default function IntroOffer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      id="mixing"
      className="scroll-mt-24 relative bg-black overflow-hidden"
      style={{ padding: "clamp(60px, 10vw, 120px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* ── Left: the real flyer, tilted 3D card ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="relative flex justify-center lg:justify-start order-1"
        >
          <div className="group relative" style={{ width: "min(78vw, 360px)" }}>
            {/* Ambient glow behind the flyer */}
            <div
              className="absolute -inset-6 rounded-[36px] pointer-events-none blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(234,154,97,0.22) 0%, rgba(166,77,43,0.10) 40%, transparent 70%)" }}
            />
            {/* Soft grounding shadow */}
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-[50%] blur-2xl pointer-events-none"
              style={{ background: "rgba(0,0,0,0.7)" }}
            />

            <div style={{ filter: "drop-shadow(0 30px 55px rgba(0,0,0,0.65))" }}>
              <TiltedCard
                imageSrc="/soundpage/music_flyer.webp"
                altText="Range of View Music studio flyer, designed by Karina"
                containerWidth="100%"
                containerHeight="min(101vw, 466px)"
                imageWidth="100%"
                imageHeight="100%"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={false}
              />
            </div>

            {/* Hover credit — "designed by Karina". Persistent on touch, hover-reveal on desktop. */}
            <FlyerCredit />
          </div>
        </motion.div>

        {/* ── Right: the offer ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ ...spring, delay: 0.25 }}
          className="text-center lg:text-left order-2"
        >
          <span
            className="inline-block rounded-full border border-[#EA9A61]/30 bg-[#EA9A61]/10 px-4 py-1.5 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-[#EA9A61] mb-5"
            style={{ fontFamily: BODY }}
          >
            Intro offer
          </span>

          <h2
            className="font-bold italic leading-[0.85] mb-4"
            style={{
              fontFamily: HEADING,
              fontSize: "clamp(4.5rem, 11vw, 8.5rem)",
              background: "linear-gradient(135deg, #EA9A61 0%, #B16937 40%, #A64D2B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            $50
            <span
              style={{
                fontSize: "clamp(1.35rem, 2.6vw, 2.25rem)",
                WebkitTextFillColor: "rgba(255,255,255,0.5)",
              }}
            >
              /song
            </span>
          </h2>

          <p
            className="text-white text-xl md:text-2xl lg:text-3xl font-bold italic mb-6"
            style={{ fontFamily: HEADING }}
          >
            Mix &amp; master. First 3 songs. No commitment.
          </p>

          {/* Feature bullets */}
          <ul className="flex flex-col gap-2.5 mb-8 max-w-sm mx-auto lg:mx-0 text-left">
            {[
              "Full mix & master, not just mastering",
              "48-hour turnaround",
              "2 revisions included",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-white/70 text-sm" style={{ fontFamily: BODY }}>
                <span className="shrink-0 text-[#EA9A61]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>

          <a
            href={checkoutHref("intro")}
            className="cta-shine inline-flex items-center gap-2 text-white font-semibold transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: HEADING,
              borderRadius: "41.444px",
              background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
              boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
              padding: "clamp(1rem, 1.5vw, 1.15rem) clamp(2rem, 3.5vw, 2.75rem)",
              fontSize: "clamp(0.875rem, 1.2vw, 1.05rem)",
              letterSpacing: "0.05em",
            }}
          >
            Send your stems &rarr;
          </a>

          <p
            className="text-white/40 text-[clamp(0.7rem,1.5vw,0.75rem)] md:text-xs mt-6 leading-relaxed max-w-md mx-auto lg:mx-0"
            style={{ fontFamily: BODY }}
          >
            First 3 songs only, per artist. Same finished sound as every paid record we release.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Cute hover-reveal credit pinned to the flyer's corner. Pops in on hover
// (desktop) and stays visible on touch. Links to Karina's portfolio when set.
function FlyerCredit() {
  const inner = (
    <>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#EA9A61] shrink-0">
        <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z" />
      </svg>
      <span>
        Designed by <span className="text-white font-semibold">Karina</span>
      </span>
      {KARINA_PORTFOLIO_URL && <span className="text-white/50 group-hover:text-[#EA9A61] transition-colors">&#8599;</span>}
    </>
  );

  const cls =
    "absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md px-3 py-1.5 text-[11px] text-white/85 shadow-lg opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-1.5 sm:scale-95 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:scale-100 transition-all duration-300";

  if (KARINA_PORTFOLIO_URL) {
    return (
      <a
        href={KARINA_PORTFOLIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Flyer designed by Karina, view portfolio"
        className={`${cls} hover:border-[#EA9A61]/60 hover:text-white cursor-pointer`}
        style={{ fontFamily: BODY }}
      >
        {inner}
      </a>
    );
  }

  return (
    <span className={cls} style={{ fontFamily: BODY }} aria-label="Flyer designed by Karina">
      {inner}
    </span>
  );
}
