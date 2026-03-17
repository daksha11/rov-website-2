"use client";

import { useState } from "react";
import {
    ACCENT, BG, BG_CARD, CARD_BORDER,
    BROWN_GRADIENT,
    FONT_HEADING, FONT_BODY,
    WHITE, TEXT_90, TEXT_60, TEXT_40, TEXT_20,
    tierColor,
} from "../../_shared/tokens";
import { SectionTitle, Card, AnimatedCounter, AnimatedBar } from "../../_shared/components";
import {
    NAV_SECTIONS, GLOBAL_MARKET, HEADLINE_STATS, SMB_STATS,
    GA_INDUSTRIES, INDUSTRIES,
    BENCHMARKS, AI_COMPETITORS,
    PRICING_BENCHMARKS, ENGAGEMENT_TIERS, BUILD_PROJECTS, BUNDLE_TIERS,
    PITCH_STEPS, QUICK_REF,
    PLAYBOOK, TACTICAL_PRIORITIES,
} from "./data";
import type { IndustryKey } from "./data";

export { NAV_SECTIONS };

function BL({ items, color }: { items: string[]; color: string }) {
    return <>{items.map((t, i) => (
        <div key={i} style={{ padding: "4px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 7 }} />
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{t}</p>
        </div>
    ))}</>;
}

export default function AIWorkflowsTab({ chartReady }: { chartReady: boolean }) {
    const [activeIndustry, setActiveIndustry] = useState<IndustryKey>("restaurants");
    const ind = INDUSTRIES[activeIndustry];

    return (
        <>
            {/* ═══ 1. MARKET OVERVIEW ═══ */}
            <section id="ai-overview" style={{ paddingTop: 40 }}>
                <SectionTitle sub="The highest-margin, most scalable revenue opportunity">AI Automation Market</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                    {HEADLINE_STATS.map((s, i) => (
                        <Card key={i}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.1em", marginBottom: 12 }}>{s.label.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 900, margin: "0 0 8px", background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.suffix === "B" || s.suffix === "M" ? 1 : 0} />
                            </p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40 }}>{s.sub}</p>
                        </Card>
                    ))}
                </div>

                {/* Global market table */}
                <Card style={{ overflowX: "auto", padding: 0, marginTop: 24 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                        <thead><tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                            {["Market Segment", "Current Size", "Projected Size", "CAGR"].map(h => (
                                <th key={h} style={{ textAlign: "left", padding: "14px 16px", color: TEXT_40, fontSize: 10, letterSpacing: "0.06em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {GLOBAL_MARKET.map((r, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "12px 16px", color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic" }}>{r.segment}</td>
                                    <td style={{ padding: "12px 16px", color: TEXT_60 }}>{r.current}</td>
                                    <td style={{ padding: "12px 16px", color: TEXT_60 }}>{r.projected}</td>
                                    <td style={{ padding: "12px 16px", color: ACCENT, fontWeight: 700 }}>{r.cagr}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                {/* SMB adoption */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginTop: 20 }}>
                    {SMB_STATS.map((s, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 12 }}>{s.label}</p>
                            <BL color={tierColor(i)} items={s.items} />
                        </Card>
                    ))}
                </div>

                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT, lineHeight: 1.6 }}>The gap is clear: businesses know they need automation but lack skill, time, and strategy. This is R.O.V.&rsquo;s &ldquo;done-for-you&rdquo; sweet spot.</p>
                </Card>
            </section>

            {/* ═══ 2. GEORGIA + ATL ═══ */}
            <section id="ai-georgia" style={{ paddingTop: 80 }}>
                <SectionTitle sub="1.4M small businesses, only 4.5% using AI \u2014 1.3M in the addressable gap">Georgia &amp; Atlanta Opportunity</SectionTitle>
                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                        <thead><tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                            {["Georgia Industry", "Small Businesses", "Key Automation Need"].map(h => (
                                <th key={h} style={{ textAlign: "left", padding: "14px 16px", color: TEXT_40, fontSize: 10, letterSpacing: "0.06em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {GA_INDUSTRIES.map((r, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "12px 16px", color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic" }}>{r.industry}</td>
                                    <td style={{ padding: "12px 16px", color: ACCENT, fontWeight: 600 }}>{r.businesses}</td>
                                    <td style={{ padding: "12px 16px", color: TEXT_60 }}>{r.need}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: TEXT_60, lineHeight: 1.6 }}>Atlanta ranks <strong style={{ color: WHITE }}>#3 best city for entrepreneurs</strong>, <strong style={{ color: WHITE }}>#3 best for small businesses</strong>, and <strong style={{ color: WHITE }}>#1 top smart city in the U.S.</strong> Virtually no local agency positions AI automation at the small business level with creative services bundled in.</p>
                </Card>
            </section>

            {/* ═══ 3. INDUSTRY ROI ═══ */}
            <section id="ai-industries" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Every vertical has quantifiable pain points with proven ROI">Industry-by-Industry Pain Points &amp; ROI</SectionTitle>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 24 }}>
                    {(Object.keys(INDUSTRIES) as IndustryKey[]).map(k => (
                        <button key={k} onClick={() => setActiveIndustry(k)} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontFamily: FONT_HEADING, fontStyle: "italic", border: "none", cursor: "pointer", transition: "all 0.3s", color: activeIndustry === k ? BG : TEXT_40, background: activeIndustry === k ? BROWN_GRADIENT : "rgba(234,154,97,0.06)" }}>{INDUSTRIES[k].label}</button>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                    <Card style={{ borderLeft: `3px solid #E84B8A` }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: "#E84B8A", marginBottom: 12 }}>{ind.painTitle}</h4>
                        <BL color="#E84B8A" items={ind.painPoints} />
                    </Card>
                    <Card style={{ borderLeft: `3px solid #1D9E75` }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: "#1D9E75", marginBottom: 12 }}>{ind.roiTitle}</h4>
                        <BL color="#1D9E75" items={ind.roiPoints} />
                    </Card>
                </div>

                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>R.O.V. Pitch</p>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT, lineHeight: 1.7 }}>&ldquo;{ind.pitch}&rdquo;</p>
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginTop: 16 }}>
                    {[
                        { label: "Annual Revenue Lost", value: ind.lostRevenue, color: "#E84B8A" },
                        { label: "Automation Recovers", value: ind.recovers, color: "#1D9E75" },
                        { label: "R.O.V. Cost", value: ind.rovCost, color: ACCENT },
                        { label: "ROI", value: ind.roi, color: WHITE },
                    ].map((c, i) => (
                        <Card key={i} style={{ textAlign: "center", borderTop: `3px solid ${c.color}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 10, color: TEXT_40, letterSpacing: "0.08em", marginBottom: 6 }}>{c.label.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 900, color: c.color, margin: 0 }}>{c.value}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ═══ 4. CROSS-INDUSTRY BENCHMARKS ═══ */}
            <section id="ai-benchmarks" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Numbers that close deals across every industry">Cross-Industry ROI Benchmarks</SectionTitle>
                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                        <thead><tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                            <th style={{ textAlign: "left", padding: "14px 16px", color: TEXT_40, fontSize: 10, fontFamily: FONT_HEADING, fontStyle: "italic" }}>METRIC</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", color: TEXT_40, fontSize: 10, fontFamily: FONT_HEADING, fontStyle: "italic" }}>ROI DATA</th>
                        </tr></thead>
                        <tbody>
                            {BENCHMARKS.map((b, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "12px 16px", color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic" }}>{b.metric}</td>
                                    <td style={{ padding: "12px 16px", color: ACCENT, fontWeight: 600 }}>{b.data}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </section>

            {/* ═══ 5. COMPETITORS ═══ */}
            <section id="ai-competitors" style={{ paddingTop: 80 }}>
                <SectionTitle sub="No Atlanta agency bundles AI automation with creative services">Atlanta AI Automation Competitors</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                    {AI_COMPETITORS.map((c, i) => (
                        <Card key={i}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, margin: 0 }}>
                                    {"url" in c && c.url ? (
                                        <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ color: WHITE, textDecoration: "none", borderBottom: "1px dashed rgba(255,244,227,0.2)", transition: "color 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = ACCENT; }} onMouseLeave={e => { e.currentTarget.style.color = WHITE; }}>{c.name}</a>
                                    ) : <span style={{ color: WHITE }}>{c.name}</span>}
                                </h4>
                            </div>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 4 }}><strong style={{ color: TEXT_40 }}>Focus:</strong> {c.focus}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 4 }}><strong style={{ color: TEXT_40 }}>Pricing:</strong> {c.pricing}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: "#E84B8A" }}><strong>Gap:</strong> {c.gap}</p>
                        </Card>
                    ))}
                </div>
                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT, lineHeight: 1.6 }}>Every automated touchpoint \u2014 confirmation emails, chatbot scripts, review request texts, booking confirmations, voice agent greetings \u2014 is a brand interaction. <strong style={{ color: WHITE }}>R.O.V. is the only Atlanta agency that designs those interactions as well as builds them.</strong></p>
                </Card>
            </section>

            {/* ═══ 6. PRICING ═══ */}
            <section id="ai-pricing" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Quotation-based, anchored to client revenue and ROI data">AI Automation Pricing</SectionTitle>

                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                        <thead><tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                            <th style={{ textAlign: "left", padding: "14px 16px", color: TEXT_40, fontSize: 10, fontFamily: FONT_HEADING, fontStyle: "italic" }}>MODEL</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", color: TEXT_40, fontSize: 10, fontFamily: FONT_HEADING, fontStyle: "italic" }}>MARKET RANGE</th>
                        </tr></thead>
                        <tbody>
                            {PRICING_BENCHMARKS.map((p, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "12px 16px", color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic" }}>{p.model}</td>
                                    <td style={{ padding: "12px 16px", color: ACCENT, fontWeight: 600 }}>{p.range}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Engagement Tiers</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                    {ENGAGEMENT_TIERS.map((t, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 2 }}>{t.tier}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 900, color: ACCENT, margin: "4px 0 8px" }}>{t.range}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40, marginBottom: 8 }}>Target: {t.target}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 8, lineHeight: 1.6 }}>{t.scope}</p>
                            <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(234,154,97,0.06)" }}>
                                <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: ACCENT, margin: 0 }}>{t.context}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>One-Time Build Projects</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                    {BUILD_PROJECTS.map((b, i) => (
                        <Card key={i} style={{ padding: 16 }}>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 4 }}>{b.type}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 800, color: ACCENT, margin: 0 }}>{b.range}</p>
                        </Card>
                    ))}
                </div>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Creative + AI Bundled (R.O.V. Unique)</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    {BUNDLE_TIERS.map((b, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 2 }}>{b.name}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 900, color: ACCENT, margin: "4px 0 8px" }}>{b.price}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>{b.desc}</p>
                        </Card>
                    ))}
                </div>

                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: TEXT_60, lineHeight: 1.6 }}>
                        <strong style={{ color: WHITE }}>\u00C0 la carte comparison:</strong> Design ($1K\u2013$2.5K/mo) + automation ($2K\u2013$5K/mo) + email ($500\u2013$1.5K/mo) + chatbot ($500\u2013$2K/mo) = <strong style={{ color: "#E84B8A" }}>$4,000\u2013$11,000/month</strong>. R.O.V. bundled: <strong style={{ color: ACCENT }}>40\u201360% savings</strong> with brand consistency across every touchpoint.
                    </p>
                </Card>
            </section>

            {/* ═══ 7. PITCH FRAMEWORK ═══ */}
            <section id="ai-pitch" style={{ paddingTop: 80 }}>
                <SectionTitle sub="ROI-first, every time">The Pitch Framework</SectionTitle>
                <Card>
                    {PITCH_STEPS.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingBottom: 20 }}>
                            <span style={{ width: 36, height: 36, borderRadius: "50%", background: tierColor(i), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 800, color: BG, flexShrink: 0 }}>{i + 1}</span>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: TEXT_60, lineHeight: 1.7, margin: 0 }}>{s.body}</p>
                        </div>
                    ))}
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Industry-Specific ROI Quick Reference</p>
                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                        <thead><tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                            {["Industry", "Annual Lost", "Recovers", "R.O.V. Cost", "ROI"].map(h => (
                                <th key={h} style={{ textAlign: "left", padding: "12px 14px", color: TEXT_40, fontSize: 10, fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {QUICK_REF.map((r, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "10px 14px", color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 12 }}>{r.industry}</td>
                                    <td style={{ padding: "10px 14px", color: "#E84B8A", fontSize: 12 }}>{r.lost}</td>
                                    <td style={{ padding: "10px 14px", color: "#1D9E75", fontSize: 12 }}>{r.recovers}</td>
                                    <td style={{ padding: "10px 14px", color: TEXT_60, fontSize: 12 }}>{r.cost}</td>
                                    <td style={{ padding: "10px 14px", color: ACCENT, fontWeight: 700, fontSize: 12 }}>{r.roi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </section>

            {/* ═══ 8. USP + PLAYBOOK ═══ */}
            <section id="ai-usp" style={{ paddingTop: 80, paddingBottom: 100 }}>
                <SectionTitle sub="Validated positioning + immediate action items">USP &amp; Strategic Playbook</SectionTitle>

                <Card style={{ borderLeft: "3px solid #1D9E75", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <span style={{ fontFamily: FONT_HEADING, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", padding: "4px 10px", borderRadius: 4, background: "rgba(29,158,117,0.15)", color: "#1D9E75" }}>VALIDATED \u2014 ZERO DIRECT COMPETITORS</span>
                    </div>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 12 }}>Atlanta&rsquo;s only creative studio-agency delivering AI automation, branding, websites, mixing/mastering, and stage visuals \u2014 all under one roof.</p>
                    <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(29,158,117,0.06)", border: "1px solid rgba(29,158,117,0.15)" }}>
                        <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: "#1D9E75", margin: 0, lineHeight: 1.6 }}>&ldquo;Most AI agencies build your systems and hand you ugly templates. Most creative agencies design beautiful assets but can&rsquo;t wire them to anything. R.O.V. does both. Your automated emails are designed. Your chatbot is branded. Your workflows are visual. One team, one invoice, zero gaps.&rdquo;</p>
                    </div>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "0 0 12px" }}>Strategic Moves</p>
                {PLAYBOOK.map((p, i) => (
                    <Card key={i} style={{ marginBottom: 12, borderLeft: `3px solid ${tierColor(i)}` }}>
                        <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 6 }}>{p.move}</p>
                        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>{p.body}</p>
                    </Card>
                ))}

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "24px 0 12px" }}>Immediate Tactical Priorities</p>
                <Card>
                    <BL color={ACCENT} items={TACTICAL_PRIORITIES} />
                </Card>
            </section>
        </>
    );
}
