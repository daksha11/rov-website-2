"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const HEADING = "Norwige, sans-serif";
const BODY = "Roboto, sans-serif";

// ── Pixel Trail + Starry Night Canvas ──────────────────────

interface TrailPixel {
    x: number;
    y: number;
    birth: number;
}

interface Star {
    x: number;
    y: number;
    size: number;
    nextBlink: number;  // timestamp of next blink
    blinkDur: number;   // how long the blink lasts (ms)
    blinkStart: number; // when current blink started
    color: string;
}

const PIXEL_MAX_LIFE = 2000;
const TRAIL_SPAWN_DIST = 5;
const MAX_PIXEL_SIZE = 14;
const MIN_PIXEL_SIZE = 3;
const GLOW_RADIUS = 160;
const STAR_COUNT = 40;

const STAR_COLORS = [
    "234,154,97",
    "177,105,55",
    "166,77,43",
    "149,126,94",
    "200,160,120",
    "255,210,170",
];

function scheduleNextBlink(): number {
    return performance.now() + 1000 + Math.random() * 4000;
}

// Exposed ref for parent to feed mouse position
interface PixelCanvasHandle {
    feedMouse: (x: number, y: number) => void;
    feedLeave: () => void;
}

const PixelSpotlightCanvas = ({ canvasHandle }: { canvasHandle: React.MutableRefObject<PixelCanvasHandle | null> }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number; y: number } | null>(null);
    const lastSpawnRef = useRef<{ x: number; y: number } | null>(null);
    const trailRef = useRef<TrailPixel[]>([]);
    const starsRef = useRef<Star[]>([]);
    const initedRef = useRef(false);

    // Expose mouse feed to parent
    useEffect(() => {
        canvasHandle.current = {
            feedMouse: (x: number, y: number) => {
                mouseRef.current = { x, y };
                const last = lastSpawnRef.current;
                if (!last || Math.hypot(x - last.x, y - last.y) >= TRAIL_SPAWN_DIST) {
                    trailRef.current.push({ x, y, birth: performance.now() });
                    lastSpawnRef.current = { x, y };
                }
            },
            feedLeave: () => {
                mouseRef.current = null;
                lastSpawnRef.current = null;
            },
        };
    }, [canvasHandle]);

    const initStars = useCallback((w: number, h: number) => {
        if (initedRef.current) return;
        initedRef.current = true;
        const now = performance.now();
        const stars: Star[] = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: w * 0.35 + Math.random() * w * 0.63,
                y: Math.random() * h,
                size: 2 + Math.random() * 5,
                nextBlink: now + Math.random() * 3000,
                blinkDur: 300 + Math.random() * 600,
                blinkStart: 0,
                color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
            });
        }
        starsRef.current = stars;
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.clientWidth;
        const h = canvas.clientHeight;

        if (w === 0 || h === 0) {
            animRef.current = requestAnimationFrame(draw);
            return;
        }

        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initStars(w, h);
        }

        const now = performance.now();
        ctx.clearRect(0, 0, w, h);

        const mouse = mouseRef.current;
        const trail = trailRef.current;

        for (let i = trail.length - 1; i >= 0; i--) {
            if (now - trail[i].birth > PIXEL_MAX_LIFE) trail.splice(i, 1);
        }

        // ── 1. Starry pixels — random blink pattern ──
        for (const star of starsRef.current) {
            let alpha = 0.08; // dim baseline

            // Check if it's time to blink
            if (star.blinkStart > 0) {
                const elapsed = now - star.blinkStart;
                if (elapsed < star.blinkDur) {
                    // Blink: quick flash up then fade down
                    const t = elapsed / star.blinkDur;
                    const curve = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
                    alpha = 0.08 + curve * 0.75;
                } else {
                    star.blinkStart = 0;
                    star.nextBlink = scheduleNextBlink();
                }
            } else if (now >= star.nextBlink) {
                star.blinkStart = now;
            }

            const half = star.size / 2;
            const sx = Math.round(star.x / star.size) * star.size;
            const sy = Math.round(star.y / star.size) * star.size;

            if (alpha > 0.4) {
                ctx.shadowColor = `rgba(${star.color},0.7)`;
                ctx.shadowBlur = star.size * 3;
            }

            ctx.fillStyle = `rgba(${star.color},${alpha})`;
            ctx.fillRect(sx - half, sy - half, star.size - 1, star.size - 1);
            ctx.shadowBlur = 0;
        }

        // ── 2. Cursor glow ──
        if (mouse) {
            const grad = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, GLOW_RADIUS
            );
            grad.addColorStop(0, "rgba(234,154,97,0.20)");
            grad.addColorStop(0.25, "rgba(234,154,97,0.10)");
            grad.addColorStop(0.5, "rgba(234,154,97,0.04)");
            grad.addColorStop(1, "rgba(234,154,97,0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }

        // ── 3. Pixel trail ──
        for (const p of trail) {
            const age = now - p.birth;
            const progress = age / PIXEL_MAX_LIFE;
            if (progress >= 1) continue;

            const fade = 1 - progress;
            const size = MIN_PIXEL_SIZE + (MAX_PIXEL_SIZE - MIN_PIXEL_SIZE) * fade;
            const half = size / 2;
            const grid = Math.max(4, Math.round(size));
            const sx = Math.round(p.x / grid) * grid;
            const sy = Math.round(p.y / grid) * grid;

            if (fade > 0.3) {
                ctx.shadowColor = "#EA9A61";
                ctx.shadowBlur = size * 1.5 * fade;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = `rgba(234,154,97,${fade * 0.65})`;
            ctx.fillRect(sx - half, sy - half, size - 1, size - 1);

            if (fade > 0.5) {
                ctx.shadowBlur = 0;
                const coreSize = size * 0.4;
                ctx.fillStyle = `rgba(255,210,170,${(fade - 0.5) * 1.4})`;
                ctx.fillRect(sx - coreSize / 2, sy - coreSize / 2, coreSize, coreSize);
            }
            ctx.shadowBlur = 0;
        }

        // ── 4. Cursor pixel ──
        if (mouse) {
            const snapGrid = MAX_PIXEL_SIZE;
            const sx = Math.round(mouse.x / snapGrid) * snapGrid;
            const sy = Math.round(mouse.y / snapGrid) * snapGrid;
            const half = MAX_PIXEL_SIZE / 2;

            ctx.shadowColor = "#EA9A61";
            ctx.shadowBlur = 24;
            ctx.fillStyle = "rgba(234,154,97,0.9)";
            ctx.fillRect(sx - half, sy - half, MAX_PIXEL_SIZE - 1, MAX_PIXEL_SIZE - 1);
            ctx.shadowBlur = 0;

            ctx.fillStyle = "rgba(255,220,180,0.95)";
            ctx.fillRect(sx - 3, sy - 3, 6, 6);
        }

        animRef.current = requestAnimationFrame(draw);
    }, [initStars]);

    useEffect(() => {
        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [draw]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full pointer-events-none"
            style={{ width: "100%", height: "100%" }}
        />
    );
};

// ── Main Hero ──────────────────────────────────────────

export default function WebHero() {
    const heroRef = useRef<HTMLElement>(null);
    const canvasHandle = useRef<PixelCanvasHandle | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (isMobile) return;
            const rect = heroRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setMousePos({ x, y });
                canvasHandle.current?.feedMouse(x, y);
            }
        },
        [isMobile]
    );

    const handleMouseLeave = useCallback(() => {
        canvasHandle.current?.feedLeave();
    }, []);

    return (
        <section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative bg-black overflow-hidden"
        >
            {/* ── Background Layers ── */}
            <div
                className="absolute bottom-0 left-0 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full pointer-events-none"
                style={{
                    background: "rgba(139, 99, 55, 0.12)",
                    filter: "blur(160px)",
                    transform: "translate(-30%, 30%)",
                }}
            />

            {!isMobile && (
                <div
                    className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-[1]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(234,154,97,0.04) 0%, transparent 70%)",
                        left: mousePos.x,
                        top: mousePos.y,
                        transform: "translate(-50%, -50%)",
                        transition: "left 0.3s ease-out, top 0.3s ease-out",
                    }}
                />
            )}

            {/* Pixel trail canvas — covers entire hero, pointer-events-none */}
            {!isMobile && (
                <div className="absolute inset-0 z-[2] pointer-events-none">
                    <PixelSpotlightCanvas canvasHandle={canvasHandle} />
                </div>
            )}

            {/* ════════════════════════════════════════════
                ACT 1 — EDITORIAL HEADLINE + PIXEL REVEAL
            ════════════════════════════════════════════ */}
            <div
                className="relative z-10 max-w-[1400px] mx-auto"
                style={{
                    padding:
                        "clamp(120px, 18vh, 200px) clamp(24px, 5vw, 60px) clamp(60px, 10vh, 120px)",
                }}
            >
                {/* Typography Stack */}
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
                                background:
                                    "linear-gradient(135deg, #EA9A61 0%, #B16937 40%, #A64D2B 100%)",
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
                                    background:
                                        "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
                                    boxShadow: "0 4px 24px rgba(160, 90, 40, 0.35)",
                                }}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: "0 6px 32px rgba(160, 90, 40, 0.55)",
                                }}
                                whileTap={{ scale: 0.97 }}
                            >
                                LET&apos;S CREATE <span className="ml-2">&rarr;</span>
                            </motion.button>
                        </Link>
                        <Link href="#featured-works">
                            <motion.button
                                className="px-8 py-3.5 md:px-10 md:py-4 text-white rounded-full font-medium uppercase tracking-wide text-sm border border-white/15"
                                style={{ fontFamily: BODY }}
                                whileHover={{
                                    scale: 1.03,
                                    backgroundColor: "rgba(255,255,255,0.04)",
                                }}
                                whileTap={{ scale: 0.97 }}
                            >
                                VIEW OUR WORK
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Accent divider line */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div
                    className="h-px w-full"
                    style={{ background: "rgba(255,244,227,0.06)" }}
                />
            </div>

            {/* ════════════════════════════════════════════
                ACT 3 — CLOSING STATEMENT
            ════════════════════════════════════════════ */}
            <div
                className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start max-w-[1200px] mx-auto px-6 md:px-12"
                style={{
                    paddingBottom: "clamp(60px, 10vw, 120px)",
                    paddingTop: "clamp(40px, 6vw, 80px)",
                }}
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
                        Designed with intention. Built for impact. We craft websites that clearly
                        communicate your brand and work harder for your business.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
