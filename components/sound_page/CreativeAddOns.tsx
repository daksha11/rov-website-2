"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const addons = [
  { name: "Cover Art", subPrice: "$50", oneOff: "$75", turnaround: "3 to 5 business days" },
  { name: "Lyric Visualizer", subPrice: "$40", oneOff: "$60", turnaround: "5 to 7 business days" },
  { name: "Merch Design", subPrice: "$65", oneOff: "$95", turnaround: "3 to 5 business days" },
];

export default function CreativeAddOns() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ padding: "clamp(40px, 8vw, 80px) clamp(16px, 5vw, 60px)" }}
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
          Creative Add-Ons
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-white text-2xl md:text-3xl font-bold italic mb-8"
          style={{ fontFamily: HEADING }}
        >
          Everything else you need to drop
        </motion.h3>

        {/* Add-on cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {addons.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.15 + i * 0.08 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] block mb-2" style={{ fontFamily: BODY }}>
                {a.name}
              </span>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-white text-2xl font-bold italic" style={{ fontFamily: HEADING }}>
                  {a.subPrice}
                </span>
                <span className="text-white/25 text-xs" style={{ fontFamily: BODY }}>subscriber</span>
              </div>
              <span className="text-white/20 text-xs block mb-3" style={{ fontFamily: BODY }}>
                {a.oneOff} one-off
              </span>
              <span className="text-[#EA9A61]/60 text-[10px] uppercase tracking-[0.15em]" style={{ fontFamily: BODY }}>
                {a.turnaround}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Creative Pack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.4 }}
          className="rounded-2xl border border-[#EA9A61]/15 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ background: "linear-gradient(135deg, rgba(234,154,97,0.04) 0%, transparent 60%)" }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white text-xl md:text-2xl font-bold italic" style={{ fontFamily: HEADING }}>
                Creative Pack
              </span>
              <span
                className="rounded-full border border-[#EA9A61]/30 bg-[#EA9A61]/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-[#EA9A61]"
                style={{ fontFamily: BODY }}
              >
                Save $120/mo
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed" style={{ fontFamily: BODY }}>
              $125/mo add-on to any subscription. Includes 2 cover arts + 2 lyric visualizers + 1 merch design. A la carte value: $245.
            </p>
          </div>
          <a
            href="mailto:stems@rovstudios.com"
            className="shrink-0 text-[#EA9A61] text-sm uppercase tracking-[0.15em] hover:tracking-[0.25em] transition-all duration-500"
            style={{ fontFamily: BODY }}
          >
            Add to plan &rarr;
          </a>
        </motion.div>
      </div>
    </section>
  );
}
