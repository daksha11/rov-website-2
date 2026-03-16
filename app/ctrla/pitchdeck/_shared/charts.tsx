"use client";

import { useRef, useEffect } from "react";
import { useInView } from "./hooks";
import {
    ACCENT, ACCENT_MID, ACCENT_DARK, ACCENT_DEEPEST,
    BG_CARD, WHITE, TEXT_90, TEXT_60, TEXT_40,
    CARD_BORDER, FONT_HEADING, FONT_BODY,
} from "./tokens";
import type { SoundPricing } from "./types";

/* ─── Chart.js type helpers ─── */
type ChartInstance = { destroy(): void };
type ChartConstructor = { new(...args: unknown[]): ChartInstance };
function getChart(): ChartConstructor | null {
    return ((window as unknown as Record<string, unknown>).Chart as ChartConstructor) ?? null;
}

const TOOLTIP_STYLE = {
    backgroundColor: BG_CARD,
    titleColor: WHITE,
    bodyColor: TEXT_90,
    borderColor: CARD_BORDER,
    borderWidth: 1,
    titleFont: { family: FONT_HEADING },
    bodyFont: { family: FONT_BODY },
};

/* ═══════════════════════════════════════════════════════
   SOUND PRICING HORIZONTAL BAR
   ═══════════════════════════════════════════════════════ */
export function SoundPricingChart({ data }: { data: SoundPricing[] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<ChartInstance | null>(null);
    const { ref: wrapRef, visible } = useInView(0.3);

    useEffect(() => {
        if (!visible || !canvasRef.current) return;
        const Chart = getChart();
        if (!Chart) return;
        if (chartRef.current) chartRef.current.destroy();

        const sorted = [...data].sort((a, b) => a.priceNum - b.priceNum);
        const isROV = sorted.map(s => s.name.includes("R.O.V."));

        chartRef.current = new Chart(canvasRef.current, {
            type: "bar",
            data: {
                labels: sorted.map(s => s.name),
                datasets: [{
                    label: "Avg Price ($/song)",
                    data: sorted.map(s => s.priceNum),
                    backgroundColor: sorted.map((_, i) => isROV[i] ? ACCENT : "rgba(255,244,227,0.07)"),
                    borderColor: sorted.map((_, i) => isROV[i] ? ACCENT : "rgba(234,154,97,0.15)"),
                    borderWidth: 1,
                    borderRadius: 6,
                }],
            },
            options: {
                indexAxis: "y" as const,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        ...TOOLTIP_STYLE,
                        callbacks: {
                            label: (ctx: { dataIndex: number }) => {
                                const s = sorted[ctx.dataIndex];
                                return `${s.price} | ${s.turnaround} | Rush: ${s.rush}`;
                            },
                        },
                    },
                },
                scales: {
                    x: { grid: { color: "rgba(255,244,227,0.04)" }, ticks: { color: TEXT_40, font: { family: FONT_BODY, size: 12 } } },
                    y: { grid: { display: false }, ticks: { color: TEXT_60, font: { family: FONT_BODY, size: 11 } } },
                },
            },
        });
    }, [visible, data]);

    return (
        <div ref={wrapRef} style={{ height: 380, position: "relative" }}>
            <canvas ref={canvasRef} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   EVENT COST STACKED BAR
   ═══════════════════════════════════════════════════════ */
export function EventCostChart() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<ChartInstance | null>(null);
    const { ref: wrapRef, visible } = useInView(0.3);

    useEffect(() => {
        if (!visible || !canvasRef.current) return;
        const Chart = getChart();
        if (!Chart) return;
        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new Chart(canvasRef.current, {
            type: "bar",
            data: {
                labels: ["\u00C0 La Carte\n(Current)", "Foundation\n($2K/mo)", "Production\n($3.5K/mo)", "Full Partner\n($5K/mo)"],
                datasets: [
                    { label: "Flyers", data: [2000, 800, 1400, 1600], backgroundColor: ACCENT, borderRadius: 4 },
                    { label: "Social/Motion", data: [1000, 400, 700, 1200], backgroundColor: ACCENT_MID, borderRadius: 4 },
                    { label: "Web/Tech", data: [1000, 300, 600, 800], backgroundColor: ACCENT_DARK, borderRadius: 4 },
                    { label: "Stage Visuals", data: [5000, 0, 500, 800], backgroundColor: ACCENT_DEEPEST, borderRadius: 4 },
                    { label: "AI/CRM", data: [0, 200, 300, 600], backgroundColor: "rgba(255,244,227,0.1)", borderRadius: 4 },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: TEXT_60, font: { family: FONT_BODY, size: 11 }, boxWidth: 12, padding: 16 } },
                    tooltip: { mode: "index" as const, ...TOOLTIP_STYLE },
                },
                scales: {
                    x: { stacked: true, grid: { display: false }, ticks: { color: TEXT_60, font: { family: FONT_BODY, size: 11 } } },
                    y: {
                        stacked: true,
                        grid: { color: "rgba(255,244,227,0.04)" },
                        ticks: { color: TEXT_40, font: { family: FONT_BODY, size: 11 }, callback: (v: number) => `$${(v / 1000).toFixed(1)}K` },
                    },
                },
            },
        });
    }, [visible]);

    return (
        <div ref={wrapRef} style={{ height: 360, position: "relative" }}>
            <canvas ref={canvasRef} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   COMPETITOR RADAR — visual service coverage comparison
   ═══════════════════════════════════════════════════════ */
export function CompetitorRadarChart() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<ChartInstance | null>(null);
    const { ref: wrapRef, visible } = useInView(0.3);

    useEffect(() => {
        if (!visible || !canvasRef.current) return;
        const Chart = getChart();
        if (!Chart) return;
        if (chartRef.current) chartRef.current.destroy();

        const services = ["Brand / Design", "Web Development", "AI Automation", "Sound Studio", "Media Production"];

        chartRef.current = new Chart(canvasRef.current, {
            type: "radar",
            data: {
                labels: services,
                datasets: [
                    {
                        label: "R.O.V. Studios — 5/5 services",
                        data: [1, 1, 1, 1, 1],
                        backgroundColor: "rgba(234,154,97,0.25)",
                        borderColor: ACCENT,
                        borderWidth: 2.5,
                        pointBackgroundColor: ACCENT,
                        pointBorderColor: ACCENT,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        fill: true,
                    },
                    {
                        label: "Matchstic — 1/5 (Brand only)",
                        data: [1, 0, 0, 0, 0],
                        backgroundColor: "rgba(127,119,221,0.12)",
                        borderColor: "#7F77DD",
                        borderWidth: 1.5,
                        borderDash: [4, 4],
                        pointBackgroundColor: "#7F77DD",
                        pointBorderColor: "#7F77DD",
                        pointRadius: 4,
                        fill: true,
                    },
                    {
                        label: "American Design Hub — 3/5",
                        data: [1, 1, 1, 0, 0],
                        backgroundColor: "rgba(232,75,138,0.08)",
                        borderColor: "#E84B8A",
                        borderWidth: 1.5,
                        borderDash: [6, 3],
                        pointBackgroundColor: "#E84B8A",
                        pointBorderColor: "#E84B8A",
                        pointRadius: 4,
                        fill: true,
                    },
                    {
                        label: "Patchwerk — 1/5 (Sound only)",
                        data: [0, 0, 0, 1, 0],
                        backgroundColor: "rgba(29,158,117,0.08)",
                        borderColor: "#1D9E75",
                        borderWidth: 1.5,
                        borderDash: [2, 3],
                        pointBackgroundColor: "#1D9E75",
                        pointBorderColor: "#1D9E75",
                        pointRadius: 4,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom" as const,
                        labels: {
                            color: TEXT_60,
                            font: { family: FONT_BODY, size: 12 },
                            boxWidth: 16,
                            boxHeight: 3,
                            padding: 20,
                            usePointStyle: false,
                        },
                    },
                    tooltip: {
                        ...TOOLTIP_STYLE,
                        callbacks: {
                            label: (ctx: { dataset: { label?: string }; raw: unknown }) => {
                                const val = ctx.raw as number;
                                return `${ctx.dataset.label?.split(" —")[0]}: ${val === 1 ? "Yes" : "No"}`;
                            },
                        },
                    },
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 1,
                        ticks: {
                            display: true,
                            stepSize: 0.5,
                            color: "rgba(255,244,227,0.15)",
                            font: { size: 10 },
                            backdropColor: "transparent",
                            callback: (v: number) => v === 1 ? "Offers" : v === 0 ? "" : "",
                        },
                        grid: { color: "rgba(255,244,227,0.06)", lineWidth: 1 },
                        angleLines: { color: "rgba(255,244,227,0.08)", lineWidth: 1 },
                        pointLabels: {
                            color: "#FFF4E3",
                            font: { family: FONT_BODY, size: 13, weight: "600" as unknown as number },
                            padding: 16,
                        },
                    },
                },
            },
        });
    }, [visible]);

    return (
        <div ref={wrapRef} style={{ height: 420, position: "relative" }}>
            <canvas ref={canvasRef} />
        </div>
    );
}
