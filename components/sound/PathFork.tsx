"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mic, Waves } from "lucide-react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

// Two-path fork. Visitors self-select: come record in the room, or send stems
// to be mixed. Each card scrolls to the relevant pricing block below.
const paths = [
  {
    id: "record",
    icon: Mic,
    kicker: "Come to the studio",
    title: "Record with us",
    body: "Book the room and an engineer. Track your song, walk out mixed and mastered the same week. One rate covers all of it.",
    price: "From $60/hr",
    sub: "Finished single from $149",
    cta: "See recording rates",
  },
  {
    id: "mixing",
    icon: Waves,
    kicker: "Already recorded",
    title: "Send your stems",
    body: "Export your stems and email them over. Full mix and master back in 48 hours. First 3 songs are $50 each, no commitment.",
    price: "First 3 at $50",
    sub: "Then one-off or subscribe",
    cta: "See mixing pricing",
  },
];

export default function PathFork() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ padding: "clamp(48px, 8vw, 90px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="block text-center text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3"
          style={{ fontFamily: BODY }}
        >
          Two ways in
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-center text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-10 md:mb-12"
          style={{ fontFamily: HEADING }}
        >
          Where are you starting?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {paths.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => goTo(p.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...spring, delay: 0.2 + i * 0.1 }}
                className="group text-left rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8 flex flex-col hover:border-[#EA9A61]/40 hover:bg-[#EA9A61]/[0.03] transition-all duration-300"
              >
                <Icon className="w-7 h-7 text-[#EA9A61] mb-5" strokeWidth={1.5} />
                <span className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/40 mb-2" style={{ fontFamily: BODY }}>
                  {p.kicker}
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-bold italic mb-3" style={{ fontFamily: HEADING }}>
                  {p.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1" style={{ fontFamily: BODY }}>
                  {p.body}
                </p>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-[#EA9A61] text-lg font-semibold" style={{ fontFamily: HEADING }}>
                    {p.price}
                  </span>
                  <span className="text-white/30 text-xs" style={{ fontFamily: BODY }}>
                    {p.sub}
                  </span>
                </div>
                <span
                  className="inline-flex items-center gap-2 text-white/70 group-hover:text-white text-sm font-semibold transition-colors"
                  style={{ fontFamily: HEADING, letterSpacing: "0.03em" }}
                >
                  {p.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
