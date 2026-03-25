"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };
const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";

const CTA_GRADIENT = "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const CTA_SHADOW = "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";

function SpinningVinyl() {
    return (
        <div className="relative w-52 h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 shrink-0">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                    background: `conic-gradient(
                        from 0deg,
                        #1a1210 0deg, #2a1e18 30deg, #1a1210 60deg, #2a1e18 90deg,
                        #1a1210 120deg, #2a1e18 150deg, #1a1210 180deg, #2a1e18 210deg,
                        #1a1210 240deg, #2a1e18 270deg, #1a1210 300deg, #2a1e18 330deg, #1a1210 360deg
                    )`,
                    boxShadow: "0 0 60px rgba(234,154,97,0.15), inset 0 0 30px rgba(0,0,0,0.5)",
                }}
            >
                {[20, 32, 44, 56, 68, 80].map((pct) => (
                    <div
                        key={pct}
                        className="absolute rounded-full border border-white/[0.04]"
                        style={{ inset: `${(100 - pct) / 2}%` }}
                    />
                ))}
                <div
                    className="absolute top-0 left-1/2 w-px h-1/2 origin-bottom"
                    style={{ background: "linear-gradient(to top, transparent 30%, rgba(234,154,97,0.12) 60%, transparent 100%)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="w-[30%] h-[30%] rounded-full flex items-center justify-center"
                        style={{
                            background: "linear-gradient(135deg, #EA9A61 0%, #B16937 40%, #42201C 100%)",
                            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
                        }}
                    >
                        <div className="w-[20%] h-[20%] rounded-full bg-black/60" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function Tape3Content() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <div className="bg-black min-h-screen text-white overflow-x-hidden">
            <section
                ref={ref}
                className="relative min-h-screen flex items-center"
                style={{ padding: "clamp(80px, 8vw, 120px) clamp(16px, 5vw, 60px)" }}
            >
                {/* Background glow */}
                <div
                    className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(234,154,97,0.06) 0%, transparent 60%)" }}
                />

                <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Left — Vinyl + title */}
                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                            animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                            transition={{ ...spring, delay: 0.1 }}
                        >
                            <SpinningVinyl />
                        </motion.div>

                        <div className="text-center lg:text-left">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : {}}
                                transition={spring}
                                className="block text-[10px] uppercase tracking-[0.4em] text-[#EA9A61]/50 mb-3"
                                style={{ fontFamily: BODY }}
                            >
                                Range of View Studios
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ ...spring, delay: 0.1 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold italic leading-[0.9] mb-3"
                                style={{ fontFamily: HEADING }}
                            >
                                The ROV{" "}
                                <span
                                    className="bg-clip-text text-transparent"
                                    style={{ backgroundImage: CTA_GRADIENT }}
                                >
                                    Tape 3
                                </span>
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : {}}
                                transition={{ ...spring, delay: 0.15 }}
                                className="flex items-center gap-3 justify-center lg:justify-start"
                            >
                                <span className="text-white/25 text-xs tracking-[0.15em] uppercase" style={{ fontFamily: BODY }}>
                                    Creative Brief / 2024
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#EA9A61] animate-pulse" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Right — Brief content, all in one column */}
                    <motion.div
                        className="lg:col-span-7"
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ ...spring, delay: 0.2 }}
                    >
                        {/* What this is */}
                        <p
                            className="text-white/80 text-base md:text-lg leading-relaxed mb-8"
                            style={{ fontFamily: BODY }}
                        >
                            The first two ROV Tapes were the beginning. Artists from different genres
                            making something none of them would have made alone. Tape 3 is a step forward.
                            ROV is a full creative agency now. This tape reflects where we are and where
                            culture is heading.
                        </p>

                        {/* Three pillars — compact grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            {[
                                {
                                    title: "Sound",
                                    text: "Afrobeats, RnB, soul, Atlanta energy, British influence. Cross-genre tension is the point. Fun on the surface, depth underneath.",
                                },
                                {
                                    title: "Experience",
                                    text: "Works at a session, in the car, or alone at night. Rewards attention without demanding it. Feel at home, then get caught off guard.",
                                },
                                {
                                    title: "Direction",
                                    text: "Art and rollout that feels found, not pushed. Cultural, considered, proud of where it comes from. The future is wide open.",
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ ...spring, delay: 0.25 + i * 0.08 }}
                                >
                                    <h2
                                        className="text-lg md:text-xl font-bold italic mb-2 text-white/90"
                                        style={{ fontFamily: HEADING }}
                                    >
                                        {item.title}
                                    </h2>
                                    <p
                                        className="text-white/35 text-sm leading-relaxed"
                                        style={{ fontFamily: BODY }}
                                    >
                                        {item.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/[0.06] mb-6" />

                        {/* Details — inline row */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ ...spring, delay: 0.45 }}
                            className="flex flex-wrap gap-x-8 gap-y-3 mb-8"
                        >
                            {[
                                ["Format", "Multi-artist tape"],
                                ["Status", "Beats in progress"],
                                ["Tone", "Warm, cinematic"],
                                ["Audience", "Atlanta & beyond"],
                            ].map(([label, value]) => (
                                <div key={label} className="flex items-baseline gap-2">
                                    <span
                                        className="text-[#EA9A61] text-[10px] uppercase tracking-[0.2em]"
                                        style={{ fontFamily: BODY }}
                                    >
                                        {label}
                                    </span>
                                    <span
                                        className="text-white/40 text-sm"
                                        style={{ fontFamily: BODY }}
                                    >
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ ...spring, delay: 0.5 }}
                            className="flex items-center gap-4"
                        >
                            <a
                                href="https://calendly.com/rangeofviewmusic/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cta-shine inline-flex items-center gap-2 text-white font-semibold transition-all duration-300 hover:scale-105"
                                style={{
                                    fontFamily: HEADING,
                                    borderRadius: "41.444px",
                                    background: CTA_GRADIENT,
                                    boxShadow: CTA_SHADOW,
                                    padding: "0.75rem 1.75rem",
                                    fontSize: "0.875rem",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                Get Involved
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                            <span
                                className="text-white/20 text-xs"
                                style={{ fontFamily: BODY }}
                            >
                                Artists &amp; collaborators welcome
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
