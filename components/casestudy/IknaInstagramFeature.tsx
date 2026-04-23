"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const EASE = [0.32, 0.72, 0, 1] as const;

export default function IknaInstagramFeature() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      aria-label="Aysegul Ikna on Instagram"
      className="relative overflow-hidden rounded-[2rem] ring-1 ring-white/5"
      style={{
        background: "linear-gradient(180deg, #0E0A08 0%, #050505 100%)",
        padding: "clamp(56px, 7vw, 88px) clamp(24px, 4vw, 56px)",
      }}
    >
      {/* Ambient green backlight */}
      <div
        aria-hidden
        className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(76,175,125,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-12 lg:gap-16">
        {/* Copy column */}
        <div className="max-w-xl text-left mx-auto lg:mx-0">
          {/* Live eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 mb-6"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-[#4CAF7D]/60 animate-ping" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#4CAF7D]" />
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.28em] text-white/70"
              style={{ fontFamily: BODY }}
            >
              Live on Instagram
            </span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={
              inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
            }
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="text-white leading-[0.95] tracking-[-0.02em]"
            style={{
              fontFamily: HEADING,
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
            }}
          >
            In the feed
          </motion.h3>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className="origin-left mt-5 h-px w-16 bg-gradient-to-r from-[#4CAF7D]/70 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="mt-5 text-white/70 leading-[1.7]"
            style={{
              fontFamily: BODY,
              fontSize: "clamp(0.95rem, 1.5vw, 1.02rem)",
            }}
          >
            The Instagram overhaul in practice. Refined feed curation,
            considered captions, and a tone that matches the craftsmanship
            of the garments themselves.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            className="mt-8"
          >
            <a
              href="https://www.instagram.com/p/DXVSPIAlTdM/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full pl-6 pr-1.5 py-1.5 text-white transition-transform hover:-translate-y-[2px] active:scale-[0.98]"
              style={{
                fontFamily: BODY,
                fontSize: "0.9rem",
                letterSpacing: "0.04em",
                background:
                  "linear-gradient(135deg, #4CAF7D 0%, #1A4D2E 100%)",
                boxShadow:
                  "0 16px 40px -14px rgba(76,175,125,0.5), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.08)",
                transitionDuration: "600ms",
                transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
              }}
            >
              <span className="py-1">View on Instagram</span>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1A4D2E] transition-all group-hover:translate-x-[3px] group-hover:-translate-y-[1px] group-hover:scale-[1.04]"
                style={{
                  transitionDuration: "600ms",
                  transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
                  boxShadow: "0 4px 10px -2px rgba(0,0,0,0.25)",
                }}
              >
                <ArrowUpRight size={15} strokeWidth={2} />
              </span>
            </a>
          </motion.div>
        </div>

        {/* Embed column — double-bezel frame */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.25, ease: EASE }}
          className="relative mx-auto lg:mx-0 w-full max-w-[440px]"
        >
          <div
            className="relative rounded-[1.75rem] p-[5px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] ring-1 ring-white/10"
            style={{
              boxShadow:
                "0 40px 100px -40px rgba(0,0,0,0.85), 0 0 0 1px rgba(76,175,125,0.05)",
            }}
          >
            {/* Editorial corner marks */}
            <span
              aria-hidden
              className="absolute -top-[1px] -left-[1px] h-3 w-3 border-t border-l border-[#4CAF7D]/55 rounded-tl-[1.75rem]"
            />
            <span
              aria-hidden
              className="absolute -top-[1px] -right-[1px] h-3 w-3 border-t border-r border-[#4CAF7D]/55 rounded-tr-[1.75rem]"
            />
            <span
              aria-hidden
              className="absolute -bottom-[1px] -left-[1px] h-3 w-3 border-b border-l border-[#4CAF7D]/55 rounded-bl-[1.75rem]"
            />
            <span
              aria-hidden
              className="absolute -bottom-[1px] -right-[1px] h-3 w-3 border-b border-r border-[#4CAF7D]/55 rounded-br-[1.75rem]"
            />

            <div
              className="relative overflow-hidden rounded-[calc(1.75rem-5px)] bg-[#0a0a0a]"
              style={{
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <iframe
                src="https://www.instagram.com/p/DXVSPIAlTdM/embed/captioned/"
                title="Aysegul Ikna on Instagram"
                loading="lazy"
                allow="encrypted-media"
                allowFullScreen
                className="block w-full"
                style={{ height: "780px", border: 0 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
