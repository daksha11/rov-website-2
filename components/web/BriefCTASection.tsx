"use client";

// Mid-page entry point to /web/brief. Sits after pricing, where a visitor has
// just seen numbers and is deciding whether to raise their hand. The pitch is
// the trade: a few minutes of answers for a real scope and a demo direction.

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const GRADIENT =
    "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
    "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";

const COVERED = ["Your link", "The goal", "Budget and timeline"];

export default function BriefCTASection() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section ref={ref} className="relative bg-black px-6 md:px-12 py-10">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="max-w-7xl mx-auto rounded-2xl border border-white/[0.09] p-8 md:p-12"
                style={{
                    background:
                        "radial-gradient(120% 140% at 0% 0%, rgba(234,154,97,0.09) 0%, rgba(0,0,0,0) 55%), rgba(255,255,255,0.02)",
                }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-14">
                    <div className="flex-1">
                        <span
                            className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3"
                            style={{ fontFamily: BODY }}
                        >
                            Skip the sales call
                        </span>
                        <h2
                            className="text-white font-bold italic leading-tight mb-4"
                            style={{ fontFamily: HEADING, fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)" }}
                        >
                            Give us the vision, get a demo direction
                        </h2>
                        <p
                            className="text-white/50 leading-relaxed max-w-xl mb-6"
                            style={{ fontFamily: BODY, fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)" }}
                        >
                            Start with your link, pick the job the site has to do, tell us the numbers. Three
                            screens and you&apos;re done. A person reads it and replies within a business day with
                            a scope and a demo direction.
                        </p>
                        <ul className="flex flex-wrap gap-2">
                            {COVERED.map((c) => (
                                <li
                                    key={c}
                                    className="rounded-full border border-white/[0.1] bg-white/[0.02] px-3 py-1.5 text-xs text-white/55"
                                    style={{ fontFamily: BODY }}
                                >
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="shrink-0 flex flex-col items-stretch gap-3 lg:w-64">
                        <Link
                            href="/web/brief"
                            className="cta-shine block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.03]"
                            style={{
                                fontFamily: HEADING,
                                padding: "15px",
                                fontSize: "13px",
                                letterSpacing: "0.05em",
                                background: GRADIENT,
                                boxShadow: GRADIENT_SHADOW,
                            }}
                        >
                            Start your brief &rarr;
                        </Link>
                        <a
                            href="https://cal.com/rov-studios-imhphw/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center text-white/70 font-semibold rounded-full border border-white/12 hover:border-[#EA9A61]/50 hover:text-white transition-all duration-300"
                            style={{
                                fontFamily: HEADING,
                                padding: "15px",
                                fontSize: "13px",
                                letterSpacing: "0.05em",
                                background: "rgba(255,255,255,0.03)",
                            }}
                        >
                            Book a call instead
                        </a>
                        <span
                            className="text-center text-white/30 text-xs mt-1"
                            style={{ fontFamily: BODY }}
                        >
                            No obligation, no pitch deck
                        </span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
