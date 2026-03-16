"use client";

import { useState, useEffect } from "react";
import { useInView } from "./hooks";
import {
    BG_CARD, CARD_BORDER, CARD_BORDER_HOVER, SHADOW_CARD, SHADOW_CARD_HOVER,
    FONT_HEADING, FONT_BODY, WHITE, TEXT_40, ACCENT,
    BROWN_GRADIENT,
} from "./tokens";

/* ─── Animated Counter ─── */
export function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0 }: {
    value: number; prefix?: string; suffix?: string; decimals?: number;
}) {
    const { ref, visible } = useInView(0.3);
    const [display, setDisplay] = useState("0");
    useEffect(() => {
        if (!visible) return;
        const duration = 1800;
        const start = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setDisplay((value * eased).toFixed(decimals));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [visible, value, decimals]);
    return (
        <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
            {prefix}{Number(display).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
        </span>
    );
}

/* ─── Animated Bar ─── */
export function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
    const { ref, visible } = useInView(0.2);
    const [width, setWidth] = useState(0);
    useEffect(() => {
        if (!visible) return;
        const t = setTimeout(() => setWidth(pct), delay);
        return () => clearTimeout(t);
    }, [visible, pct, delay]);
    return (
        <div ref={ref} style={{ height: 6, background: "rgba(255,244,227,0.06)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 3, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
        </div>
    );
}

/* ─── Section Title ─── */
export function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
    return (
        <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                <div style={{ width: 32, height: 2, background: BROWN_GRADIENT, borderRadius: 1 }} />
                <h2 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: WHITE, margin: 0, letterSpacing: "0.01em" }}>
                    {children}
                </h2>
            </div>
            {sub && <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 15, color: "rgba(255,244,227,0.6)", marginTop: 8, marginLeft: 46 }}>{sub}</p>}
        </div>
    );
}

/* ─── Card ─── */
export function Card({ children, style, hover = true, onClick }: { children: React.ReactNode; style?: React.CSSProperties; hover?: boolean; onClick?: () => void }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => hover && setHovered(true)}
            onMouseLeave={() => hover && setHovered(false)}
            style={{
                background: BG_CARD,
                border: `1px solid ${hovered ? CARD_BORDER_HOVER : CARD_BORDER}`,
                borderRadius: 16,
                padding: 24,
                transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
                transform: hovered ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hovered ? SHADOW_CARD_HOVER : SHADOW_CARD,
                ...style,
            }}
        >
            {children}
        </div>
    );
}

/* ─── Status Dot (Yes/No/Partial) ─── */
export function StatusDot({ status }: { status: string }) {
    const config: Record<string, { bg: string; color: string; label: string }> = {
        yes: { bg: "rgba(234,154,97,0.15)", color: ACCENT, label: "\u2713" },
        no: { bg: "rgba(255,244,227,0.04)", color: TEXT_40, label: "\u2715" },
        partial: { bg: "rgba(177,105,55,0.15)", color: "#B16937", label: "~" },
    };
    const c = config[status] ?? config.no;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: 8,
            background: c.bg, color: c.color,
            fontSize: 13, fontWeight: 700, fontFamily: FONT_BODY,
        }}>
            {c.label}
        </span>
    );
}

/* ─── Coming Soon Placeholder ─── */
export function ComingSoonPlaceholder({ title }: { title: string }) {
    return (
        <div style={{ padding: "120px 24px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 18px", borderRadius: 999, border: "1px dashed rgba(234,154,97,0.35)", marginBottom: 28 }}>
                <span style={{ width: 24, height: 1, background: "rgba(234,154,97,0.5)" }} />
                <span style={{ fontSize: 11, color: ACCENT, fontFamily: FONT_HEADING, fontStyle: "italic", letterSpacing: "5px" }}>COMING SOON</span>
                <span style={{ width: 24, height: 1, background: "rgba(234,154,97,0.5)" }} />
            </div>
            <h2 style={{
                fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 900, color: WHITE, margin: "0 0 16px",
            }}>
                {title}
            </h2>
            <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 16, color: TEXT_40, maxWidth: 420, margin: "0 auto" }}>
                Research data for this vertical is being compiled. Check back soon.
            </p>
        </div>
    );
}
