"use client";

// Pricing for /brand, mirroring WebPricingTiers so the two service pages read
// as one studio. Numbers come from the locked commercials in lib/pricing.ts:
// $2,500 hard floor, $10,000 ceiling, refresh in the $2,500-$4,500 band, full
// identity with touchpoints above it. The ROV side of the comparison bar reads
// FLOOR and CEILING directly rather than restating them, because the restated
// version drifted to "$2,500 - $15,000" and outlived the cap by weeks.
//
// The market-rate bar uses the same MarketRateTooltip as /web, with real cited
// sources. If a source cannot be pointed at, the number does not go on the page.

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import MarketRateTooltip from "@/components/common/MarketRateTooltip";
import { FLOOR, CEILING, range } from "@/lib/pricing";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

interface Tier {
    id: string;
    name: string;
    tier: string;
    price: number;
    priceSub: string;
    tagline: string;
    bestFor: string;
    support: string;
    recommended?: boolean;
    includesPrefix?: string;
    features: string[];
}

const tiers: Tier[] = [
    {
        id: "refresh",
        name: "The Refresh",
        tier: "Identity, tightened",
        price: 2500,
        priceSub: "Starting, one-time project fee",
        tagline: "Your mark is fine. What you do with it isn't.",
        bestFor: "Established businesses whose logo works but whose surfaces contradict each other",
        support: "30 days of post-handoff support",
        features: [
            "Full touchpoint audit, every surface inventoried",
            "Type system and accessible colour pairs",
            "Logo variations for the sizes you actually use",
            "Written guidelines short enough to be read",
            "Two priority surfaces rebuilt on the new system",
            "Handoff walkthrough, recorded",
        ],
    },
    {
        id: "fullview",
        name: "The Full View",
        tier: "Identity + every surface it lives on",
        price: 6000,
        priceSub: "Starting, scales with surface count",
        tagline: "The 11pm automated email looks like the website. That's the job.",
        bestFor: "Businesses that want the whole customer journey to sound like one company",
        support: "60 days of post-handoff support",
        recommended: true,
        includesPrefix: "Everything in The Refresh",
        features: [
            "Naming, if you need it",
            "Email and lifecycle sequences built and shipped",
            "Confirmation, receipt, and thank-you templates",
            "Booking, intake, and contact forms",
            "Review requests and post-purchase follow-up",
            "Tested end to end in your own platform",
        ],
    },
];

function fmt(n: number): string {
    return "$" + n.toLocaleString("en-US");
}

export default function BrandPricingTiers() {
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
                    Pricing
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ ...spring, delay: 0.1 }}
                    className="mb-4 max-w-2xl text-3xl font-bold italic text-white md:text-4xl lg:text-5xl"
                    style={{ fontFamily: HEADING }}
                >
                    Two ways in, one standard
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ ...spring, delay: 0.15 }}
                    className="mb-10 max-w-xl text-sm text-white/40"
                    style={{ fontFamily: BODY }}
                >
                    We&apos;ll tell you which one you need after the audit, and we&apos;d rather sell you
                    the smaller correct job than the bigger wrong one.
                </motion.p>

                <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-4">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ ...spring, delay: 0.15 + i * 0.12 }}
                            className={`relative flex flex-col rounded-2xl border p-6 md:p-8 ${
                                tier.recommended
                                    ? "border-[#EA9A61]/30 bg-[#EA9A61]/[0.04]"
                                    : "border-white/[0.06] bg-white/[0.02]"
                            }`}
                        >
                            {tier.recommended && (
                                <span
                                    className="absolute -top-3 left-6 rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/15 px-3 py-0.5 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-[#EA9A61]"
                                    style={{ fontFamily: BODY }}
                                >
                                    Recommended
                                </span>
                            )}

                            <span
                                className="mb-1 text-lg font-bold italic text-white"
                                style={{ fontFamily: HEADING }}
                            >
                                {tier.name}
                            </span>
                            <span
                                className="mb-4 text-xs uppercase tracking-[0.15em] text-[#EA9A61]"
                                style={{ fontFamily: BODY }}
                            >
                                {tier.tier}
                            </span>

                            <div className="mb-1 flex items-baseline gap-1">
                                <span
                                    className="text-4xl font-bold italic text-white md:text-5xl"
                                    style={{ fontFamily: HEADING }}
                                >
                                    {fmt(tier.price)}
                                </span>
                            </div>
                            <span className="mb-5 text-xs text-white/30" style={{ fontFamily: BODY }}>
                                {tier.priceSub}
                            </span>

                            <p className="mb-5 text-sm italic text-white/50" style={{ fontFamily: BODY }}>
                                {tier.tagline}
                            </p>

                            <div className="mb-5 h-px w-full bg-white/[0.06]" />

                            {tier.includesPrefix && (
                                <p className="mb-4 text-sm text-white/50" style={{ fontFamily: BODY }}>
                                    <span className="font-semibold text-[#EA9A61]">{tier.includesPrefix}</span>
                                    , plus:
                                </p>
                            )}

                            <ul className="mb-6 grid flex-1 grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                                {tier.features.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-2 text-sm text-white/50"
                                        style={{ fontFamily: BODY }}
                                    >
                                        <span className="mt-0.5 shrink-0 text-[#EA9A61]">&#10003;</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <p
                                className="mb-1 pt-5 text-xs italic text-white/30"
                                style={{ fontFamily: BODY, borderTop: "1px solid rgba(255,255,255,0.04)" }}
                            >
                                <span className="font-semibold text-white/50">Best for:</span> {tier.bestFor}
                            </p>
                            <p className="mb-6 text-xs text-white/25" style={{ fontFamily: BODY }}>
                                {tier.support}
                            </p>

                            <a
                                href="https://cal.com/rov-studios-imhphw/15min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`cta-shine block rounded-full text-center font-semibold text-white transition-all duration-300 hover:scale-[1.03] ${
                                    tier.recommended ? "" : "border border-white/10 hover:border-white/20"
                                }`}
                                style={{
                                    fontFamily: HEADING,
                                    padding: "14px",
                                    fontSize: "13px",
                                    letterSpacing: "0.05em",
                                    ...(tier.recommended
                                        ? {
                                              background:
                                                  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                                              boxShadow:
                                                  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                                          }
                                        : { background: "rgba(255,255,255,0.03)" }),
                                }}
                            >
                                Book a call &rarr;
                            </a>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ ...spring, delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-white/[0.06] px-6 py-4 md:gap-10"
                    style={{ background: "rgba(255,255,255,0.02)", fontFamily: BODY }}
                >
                    <MarketRateTooltip
                        sources={[
                            {
                                name: "Clutch.co — Branding Agency Pricing",
                                url: "https://clutch.co/agencies/branding/pricing",
                                detail: "Agency-reported project ranges for brand identity work across small and mid-market clients.",
                            },
                            {
                                name: "GoodFirms — Logo & Brand Design Cost Research",
                                url: "https://www.goodfirms.co/resources/logo-design-cost",
                                detail: "Survey of design firms covering identity project cost bands by scope and firm size.",
                            },
                        ]}
                    >
                        <span className="text-xs uppercase tracking-[0.15em] text-white/30">
                            Market rate:{" "}
                            <span className="font-medium text-white/50">$5,000 – $30,000</span>
                        </span>
                    </MarketRateTooltip>
                    <span className="hidden h-4 w-px bg-white/10 md:block" />
                    <span className="text-xs uppercase tracking-[0.15em] text-white/30">
                        ROV:{" "}
                        <span className="font-semibold text-[#EA9A61]">{range(FLOOR, CEILING).replace(" to ", " – ")}</span>
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
