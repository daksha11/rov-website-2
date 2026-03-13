"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                ...style,
            }}
        >
            {/* Browser Chrome Top Bar */}
            <div className="h-7 md:h-8 bg-[#1a1a1a] flex items-center gap-1.5 px-3">
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#27ca40]" />
            </div>
            {/* Screenshot */}
            <div className="relative aspect-[16/10] w-full">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover object-top"
                    priority={priority}
                    sizes="(max-width: 768px) 85vw, (max-width: 1024px) 340px, 420px"
                />
            </div>
        </div>
    );
}

export default function WebHero() {
    const heroRef = useRef<HTMLElement>(null);
    const leftMockupRef = useRef<HTMLDivElement>(null);
    const centerMockupRef = useRef<HTMLDivElement>(null);
    const rightMockupRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const trigger = {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.5,
            };

            if (leftMockupRef.current) {
                gsap.to(leftMockupRef.current, { y: -80, ease: "none", scrollTrigger: trigger });
            }
            if (centerMockupRef.current) {
                gsap.to(centerMockupRef.current, { y: -140, ease: "none", scrollTrigger: { ...trigger } });
            }
            if (rightMockupRef.current) {
                gsap.to(rightMockupRef.current, { y: -60, ease: "none", scrollTrigger: { ...trigger } });
            }
        }, heroRef);

        return () => ctx.revert();
    }, [isMobile]);

    return (
        <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 lg:pt-48 pb-20 overflow-hidden">
            {/* Background: Dot Grid Texture */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: "radial-gradient(rgba(255, 244, 227, 0.04) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            {/* Background: Bottom-left gradient blob */}
            <div
                className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] rounded-full pointer-events-none z-0"
                style={{
                    background: "rgba(96, 62, 37, 0.60)",
                    filter: "blur(200px)",
                    transform: "translate(-20%, 20%)",
                }}
            />

            {/* Background: Top-right ambient glow */}
            <div
                className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none z-0"
                style={{
                    background: "rgba(139, 115, 85, 0.15)",
                    filter: "blur(180px)",
                    transform: "translate(30%, -30%)",
                }}
            />

            {/* Content Layer */}
            <div className="relative z-10 max-w-7xl w-full text-center">
                {/* Headline */}
                <h1 className="mb-4 md:mb-6">
                    <motion.span
                        className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white/80 mb-1 font-bold"
                        style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        Your Website
                    </motion.span>
                    <motion.span
                        className="block text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold"
                        style={{
                            fontFamily: "Norwige, sans-serif",
                            fontStyle: "italic",
                            letterSpacing: "-0.02em",
                            background: "linear-gradient(135deg, #EA9A61 0%, #B16937 50%, #A64D2B 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
                    >
                        Reimagined
                    </motion.span>
                </h1>

                {/* Subtitle */}
                <motion.p
                    className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-10"
                    style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
                >
                    Websites designed with intention, built for impact, crafted to convert.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                >
                    <Link href="https://calendly.com/rangeofviewmusic/30min" target="_blank">
                        <motion.button
                            className="px-8 py-3.5 md:px-10 md:py-4 text-white rounded-full font-medium transition-all uppercase tracking-wide text-sm md:text-base"
                            style={{
                                background: "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
                                fontFamily: "Roboto, sans-serif",
                                boxShadow: "0 4px 24px rgba(160, 90, 40, 0.4)",
                            }}
                            whileHover={{ scale: 1.04, boxShadow: "0 6px 32px rgba(160, 90, 40, 0.6)" }}
                            whileTap={{ scale: 0.97 }}
                        >
                            LET&apos;S CREATE <span className="ml-2">&rarr;</span>
                        </motion.button>
                    </Link>
                    <Link href="#featured-works">
                        <motion.button
                            className="px-8 py-3.5 md:px-10 md:py-4 text-white rounded-full font-medium transition-all uppercase tracking-wide text-sm md:text-base border border-white/20"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.06)" }}
                            whileTap={{ scale: 0.97 }}
                        >
                            VIEW OUR WORK
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* Floating Mockups Layer */}
            <div
                className="relative z-[5] w-full max-w-6xl mx-auto"
                style={{ perspective: "1200px" }}
            >
                <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
                    {/* Left Mockup */}
                    <motion.div
                        ref={leftMockupRef}
                        className="hidden md:block absolute left-[2%] lg:left-[5%] top-[10%] w-[240px] lg:w-[340px] z-[1] will-change-transform"
                        style={{
                            transformStyle: "preserve-3d",
                            animation: "mockup-float 6s ease-in-out infinite",
                            animationDelay: "0s",
                        }}
                        initial={{ opacity: 0, x: -80, rotateY: 20 }}
                        animate={{ opacity: 1, x: 0, rotateY: 8, rotateX: -3 }}
                        transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
                    >
                        <MockupFrame
                            src="/heroassets/webfolder3.webp"
                            alt="The Bando - Website designed by ROV Studios"
                        />
                    </motion.div>

                    {/* Center Mockup */}
                    <motion.div
                        ref={centerMockupRef}
                        className="absolute top-0 left-0 right-0 mx-auto w-[85vw] md:w-[340px] lg:w-[420px] z-[3] will-change-transform"
                        style={{
                            transformStyle: "preserve-3d",
                            animation: "mockup-float 6s ease-in-out infinite",
                            animationDelay: "-2s",
                        }}
                        initial={{ opacity: 0, y: 60, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 2 }}
                        transition={{ duration: 1.0, delay: 0.45, ease: "easeOut" }}
                    >
                        <MockupFrame
                            src="/heroassets/webfolder2.webp"
                            alt="Aysegul Ikna - Website designed by ROV Studios"
                            priority
                        />
                    </motion.div>

                    {/* Right Mockup */}
                    <motion.div
                        ref={rightMockupRef}
                        className="hidden md:block absolute right-[2%] lg:right-[5%] top-[15%] w-[220px] lg:w-[320px] z-[2] will-change-transform"
                        style={{
                            transformStyle: "preserve-3d",
                            animation: "mockup-float 6s ease-in-out infinite",
                            animationDelay: "-4s",
                        }}
                        initial={{ opacity: 0, x: 80, rotateY: -20 }}
                        animate={{ opacity: 1, x: 0, rotateY: -8, rotateX: -2 }}
                        transition={{ duration: 1.0, delay: 0.6, ease: "easeOut" }}
                    >
                        <MockupFrame
                            src="/heroassets/webfolder1.png"
                            alt="Portfolio website designed by ROV Studios"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Bottom Section - "Uncover the true potential" */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start max-w-6xl mx-auto mt-24 md:mt-32 lg:mt-40 px-4">
                {/* Left - Potential Text */}
                <motion.div
                    className="text-left"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h3
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                        Uncover the true{" "}
                        <span className="inline-flex items-center gap-2">
                            <span
                                className="inline-flex items-center px-4 py-1 md:px-6 md:py-2 rounded-full text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl"
                                style={{
                                    background: "#957E5E",
                                    fontStyle: "italic",
                                }}
                            >
                                potential
                            </span>
                            {/* Decorative Circles */}
                            <span className="inline-flex items-center -ml-3">
                                <span
                                    className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full"
                                    style={{ background: "#957E5E" }}
                                />
                                <span
                                    className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full -ml-4 md:-ml-6"
                                    style={{
                                        border: "3px solid white",
                                        background: "transparent",
                                    }}
                                />
                            </span>
                        </span>
                        <br />
                        of your website
                    </h3>
                </motion.div>

                {/* Right - Description Text */}
                <motion.div
                    className="text-left md:text-right"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                >
                    <p
                        className="text-base sm:text-lg md:text-xl leading-relaxed"
                        style={{
                            fontFamily: "Norwige, sans-serif",
                            fontStyle: "italic",
                        }}
                    >
                        Designed with intention. Built for impact. We craft websites that clearly communicate your brand and work harder for your business.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
