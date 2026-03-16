"use client";

import { useState, useMemo } from "react";
import {
    ACCENT, ACCENT_MID, ACCENT_DARK, BG, BG_CARD, CARD_BORDER,
    BROWN_GRADIENT, SHADOW_CARD,
    FONT_HEADING, FONT_BODY,
    WHITE, TEXT_90, TEXT_60, TEXT_40, TEXT_20,
    tierColor,
} from "../../_shared/tokens";
import { SectionTitle, Card, StatusDot, AnimatedCounter, AnimatedBar } from "../../_shared/components";
import {
    NAV_SECTIONS, OVERVIEW_STATS, ROI_STATS, SEGMENT_ROI, TARGET_SEGMENTS,
    COMPETITORS_WEB, DIFF_MATRIX, MEETING_STEPS, TIMING_CARDS, OBJECTIONS,
    LINKEDIN_STATS, LINKEDIN_STEPS, AI_STATS, AI_BY_SEGMENT, AI_PRICING,
    PRICING_TIERS, PROPOSAL_STEPS, MONTHLY_TARGETS,
} from "./data";
import type { SegmentKey } from "./data";

export { NAV_SECTIONS };

/* ─── Helpers ─── */
const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
    return (
        <Card>
            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.1em", marginBottom: 12 }}>{label.toUpperCase()}</p>
            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 900, margin: "0 0 8px", color: color ?? ACCENT }}>{value}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40 }}>{sub}</p>
        </Card>
    );
}

function TimelineStep({ num, color, title, body, sub }: { num: number; color: string; title: string; body: string; sub?: string }) {
    return (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", position: "relative" }}>
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

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function WebDevelopmentTab({ chartReady }: { chartReady: boolean }) {
    const [activeSegment, setActiveSegment] = useState<SegmentKey>("restaurants");
    const [roiRevenue, setRoiRevenue] = useState(500000);
    const [expandedObj, setExpandedObj] = useState<number | null>(null);
    const [activeRoiSeg, setActiveRoiSeg] = useState("restaurants");

    /* ROI calculator math */
    const roi = useMemo(() => {
        const scenarios = [
            { label: "Conservative", webPct: 0.3, improvement: 0.15 },
            { label: "Moderate", webPct: 0.5, improvement: 0.15 },
            { label: "High", webPct: 0.7, improvement: 0.15 },
        ];
        return scenarios.map(s => {
            const webRevenue = roiRevenue * s.webPct;
            const monthlyGain = (webRevenue / 12) * s.improvement;
            const annualGain = webRevenue * s.improvement;
            const payback = annualGain > 0 ? Math.ceil(10000 / (annualGain / 12)) : 99;
            return { ...s, webRevenue, monthlyGain, annualGain, payback };
        });
    }, [roiRevenue]);

    const seg = TARGET_SEGMENTS[activeSegment];

    return (
        <>
            {/* ═══ 1. OVERVIEW ═══ */}
            <section id="wd-overview" style={{ paddingTop: 80 }}>
                <SectionTitle sub="High-revenue Atlanta businesses are hemorrhaging customers through bad websites — and don't know it">The Gap</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                    {OVERVIEW_STATS.map((s, i) => (
                        <Card key={i}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.1em", marginBottom: 12 }}>{s.label.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 900, margin: "0 0 8px", background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.suffix === "B" ? 1 : 0} />
                            </p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40 }}>{s.sub}</p>
                        </Card>
                    ))}
                </div>

                {/* Two callout cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 24 }}>
                    <Card style={{ borderLeft: `3px solid #1D9E75` }}>
                        <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 16 }}>What R.O.V. delivers</h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {["Premium front-end builds — Figma to production, custom code, Vercel hosted", "Cohesive brand identity kits bundled with every web project", "Custom AI workflow integrations (chatbots, lead capture, booking, CRM sync via n8n)", "Target price: $7K–$15K per project"].map((item, i) => (
                                <li key={i} style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, padding: "6px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D9E75", flexShrink: 0, marginTop: 7 }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Card>
                    <Card style={{ borderLeft: `3px solid #7F77DD` }}>
                        <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 12 }}>The core pitch</h3>
                        <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 16, color: ACCENT, lineHeight: 1.6, marginBottom: 12 }}>
                            &ldquo;Your website is your best salesperson. Right now it&rsquo;s losing you customers every single day — and you don&rsquo;t even know how many.&rdquo;
                        </p>
                        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.6 }}>
                            Show them the data. Show them what they could have. Close on ROI, not aesthetics.
                        </p>
                    </Card>
                </div>
            </section>

            {/* ═══ 2. ROI DATA ═══ */}
            <section id="wd-roi" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Hard numbers to show in every meeting">The Business Case</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                    {ROI_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>

                {/* ROI Calculator */}
                <Card style={{ marginTop: 32 }}>
                    <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 20, fontWeight: 700, color: WHITE, marginBottom: 8 }}>ROI Calculator</h3>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40, marginBottom: 20 }}>Estimate your client&rsquo;s monthly web revenue loss</p>
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>Annual Revenue</span>
                            <span style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 800, color: ACCENT }}>{fmt(roiRevenue)}</span>
                        </div>
                        <input
                            type="range" min={50000} max={2000000} step={50000} value={roiRevenue}
                            onChange={e => setRoiRevenue(Number(e.target.value))}
                            style={{ width: "100%", accentColor: ACCENT, cursor: "pointer" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                            <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_20 }}>$50K</span>
                            <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_20 }}>$2M</span>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                        {roi.map((r, i) => (
                            <div key={i} style={{ background: "rgba(234,154,97,0.04)", border: `1px solid ${tierColor(i)}30`, borderRadius: 12, padding: 20, borderTop: `3px solid ${tierColor(i)}` }}>
                                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 12, color: tierColor(i), fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8 }}>{r.label.toUpperCase()} ({Math.round(r.webPct * 100)}% WEB-DRIVEN)</p>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 4 }}>Monthly web revenue: <strong style={{ color: TEXT_90 }}>{fmt(r.webRevenue / 12)}</strong></p>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 4 }}>15% improvement: <strong style={{ color: ACCENT }}>{fmt(r.monthlyGain)}/mo</strong></p>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 8 }}>Annual gain: <strong style={{ color: WHITE }}>{fmt(r.annualGain)}</strong></p>
                                <p style={{ fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 700, color: tierColor(i) }}>$10K website payback: {r.payback} {r.payback === 1 ? "month" : "months"}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, background: "rgba(234,154,97,0.06)", border: "1px solid rgba(234,154,97,0.15)" }}>
                        <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT }}>
                            At moderate scenario for a $500K/year business: a $10,000 website pays itself back in under 4 months.
                        </p>
                    </div>
                </Card>

                {/* Segment-specific ROI */}
                <div style={{ marginTop: 24 }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
                        {Object.entries(SEGMENT_ROI).map(([k, v]) => (
                            <button key={k} onClick={() => setActiveRoiSeg(k)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontFamily: FONT_HEADING, fontStyle: "italic", border: "none", cursor: "pointer", transition: "all 0.3s", color: activeRoiSeg === k ? BG : TEXT_40, background: activeRoiSeg === k ? BROWN_GRADIENT : "rgba(234,154,97,0.06)" }}>
                            {v.label}
                            </button>
                        ))}
                    </div>
                    <Card style={{ borderLeft: `3px solid ${SEGMENT_ROI[activeRoiSeg].color}` }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: WHITE, marginBottom: 16 }}>{SEGMENT_ROI[activeRoiSeg].label}</h4>
                        {SEGMENT_ROI[activeRoiSeg].stats.map((s, i) => (
                            <div key={i} style={{ padding: "8px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: SEGMENT_ROI[activeRoiSeg].color, flexShrink: 0, marginTop: 7 }} />
                                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, margin: 0 }}>{s}</p>
                            </div>
                        ))}
                    </Card>
                </div>
            </section>

            {/* ═══ 3. TARGET SEGMENTS ═══ */}
            <section id="wd-segments" style={{ paddingTop: 80 }}>
                <SectionTitle sub="What each vertical looks like now vs what R.O.V. builds">Target Segments</SectionTitle>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 24 }}>
                    {(Object.keys(TARGET_SEGMENTS) as SegmentKey[]).map(k => (
                        <button key={k} onClick={() => setActiveSegment(k)} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontFamily: FONT_HEADING, fontStyle: "italic", border: "none", cursor: "pointer", transition: "all 0.3s", color: activeSegment === k ? BG : TEXT_40, background: activeSegment === k ? BROWN_GRADIENT : "rgba(234,154,97,0.06)" }}>
                            {TARGET_SEGMENTS[k].label}
                        </button>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                    <Card style={{ borderLeft: "3px solid #E84B8A" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: "#E84B8A", marginBottom: 16 }}>{seg.currentTitle}</h4>
                        {seg.currentItems.map((item, i) => (
                            <div key={i} style={{ padding: "5px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <span style={{ color: "#E84B8A", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{"\u2715"}</span>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, margin: 0 }}>{item}</p>
                            </div>
                        ))}
                    </Card>
                    <Card style={{ borderLeft: "3px solid #1D9E75" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: "#1D9E75", marginBottom: 16 }}>{seg.rovTitle}</h4>
                        {seg.rovItems.map((item, i) => (
                            <div key={i} style={{ padding: "5px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <span style={{ color: "#1D9E75", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{"\u2713"}</span>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, margin: 0 }}>{item}</p>
                            </div>
                        ))}
                    </Card>
                </div>
                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 15, color: ACCENT, lineHeight: 1.6, marginBottom: 8 }}>&ldquo;{seg.pitch}&rdquo;</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40 }}><strong style={{ color: TEXT_60 }}>How to find targets:</strong> {seg.howToFind}</p>
                </Card>
            </section>

            {/* ═══ 4. COMPETITORS ═══ */}
            <section id="wd-competitors" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Who R.O.V. competes with and where the gap is">Atlanta Web Agencies — $7K–$15K Tier</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                    {COMPETITORS_WEB.map((c, i) => (
                        <Card key={i} style={{ borderColor: "isROV" in c && c.isROV ? `${ACCENT}40` : CARD_BORDER, borderWidth: "isROV" in c && c.isROV ? 2 : 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: "isROV" in c && c.isROV ? ACCENT : WHITE, margin: 0 }}>{c.name}</h4>
                                <span style={{ fontFamily: FONT_HEADING, fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, background: `${c.tagColor}20`, color: c.tagColor }}>{c.tag.toUpperCase()}</span>
                            </div>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.6 }}>{c.desc}</p>
                        </Card>
                    ))}
                </div>

                {/* Differentiation matrix */}
                <Card style={{ overflowX: "auto", padding: 0, marginTop: 20 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                                <th style={{ textAlign: "left", padding: "14px 20px", color: TEXT_40, fontSize: 11, fontFamily: FONT_HEADING, fontStyle: "italic", letterSpacing: "0.06em" }}>CAPABILITY</th>
                                {["R.O.V.", "Trajectory", "Newman", "Cardinal"].map(h => (
                                    <th key={h} style={{ padding: "14px 10px", color: h === "R.O.V." ? ACCENT : TEXT_40, fontSize: 11, textAlign: "center", fontFamily: FONT_HEADING, fontStyle: "italic", letterSpacing: "0.04em" }}>{h.toUpperCase()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {DIFF_MATRIX.map((r, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "12px 20px", color: TEXT_60, fontFamily: FONT_BODY, fontSize: 13 }}>{r.capability}</td>
                                    <td style={{ padding: "12px 10px", textAlign: "center" }}><StatusDot status={r.rov} /></td>
                                    <td style={{ padding: "12px 10px", textAlign: "center" }}><StatusDot status={r.trajectory} /></td>
                                    <td style={{ padding: "12px 10px", textAlign: "center" }}><StatusDot status={r.newman} /></td>
                                    <td style={{ padding: "12px 10px", textAlign: "center" }}><StatusDot status={r.cardinal} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </section>

            {/* ═══ 5. GETTING MEETINGS ═══ */}
            <section id="wd-meetings" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Guerrilla strategy for landing high-ticket meetings">Getting in the Door</SectionTitle>
                <Card>
                    {MEETING_STEPS.map((s, i) => <TimelineStep key={i} num={i + 1} color={s.color} title={s.title} body={s.body} />)}
                </Card>

                {/* Timing cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 24 }}>
                    {TIMING_CARDS.map((t, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{t.segment}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 12, color: ACCENT, marginBottom: 10 }}>{t.time}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.6 }}>{t.body}</p>
                        </Card>
                    ))}
                </div>

                {/* Objection scripts */}
                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "32px 0 16px" }}>Objection Scripts</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {OBJECTIONS.map((o, i) => (
                        <Card key={i} onClick={() => setExpandedObj(expandedObj === i ? null : i)} style={{ cursor: "pointer", borderLeft: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE }}>{o.q}</p>
                            <div style={{ maxHeight: expandedObj === i ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7, paddingTop: 12 }}>{o.a}</p>
                            </div>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_20, marginTop: 8 }}>{expandedObj === i ? "click to collapse" : "click to expand"}</p>
                        </Card>
                    ))}
                </div>
                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT }}>69% of buyers have accepted cold pitches from new providers — it works when done right.</p>
                </Card>
            </section>

            {/* ═══ 6. LINKEDIN STRATEGY ═══ */}
            <section id="wd-linkedin" style={{ paddingTop: 80 }}>
                <SectionTitle sub="The highest-ROI channel for reaching high-ticket Atlanta decision makers">LinkedIn Outreach</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
                    {LINKEDIN_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>

                <Card>
                    {LINKEDIN_STEPS.map((s, i) => <TimelineStep key={i} num={i + 1} color={s.color} title={s.title} body={s.body} sub={s.day} />)}
                </Card>

                {/* Search filters + Profile checklist */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 24 }}>
                    <Card style={{ borderLeft: "3px solid #1D9E75" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 12 }}>Search Filters by Segment</h4>
                        {[
                            "Restaurants: 'Owner' OR 'Operator' + 'restaurant' + 'Atlanta'",
                            "Law: 'Managing Partner' OR 'Marketing Director' + 'law firm' + 'Atlanta'",
                            "Startups: 'Founder' OR 'CEO' + 1–10 employees + 'Atlanta'",
                            "Retail: 'Owner' OR 'Founder' + 'boutique' + 'Atlanta'",
                            "Real Estate: 'Marketing Director' OR 'Developer' + 'real estate' + 'Atlanta'",
                        ].map((f, i) => (
                            <p key={i} style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, padding: "4px 0", lineHeight: 1.5 }}>{f}</p>
                        ))}
                    </Card>
                    <Card style={{ borderLeft: "3px solid #7F77DD" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 12 }}>Profile Optimization Checklist</h4>
                        {[
                            "Headline: 'We build premium websites for Atlanta businesses'",
                            "Banner: showcase best work",
                            "About: lead with the problem you solve, not your services",
                            "CTA: Calendly link for free 20-min web audit",
                            "Post 3x/week: before/afters, client results, ATL business observations",
                        ].map((f, i) => (
                            <div key={i} style={{ padding: "5px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <span style={{ color: "#7F77DD", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{"\u2713"}</span>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{f}</p>
                            </div>
                        ))}
                    </Card>
                </div>
            </section>

            {/* ═══ 7. AI INTEGRATION ═══ */}
            <section id="wd-ai" style={{ paddingTop: 80 }}>
                <SectionTitle sub="R.O.V.'s biggest differentiator — no competitor in this price range offers this">AI Integration</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
                    {AI_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>

                {/* AI by segment */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {AI_BY_SEGMENT.map((seg, idx) => (
                        <Card key={idx} style={{ borderTop: `3px solid ${seg.color}` }}>
                            <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 12 }}>{seg.segment}</h4>
                            {seg.items.map((item, i) => (
                                <div key={i} style={{ padding: "4px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: seg.color, flexShrink: 0, marginTop: 7 }} />
                                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{item}</p>
                                </div>
                            ))}
                        </Card>
                    ))}
                </div>

                {/* Revenue math */}
                <Card style={{ marginTop: 20, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 8 }}>Revenue Math Example — Restaurant</h4>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>
                        100 website visitors/day → chatbot captures 5% = <strong style={{ color: ACCENT }}>5 leads/day</strong> × 30 days = <strong style={{ color: ACCENT }}>150 leads/month</strong> × 20% conversion = <strong style={{ color: ACCENT }}>30 additional covers/month</strong> × $80 avg check = <strong style={{ color: WHITE }}>$2,400/month</strong> = <strong style={{ color: WHITE }}>$28,800/year</strong> from a $1,500 AI add-on.
                    </p>
                </Card>

                {/* AI pricing */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginTop: 20 }}>
                    {AI_PRICING.map((a, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 12, color: ACCENT, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8 }}>{a.tier.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 900, color: WHITE, margin: "0 0 8px" }}>{a.price}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>{a.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ═══ 8. PRICING + PITCH ═══ */}
            <section id="wd-pricing" style={{ paddingTop: 80, paddingBottom: 100 }}>
                <SectionTitle sub="How to structure, pitch, and close $7K–$15K web deals">Pricing &amp; Packages</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                    {PRICING_TIERS.map((t, i) => (
                        <Card key={i} style={{ border: t.highlighted ? `2px solid ${ACCENT}` : `1px solid ${CARD_BORDER}`, position: "relative", overflow: "hidden" }}>
                            {t.highlighted && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: BROWN_GRADIENT }} />}
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 13, color: t.highlighted ? ACCENT : TEXT_40, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>{t.name.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(26px, 3.5vw, 34px)", fontWeight: 900, color: WHITE, margin: "4px 0 8px" }}>{t.price}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40, marginBottom: 16 }}>Best for: {t.best}</p>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {t.features.map((f, j) => (
                                    <li key={j} style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, padding: "4px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                                        <span style={{ color: ACCENT, fontSize: 11, marginTop: 2, flexShrink: 0 }}>{"\u2713"}</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>

                {/* Proposal structure */}
                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, margin: "36px 0 16px" }}>Proposal Structure</p>
                <Card>
                    {PROPOSAL_STEPS.map((s, i) => <TimelineStep key={i} num={i + 1} color={tierColor(i)} title={s.title} body={s.body} />)}
                </Card>

                {/* Retainer upsell */}
                <Card style={{ marginTop: 20, borderLeft: "3px solid #1D9E75", background: "rgba(29,158,117,0.04)" }}>
                    <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 8 }}>Retainer Upsell</h4>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>
                        Every web project ends with a retainer conversation: &ldquo;We&rsquo;ve built the car — now do you want us to keep it running?&rdquo; Monthly maintenance + content updates + AI optimization: <strong style={{ color: ACCENT }}>$500–$2,000/month</strong>. Retainer clients have <strong style={{ color: WHITE }}>90%+ renewal rate</strong>. Zero new sales effort required.
                    </p>
                </Card>

                {/* Monthly targets */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginTop: 20 }}>
                    {MONTHLY_TARGETS.map((m, i) => (
                        <Card key={i} style={{ textAlign: "center" }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.1em", marginBottom: 8 }}>{m.label.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 900, color: ACCENT, margin: "0 0 4px" }}>{m.value}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40 }}>{m.sub}</p>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    );
}
