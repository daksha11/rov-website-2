"use client";

import {
    ACCENT, BG, BG_CARD, CARD_BORDER,
    BROWN_GRADIENT,
    FONT_HEADING, FONT_BODY,
    WHITE, TEXT_90, TEXT_60, TEXT_40, TEXT_20,
    tierColor,
} from "../../_shared/tokens";
import { SectionTitle, Card, AnimatedBar } from "../../_shared/components";
import {
    NAV_SECTIONS, TAM_TABLE, SAM_FILTERS, SOM_TABLE, VIDEO_PRICING,
    LTV_CAC, CAC_CHANNELS,
    MARGINS, REVENUE_MIX, EXPANSION_STATS,
    SWITCHING_COSTS, IP_INVENTORY,
    FUNDED_COMPS, VALUATION_MULTIPLES, CASE_STUDIES, ATL_VCS, ATL_DEAL_TERMS,
    TAILWINDS, GA_INCENTIVES,
    AI_DELIVERY, PRODUCT_ROADMAP, EXPANSION_CITIES,
    RISKS, INVESTOR_METRICS,
} from "./data";

export { NAV_SECTIONS };

function BL({ items, color }: { items: string[]; color: string }) {
    return <>{items.map((t, i) => (
        <div key={i} style={{ padding: "4px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 7 }} />
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{t}</p>
        </div>
    ))}</>;
}

function Table({ headers, rows, highlightCol }: { headers: string[]; rows: (string | undefined)[][]; highlightCol?: number }) {
    return (
        <Card style={{ overflowX: "auto", padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                <thead><tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                    {headers.map((h, i) => (
                        <th key={h} style={{ textAlign: i === 0 ? "left" : "center", padding: "14px 14px", color: i === highlightCol ? ACCENT : TEXT_40, fontSize: 10, letterSpacing: "0.06em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                    ))}
                </tr></thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                            {r.map((cell, j) => (
                                <td key={j} style={{ padding: "12px 14px", textAlign: j === 0 ? "left" : "center", color: j === highlightCol ? ACCENT : (j === 0 ? TEXT_90 : TEXT_60), fontWeight: j === highlightCol ? 700 : 400, fontFamily: j === 0 ? FONT_HEADING : FONT_BODY, fontStyle: j === 0 ? "italic" : "normal", fontSize: 12 }}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}

export default function VCInvestorsTab({ chartReady }: { chartReady: boolean }) {
    return (
        <>
            {/* ═══ 1. TAM/SAM/SOM ═══ */}
            <section id="vc-tam" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Bottom-up market sizing across all five service pillars">TAM / SAM / SOM</SectionTitle>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 12 }}>Bottom-Up TAM (Atlanta Metro / Georgia)</p>
                <Table headers={["Service Pillar", "Sizing Basis", "ATL/GA TAM"]} highlightCol={2} rows={TAM_TABLE.map(r => [r.pillar, r.basis, r.tam])} />
                <Card style={{ marginTop: 12, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, color: WHITE, margin: 0 }}>Combined TAM: <span style={{ color: ACCENT, fontWeight: 900, fontSize: 22 }}>~$28.1B</span></p>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>SAM Narrowing</p>
                <Table headers={["Filter", "Businesses", "Note"]} rows={SAM_FILTERS.map(r => [r.filter, r.businesses, r.note])} />
                <Card style={{ marginTop: 12, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: TEXT_60 }}>At avg ACV of $12K\u2013$36K: <strong style={{ color: WHITE }}>SAM = $224M\u2013$673M annually</strong> in the Atlanta/Georgia market.</p>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>SOM Projection: Year 1\u20133</p>
                <Table headers={["Year", "Clients", "Avg ACV", "Annual Revenue", "Capture Rate"]} highlightCol={3} rows={SOM_TABLE.map(r => [r.year, r.clients, r.acv, r.revenue, r.capture])} />

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Atlanta Video Production Pricing Landscape</p>
                <Table headers={["Video Type", "ATL Price Range", "R.O.V. Opportunity"]} rows={VIDEO_PRICING.map(r => [r.type, r.range, r.opp])} />
            </section>

            {/* ═══ 2. UNIT ECONOMICS ═══ */}
            <section id="vc-unit" style={{ paddingTop: 80 }}>
                <SectionTitle sub="LTV:CAC modeling by client segment">Unit Economics</SectionTitle>
                <Table headers={["Segment", "Monthly Spend", "Lifespan", "LTV", "CAC", "LTV:CAC"]} highlightCol={5} rows={LTV_CAC.map(r => [r.segment, r.spend, r.lifespan, r.ltv, r.cac, r.ratio])} />

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>CAC Benchmarks by Channel</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                    {CAC_CHANNELS.map((c, i) => (
                        <Card key={i} style={{ textAlign: "center", borderTop: `3px solid ${i === CAC_CHANNELS.length - 1 ? "#E84B8A" : tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40, marginBottom: 6 }}>{c.channel}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 900, color: i === CAC_CHANNELS.length - 1 ? "#E84B8A" : ACCENT, margin: 0 }}>{c.cac}</p>
                        </Card>
                    ))}
                </div>
                <Card style={{ marginTop: 12, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: TEXT_60 }}>R.O.V.\u2019s blended CAC target: <strong style={{ color: ACCENT }}>$200\u2013$500</strong> (referral-driven), far below the <strong style={{ color: "#E84B8A" }}>$802 industry average</strong>. Minimum viable LTV:CAC is 3:1; R.O.V. targets <strong style={{ color: WHITE }}>12:1\u201348:1</strong>.</p>
                </Card>
            </section>

            {/* ═══ 3. MARGINS + REVENUE ═══ */}
            <section id="vc-margins" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Gross margin analysis and path to 70%+ recurring revenue">Margins &amp; Revenue Mix</SectionTitle>
                <Table headers={["Pillar", "Gross Margin", "Margin Driver", "Portfolio Role"]} highlightCol={1} rows={MARGINS.map(r => [r.pillar, r.margin, r.driver, r.role])} />

                <Card style={{ marginTop: 16, borderLeft: "3px solid #1D9E75" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 8 }}>Strategic Portfolio Play</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>Lead with <strong style={{ color: ACCENT }}>design</strong> (high perceived value, moderate margin), close the retainer with <strong style={{ color: ACCENT }}>web + AI automation</strong> (highest margins), deepen with <strong style={{ color: ACCENT }}>sound</strong> (cultural lock-in), scale revenue with <strong style={{ color: ACCENT }}>video</strong> (universal cross-sell, 24.58% CAGR \u2014 fastest-growing pillar).</p>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Revenue Mix Trajectory</p>
                <Table headers={["Year", "Project-Based", "Retainer/Recurring", "Recurring %", "Key Drivers"]} highlightCol={3} rows={REVENUE_MIX.map(r => [r.year, r.project, r.retainer, r.pct, r.drivers])} />

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Expansion Revenue Drivers</p>
                <Card>
                    <BL color={ACCENT} items={EXPANSION_STATS} />
                </Card>
            </section>

            {/* ═══ 4. MOAT + SWITCHING ═══ */}
            <section id="vc-moat" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Switching costs compound with every pillar activated">Competitive Moat &amp; Defensibility</SectionTitle>
                <Table headers={["Asset", "Replacement Cost", "Time to Replace", "Risk"]} rows={SWITCHING_COSTS.map(r => [r.asset, r.cost, r.time, r.risk])} />
                <Card style={{ marginTop: 12, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: TEXT_60 }}>Total switching cost: <strong style={{ color: WHITE }}>$32,500\u2013$275,000+</strong> over <strong style={{ color: WHITE }}>6\u201314 months</strong>. For a $5K/month retainer ($60K/year), switching costs = <strong style={{ color: ACCENT }}>54%\u2013458% of annual spend</strong>. Each additional pillar exponentially increases lock-in.</p>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Proprietary Tech Inventory (Licensable IP)</p>
                <Card>
                    <BL color="#1D9E75" items={IP_INVENTORY} />
                </Card>
            </section>

            {/* ═══ 5. COMPARABLES ═══ */}
            <section id="vc-comps" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Funded creative-as-a-service companies and agency valuations">Comparable Transactions</SectionTitle>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {FUNDED_COMPS.map((c, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{c.company}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40, marginBottom: 8 }}>{c.stage}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 4 }}><strong style={{ color: TEXT_40 }}>Revenue:</strong> {c.revenue}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 4 }}><strong style={{ color: TEXT_40 }}>Funding:</strong> {c.funding}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: ACCENT }}><strong>Proved:</strong> {c.proved}</p>
                        </Card>
                    ))}
                </div>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Agency Valuation Multiples</p>
                <Table headers={["Revenue Band", "EBITDA Margin", "EBITDA Multiple", "Rev Multiple"]} highlightCol={3} rows={VALUATION_MULTIPLES.map(r => [r.band, r.ebitda_margin, r.ebitda_multiple, r.rev_multiple])} />

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Agency \u2192 Platform Conversion Case Studies</p>
                {CASE_STUDIES.map((cs, i) => (
                    <Card key={i} style={{ marginBottom: 12, borderLeft: `3px solid ${tierColor(i)}` }}>
                        <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 8 }}>{cs.name}</p>
                        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>{cs.detail}</p>
                    </Card>
                ))}

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Atlanta Seed/Pre-Seed Deal Terms</p>
                <Table headers={["Metric", "Data"]} highlightCol={1} rows={ATL_DEAL_TERMS.map(r => [r.metric, r.data])} />

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Key VC Targets for R.O.V.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {ATL_VCS.map((v, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{v.fund}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 900, color: ACCENT, margin: "4px 0 8px" }}>{v.check}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>{v.fit}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ═══ 6. ATLANTA TAILWINDS ═══ */}
            <section id="vc-atl" style={{ paddingTop: 80 }}>
                <SectionTitle sub="FIFA World Cup, Super Bowl, tech ecosystem, and state incentives">Atlanta Market Tailwinds</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {TAILWINDS.map((t, i) => (
                        <Card key={i} style={{ borderLeft: `3px solid ${t.color}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: WHITE, marginBottom: 8 }}>{t.event}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>{t.detail}</p>
                        </Card>
                    ))}
                </div>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Georgia Incentive Programs</p>
                <Table headers={["Program", "Benefit", "R.O.V. Relevance"]} rows={GA_INCENTIVES.map(r => [r.program, r.benefit, r.relevance])} />
            </section>

            {/* ═══ 7. SCALABILITY ═══ */}
            <section id="vc-scale" style={{ paddingTop: 80 }}>
                <SectionTitle sub="AI-enabled delivery economics and productization roadmap">Scalability &amp; Growth Levers</SectionTitle>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 12 }}>AI-Enabled Delivery Economics</p>
                <Table headers={["Deliverable", "Traditional Cost", "AI-Assisted Cost", "Improvement"]} highlightCol={3} rows={AI_DELIVERY.map(r => [r.deliverable, r.traditional, r.ai, r.improvement])} />

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Productization Roadmap</p>
                <Card>
                    {PRODUCT_ROADMAP.map((p, i) => (
                        <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingBottom: 20 }}>
                            <span style={{ width: 36, height: 36, borderRadius: "50%", background: tierColor(i), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEADING, fontSize: 13, fontWeight: 800, color: BG, flexShrink: 0 }}>{i + 1}</span>
                            <div>
                                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: tierColor(i), letterSpacing: "0.08em", marginBottom: 2 }}>{p.phase} \u2014 {p.timeline}</p>
                                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "0 0 4px" }}>{p.product}</p>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>{p.model}</p>
                            </div>
                        </div>
                    ))}
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Geographic Expansion Potential</p>
                <Table headers={["City", "Music Economy", "Startup Ecosystem", "Cultural Capital", "Fit"]} highlightCol={4} rows={EXPANSION_CITIES.map(r => [r.city, r.music, r.startup, r.culture, r.fit])} />
            </section>

            {/* ═══ 8. RISK ANALYSIS ═══ */}
            <section id="vc-risk" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Key risks and mitigation strategies">Risk Analysis</SectionTitle>
                {RISKS.map((r, i) => (
                    <Card key={i} style={{ marginBottom: 16, borderLeft: `3px solid ${tierColor(i)}` }}>
                        <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 6 }}>{r.risk}</p>
                        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#E84B8A", marginBottom: 8 }}>{r.detail}</p>
                        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}><strong style={{ color: "#1D9E75" }}>Mitigation:</strong> {r.mitigation}</p>
                    </Card>
                ))}
            </section>

            {/* ═══ 9. INVESTOR METRICS ═══ */}
            <section id="vc-metrics" style={{ paddingTop: 80, paddingBottom: 100 }}>
                <SectionTitle sub="What investors need to see at R.O.V.\u2019s stage">Investor-Grade Metrics</SectionTitle>
                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                        <thead><tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                            {["Metric", "Minimum for Seed", "Strong for Seed", "R.O.V. Target"].map((h, i) => (
                                <th key={h} style={{ textAlign: i === 0 ? "left" : "center", padding: "14px 14px", color: i === 3 ? ACCENT : TEXT_40, fontSize: 10, letterSpacing: "0.06em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {INVESTOR_METRICS.map((m, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "12px 14px", color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 13 }}>{m.metric}</td>
                                    <td style={{ padding: "12px 14px", textAlign: "center", color: TEXT_40, fontSize: 12 }}>{m.minimum}</td>
                                    <td style={{ padding: "12px 14px", textAlign: "center", color: "#1D9E75", fontSize: 12 }}>{m.strong}</td>
                                    <td style={{ padding: "12px 14px", textAlign: "center", color: ACCENT, fontWeight: 700, fontSize: 12 }}>{m.rovTarget}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>
                        The path to investability mirrors <strong style={{ color: WHITE }}>Design Pickle\u2019s trajectory</strong>: build to $1M+ ARR through operational excellence and retainer growth, then pursue growth capital at favorable terms. Alternatively, <strong style={{ color: ACCENT }}>Collab Capital\u2019s SPACE model</strong> (profit-sharing + equity) provides non-dilutive-adjacent capital while R.O.V. maintains control.
                    </p>
                </Card>
            </section>
        </>
    );
}
