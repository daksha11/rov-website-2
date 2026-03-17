"use client";

import { useState } from "react";
import {
    ACCENT, ACCENT_MID, BG, BG_CARD, CARD_BORDER,
    BROWN_GRADIENT, SHADOW_CARD,
    FONT_HEADING, FONT_BODY,
    WHITE, TEXT_90, TEXT_60, TEXT_40, TEXT_20,
    tierColor,
} from "../../_shared/tokens";
import { SectionTitle, Card, AnimatedCounter, AnimatedBar } from "../../_shared/components";
import {
    NAV_SECTIONS, MARKET_STATS, STUDIO_COMPETITORS, STUDIO_TIERS,
    ROV_TIERS, BUNDLES, ADDONS,
    EVENT_STATS, EVENT_TARGETS, EVENT_VENUES, EVENT_PAINS, EVENT_RETAINERS, ALA_CARTE_COSTS,
    MANAGER_TIERS, MANAGER_PAINS, DISCOVERY_CHANNELS, MANAGER_PITCH_STEPS,
    LEAD_CHANNELS, CREDIBILITY_SIGNALS, ORGS_TO_JOIN,
    USP1_EVIDENCE, USP2_STANDARD, USP2_ROV, MESSAGING_AUDIENCE,
    PIPELINE_STEPS, RETENTION_LEFT, TARGET_CAMPUSES, MILESTONE_PATH,
} from "./data";

export { NAV_SECTIONS };

/* ─── Helpers ─── */
function TimelineStep({ num, color, title, body, sub }: { num: number; color: string; title: string; body: string; sub?: string }) {
    return (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 800, color: BG }}>{num}</span>
                <div style={{ width: 2, height: 40, background: `${color}30`, marginTop: 4 }} />
            </div>
            <div style={{ paddingBottom: 24 }}>
                {sub && <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: color, letterSpacing: "0.08em", marginBottom: 4 }}>{sub}</p>}
                <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: WHITE, margin: "0 0 8px" }}>{title}</h4>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>{body}</p>
            </div>
        </div>
    );
}

function Tag({ text, color }: { text: string; color: string }) {
    return <span style={{ fontFamily: FONT_HEADING, fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 4, background: `${color}20`, color: color }}>{text.toUpperCase()}</span>;
}

/* ═══════════════════════════════════════════════════════ */
export default function SoundEngineeringTab({ chartReady }: { chartReady: boolean }) {
    return (
        <>
            {/* ═══ 1. MARKET OVERVIEW ═══ */}
            <section id="snd-overview" style={{ paddingTop: 40 }}>
                <SectionTitle sub="The numbers behind the world's hip-hop capital">Atlanta Sound Market</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                    {MARKET_STATS.map((s, i) => (
                        <Card key={i}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.1em", marginBottom: 12 }}>{s.label.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 900, margin: "0 0 8px", background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.suffix === "B" ? 1 : 0} />
                            </p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40 }}>{s.sub}</p>
                        </Card>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 24 }}>
                    <Card style={{ borderLeft: "3px solid #1D9E75" }}>
                        <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 16 }}>R.O.V.&rsquo;s sound position</h3>
                        {["Fastest mix + master turnaround in Atlanta: 1\u20132 days", "Only studio offering full creative stack: sound + design + web + AI + stage visuals", "$55/song student flat rate builds the future client pipeline", "Manager relationships = $15K\u2013$40K+ annual revenue per relationship"].map((t, i) => (
                            <div key={i} style={{ padding: "5px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D9E75", flexShrink: 0, marginTop: 7 }} />
                                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, margin: 0 }}>{t}</p>
                            </div>
                        ))}
                    </Card>
                    <Card style={{ borderLeft: "3px solid #E8A838" }}>
                        <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 16 }}>Why Atlanta is the right market</h3>
                        {["713 studios means thousands of artists actively releasing music", "89% of studios are single-owner \u2014 none offer the creative bundle R.O.V. does", "Hip-hop culture drives mainstream commerce globally \u2014 ATL is the source", "2026 FIFA World Cup + 2028 Super Bowl = global spotlight on Atlanta brands and artists"].map((t, i) => (
                            <div key={i} style={{ padding: "5px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#E8A838", flexShrink: 0, marginTop: 7 }} />
                                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, margin: 0 }}>{t}</p>
                            </div>
                        ))}
                    </Card>
                </div>
            </section>

            {/* ═══ 2. STUDIO COMPETITORS ═══ */}
            <section id="snd-competitors" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Where R.O.V. sits in the market">Atlanta Studio Landscape</SectionTitle>
                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                                {["Studio", "Price/Song", "Turnaround", "Rush Fee", "Creative Services"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "14px 16px", color: TEXT_40, fontSize: 10, letterSpacing: "0.06em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {STUDIO_COMPETITORS.map((c, i) => {
                                const r = "isROV" in c;
                                return (
                                    <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)", background: r ? "rgba(234,154,97,0.06)" : "transparent" }}>
                                        <td style={{ padding: "12px 16px", fontWeight: r ? 700 : 400, fontFamily: FONT_HEADING, fontStyle: "italic" }}>
                                            {"url" in c && c.url ? (
                                                <a href={c.url as string} target="_blank" rel="noopener noreferrer" style={{ color: TEXT_90, textDecoration: "none", borderBottom: "1px dashed rgba(255,244,227,0.2)", transition: "color 0.2s, border-color 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = ACCENT; e.currentTarget.style.borderColor = ACCENT; }} onMouseLeave={e => { e.currentTarget.style.color = TEXT_90; e.currentTarget.style.borderColor = "rgba(255,244,227,0.2)"; }}>
                                                    {c.name}                                                </a>
                                            ) : (
                                                <span style={{ color: r ? ACCENT : TEXT_90 }}>{c.name}</span>
                                            )}
                                        </td>
                                        <td style={{ padding: "12px 16px", color: TEXT_60 }}>{c.price}</td>
                                        <td style={{ padding: "12px 16px", color: r ? "#1D9E75" : TEXT_60, fontWeight: r ? 600 : 400 }}>{c.turnaround}</td>
                                        <td style={{ padding: "12px 16px", color: r ? "#1D9E75" : (c.rush.startsWith("+") ? "#E84B8A" : TEXT_40) }}>{c.rush}</td>
                                        <td style={{ padding: "12px 16px", color: r ? ACCENT : TEXT_40, fontWeight: r ? 700 : 400 }}>{c.creative}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginTop: 20 }}>
                    {[
                        { label: "Industry Standard Turnaround", value: "5\u201310+ days", color: "#E84B8A", sub: "What competitors charge for" },
                        { label: "R.O.V. Turnaround", value: "1\u20132 days", color: "#1D9E75", sub: "Standard, no surcharge" },
                        { label: "Competitor Rush Fee", value: "+$50\u2013$200", color: "#E84B8A", sub: "Per song at same-day speed" },
                        { label: "R.O.V. Rush Fee", value: "$0", color: "#1D9E75", sub: "Included at every tier" },
                    ].map((s, i) => (
                        <Card key={i}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.08em", marginBottom: 8 }}>{s.label.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 900, color: s.color, margin: "0 0 4px" }}>{s.value}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40 }}>{s.sub}</p>
                        </Card>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginTop: 20 }}>
                    {STUDIO_TIERS.map((t, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${t.border}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 8 }}>{t.tier}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>{t.body}</p>
                        </Card>
                    ))}
                </div>

                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>
                        <strong style={{ color: ACCENT }}>The gap:</strong> Wavy Entertainment is the closest hybrid \u2014 recording + basic graphic design + branding. 250+ Google reviews, two locations. But: no website builds, no AI workflows, no stage visuals, no brand identity strategy. <strong style={{ color: WHITE }}>R.O.V. is the only small studio-agency in Atlanta combining all five pillars.</strong>
                    </p>
                </Card>
            </section>

            {/* ═══ 3. R.O.V. PRICING ═══ */}
            <section id="snd-pricing" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Tiered model from students to managed artists">R.O.V. Sound Pricing</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    {ROV_TIERS.map((t, i) => (
                        <Card key={i} style={{ border: t.highlighted ? `2px solid ${t.tagColor}` : `1px solid ${CARD_BORDER}`, position: "relative", overflow: "hidden" }}>
                            {t.highlighted && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.tagColor }} />}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, margin: 0 }}>{t.name}</p>
                                <Tag text={t.tag} color={t.tagColor} />
                            </div>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: ACCENT, margin: "4px 0 16px" }}>{t.price}</p>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {t.features.map((f, j) => (
                                    <li key={j} style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, padding: "4px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                        <span style={{ color: t.tagColor, fontSize: 11, marginTop: 2, flexShrink: 0 }}>{"\u2713"}</span>{f}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 20 }}>
                    {BUNDLES.map((b, i) => (
                        <Card key={i} style={{ textAlign: "center", borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 13, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{b.name}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 900, color: ACCENT, margin: "4px 0" }}>{b.discount}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40 }}>{b.sub}</p>
                        </Card>
                    ))}
                </div>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Add-on Services</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                    {ADDONS.map((a, i) => (
                        <Card key={i} style={{ padding: 16 }}>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 4 }}>{a.name}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <p style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 800, color: ACCENT, margin: 0 }}>{a.price}</p>
                                {"tag" in a && a.tag && <Tag text={a.tag} color={ACCENT} />}
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ═══ 4. EVENT ORGS ═══ */}
            <section id="snd-events" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Design-first, tech-backed creative partner for Atlanta's event scene">Event Organization Clients</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                    {EVENT_STATS.map((s, i) => (
                        <Card key={i}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.08em", marginBottom: 10 }}>{s.label.toUpperCase()}</p>
                            {"isText" in s ? (
                                <p style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 900, color: ACCENT, margin: "0 0 4px" }}>{s.value}</p>
                            ) : (
                                <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 900, margin: "0 0 4px", background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                    <AnimatedCounter value={s.value as number} prefix={s.prefix!} suffix={s.suffix!} decimals={1} />
                                </p>
                            )}
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40 }}>{s.sub}</p>
                        </Card>
                    ))}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                    {EVENT_TARGETS.map(t => <span key={t} style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 12, padding: "6px 14px", borderRadius: 999, background: "rgba(234,154,97,0.08)", border: "1px solid rgba(234,154,97,0.15)", color: ACCENT }}>{t}</span>)}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {EVENT_VENUES.map(v => <span key={v} style={{ fontFamily: FONT_BODY, fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "rgba(255,244,227,0.04)", color: TEXT_40 }}>{v}</span>)}
                </div>

                <Card style={{ marginTop: 20 }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 20 }}>Event Org Pain Points</p>
                    {EVENT_PAINS.map((p, i) => (
                        <div key={i} style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>{p.pain}</span>
                                <span style={{ fontFamily: FONT_HEADING, fontSize: 13, fontWeight: 700, color: ACCENT, flexShrink: 0, marginLeft: 12 }}>{p.pct}%</span>
                            </div>
                            <AnimatedBar pct={p.pct} color={BROWN_GRADIENT} delay={i * 100} />
                        </div>
                    ))}
                    <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(234,154,97,0.06)", border: "1px solid rgba(234,154,97,0.12)" }}>
                        <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 13, color: ACCENT }}>Email marketing delivers 30\u201340x ROI \u2014 almost no Atlanta promoter uses it. R.O.V.&rsquo;s n8n workflows solve this immediately.</p>
                    </div>
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginTop: 20 }}>
                    {EVENT_RETAINERS.map((r, i) => (
                        <Card key={i} style={{ border: r.highlighted ? `2px solid ${r.tagColor}` : `1px solid ${CARD_BORDER}`, position: "relative", overflow: "hidden" }}>
                            {r.highlighted && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: r.tagColor }} />}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, margin: 0 }}>{r.name}</p>
                                <Tag text={r.tag} color={r.tagColor} />
                            </div>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 26, fontWeight: 900, color: ACCENT, margin: "8px 0 16px" }}>{r.price}</p>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {r.features.map((f, j) => (
                                    <li key={j} style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, padding: "3px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: r.tagColor, flexShrink: 0, marginTop: 7 }} />{f}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>

                <Card style={{ overflowX: "auto", padding: 0, marginTop: 20 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 14 }}>
                        <thead><tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                            <th style={{ textAlign: "left", padding: "14px 20px", color: TEXT_40, fontSize: 11, fontFamily: FONT_HEADING, fontStyle: "italic" }}>WHAT THEY BUY TODAY</th>
                            <th style={{ textAlign: "right", padding: "14px 20px", color: TEXT_40, fontSize: 11, fontFamily: FONT_HEADING, fontStyle: "italic" }}>MONTHLY COST</th>
                        </tr></thead>
                        <tbody>
                            {ALA_CARTE_COSTS.map((c, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)", background: "isROV" in c ? "rgba(234,154,97,0.06)" : "isTotal" in c ? "rgba(255,244,227,0.02)" : "transparent" }}>
                                    <td style={{ padding: "12px 20px", color: "isROV" in c ? ACCENT : ("isTotal" in c ? WHITE : TEXT_60), fontWeight: "isTotal" in c || "isROV" in c ? 700 : 400, fontFamily: "isROV" in c ? FONT_HEADING : FONT_BODY, fontStyle: "isROV" in c ? "italic" : "normal" }}>{c.item}</td>
                                    <td style={{ padding: "12px 20px", textAlign: "right", color: "isROV" in c ? ACCENT : ("isTotal" in c ? "#E84B8A" : TEXT_60), fontWeight: "isTotal" in c || "isROV" in c ? 700 : 400 }}>{c.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT }}>R.O.V. is 50\u201370% cheaper than sourcing \u00e0 la carte \u2014 and adds AI infrastructure (email capture, CRM, automation) that competitors don&rsquo;t offer at any price point.</p>
                </Card>
                <Card style={{ marginTop: 12, borderLeft: "3px solid #7F77DD" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>Stage Visuals Competitive Note</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>LED wall rental companies \u2014 Technical Elements, ATL Special FX, Shock & Awe Productions \u2014 rent the screens. Nobody creates the branded visual content. R.O.V. creates that content. Stage visual content: $500\u2013$2,000/minute for custom work if sourced separately. <strong style={{ color: WHITE }}>Included in Production and Full Partner retainer tiers.</strong></p>
                </Card>
            </section>

            {/* ═══ 5. ARTIST MANAGERS ═══ */}
            <section id="snd-managers" style={{ paddingTop: 80 }}>
                <SectionTitle sub="The highest-value B2B relationship in R.O.V.'s entire sound business">Targeting Artist Managers</SectionTitle>
                <Card style={{ background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 15, color: TEXT_60, lineHeight: 1.7 }}>
                        1 manager \u00d7 5 artists \u00d7 4 singles/year = <strong style={{ color: ACCENT }}>20 songs/year</strong>. At semi-pro rate ($175\u2013$225/song) + design work per release = <strong style={{ color: WHITE }}>$15,000\u2013$40,000+ per year</strong> from one manager relationship. This is R.O.V.&rsquo;s most scalable revenue channel.
                    </p>
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginTop: 20 }}>
                    {MANAGER_TIERS.map((t, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${t.border}`, border: "highlighted" in t ? `2px solid ${t.border}` : undefined }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: "highlighted" in t ? ACCENT : WHITE, marginBottom: 10 }}>{t.tier}</p>
                            {"body" in t && <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>{t.body}</p>}
                            {"items" in t && (
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {t.items!.map((item, j) => (
                                        <li key={j} style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, padding: "4px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.border, flexShrink: 0, marginTop: 7 }} />{item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    ))}
                </div>

                <Card style={{ marginTop: 20 }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 20 }}>Manager Pain Points with Current Studios</p>
                    {MANAGER_PAINS.map((p, i) => (
                        <div key={i} style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>{p.pain}</span>
                                <span style={{ fontFamily: FONT_HEADING, fontSize: 13, fontWeight: 700, color: ACCENT, flexShrink: 0, marginLeft: 12 }}>{p.pct}%</span>
                            </div>
                            <AnimatedBar pct={p.pct} color={BROWN_GRADIENT} delay={i * 100} />
                        </div>
                    ))}
                    <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 8, background: "rgba(234,154,97,0.06)" }}>
                        <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 13, color: ACCENT }}>Every single pain point listed above is a direct R.O.V. strength. The pitch writes itself.</p>
                    </div>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>How Managers Discover + Vet Studios</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {DISCOVERY_CHANNELS.map((d, i) => (
                        <Card key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px" }}>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, margin: 0 }}>{d.channel}</p>
                            <span style={{ fontFamily: FONT_HEADING, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", padding: "4px 10px", borderRadius: 4, background: `${d.color}15`, color: d.color, flexShrink: 0 }}>{d.badge}</span>
                        </Card>
                    ))}
                </div>

                <Card style={{ marginTop: 16, borderLeft: "3px solid #1D9E75" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>Music Biz 2026</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>Music Biz Conference returns to Atlanta \u2014 <strong style={{ color: ACCENT }}>May 11\u201314, 2026</strong>. Renaissance Atlanta Waverly Hotel. 2,000+ attendees, 800+ companies, 30+ countries. R.O.V.&rsquo;s highest-ROI networking event of the year. Register immediately.</p>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Manager Pitch Deck Structure</p>
                <Card>
                    {MANAGER_PITCH_STEPS.map((s, i) => <TimelineStep key={i} num={i + 1} color={tierColor(i)} title={s.title} body={s.body} />)}
                </Card>
            </section>

            {/* ═══ 6. GETTING CLIENTS ═══ */}
            <section id="snd-clients" style={{ paddingTop: 80 }}>
                <SectionTitle sub="How to fill the R.O.V. sound pipeline">Client Acquisition</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {LEAD_CHANNELS.map((ch, i) => (
                        <Card key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 16, alignItems: "center", padding: "16px 24px" }}>
                            <span style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 800, background: i === 0 ? BROWN_GRADIENT : "rgba(234,154,97,0.06)", color: i === 0 ? BG : (i < 3 ? ACCENT : TEXT_40) }}>{i + 1}</span>
                            <div>
                                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 600, color: TEXT_90, margin: 0 }}>{ch.channel}</p>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40, marginTop: 2 }}>{ch.sub}</p>
                            </div>
                            <div style={{ width: 80 }}><AnimatedBar pct={ch.roi} color={BROWN_GRADIENT} delay={i * 80} /></div>
                        </Card>
                    ))}
                </div>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Credibility Signals That Convert</p>
                <Card>
                    {CREDIBILITY_SIGNALS.map((s, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>{s.signal}</span>
                                <span style={{ fontFamily: FONT_HEADING, fontSize: 13, fontWeight: 700, color: "#1D9E75", flexShrink: 0, marginLeft: 12 }}>{s.impact}%</span>
                            </div>
                            <AnimatedBar pct={s.impact} color="#1D9E75" delay={i * 80} />
                        </div>
                    ))}
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 20 }}>
                    {ORGS_TO_JOIN.map((o, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${o.color}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 8 }}>{o.name}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>{o.body}</p>
                        </Card>
                    ))}
                </div>

                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>Free Test Mix Strategy</p>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT, lineHeight: 1.7 }}>Offering a free test mix for one track is the most effective door-opener for serious manager prospecting. It converts cold outreach into warm relationships at a dramatically higher rate than any pitch deck. The quality of that free mix IS the pitch.</p>
                </Card>
            </section>

            {/* ═══ 7. USP VALIDATION ═══ */}
            <section id="snd-usp" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Both claims are confirmed by market research \u2014 here's the evidence">R.O.V.&rsquo;s Validated USPs</SectionTitle>

                <Card style={{ borderLeft: "3px solid #1D9E75", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <span style={{ fontFamily: FONT_HEADING, fontSize: 32, fontWeight: 900, color: "#1D9E75" }}>USP 1</span>
                        <span style={{ fontFamily: FONT_HEADING, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", padding: "4px 10px", borderRadius: 4, background: "rgba(29,158,117,0.15)", color: "#1D9E75" }}>VALIDATED \u2014 NO DIRECT COMPETITOR</span>
                    </div>
                    <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 16 }}>Only small Atlanta studio-agency combining design + web + AI + sound + stage visuals</h3>
                    {USP1_EVIDENCE.map((e, i) => (
                        <div key={i} style={{ padding: "5px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ color: "#1D9E75", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{"\u2713"}</span>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, margin: 0 }}>{e}</p>
                        </div>
                    ))}
                    <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, background: "rgba(29,158,117,0.06)", border: "1px solid rgba(29,158,117,0.15)" }}>
                        <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: "#1D9E75" }}>&ldquo;The only small Atlanta studio-agency delivering complete creative infrastructure \u2014 websites, brand identity, mixing/mastering, AI workflows, and stage visuals \u2014 all under one roof.&rdquo;</p>
                    </div>
                </Card>

                <Card style={{ borderLeft: "3px solid #E8A838" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <span style={{ fontFamily: FONT_HEADING, fontSize: 32, fontWeight: 900, color: "#E8A838" }}>USP 2</span>
                        <span style={{ fontFamily: FONT_HEADING, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", padding: "4px 10px", borderRadius: 4, background: "rgba(232,168,56,0.15)", color: "#E8A838" }}>VALIDATED \u2014 RARE AT THIS PRICE TIER</span>
                    </div>
                    <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 16 }}>1\u20132 day turnaround, locked timelines, no rush fees</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                        <div style={{ background: "rgba(232,75,138,0.04)", borderRadius: 12, padding: 16 }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 12, color: "#E84B8A", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 10 }}>INDUSTRY STANDARD</p>
                            {USP2_STANDARD.map((s, i) => (
                                <div key={i} style={{ padding: "4px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <span style={{ color: "#E84B8A", fontSize: 11, marginTop: 2, flexShrink: 0 }}>{"\u2715"}</span>
                                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{s}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: "rgba(29,158,117,0.04)", borderRadius: 12, padding: 16 }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 12, color: "#1D9E75", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 10 }}>R.O.V.</p>
                            {USP2_ROV.map((s, i) => (
                                <div key={i} style={{ padding: "4px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <span style={{ color: "#1D9E75", fontSize: 11, marginTop: 2, flexShrink: 0 }}>{"\u2713"}</span>
                                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{s}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, background: "rgba(232,168,56,0.06)", border: "1px solid rgba(232,168,56,0.15)" }}>
                        <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: "#E8A838" }}>&ldquo;1\u20132 day mix and master, locked timelines, no vague ETAs \u2014 while most studios take 5\u20137+ business days and charge extra to rush.&rdquo;</p>
                    </div>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Messaging by Audience</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {MESSAGING_AUDIENCE.map((m, i) => (
                        <Card key={i} style={{ borderLeft: `3px solid ${m.color}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 8 }}>{m.audience}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>{m.msg}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ═══ 8. STUDENT PIPELINE ═══ */}
            <section id="snd-pipeline" style={{ paddingTop: 80, paddingBottom: 100 }}>
                <SectionTitle sub="The $55/song rate is a long-term investment, not just a revenue stream">Student Pipeline Strategy</SectionTitle>
                <Card style={{ background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 15, color: TEXT_60, lineHeight: 1.7 }}>
                        Today&rsquo;s <strong style={{ color: ACCENT }}>$55/song student</strong> = tomorrow&rsquo;s managed artist = future <strong style={{ color: WHITE }}>$15K\u2013$40K/year manager relationship</strong>. Every student project is a seed investment in a future B2B relationship. Quality at $55 is the most important marketing R.O.V. can do.
                    </p>
                </Card>

                <Card style={{ marginTop: 20 }}>
                    {PIPELINE_STEPS.map((s, i) => <TimelineStep key={i} num={i + 1} color={s.color} title={s.title} body={s.body} />)}
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 20 }}>
                    <Card style={{ borderLeft: "3px solid #1D9E75" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 12 }}>Keep Students Coming Back</h4>
                        {RETENTION_LEFT.map((r, i) => (
                            <div key={i} style={{ padding: "5px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D9E75", flexShrink: 0, marginTop: 7 }} />
                                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{r}</p>
                            </div>
                        ))}
                    </Card>
                    <Card style={{ borderLeft: "3px solid #7F77DD" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 12 }}>Target Campuses</h4>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                            {TARGET_CAMPUSES.map(c => <span key={c} style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 12, padding: "6px 14px", borderRadius: 999, background: "rgba(127,119,221,0.1)", border: "1px solid rgba(127,119,221,0.2)", color: "#7F77DD" }}>{c}</span>)}
                        </div>
                        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>Campus partnerships, flyer placement in music departments, student org sponsorships, relationships with campus radio stations and music production clubs.</p>
                    </Card>
                </div>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Milestone Upgrade Path</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    {MILESTONE_PATH.map((m, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>{m.stage}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 8 }}>{m.trigger}</p>
                            <div style={{ padding: "8px 12px", borderRadius: 6, background: `${tierColor(i)}10`, border: `1px solid ${tierColor(i)}20` }}>
                                <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: tierColor(i), margin: 0 }}>\u2192 {m.upgrade}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card style={{ marginTop: 16, borderLeft: "3px solid #1D9E75" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>Quarterly Studio Mixer</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>Host a quarterly listening session + networking event at R.O.V. Studios. Invite student clients, emerging artists, and any manager relationships. Position R.O.V. as a connector \u2014 not just a vendor. This deepens loyalty, generates referrals, and creates organic word-of-mouth. <strong style={{ color: ACCENT }}>Research shows increasing customer retention by just 5% boosts profits by 25\u201395%.</strong></p>
                </Card>
            </section>
        </>
    );
}
