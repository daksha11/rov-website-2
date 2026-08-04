"use client";

// Stats row for /brand.
//
// Every number here is ROV's own, documented elsewhere on this site, and each
// card names where it came from. No invented industry statistics: a made-up
// "brands with consistent identity see 33% more revenue" line is exactly the
// kind of thing an AI answer engine will not cite and a sharp prospect will not
// believe.

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const STATS: { stat: string; label: string; sub: string }[] = [
    {
        stat: "689x",
        label: "More online orders after one rebuild",
        sub: "TheBando, Atlanta, in 139 days",
    },
    {
        stat: "9 of 9",
        label: "Businesses we audited had a gap they'd missed",
        sub: "Beltline visibility audit, July 2026",
    },
    {
        stat: "20%",
        label: "Revenue growth from zero online sales",
        sub: "Aysegul Ikna, brand plus e-commerce build",
    },
    {
        stat: "$2,500",
        label: "Project floor, and we don't discount below it",
        sub: "Refresh, full identity, or touchpoint build",
    },
];

export default function BrandStats() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section
            ref={ref}
            className="relative bg-black"
            style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 60px)" }}
        >
            <div className="mx-auto max-w-6xl">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={spring}
                    className="mb-3 block text-xs uppercase tracking-[0.3em] text-[#EA9A61]"
                    style={{ fontFamily: BODY }}
                >
                    Our own numbers
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ ...spring, delay: 0.1 }}
                    className="mb-4 max-w-2xl text-3xl font-bold italic text-white md:text-4xl lg:text-5xl"
                    style={{ fontFamily: HEADING }}
                >
                    What closing the gap did
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ ...spring, delay: 0.15 }}
                    className="mb-12 max-w-xl text-sm text-white/40"
                    style={{ fontFamily: BODY }}
                >
                    Four numbers from our own work, each one traceable to a project or an audit on
                    this site. No borrowed industry statistics.
                </motion.p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {STATS.map((item, i) => (
                        <motion.div
                            key={item.stat}
                            initial={{ opacity: 0, y: 26 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ ...spring, delay: 0.2 + i * 0.09 }}
                            whileHover={{ scale: 1.03 }}
                            className="flex flex-col items-center gap-3 rounded-[20px] p-7 text-center"
                            style={{
                                background: "rgba(126,42,12,0.15)",
                                border: "1px solid rgba(202,53,0,0.20)",
                            }}
                        >
                            <span
                                className="text-[clamp(2rem,3.5vw,2.8rem)] font-semibold italic leading-none"
                                style={{
                                    fontFamily: HEADING,
                                    background: "linear-gradient(90deg, #FF8904 0%, #F54900 100%)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                {item.stat}
                            </span>
                            <p
                                className="m-0 text-[0.88rem] font-semibold leading-snug text-white/85"
                                style={{ fontFamily: BODY }}
                            >
                                {item.label}
                            </p>
                            <p
                                className="m-0 text-[clamp(0.75rem,1vw,0.8rem)] leading-snug text-white/35"
                                style={{ fontFamily: BODY }}
                            >
                                {item.sub}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
