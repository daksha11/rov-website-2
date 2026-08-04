"use client";

// Hero for /brand. The centerpiece canvas is the argument, not decoration: one
// identity mark at the centre, five touchpoints orbiting it, and pulses that
// travel outward to keep each one on-brand. Nodes that stop receiving a pulse
// decay toward grey, which is exactly what happens to a real receipt or
// confirmation email nobody ever applied the brand to. Moving the cursor near a
// node re-energises it.
//
// Canvas rules (see CLAUDE.md): the element is always 100% x 100% and derives
// its real size from the parent via clientWidth/clientHeight every frame. The
// draw loop skips and reschedules whenever either dimension is 0, so a canvas
// that has not been laid out yet never renders a black box.

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import GradientButton from "./GradientButton";

const HEADING = "Norwige, sans-serif";
const BODY = "Roboto, sans-serif";

const TOUCHPOINTS = ["Website", "Email", "Receipt", "Thank-you", "Review ask"];

const BRAND_RGB = "234,154,97";
const DECAY_MS = 2600; // how long a node stays lit after a pulse reaches it
const PULSE_INTERVAL = 900; // ms between pulses leaving the centre
const PULSE_TRAVEL = 1400; // ms for a pulse to reach its node

type Node = { angle: number; label: string; lit: number };
type Pulse = { target: number; start: number };

function BrandSystemCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef<{ x: number; y: number } | null>(null);

    const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }, []);

    const handleLeave = useCallback(() => {
        mouse.current = null;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const nodes: Node[] = TOUCHPOINTS.map((label, i) => ({
            angle: (i / TOUCHPOINTS.length) * Math.PI * 2 - Math.PI / 2,
            label,
            lit: 0,
        }));
        let pulses: Pulse[] = [];
        let next = 0;
        let cursor = 0;
        let raf = 0;

        const draw = (t: number) => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;

            // Guard: never draw into an unlaid-out canvas. Skip and try again.
            if (!w || !h) {
                raf = requestAnimationFrame(draw);
                return;
            }

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
                canvas.width = Math.round(w * dpr);
                canvas.height = Math.round(h * dpr);
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;
            const radius = Math.min(w, h) * 0.34;

            if (t > next) {
                pulses.push({ target: cursor % nodes.length, start: t });
                cursor += 1;
                next = t + PULSE_INTERVAL;
            }

            // ── Spokes and nodes ──
            nodes.forEach((n, i) => {
                const nx = cx + Math.cos(n.angle) * radius;
                const ny = cy + Math.sin(n.angle) * radius;

                if (mouse.current) {
                    const d = Math.hypot(mouse.current.x - nx, mouse.current.y - ny);
                    if (d < 70) n.lit = t;
                }

                const age = n.lit ? t - n.lit : Infinity;
                const heat = age < DECAY_MS ? 1 - age / DECAY_MS : 0;

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(nx, ny);
                ctx.strokeStyle = `rgba(255,255,255,${0.05 + heat * 0.12})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Grey when neglected, brand colour when it just received a pulse.
                const r = 5 + heat * 3;
                ctx.beginPath();
                ctx.arc(nx, ny, r, 0, Math.PI * 2);
                ctx.fillStyle = heat > 0
                    ? `rgba(${BRAND_RGB},${0.35 + heat * 0.65})`
                    : "rgba(255,255,255,0.16)";
                ctx.fill();

                if (heat > 0) {
                    ctx.beginPath();
                    ctx.arc(nx, ny, r + 10 * heat, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${BRAND_RGB},${heat * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                ctx.font = `500 ${Math.max(9, Math.min(11, w / 46))}px Roboto, sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = heat > 0
                    ? `rgba(${BRAND_RGB},${0.5 + heat * 0.4})`
                    : "rgba(255,255,255,0.28)";
                const lx = cx + Math.cos(n.angle) * (radius + 26);
                const ly = cy + Math.sin(n.angle) * (radius + 26);
                ctx.fillText(nodes[i].label, lx, ly);
            });

            // ── Pulses in flight ──
            pulses = pulses.filter((p) => {
                const prog = (t - p.start) / PULSE_TRAVEL;
                if (prog >= 1) {
                    nodes[p.target].lit = t;
                    return false;
                }
                const n = nodes[p.target];
                const px = cx + Math.cos(n.angle) * radius * prog;
                const py = cy + Math.sin(n.angle) * radius * prog;
                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${BRAND_RGB},0.9)`;
                ctx.fill();
                return true;
            });

            // ── The mark at the centre ──
            const breathe = 1 + Math.sin(t / 1100) * 0.04;
            ctx.beginPath();
            ctx.arc(cx, cy, 26 * breathe, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${BRAND_RGB},0.10)`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx, cy, 26 * breathe, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${BRAND_RGB},0.45)`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${BRAND_RGB},0.85)`;
            ctx.fill();

            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            aria-hidden="true"
            style={{ width: "100%", height: "100%", display: "block" }}
        />
    );
}

export default function BrandHero() {
    return (
        <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center md:px-12">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `
                        radial-gradient(ellipse 1100px 900px at 20% 20%, rgba(234,154,97,0.26) 0%, transparent 55%),
                        radial-gradient(ellipse 1000px 900px at 80% 60%, rgba(177,105,55,0.20) 0%, transparent 55%)
                    `,
                }}
            />

            <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
                <motion.span
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-9 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
                    style={{
                        background: "rgba(126,42,12,0.20)",
                        border: "1px solid rgba(202,53,0,0.30)",
                        color: "#E8914A",
                        fontFamily: BODY,
                    }}
                >
                    <span aria-hidden="true">✦</span>
                    Brand Identity &amp; Experience
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.12 }}
                    className="max-w-4xl text-[clamp(2.5rem,6.6vw,5.6rem)] font-extrabold leading-[1.06] tracking-[-0.01em] text-white"
                    style={{ fontFamily: "TestSohne-Extrafett, Norwige, sans-serif" }}
                >
                    Your brand stops at the logo.
                    <span
                        className="mt-2 block text-[clamp(2.3rem,6vw,5rem)] font-normal leading-[1.14]"
                        style={{
                            fontFamily: "NorwigeHeroItalic, sans-serif",
                            background: "linear-gradient(90deg, #FF8904 0%, #F54900 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Your customers don&apos;t.
                    </span>
                </motion.h1>

                {/* The centrepiece. Parent owns the sizing, canvas fills it. */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="my-10"
                    style={{ width: "min(92vw, 620px)", height: "min(62vw, 400px)" }}
                >
                    <BrandSystemCanvas />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.42 }}
                    className="max-w-xl text-[clamp(0.95rem,1.6vw,1.1rem)] leading-relaxed text-white/60"
                    style={{ fontFamily: BODY }}
                >
                    Most businesses buy a logo, then send a confirmation email that looks like a 2009
                    receipt. We build the identity and every surface it has to survive on.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.54 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                    <GradientButton href="/report">Get a free audit</GradientButton>
                    <GradientButton href="#see-it" variant="ghost">
                        See the difference
                    </GradientButton>
                </motion.div>
            </div>
        </section>
    );
}
