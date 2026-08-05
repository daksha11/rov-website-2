"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mic, Waves, Layers, Users } from "lucide-react";
import { useEffectiveRole } from "@/components/music/RoleContext";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

// Two-path fork. The second question, after RoleGate asks who they are.
// Artists sort by where their song currently is. Managers sort by scale,
// because "record vs stems" is the wrong axis when you run a roster.
const artistPaths = [
  {
    id: "record",
    icon: Mic,
    kicker: "Come to the studio",
    title: "Record with us",
    body: "Book the room and an engineer. Track your song, walk out mixed and mastered the same week. One rate covers all of it.",
    price: "From $50/hr",
    sub: "Mix & master included",
    cta: "See recording rates",
  },
  {
    id: "mixing",
    icon: Waves,
    kicker: "Already recorded",
    title: "Send your stems",
    body: "Export your stems and email them over. Full mix and master back in 48 hours. Your first one is $50, so you hear the work before committing to anything.",
    price: "First mix $50",
    sub: "Then $65, or $40 in a pack",
    cta: "See mixing pricing",
  },
];

const managerPaths = [
  {
    id: "mixing",
    icon: Layers,
    kicker: "One artist, one release",
    title: "Start with a record",
    body: "Send us one artist's stems and see how we work before anything else. Full mix and master back in 48 hours, at the intro rate.",
    price: "First 3 at $50",
    sub: "Per artist, no commitment",
    cta: "See mixing pricing",
  },
  {
    id: "foundation",
    icon: Users,
    kicker: "The whole roster",
    title: "Build the backend",
    body: "Splits, metadata, release hubs, EPKs, and art systems, built the same way for every artist you manage. One system, one point of contact.",
    price: "Foundation, per artist",
    sub: "Then release cycles on cadence",
    cta: "See what it covers",
  },
];

export default function PathFork() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const role = useEffectiveRole();
  const isManager = role === "manager";
  const paths = isManager ? managerPaths : artistPaths;

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={ref}
      id="start"
      className="scroll-mt-24 relative bg-black"
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
          {isManager ? "Two ways to start" : "Two ways in"}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.1 }}
          className="text-center text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-10 md:mb-12"
          style={{ fontFamily: HEADING }}
        >
          {isManager ? "How do you want to begin?" : "Where are you starting?"}
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

        {/* Third door, deliberately quiet. The readiness audit lives further
            down in Act 3 so it doesn't interrupt the song funnel, which means
            it needs an entry point up here for anyone who isn't sure yet. */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ ...spring, delay: 0.45 }}
          className="text-center text-white/35 text-sm mt-7"
          style={{ fontFamily: BODY }}
        >
          {isManager ? "Not sure where the roster stands? " : "Not sure where you're at? "}
          <button
            type="button"
            onClick={() => goTo("audit")}
            className="text-[#EA9A61]/85 hover:text-[#EA9A61] underline underline-offset-4 decoration-[#EA9A61]/30 hover:decoration-[#EA9A61]/70 transition-colors cursor-pointer"
          >
            Take the 40-second audit
          </button>
        </motion.p>
      </div>
    </section>
  );
}
