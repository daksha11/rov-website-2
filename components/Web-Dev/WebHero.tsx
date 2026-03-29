"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HEADING = "Norwige, sans-serif";
const BODY = "Roboto, sans-serif";

// ── MockupFrame ────────────────────────────────────────

interface MockupFrameProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    priority?: boolean;
}

function MockupFrame({ src, alt, className = "", style, priority = false }: MockupFrameProps) {
    return (
        <div
            className={`rounded-2xl overflow-hidden ${className}`}
            style={{
                border: "1px solid rgba(255,244,227,0.06)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,244,227,0.04)",
                ...style,
            }}
        >
            <div className="h-7 md:h-8 bg-[#1a1a1a] flex items-center gap-1.5 px-3">
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#27ca40]" />
            </div>
            <div className="relative aspect-[16/10] w-full">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    unoptimized
                    className="object-cover object-top"
                    priority={priority}
                    sizes="(max-width: 768px) 85vw, (max-width: 1024px) 340px, 520px"
                />
            </div>
        </div>
    );
}

// ── Main Hero ──────────────────────────────────────────

export default function WebHero() {
    const heroRef = useRef<HTMLElement>(null);
    const heroMockupRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Mobile detection
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // GSAP parallax
    useEffect(() => {
        if (isMobile) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const base = {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
            };

            if (heroMockupRef.current)
                gsap.to(heroMockupRef.current, { y: -100, ease: "none", scrollTrigger: base });
        }, heroRef);

        return () => ctx.revert();
    }, [isMobile]);

    // Cursor glow
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isMobile) return;
        const rect = heroRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    }, [isMobile]);

    return (
        <section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            className="relative bg-black overflow-hidden"
        >
            {/* ── Background Layers ── */}

            {/* Warm ambient glow — bottom left */}
            <div
                className="absolute bottom-0 left-0 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full pointer-events-none"
                style={{
                    background: "rgba(139, 99, 55, 0.12)",
                    filter: "blur(160px)",
                    transform: "translate(-30%, 30%)",
                }}
            />

            {/* Cursor-following glow (desktop only) */}
            {!isMobile && (
                <div
                    className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-[1]"
                    style={{
                        background: "radial-gradient(circle, rgba(234,154,97,0.04) 0%, transparent 70%)",
                        left: mousePos.x,
                        top: mousePos.y,
                        transform: "translate(-50%, -50%)",
                        transition: "left 0.3s ease-out, top 0.3s ease-out",
                    }}
                />
            )}

            {/* ════════════════════════════════════════════
                ACT 1 — EDITORIAL HEADLINE
            ════════════════════════════════════════════ */}
            <div
                className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-0"
                style={{ padding: "clamp(120px, 18vh, 200px) clamp(24px, 5vw, 60px) clamp(60px, 10vh, 120px)" }}
            >
                {/* Left — Typography Stack */}
                <div className="text-center md:text-left">
                    {/* Overline */}
                    <motion.span
                        className="block text-white/40 mb-8 md:mb-10 uppercase"
                        style={{ fontFamily: BODY, fontSize: "12px", letterSpacing: "0.2em" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    >
                        Web Development
                    </motion.span>

                    {/* Headline */}
                    <h1>
                        <motion.span
                            className="block font-bold italic leading-[0.9]"
                            style={{
                                fontFamily: HEADING,
                                fontSize: "clamp(3.5rem, 8vw, 8rem)",
                                color: "#FFF4E3",
                                letterSpacing: "-0.03em",
                            }}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        >
                            Purpose
                        </motion.span>

                        <motion.span
                            className="block font-bold italic leading-[0.9]"
                            style={{
                                fontFamily: HEADING,
                                fontSize: "clamp(3.5rem, 8vw, 8rem)",
                                color: "#FFF4E3",
                                letterSpacing: "-0.03em",
                                marginLeft: "clamp(0rem, 4vw, 5rem)",
                            }}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
                        >
                            in Every
                        </motion.span>

                        <motion.span
                            className="block font-bold italic leading-[0.9]"
                            style={{
                                fontFamily: HEADING,
                                fontSize: "clamp(3.5rem, 8vw, 8rem)",
                                letterSpacing: "-0.03em",
                                background: "linear-gradient(135deg, #EA9A61 0%, #B16937 40%, #A64D2B 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        >
                            Pixel.
                        </motion.span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-white/50 max-w-[380px] mx-auto md:mx-0 mt-10 md:mt-12"
                        style={{
                            fontFamily: HEADING,
                            fontStyle: "italic",
                            fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
                            lineHeight: 1.6,
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
                    >
                        Websites designed with intention, built for impact, crafted to convert.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center md:items-start gap-4 mt-8 md:mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.85, ease: "easeOut" }}
                    >
                        <Link href="https://calendly.com/rangeofviewmusic/30min" target="_blank">
                            <motion.button
                                className="cta-shine px-8 py-3.5 md:px-10 md:py-4 text-white rounded-full font-medium uppercase tracking-wide text-sm"
                                style={{
                                    fontFamily: BODY,
                                    background: "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
                                    boxShadow: "0 4px 24px rgba(160, 90, 40, 0.35)",
                                }}
                                whileHover={{ scale: 1.03, boxShadow: "0 6px 32px rgba(160, 90, 40, 0.55)" }}
                                whileTap={{ scale: 0.97 }}
                            >
                                LET&apos;S CREATE <span className="ml-2">&rarr;</span>
                            </motion.button>
                        </Link>
                        <Link href="#featured-works">
                            <motion.button
                                className="px-8 py-3.5 md:px-10 md:py-4 text-white rounded-full font-medium uppercase tracking-wide text-sm border border-white/15"
                                style={{ fontFamily: BODY }}
                                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.04)" }}
                                whileTap={{ scale: 0.97 }}
                            >
                                VIEW OUR WORK
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Mobile mockup (shown below CTAs on small screens) */}
                    <motion.div
                        className="md:hidden mt-12 w-[85vw] mx-auto"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
                    >
                        <MockupFrame
                            src="/heroassets/webfolder2.webp"
                            alt="Aysegul Ikna website by ROV Studios"
                            priority
                        />
                    </motion.div>
                </div>

                {/* Right — Hero Mockup (desktop only) */}
                <motion.div
                    ref={heroMockupRef}
                    className="hidden md:flex items-end justify-end will-change-transform"
                    style={{ perspective: "1200px" }}
                    initial={{ opacity: 0, x: 60, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <div
                        style={{
                            width: "clamp(380px, 32vw, 520px)",
                            transform: "rotateY(-4deg) rotateX(2deg)",
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <MockupFrame
                            src="/heroassets/webfolder2.webp"
                            alt="Aysegul Ikna website by ROV Studios"
                            priority
                        />
                    </div>
                </motion.div>
            </div>

            {/* Accent divider line */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="h-px w-full" style={{ background: "rgba(255,244,227,0.06)" }} />
            </div>


            {/* ════════════════════════════════════════════
                ACT 3 — CLOSING STATEMENT
            ════════════════════════════════════════════ */}
            <div
                className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start max-w-[1200px] mx-auto px-6 md:px-12"
                style={{ paddingBottom: "clamp(60px, 10vw, 120px)", paddingTop: "clamp(40px, 6vw, 80px)" }}
            >
                {/* Left — "Uncover the true potential" */}
                <motion.div
                    className="text-left"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h3
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                        style={{ fontFamily: BODY }}
                    >
                        Uncover the true{" "}
                        <span className="inline-flex items-center gap-2">
                            <span
                                className="inline-flex items-center px-4 py-1 md:px-6 md:py-2 rounded-full text-white font-bold italic text-lg sm:text-xl md:text-2xl lg:text-3xl"
                                style={{ background: "#957E5E" }}
                            >
                                potential
                            </span>
                            <span className="inline-flex items-center -ml-3">
                                <span className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full" style={{ background: "#957E5E" }} />
                                <span className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full -ml-4 md:-ml-6" style={{ border: "3px solid white", background: "transparent" }} />
                            </span>
                        </span>
                        <br />
                        of your website
                    </h3>
                </motion.div>

                {/* Right — Description */}
                <motion.div
                    className="text-left md:text-right"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                >
                    <p
                        className="text-base sm:text-lg md:text-xl leading-relaxed max-w-[420px] md:ml-auto"
                        style={{ fontFamily: HEADING, fontStyle: "italic" }}
                    >
                        Designed with intention. Built for impact. We craft websites that clearly communicate your brand and work harder for your business.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
