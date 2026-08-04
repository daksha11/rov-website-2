"use client";

// Image-led proof for /brand. A bento grid of real identity work, pulling the
// same assets the case study pages use so nothing new had to be shot and nothing
// can drift out of sync.
//
// Copy is deliberately minimal: category, name, and one short line, revealed on
// hover on desktop and always visible on touch. The images are the argument here,
// so the text stays out of their way.

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

type Work = {
    name: string;
    category: string;
    line: string;
    src: string;
    alt: string;
    href: string;
    /** Tailwind span classes: the bento rhythm. */
    span: string;
};

const WORKS: Work[] = [
    {
        name: "DKM Corp",
        category: "Identity + website",
        line: "One system across India, Australia, the US, and Dubai.",
        src: "/casestudy/dubaiskyline.webp",
        alt: "DKM Corp brand identity work, Dubai skyline",
        href: "/casestudy/dkm",
        span: "md:col-span-2 md:row-span-2",
    },
    {
        name: "Aysegul Ikna",
        category: "Brand + e-commerce",
        line: "Zero online sales to 20% revenue growth.",
        src: "/casestudy/ikna/fashion1ikna.webp",
        alt: "Aysegul Ikna sustainable fashion brand identity",
        href: "/casestudy/ikna",
        span: "md:col-span-2",
    },
    {
        name: "The Bando",
        category: "Rebrand + rebuild",
        line: "689x more online orders in 139 days.",
        src: "/casestudy/bando/bando1.webp",
        alt: "The Bando Atlanta restaurant brand and website",
        href: "/casestudy/bando",
        span: "",
    },
    {
        name: "Pursue Networking",
        category: "Identity + platform",
        line: "A community brand built from nothing.",
        src: "/casestudy/Pursue/pursuecover.webp",
        alt: "Pursue Networking brand identity and platform",
        href: "/casestudy/pursue-networking",
        span: "",
    },
    {
        name: "Atlanta Tech Meetup",
        category: "Event identity",
        line: "A brand that had to work on a badge and a stage.",
        src: "/casestudy/atm/atm1.webp",
        alt: "Atlanta Tech Meetup event branding",
        href: "/casestudy/atlanta-tech-meetup",
        span: "md:col-span-2",
    },
];

function Card({ work, i, inView }: { work: Work; i: number; inView: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.1 + i * 0.07 }}
            className={`group relative min-h-[220px] overflow-hidden rounded-2xl border border-white/10 ${work.span}`}
        >
            <Link href={work.href} className="block h-full w-full">
                <Image
                    src={work.src}
                    alt={work.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />

                {/* Legibility scrim, deepened on hover. */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                        background:
                            "linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.35) 42%, rgba(0,0,0,0.05) 100%)",
                    }}
                />
                {/* Brand tint that only arrives on hover. */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                        background:
                            "linear-gradient(to top, rgba(144,66,44,0.42) 0%, rgba(234,154,97,0.10) 55%, transparent 100%)",
                    }}
                />

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <span
                        className="mb-1.5 block text-[0.62rem] uppercase tracking-[0.22em] text-[#EA9A61]"
                        style={{ fontFamily: BODY }}
                    >
                        {work.category}
                    </span>
                    <h3
                        className="text-lg text-white md:text-xl"
                        style={{ fontFamily: HEADING }}
                    >
                        {work.name}
                    </h3>
                    {/* Always visible on touch, slides in on hover for pointers. */}
                    <p
                        className="mt-1 text-[0.82rem] leading-snug text-white/70 transition-all duration-500 md:max-h-0 md:translate-y-1 md:overflow-hidden md:opacity-0 md:group-hover:max-h-16 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                        style={{ fontFamily: BODY }}
                    >
                        {work.line}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}

export default function BrandWorkGallery() {
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
                    Identity work
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ ...spring, delay: 0.08 }}
                    className="mb-10 max-w-2xl text-3xl font-bold italic text-white md:text-4xl lg:text-5xl"
                    style={{ fontFamily: HEADING }}
                >
                    Systems, not logos
                </motion.h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(220px,auto)]">
                    {WORKS.map((w, i) => (
                        <Card key={w.name} work={w} i={i} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    );
}
