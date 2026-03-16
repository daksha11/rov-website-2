"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import {
    BG, ACCENT, BROWN_GRADIENT,
    CARD_BORDER, FONT_HEADING, FONT_BODY,
    WHITE, TEXT_60, TEXT_40, TEXT_20,
} from "./_shared/tokens";
import { useScrollSpy } from "./_shared/hooks";
import type { TabConfig, NavSection } from "./_shared/types";

/* ── Tab imports ── */
import CoreROVTab, { NAV_SECTIONS as coreNavSections } from "./_tabs/core-rov";
import SoundEngineeringTab from "./_tabs/sound-engineering";
import WebDevelopmentTab from "./_tabs/web-development";
import MediaProductionTab from "./_tabs/media-production";
import AIWorkflowsTab from "./_tabs/ai-workflows";
import DesignTab from "./_tabs/design";
import VCInvestorsTab from "./_tabs/vc-investors";
import { NAV_SECTIONS as soundNavSections } from "./_tabs/sound-engineering";
import { NAV_SECTIONS as webNavSections } from "./_tabs/web-development";
import { NAV_SECTIONS as mediaNavSections } from "./_tabs/media-production";
import { NAV_SECTIONS as aiNavSections } from "./_tabs/ai-workflows";
import { NAV_SECTIONS as designNavSections } from "./_tabs/design";
import { NAV_SECTIONS as vcNavSections } from "./_tabs/vc-investors";

/* ═══════════════════════════════════════════════════════
   TAB REGISTRY — add new tabs here
   ═══════════════════════════════════════════════════════ */
const TABS: TabConfig[] = [
    { id: "core-rov", label: "Core ROV", component: CoreROVTab, navSections: coreNavSections },
    { id: "sound", label: "Sound", component: SoundEngineeringTab, navSections: soundNavSections },
    { id: "web-dev", label: "Web Dev", component: WebDevelopmentTab, navSections: webNavSections },
    { id: "media", label: "Media Production", component: MediaProductionTab, navSections: mediaNavSections },
    { id: "ai", label: "AI & Automations", component: AIWorkflowsTab, navSections: aiNavSections },
    { id: "design", label: "Design", component: DesignTab, navSections: designNavSections },
    { id: "vc", label: "VC & Investors", component: VCInvestorsTab, navSections: vcNavSections },
];

/* ═══════════════════════════════════════════════════════
   DASHBOARD SHELL
   ═══════════════════════════════════════════════════════ */
export default function PitchDeckDashboard() {
    const [activeTab, setActiveTab] = useState("core-rov");
    const [chartReady, setChartReady] = useState(false);

    const currentTab = TABS.find(t => t.id === activeTab) ?? TABS[0];
    const ActiveComponent = currentTab.component;
    const sectionNav = currentTab.navSections;
    const activeSection = useScrollSpy(sectionNav);

    /* Hash sync */
    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        if (hash && TABS.some(t => t.id === hash)) setActiveTab(hash);
    }, []);

    const switchTab = useCallback((id: string) => {
        setActiveTab(id);
        window.location.hash = id;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const scrollTo = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    useEffect(() => {
        document.body.style.backgroundColor = BG;
        document.body.style.overflowX = "hidden";
        return () => { document.body.style.backgroundColor = ""; document.body.style.overflowX = ""; };
    }, []);

    return (
        <>
            <Script
                src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"
                strategy="afterInteractive"
                onLoad={() => setChartReady(true)}
            />

            <div style={{ fontFamily: FONT_BODY, backgroundColor: BG, minHeight: "100vh", color: "#FFF4E3" }}>

                {/* ── Sticky Nav: Two Tiers ── */}
                <nav style={{
                    position: "sticky", top: 0, zIndex: 100,
                    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                    background: "rgba(0,0,0,0.88)",
                    borderBottom: `1px solid ${CARD_BORDER}`,
                }}>
                    {/* Tier 1: Category tabs */}
                    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 6, overflowX: "auto", height: 52 }}>
                        <Link href="/ctrla" style={{
                            color: ACCENT, textDecoration: "none", fontSize: 14, fontWeight: 600,
                            fontFamily: FONT_HEADING, fontStyle: "italic",
                            marginRight: 8, flexShrink: 0, display: "flex", alignItems: "center", gap: 6, letterSpacing: "0.04em",
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            R.O.V.
                        </Link>
                        <div style={{ width: 1, height: 24, background: "rgba(234,154,97,0.2)", flexShrink: 0 }} />

                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => switchTab(t.id)}
                                style={{
                                    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                                    fontFamily: FONT_HEADING, fontStyle: "italic",
                                    border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                                    transition: "all 0.3s", letterSpacing: "0.02em",
                                    color: activeTab === t.id ? BG : TEXT_40,
                                    background: activeTab === t.id ? BROWN_GRADIENT : "transparent",
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Tier 2: Section scroll-spy (only if the active tab has sections) */}
                    {sectionNav.length > 0 && (
                        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 4, overflowX: "auto", height: 40, borderTop: "1px solid rgba(234,154,97,0.06)" }}>
                            {sectionNav.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => scrollTo(s.id)}
                                    style={{
                                        padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                                        fontFamily: FONT_HEADING, fontStyle: "italic",
                                        border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                                        transition: "all 0.2s",
                                        color: activeSection === s.id ? WHITE : TEXT_40,
                                        background: activeSection === s.id ? "rgba(234,154,97,0.1)" : "transparent",
                                    }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    )}
                </nav>

                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

                    {/* ── Hero ── */}
                    <header style={{ padding: "80px 0 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: "-20%", left: "-15%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle, rgba(234,154,97,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: "-20%", right: "-15%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(circle, rgba(177,105,55,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 18px", borderRadius: 999, border: "1px dashed rgba(234,154,97,0.35)", marginBottom: 28 }}>
                                <span style={{ width: 24, height: 1, background: "rgba(234,154,97,0.5)" }} />
                                <span style={{ fontSize: 11, color: ACCENT, fontFamily: FONT_HEADING, fontStyle: "italic", letterSpacing: "5px" }}>CONFIDENTIAL</span>
                                <span style={{ width: 24, height: 1, background: "rgba(234,154,97,0.5)" }} />
                            </div>
                            <h1 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 900, letterSpacing: "-1px", margin: 0, lineHeight: 0.95, color: WHITE }}>
                                Market<br />
                                <span style={{ background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                    Intelligence
                                </span>
                            </h1>
                            <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 16, color: TEXT_60, marginTop: 20, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
                                R.O.V. Studios — Atlanta-based creative hybrid agency.
                                Brand, Web, AI, Sound, Stage Visuals.
                            </p>
                        </div>
                    </header>

                    {/* ── Active Tab Content ── */}
                    <ActiveComponent chartReady={chartReady} />

                    {/* ── Footer ── */}
                    <footer style={{ textAlign: "center", padding: "40px 0 80px", borderTop: `1px solid ${CARD_BORDER}` }}>
                        <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 12, color: TEXT_20, letterSpacing: "0.15em" }}>
                            RANGE OF VIEW STUDIOS — CONFIDENTIAL MARKET RESEARCH — 2026
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
}
