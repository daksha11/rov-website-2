"use client";

import { useState } from "react";
import {
    ACCENT, ACCENT_MID, BG, BG_CARD, CARD_BORDER,
    BROWN_GRADIENT, SHADOW_CARD,
    FONT_HEADING, FONT_BODY,
    WHITE, TEXT_90, TEXT_60, TEXT_40, TEXT_20,
    tierColor,
} from "../../_shared/tokens";
import { SectionTitle, Card, StatusDot, AnimatedCounter, AnimatedBar } from "../../_shared/components";
import { CompetitorRadarChart } from "../../_shared/charts";
import {
    MARKET_STATS, COMPETITORS,
    AGENCY_PRICING, PERSONAS, PAIN_POINTS,
    VC_COMPS, ATL_VCS, INVESTOR_METRICS, TRENDS, LEAD_CHANNELS,
} from "./data";
import type { NavSection } from "../../_shared/types";

export const NAV_SECTIONS: NavSection[] = [
    { id: "market", label: "Market Size" },
    { id: "competitive", label: "Competitive" },
    { id: "agency-pricing", label: "Agency Pricing" },
    { id: "personas", label: "Personas" },
    { id: "pain-points", label: "Pain Points" },
    { id: "vc", label: "VC / Investment" },
    { id: "trends", label: "Trends" },
    { id: "leads", label: "Lead Channels" },
];

export default function CoreROVTab({ chartReady }: { chartReady: boolean }) {
    const [activePainTab, setActivePainTab] = useState("Artists");
    const [expandedPersona, setExpandedPersona] = useState<string | null>(null);

    return (
        <>
            {/* 1. MARKET SIZE */}
            <section id="market" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Atlanta creative economy and adjacent markets">Market Size</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                    {MARKET_STATS.map((s, i) => (
                        <Card key={i}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.1em", marginBottom: 12 }}>{s.label.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.02em", background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.suffix === "B" && s.value < 100 ? 1 : 0} />
                            </p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40 }}>{s.sub}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 2. COMPETITIVE LANDSCAPE */}
            <section id="competitive" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Service coverage across Atlanta agencies">Competitive Landscape</SectionTitle>
                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                                <th style={{ textAlign: "left", padding: "16px 20px", color: TEXT_40, fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>AGENCY</th>
                                {["Brand/Design", "Web Dev", "AI Automation", "Sound", "Stage Visuals"].map(h => (
                                    <th key={h} style={{ padding: "16px 12px", color: TEXT_40, fontWeight: 600, fontSize: 10, letterSpacing: "0.06em", textAlign: "center", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {COMPETITORS.map((c, i) => {
                                const isROV = c.name === "R.O.V. Studios";
                                return (
                                    <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)", background: isROV ? "rgba(234,154,97,0.06)" : "transparent" }}>
                                        <td style={{ padding: "14px 20px", fontWeight: isROV ? 700 : 400, color: isROV ? ACCENT : TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic" }}>{c.name}</td>
                                        {[c.brand, c.web, c.ai, c.sound, c.stage].map((v, j) => (
                                            <td key={j} style={{ padding: "14px 12px", textAlign: "center" }}><StatusDot status={v} /></td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card>
                {chartReady && (
                    <Card style={{ marginTop: 20 }}>
                        <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, color: TEXT_60, marginBottom: 16 }}>Service Coverage Radar — Top 3 Competitors</p>
                        <CompetitorRadarChart />
                    </Card>
                )}
            </section>

            {/* 3. AGENCY PRICING */}
            <section id="agency-pricing" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Premium quality without premium agency overhead">Atlanta Agency Pricing</SectionTitle>
                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                                <th style={{ textAlign: "left", padding: "16px 20px", color: TEXT_40, fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>TIER</th>
                                {["Brand Identity", "Website", "Full Package"].map(h => (
                                    <th key={h} style={{ padding: "16px 16px", color: TEXT_40, fontWeight: 600, fontSize: 11, letterSpacing: "0.04em", textAlign: "center", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {AGENCY_PRICING.map((a, i) => {
                                const isROV = a.tier.includes("R.O.V.");
                                return (
                                    <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)", background: isROV ? "rgba(234,154,97,0.06)" : "transparent" }}>
                                        <td style={{ padding: "14px 20px", fontWeight: isROV ? 700 : 400, color: isROV ? ACCENT : TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic" }}>{a.tier}</td>
                                        <td style={{ padding: "14px 16px", textAlign: "center", color: TEXT_60, fontFamily: FONT_BODY }}>{a.brand}</td>
                                        <td style={{ padding: "14px 16px", textAlign: "center", color: TEXT_60, fontFamily: FONT_BODY }}>{a.website}</td>
                                        <td style={{ padding: "14px 16px", textAlign: "center", color: TEXT_60, fontFamily: FONT_BODY }}>{a.full}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card>
            </section>

            {/* 6. CLIENT PERSONAS */}
            <section id="personas" style={{ paddingTop: 80 }}>
                <SectionTitle sub="6 core buyer profiles driving R.O.V.'s GTM strategy">Client Personas</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                    {PERSONAS.map((p, idx) => {
                        const isOpen = expandedPersona === p.name;
                        const bc = tierColor(idx % 4);
                        return (
                            <div key={p.name} onClick={() => setExpandedPersona(isOpen ? null : p.name)} style={{ background: BG_CARD, border: `1px solid ${isOpen ? "rgba(234,154,97,0.3)" : CARD_BORDER}`, borderRadius: 16, padding: 24, cursor: "pointer", transition: "all 0.3s", borderTop: `3px solid ${bc}`, boxShadow: isOpen ? "0 40px 100px -20px rgba(0,0,0,0.8), 0 0 40px rgba(234,154,97,0.06)" : SHADOW_CARD }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 22, fontWeight: 700, margin: "0 0 2px", color: WHITE }}>{p.name}</h3>
                                        <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 13, color: ACCENT }}>{p.role}</p>
                                    </div>
                                    <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40, padding: "4px 10px", borderRadius: 6, background: "rgba(234,154,97,0.06)", border: "1px solid rgba(234,154,97,0.1)" }}>{p.budget}</span>
                                </div>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40, marginTop: 4 }}>{p.age} · {p.location}</p>
                                <div style={{ maxHeight: isOpen ? 220 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
                                    <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                                        <div>
                                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 10, color: "#A64D2B", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>PAIN POINT</p>
                                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>{p.pain}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 10, color: ACCENT, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>HOW R.O.V. WINS</p>
                                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>{p.win}</p>
                                        </div>
                                    </div>
                                </div>
                                <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 11, color: TEXT_20, marginTop: 12 }}>{isOpen ? "click to collapse" : "click to expand"}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 7. PAIN POINTS */}
            <section id="pain-points" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Key frustrations driving demand across target segments">Pain Points by Segment</SectionTitle>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 24 }}>
                    {Object.keys(PAIN_POINTS).map((k) => (
                        <button key={k} onClick={() => setActivePainTab(k)} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: FONT_HEADING, fontStyle: "italic", border: "none", cursor: "pointer", transition: "all 0.3s", letterSpacing: "0.02em", color: activePainTab === k ? BG : TEXT_40, background: activePainTab === k ? BROWN_GRADIENT : "rgba(234,154,97,0.06)" }}>
                            {k}
                        </button>
                    ))}
                </div>
                <Card>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 24 }}>{PAIN_POINTS[activePainTab].label}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                        {PAIN_POINTS[activePainTab].items.map((item, i) => (
                            <div key={i}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60 }}>{item.pain}</span>
                                    <span style={{ fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 700, color: ACCENT, flexShrink: 0, marginLeft: 12 }}>{item.pct}%</span>
                                </div>
                                <AnimatedBar pct={item.pct} color={BROWN_GRADIENT} delay={i * 100} />
                            </div>
                        ))}
                    </div>
                </Card>
            </section>

            {/* 8. VC / INVESTMENT */}
            <section id="vc" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Traditional agencies aren't VC-investable. Tech-enabled creative platforms are.">VC / Investment Landscape</SectionTitle>
                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, color: TEXT_60, marginBottom: 16 }}>Market Comps That Raised VC</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 36 }}>
                    {VC_COMPS.map((c) => (
                        <Card key={c.name} style={{ borderLeft: `3px solid ${ACCENT_MID}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{c.name}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 26, fontWeight: 900, margin: "4px 0", background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{c.raised}</p>
                            {c.revenue !== "\u2014" && <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>Revenue: {c.revenue}</p>}
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40, marginTop: 4 }}>{c.model}</p>
                        </Card>
                    ))}
                </div>
                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, color: TEXT_60, marginBottom: 16 }}>Atlanta VCs Most Aligned</p>
                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                                <th style={{ textAlign: "left", padding: "14px 20px", color: TEXT_40, fontWeight: 600, fontSize: 11, fontFamily: FONT_HEADING, fontStyle: "italic", letterSpacing: "0.06em" }}>FIRM</th>
                                <th style={{ textAlign: "left", padding: "14px 16px", color: TEXT_40, fontWeight: 600, fontSize: 11, fontFamily: FONT_HEADING, fontStyle: "italic", letterSpacing: "0.06em" }}>CHECK SIZE</th>
                                <th style={{ textAlign: "left", padding: "14px 16px", color: TEXT_40, fontWeight: 600, fontSize: 11, fontFamily: FONT_HEADING, fontStyle: "italic", letterSpacing: "0.06em" }}>FOCUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ATL_VCS.map((v, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "12px 20px", fontWeight: 600, color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic" }}>{v.name}</td>
                                    <td style={{ padding: "12px 16px", color: ACCENT, fontWeight: 500, fontFamily: FONT_BODY }}>{v.check}</td>
                                    <td style={{ padding: "12px 16px", color: TEXT_60, fontFamily: FONT_BODY }}>{v.focus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, color: TEXT_60, margin: "36px 0 16px" }}>What Investors Want to See</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                    {INVESTOR_METRICS.map((m) => (
                        <Card key={m.metric}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 600, color: TEXT_90, margin: "0 0 6px" }}>{m.metric}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 16, color: ACCENT, fontWeight: 600 }}>{m.target}</p>
                        </Card>
                    ))}
                </div>
                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: TEXT_60 }}>
                        <strong style={{ color: ACCENT }}>Key Insight:</strong> R.O.V. must position as a tech-enabled creative platform, not a traditional agency, to be VC-investable. ATL seed pre-money valuation: <strong style={{ color: WHITE }}>$3M–$8M</strong>.
                    </p>
                </Card>
            </section>

            {/* 9. TRENDS */}
            <section id="trends" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Macro tailwinds validating R.O.V.'s positioning">Key Trends</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {TRENDS.map((t, i) => (
                        <Card key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start", borderLeft: `3px solid ${tierColor(i)}` }}>
                            <div style={{ textAlign: "center", minWidth: 100 }}>
                                <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, margin: 0, lineHeight: 1, background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{t.stat}</p>
                                <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 11, color: TEXT_40, marginTop: 4 }}>{t.statLabel}</p>
                            </div>
                            <div>
                                <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: WHITE, margin: "0 0 6px" }}>{t.title}</h3>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.6 }}>{t.detail}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 10. LEAD CHANNELS */}
            <section id="leads" style={{ paddingTop: 80, paddingBottom: 100 }}>
                <SectionTitle sub="Ranked by ROI potential for R.O.V.'s current stage">Inbound Lead Channels</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {LEAD_CHANNELS.map((ch, i) => (
                        <Card key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 16, alignItems: "center", padding: "16px 24px" }}>
                            <span style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 800, background: i === 0 ? BROWN_GRADIENT : "rgba(234,154,97,0.06)", color: i === 0 ? BG : (i < 3 ? ACCENT : TEXT_40) }}>
                                {i + 1}
                            </span>
                            <div>
                                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 600, color: TEXT_90, margin: 0 }}>{ch.channel}</p>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40, marginTop: 2 }}>{ch.detail}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ width: 100, marginBottom: 4 }}>
                                    <AnimatedBar pct={ch.roi} color={BROWN_GRADIENT} delay={i * 80} />
                                </div>
                                <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_40 }}>{ch.time}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    );
}
