"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const EASE = [0.32, 0.72, 0, 1] as const;
const EMBER_GRADIENT =
  "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)";

export default function TagorePartnership() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      aria-label="Partnership with Tagore Studios"
      className="relative bg-[#050505] overflow-hidden"
      style={{ padding: "clamp(96px, 12vw, 160px) clamp(16px, 5vw, 48px)" }}
    >
      {/* Ambient warm backlight */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[960px] h-[560px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(234,154,97,0.09) 0%, transparent 70%)",
        }}
      />

      {/* Hairline top/bottom rules */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[1180px]">
        {/* OUTER BEZEL (shell) */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative rounded-[2.25rem] p-[5px] bg-white/[0.025] ring-1 ring-white/10"
          style={{
            boxShadow:
              "0 40px 120px -40px rgba(0,0,0,0.9), 0 0 0 1px rgba(234,154,97,0.04)",
          }}
        >
          {/* Editorial corner marks */}
          <span
            aria-hidden
            className="absolute -top-[1px] -left-[1px] h-3 w-3 border-t border-l border-[#EA9A61]/50 rounded-tl-[2.25rem]"
          />
          <span
            aria-hidden
            className="absolute -top-[1px] -right-[1px] h-3 w-3 border-t border-r border-[#EA9A61]/50 rounded-tr-[2.25rem]"
          />
          <span
            aria-hidden
            className="absolute -bottom-[1px] -left-[1px] h-3 w-3 border-b border-l border-[#EA9A61]/50 rounded-bl-[2.25rem]"
          />
          <span
            aria-hidden
            className="absolute -bottom-[1px] -right-[1px] h-3 w-3 border-b border-r border-[#EA9A61]/50 rounded-br-[2.25rem]"
          />

          {/* INNER CORE */}
          <div
            className="relative overflow-hidden rounded-[calc(2.25rem-5px)] bg-gradient-to-b from-[#0c0c0c] to-[#070707]"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              padding: "clamp(32px, 5vw, 64px)",
            }}
          >
            {/* Soft warm gradient anchored to logo side */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                background:
                  "radial-gradient(circle at 18% 50%, rgba(234,154,97,0.08) 0%, transparent 42%)",
              }}
            />

            <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-10 md:gap-14">
              {/* LOGO SEAL — nested double-bezel plate */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1.0, delay: 0.15, ease: EASE }}
                className="relative mx-auto md:mx-0"
              >
                <div
                  className="relative h-[180px] w-[180px] md:h-[210px] md:w-[210px] rounded-[1.75rem] p-[4px] bg-gradient-to-br from-white/[0.09] to-white/[0.02] ring-1 ring-white/10"
                  style={{
                    boxShadow: "0 20px 60px -20px rgba(234,154,97,0.18)",
                  }}
                >
                  <div
                    className="relative h-full w-full overflow-hidden rounded-[calc(1.75rem-4px)]"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 38%, #1a1a1a 0%, #0a0a0a 70%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 60px rgba(234,154,97,0.06)",
                    }}
                  >
                    <Image
                      src="/soundpage/tagorelogo.png"
                      alt="Tagore Studios"
                      fill
                      sizes="(max-width: 768px) 180px, 210px"
                      className="object-contain p-6"
                      priority={false}
                    />
                    {/* Metallic shimmer sweep */}
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)",
                      }}
                      animate={{ x: ["-120%", "120%"] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: EASE,
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* COPY */}
              <div className="text-center md:text-left">
                {/* Eyebrow tag */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 mb-7"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EA9A61]" />
                  <span
                    className="text-[10px] uppercase tracking-[0.28em] text-[#FFF4E3]/70"
                    style={{ fontFamily: BODY }}
                  >
                    In partnership with
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={
                    inView
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : {}
                  }
                  transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                  className="text-[#FFF4E3] leading-[0.95] tracking-[-0.02em]"
                  style={{
                    fontFamily: HEADING,
                    fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)",
                  }}
                >
                  Tagore Studios
                </motion.h2>

                {/* Orange tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                  className="mt-3 text-[#EA9A61]/90"
                  style={{
                    fontFamily: BODY,
                    fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
                    letterSpacing: "0.01em",
                  }}
                >
                  A digital muse for artists.
                </motion.p>

                {/* Warm accent rule */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={inView ? { scaleX: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
                  className="origin-left mx-auto md:mx-0 mt-6 h-px w-16 bg-gradient-to-r from-[#EA9A61]/60 to-transparent"
                />

                {/* Body */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                  className="mt-6 max-w-[58ch] mx-auto md:mx-0 text-[#FFF4E3]/80 leading-[1.7]"
                  style={{
                    fontFamily: BODY,
                    fontSize: "clamp(0.95rem, 1.5vw, 1.02rem)",
                  }}
                >
                  Somewhere to land. Somewhere to connect. Somewhere to grow.
                  Build a custom profile, meet other creatives, book services,
                  and find your community. All in one place.
                </motion.p>

                {/* CTA — button-in-button pattern */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
                  className="mt-9 flex justify-center md:justify-start"
                >
                  <a
                    href="https://www.tagorestudio.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-3 rounded-full pl-6 pr-1.5 py-1.5 text-[#FFF4E3] transition-transform hover:-translate-y-[2px] active:scale-[0.98]"
                    style={{
                      fontFamily: BODY,
                      fontSize: "0.9rem",
                      letterSpacing: "0.04em",
                      background: EMBER_GRADIENT,
                      boxShadow:
                        "0 16px 40px -14px rgba(177,105,55,0.55), inset 0 1px 0 rgba(255,244,227,0.18), inset 0 0 0 1px rgba(255,244,227,0.08)",
                      transitionDuration: "600ms",
                      transitionTimingFunction:
                        "cubic-bezier(0.32,0.72,0,1)",
                    }}
                  >
                    <span className="py-1">Explore Tagore Studios</span>
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF4E3] text-[#3B2114] transition-all group-hover:translate-x-[3px] group-hover:-translate-y-[1px] group-hover:scale-[1.04]"
                      style={{
                        transitionDuration: "600ms",
                        transitionTimingFunction:
                          "cubic-bezier(0.32,0.72,0,1)",
                        boxShadow:
                          "0 4px 10px -2px rgba(0,0,0,0.25)",
                      }}
                    >
                      <ArrowUpRight size={15} strokeWidth={2} />
                    </span>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
