"use client";

import {
    ACCENT, BG, BG_CARD, CARD_BORDER,
    BROWN_GRADIENT,
    FONT_HEADING, FONT_BODY,
    WHITE, TEXT_90, TEXT_60, TEXT_40, TEXT_20,
    tierColor,
} from "../../_shared/tokens";
import { SectionTitle, Card, AnimatedCounter, AnimatedBar } from "../../_shared/components";
import {
    NAV_SECTIONS, MARKET_STATS,
    BRAND_ROI, BRAND_CORE, BRAND_OPTIONAL, BRAND_TIERS, FIVERR_BAD, ROV_GOOD,
    MUSIC_STATS, MUSIC_SERVICES, MUSIC_PRICING,
    EVENT_STATS_D, EVENT_PRICING_D,
    SOCIAL_STATS, SOCIAL_PRICING,
    PKG_STATS, PKG_PRICING,
    MOTION_STATS, MOTION_PRICING,
    STAGE_STATS, STAGE_PRICING,
    MASTER_PRICING, HOURLY_RATES, DESIGN_RETAINERS,
    CLIENT_STEPS, OUTREACH_CHANNELS, CRED_SIGNALS, REVENUE_TARGETS,
} from "./data";

export { NAV_SECTIONS };

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
    return (
        <Card>
            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.08em", marginBottom: 10 }}>{label.toUpperCase()}</p>
            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: ACCENT, margin: "0 0 4px" }}>{value}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40 }}>{sub}</p>
        </Card>
    );
}

function TimelineStep({ num, color, title, body }: { num: number; color: string; title: string; body: string }) {
    return (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 800, color: BG }}>{num}</span>
                <div style={{ width: 2, height: 40, background: `${color}30`, marginTop: 4 }} />
            </div>
            <div style={{ paddingBottom: 24 }}>
                <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: WHITE, margin: "0 0 8px" }}>{title}</h4>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>{body}</p>
            </div>
        </div>
    );
}

function BL({ items, color }: { items: string[]; color: string }) {
    return <>{items.map((t, i) => (
        <div key={i} style={{ padding: "4px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 7 }} />
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{t}</p>
        </div>
    ))}</>;
}

function PricingTable({ rows, cols }: { rows: { type?: string; service?: string; fiverr?: string; mid: string; rov: string }[]; cols: string[] }) {
    return (
        <Card style={{ overflowX: "auto", padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                <thead><tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                    {cols.map((h, i) => (
                        <th key={h} style={{ textAlign: i === 0 ? "left" : "center", padding: "14px 16px", color: i === cols.length - 1 ? ACCENT : TEXT_40, fontSize: 10, letterSpacing: "0.06em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                    ))}
                </tr></thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                            <td style={{ padding: "12px 16px", color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 13 }}>{r.type ?? r.service}</td>
                            {r.fiverr !== undefined && <td style={{ padding: "12px 16px", textAlign: "center", color: TEXT_40 }}>{r.fiverr}</td>}
                            <td style={{ padding: "12px 16px", textAlign: "center", color: TEXT_40 }}>{r.mid}</td>
                            <td style={{ padding: "12px 16px", textAlign: "center", color: ACCENT, fontWeight: 700 }}>{r.rov}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}

export default function DesignTab({ chartReady }: { chartReady: boolean }) {
    return (
        <>
            {/* ═══ 1. MARKET OVERVIEW ═══ */}
            <section id="ds-overview" style={{ paddingTop: 40 }}>
                <SectionTitle sub="Why design is the highest-leverage investment a business can make">Design Market</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                    {MARKET_STATS.map((s, i) => (
                        <Card key={i}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.1em", marginBottom: 12 }}>{s.label.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 900, margin: "0 0 8px", background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.value < 1 ? 1 : 0} />
                            </p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40 }}>{s.sub}</p>
                        </Card>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 24 }}>
                    <Card style={{ borderLeft: "3px solid #1D9E75" }}>
                        <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 16 }}>What R.O.V. designs</h3>
                        <BL color="#1D9E75" items={["Song covers + album art (singles, EPs, albums)", "Promotional flyers + event banners", "Social media posts + story templates", "Highlight covers + profile branding", "Brand identity kits (logo, colors, typography, guidelines)", "Product packaging + labels (sauce, apparel, food, CPG)", "Stage visuals + LED content", "Motion design + animated graphics"]} />
                    </Card>
                    <Card style={{ borderLeft: "3px solid #E8A838" }}>
                        <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 16 }}>R.O.V.&rsquo;s design edge</h3>
                        <BL color="#E8A838" items={["Design-first agency \u2014 aesthetics are the foundation", "Figma + Affinity + Adobe stack \u2014 production-ready, not template-based", "Cultural fluency \u2014 hip-hop, streetwear, Atlanta creative scene", "Every design service cross-sells with sound, web, and media production", "No other small ATL studio offers design + sound + web + AI + video + stage visuals"]} />
                    </Card>
                </div>
            </section>

            {/* ═══ 2. BRAND IDENTITY ═══ */}
            <section id="ds-brand" style={{ paddingTop: 80 }}>
                <SectionTitle sub="The foundation every business needs before anything else">Brand Identity Kits</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                    {BRAND_ROI.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>
                <Card style={{ marginTop: 20 }}>
                    <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 12 }}>Core Deliverables</h4>
                    <BL color={ACCENT} items={BRAND_CORE} />
                    <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "20px 0 12px" }}>Optional Extensions</h4>
                    <BL color="#7F77DD" items={BRAND_OPTIONAL} />
                </Card>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 20 }}>
                    {BRAND_TIERS.map((t, i) => (
                        <Card key={i} style={{ border: t.highlighted ? `2px solid ${t.tagColor}` : `1px solid ${CARD_BORDER}`, position: "relative", overflow: "hidden" }}>
                            {t.highlighted && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.tagColor }} />}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, margin: 0 }}>{t.name}</p>
                                <span style={{ fontFamily: FONT_HEADING, fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 4, background: `${t.tagColor}20`, color: t.tagColor }}>{t.tag.toUpperCase()}</span>
                            </div>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 26, fontWeight: 900, color: ACCENT, margin: "8px 0 16px" }}>{t.price}</p>
                            <BL color={t.tagColor} items={t.features} />
                        </Card>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginTop: 20 }}>
                    <Card style={{ borderLeft: "3px solid #E84B8A" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: "#E84B8A", marginBottom: 12 }}>What $50\u2013$150 on Fiverr gets you</h4>
                        {FIVERR_BAD.map((t, i) => (
                            <div key={i} style={{ padding: "4px 0", display: "flex", gap: 10 }}>
                                <span style={{ color: "#E84B8A", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{"\u2715"}</span>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{t}</p>
                            </div>
                        ))}
                    </Card>
                    <Card style={{ borderLeft: "3px solid #1D9E75" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: "#1D9E75", marginBottom: 12 }}>What R.O.V. delivers</h4>
                        {ROV_GOOD.map((t, i) => (
                            <div key={i} style={{ padding: "4px 0", display: "flex", gap: 10 }}>
                                <span style={{ color: "#1D9E75", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{"\u2713"}</span>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{t}</p>
                            </div>
                        ))}
                    </Card>
                </div>
            </section>

            {/* ═══ 3. MUSIC + ARTIST ═══ */}
            <section id="ds-music" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Visual identity is as important as the sound">Music + Artist Design</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                    {MUSIC_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>
                <Card style={{ marginTop: 20 }}>
                    <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 12 }}>R.O.V. Music Design Services</h4>
                    <BL color={ACCENT} items={MUSIC_SERVICES} />
                </Card>
                <div style={{ marginTop: 20 }}>
                    <PricingTable rows={MUSIC_PRICING} cols={["Deliverable", "Fiverr Budget", "Market Mid-Range", "R.O.V. Price"]} />
                </div>
                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT, lineHeight: 1.6 }}>R.O.V. is the only studio in Atlanta where you can record the song AND design the cover in the same place. No briefs across vendors. No disconnected aesthetics. The visual and the audio are both built by the same creative team.</p>
                </Card>
            </section>

            {/* ═══ 4. EVENT + PROMO ═══ */}
            <section id="ds-event" style={{ paddingTop: 80 }}>
                <SectionTitle sub="The visual that gets people through the door">Event + Promotional Graphics</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                    {EVENT_STATS_D.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>
                <div style={{ marginTop: 20 }}>
                    <PricingTable rows={EVENT_PRICING_D} cols={["Deliverable", "Fiverr/DIY", "Market Rate", "R.O.V. Price"]} />
                </div>
            </section>

            {/* ═══ 5. SOCIAL MEDIA ═══ */}
            <section id="ds-social" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Your visual identity on the platforms where your audience lives">Social Media Design</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                    {SOCIAL_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>
                <div style={{ marginTop: 20 }}>
                    <PricingTable rows={SOCIAL_PRICING} cols={["Deliverable", "DIY/Fiverr", "Market Rate", "R.O.V. Price"]} />
                </div>
                <Card style={{ marginTop: 16, background: "rgba(232,75,138,0.04)", borderColor: "rgba(232,75,138,0.15)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: "#E84B8A", lineHeight: 1.6 }}>Most businesses have a beautiful product \u2014 and a profile that looks like nobody thought about it. 83% of users discover brands on Instagram. If the profile doesn&rsquo;t convert the click into a follow, the ad spend is wasted. R.O.V. builds social identity systems where every post looks like it belongs.</p>
                </Card>
            </section>

            {/* ═══ 6. PACKAGING ═══ */}
            <section id="ds-packaging" style={{ paddingTop: 80 }}>
                <SectionTitle sub="The physical touchpoint that makes or breaks a premium product">Product Packaging + Labels</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                    {PKG_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>
                <div style={{ marginTop: 20 }}>
                    <PricingTable rows={PKG_PRICING} cols={["Deliverable", "Fiverr Budget", "Market Range", "R.O.V. Price"]} />
                </div>
                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT, lineHeight: 1.6 }}>Atlanta&rsquo;s food and beverage scene is exploding \u2014 local hot sauces, BBQ rubs, craft beverages. Most local CPG brands launch with a label designed in Canva that looks like it came from a gas station. R.O.V. builds packaging that looks like it belongs on a Whole Foods shelf \u2014 at an accessible price.</p>
                </Card>
                <Card style={{ marginTop: 12, borderLeft: "3px solid #1D9E75" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>What makes packaging different</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>Packaging requires: print-ready files at exact bleed/trim specs, CMYK color mode (not RGB), accurate dieline templates for the container, FDA compliance for food/beverage labels, and material-specific design. R.O.V. delivers print-ready files, not just pretty concepts.</p>
                </Card>
            </section>

            {/* ═══ 7. MOTION DESIGN ═══ */}
            <section id="ds-motion" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Premium-tier visual storytelling \u2014 when static isn\u2019t enough">Motion Design + Animation</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                    {MOTION_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>
                <div style={{ marginTop: 20 }}>
                    <PricingTable rows={MOTION_PRICING} cols={["Deliverable", "Freelance Budget", "Market Range", "R.O.V. Price"]} />
                </div>
                <Card style={{ marginTop: 16, borderLeft: "3px solid #1D9E75" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>Why R.O.V. can offer motion at competitive rates</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>Most clients get quoted $5,000+ for a 30-second animation at a specialized studio. R.O.V. builds motion as an extension of the existing brand system \u2014 assets (logo, color, typography) already exist, reducing production time dramatically. The &ldquo;build from scratch&rdquo; tax is eliminated.</p>
                </Card>
            </section>

            {/* ═══ 8. STAGE VISUALS ═══ */}
            <section id="ds-stage" style={{ paddingTop: 80 }}>
                <SectionTitle sub="The visual layer behind every live performance and event">Stage Visuals + LED Content</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                    {STAGE_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>
                <div style={{ marginTop: 20 }}>
                    <PricingTable rows={STAGE_PRICING} cols={["Deliverable", "Market Rate", "R.O.V. Price"]} />
                </div>
                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT, lineHeight: 1.6 }}>Event orgs who book R.O.V. for design retainers get stage visual content included at the Production and Full Partner tier \u2014 VJ loops, flyers, website, social graphics, and brand identity all built by the same team. One invoice.</p>
                </Card>
                <Card style={{ marginTop: 12, borderLeft: "3px solid #1D9E75" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>Stage visuals in the Atlanta context</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>Atlanta venues \u2014 Compound, District ATL, Tabernacle, Center Stage \u2014 all run LED walls. The hardware is there. The content rarely matches the brand quality. Most performers use generic downloaded loops. R.O.V. creates branded, custom visual content. Wide-open gap in the Atlanta market.</p>
                </Card>
            </section>

            {/* ═══ 9. PRICING ═══ */}
            <section id="ds-pricing" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Transparent rates across all R.O.V. design services">Design Pricing at a Glance</SectionTitle>
                <PricingTable rows={MASTER_PRICING} cols={["Service", "Fiverr / DIY", "Mid-Market", "R.O.V."]} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 20 }}>
                    {HOURLY_RATES.map((h, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 8 }}>{h.tier}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>{h.body}</p>
                        </Card>
                    ))}
                </div>
                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Design Monthly Retainers</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    {DESIGN_RETAINERS.map((r, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${r.tagColor}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, margin: 0 }}>{r.name}</p>
                                <span style={{ fontFamily: FONT_HEADING, fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 4, background: `${r.tagColor}20`, color: r.tagColor }}>{r.tag.toUpperCase()}</span>
                            </div>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 900, color: ACCENT, margin: "8px 0 16px" }}>{r.price}</p>
                            <BL color={r.tagColor} items={r.features} />
                        </Card>
                    ))}
                </div>
            </section>

            {/* ═══ 10. GETTING CLIENTS ═══ */}
            <section id="ds-clients" style={{ paddingTop: 80, paddingBottom: 100 }}>
                <SectionTitle sub="How to convert design into R.O.V.\u2019s highest-volume service">Client Acquisition for Design</SectionTitle>
                <Card style={{ background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)", marginBottom: 20 }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 15, color: ACCENT, lineHeight: 1.7 }}>Every single client R.O.V. targets \u2014 artists, restaurants, event orgs, startups, boutiques, CPG brands \u2014 needs design. Design is the lowest-barrier entry point. A $150 flyer converts into a $500 brand kit, into a $3,000 website, into a monthly retainer. <strong style={{ color: WHITE }}>Design is R.O.V.&rsquo;s widest funnel.</strong></p>
                </Card>
                <Card>
                    {CLIENT_STEPS.map((s, i) => <TimelineStep key={i} num={i + 1} color={s.color} title={s.title} body={s.body} />)}
                </Card>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginTop: 20 }}>
                    {OUTREACH_CHANNELS.map((o, i) => (
                        <Card key={i} style={{ borderLeft: `3px solid ${o.color}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 8 }}>{o.channel}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>{o.body}</p>
                        </Card>
                    ))}
                </div>
                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Credibility Signals</p>
                <Card>
                    {CRED_SIGNALS.map((s, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>{s.signal}</span>
                                <span style={{ fontFamily: FONT_HEADING, fontSize: 13, fontWeight: 700, color: "#1D9E75", flexShrink: 0, marginLeft: 12 }}>{s.impact}%</span>
                            </div>
                            <AnimatedBar pct={s.impact} color="#1D9E75" delay={i * 80} />
                        </div>
                    ))}
                </Card>
                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>90-Day Revenue Targets</p>
                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 14 }}>
                        <thead><tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                            {["Goal", "Target", "Revenue"].map(h => (
                                <th key={h} style={{ textAlign: "left", padding: "14px 16px", color: TEXT_40, fontSize: 10, letterSpacing: "0.06em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {REVENUE_TARGETS.map((r, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "12px 16px", color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic" }}>{r.goal}</td>
                                    <td style={{ padding: "12px 16px", color: TEXT_60 }}>{r.target}</td>
                                    <td style={{ padding: "12px 16px", color: ACCENT, fontWeight: 600 }}>{r.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </section>
        </>
    );
}
