"use client";

import { useState, useMemo } from "react";
import {
    ACCENT, BG, BG_CARD, CARD_BORDER,
    BROWN_GRADIENT, SHADOW_CARD,
    FONT_HEADING, FONT_BODY,
    WHITE, TEXT_90, TEXT_60, TEXT_40, TEXT_20,
    tierColor,
} from "../../_shared/tokens";
import { SectionTitle, Card, AnimatedCounter, AnimatedBar } from "../../_shared/components";
import {
    NAV_SECTIONS, MARKET_STATS, ROI_STATS, ROI_BY_FORMAT, PLATFORM_STATS, PLATFORMS,
    RE_STATS, RE_VIDEO_TYPES, RE_RETAINERS, MEDIA_SEGMENTS,
    PRICING_TABLE, FREELANCE_TIERS, ADDONS,
    RETAINER_STATS, RETAINER_PITCH_STEPS, RETAINER_BY_CLIENT, RETAINER_OBJECTIONS,
    DRONE_STATS, FAA_STEPS, DRONE_APPS,
    WALKIN_STEPS, OUTREACH_CHANNELS, CRED_SIGNALS, MONTHLY_TARGETS,
} from "./data";
import type { MediaSegKey } from "./data";

export { NAV_SECTIONS };

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
    return (
        <Card>
            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.08em", marginBottom: 10 }}>{label.toUpperCase()}</p>
            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: ACCENT, margin: "0 0 4px" }}>{value}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40 }}>{sub}</p>
        </Card>
    );
}

function TimelineStep({ num, color, title, body, sub }: { num: number; color: string; title: string; body: string; sub?: string }) {
    return (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 800, color: BG }}>{num}</span>
                <div style={{ width: 2, height: 40, background: `${color}30`, marginTop: 4 }} />
            </div>
            <div style={{ paddingBottom: 24 }}>
                {sub && <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color, letterSpacing: "0.08em", marginBottom: 4 }}>{sub}</p>}
                <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: WHITE, margin: "0 0 8px" }}>{title}</h4>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>{body}</p>
            </div>
        </div>
    );
}

function BulletList({ items, color }: { items: string[]; color: string }) {
    return <>{items.map((t, i) => (
        <div key={i} style={{ padding: "4px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 7 }} />
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, margin: 0 }}>{t}</p>
        </div>
    ))}</>;
}

/* ═══════════════════════════════════════════════════════ */
export default function MediaProductionTab({ chartReady }: { chartReady: boolean }) {
    const [activePlatform, setActivePlatform] = useState<"reels" | "tiktok" | "trial">("reels");
    const [activeSegment, setActiveSegment] = useState<MediaSegKey>("restaurants");
    const [activeRoiFormat, setActiveRoiFormat] = useState(0);
    const [expandedObj, setExpandedObj] = useState<number | null>(null);
    const [visitors, setVisitors] = useState(5000);
    const [convRate, setConvRate] = useState(2);

    const roiCalc = useMemo(() => {
        const current = Math.round(visitors * (convRate / 100));
        const projected = Math.round(visitors * ((convRate * 1.8) / 100));
        const gain = projected - current;
        return { current, projected, gain, annual: gain * 12, revenue: gain * 12 * 150 };
    }, [visitors, convRate]);

    const seg = MEDIA_SEGMENTS[activeSegment];

    return (
        <>
            {/* ═══ 1. MARKET OVERVIEW ═══ */}
            <section id="mp-overview" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Why video is now the single most important marketing tool for every Atlanta business">Media Production Market</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                    {MARKET_STATS.map((s, i) => (
                        <Card key={i}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.1em", marginBottom: 12 }}>{s.label.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 900, margin: "0 0 8px", background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.suffix === "B" ? 0 : 0} />
                            </p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40 }}>{s.sub}</p>
                        </Card>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 24 }}>
                    <Card style={{ borderLeft: "3px solid #1D9E75" }}>
                        <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 16 }}>What R.O.V. delivers</h3>
                        <BulletList color="#1D9E75" items={["Short-form reels, TikToks, trial reels (15\u201360 sec)", "Property listing + promotional videos (2\u20134 min)", "Drone + aerial footage (FAA Part 107 certified)", "Event recap coverage", "Brand/promo videos (60\u201390 sec)", "Dialogue-style videos (shop intros, owner spotlights)", "Cool edits + highlight reels", "Motion design/animated videos (premium tier)", "Target: $1,500\u2013$3,500 per project | Mix of project + retainer"]} />
                    </Card>
                    <Card style={{ borderLeft: "3px solid #E8A838" }}>
                        <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 18, fontWeight: 700, color: WHITE, marginBottom: 16 }}>R.O.V.&rsquo;s edge</h3>
                        <BulletList color="#E8A838" items={["Young team that understands social from the ground up", "Quality cameras, drone, LOG footage, premium editing + color grading", "Fast turnaround \u2014 organized file structure and clean deliverables", "Clear communication \u2014 no ghosting, locked timelines, professional handoff", "Only media production team in Atlanta also offering brand identity, web dev, and AI workflows"]} />
                    </Card>
                </div>
            </section>

            {/* ═══ 2. ROI + BUSINESS CASE ═══ */}
            <section id="mp-roi" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Hard numbers to show in every pitch meeting">The ROI Case for Video</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                    {ROI_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "32px 0 12px" }}>ROI by Format</p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
                    {ROI_BY_FORMAT.map((f, i) => (
                        <button key={i} onClick={() => setActiveRoiFormat(i)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontFamily: FONT_HEADING, fontStyle: "italic", border: "none", cursor: "pointer", transition: "all 0.3s", color: activeRoiFormat === i ? BG : TEXT_40, background: activeRoiFormat === i ? BROWN_GRADIENT : "rgba(234,154,97,0.06)" }}>{f.format}</button>
                    ))}
                </div>
                <Card style={{ borderLeft: `3px solid ${ROI_BY_FORMAT[activeRoiFormat].color}` }}>
                    <BulletList color={ROI_BY_FORMAT[activeRoiFormat].color} items={ROI_BY_FORMAT[activeRoiFormat].stats} />
                </Card>

                {/* ROI Calculator */}
                <Card style={{ marginTop: 24 }}>
                    <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 20, fontWeight: 700, color: WHITE, marginBottom: 8 }}>Video ROI Calculator</h3>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40, marginBottom: 20 }}>Estimate a client&rsquo;s annual gain from professional video</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 20 }}>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>Monthly website visitors</span>
                                <span style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 800, color: ACCENT }}>{visitors.toLocaleString()}</span>
                            </div>
                            <input type="range" min={1000} max={50000} step={1000} value={visitors} onChange={e => setVisitors(Number(e.target.value))} style={{ width: "100%", accentColor: ACCENT, cursor: "pointer" }} />
                        </div>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60 }}>Current conversion rate</span>
                                <span style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 800, color: ACCENT }}>{convRate.toFixed(1)}%</span>
                            </div>
                            <input type="range" min={0.5} max={5} step={0.1} value={convRate} onChange={e => setConvRate(Number(e.target.value))} style={{ width: "100%", accentColor: ACCENT, cursor: "pointer" }} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                        {[
                            { label: "Current monthly conversions", val: roiCalc.current.toLocaleString() },
                            { label: "Projected with video (+80%)", val: roiCalc.projected.toLocaleString() },
                            { label: "Monthly gain", val: `+${roiCalc.gain.toLocaleString()}` },
                            { label: "Annual gain", val: `+${roiCalc.annual.toLocaleString()}` },
                        ].map((c, i) => (
                            <div key={i} style={{ background: "rgba(234,154,97,0.04)", borderRadius: 10, padding: 14, borderTop: `2px solid ${tierColor(i)}` }}>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_40, marginBottom: 4 }}>{c.label}</p>
                                <p style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 900, color: WHITE, margin: 0 }}>{c.val}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(234,154,97,0.06)", border: "1px solid rgba(234,154,97,0.15)" }}>
                        <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT }}>At a $150 average order/lead value, that&rsquo;s <strong style={{ color: WHITE }}>{fmt(roiCalc.revenue)}</strong> additional annual revenue from one video investment.</p>
                    </div>
                </Card>
            </section>

            {/* ═══ 3. SHORT-FORM VIDEO ═══ */}
            <section id="mp-shortform" style={{ paddingTop: 80 }}>
                <SectionTitle sub="The team that lives on TikTok, Reels, and Trial Reels">Short-Form Video &mdash; R.O.V.&rsquo;s Social Edge</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
                    {PLATFORM_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>

                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                    {(Object.keys(PLATFORMS) as Array<"reels" | "tiktok" | "trial">).map(k => (
                        <button key={k} onClick={() => setActivePlatform(k)} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontFamily: FONT_HEADING, fontStyle: "italic", border: "none", cursor: "pointer", transition: "all 0.3s", color: activePlatform === k ? BG : TEXT_40, background: activePlatform === k ? BROWN_GRADIENT : "rgba(234,154,97,0.06)" }}>{PLATFORMS[k].label}</button>
                    ))}
                </div>
                <Card>
                    <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: WHITE, marginBottom: 16 }}>{PLATFORMS[activePlatform].label}</h4>
                    <BulletList color={ACCENT} items={PLATFORMS[activePlatform].items} />
                </Card>

                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 15, color: ACCENT, lineHeight: 1.6 }}>You have <strong style={{ color: WHITE }}>3 seconds or less</strong> to capture attention. Start with the payoff, problem, or most compelling moment &mdash; not the setup. Every video R.O.V. produces is built with the hook first, always.</p>
                </Card>

                <Card style={{ marginTop: 12, borderLeft: "3px solid #1D9E75" }}>
                    <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 12 }}>What R.O.V. understands that older videographers don&rsquo;t</h4>
                    <BulletList color="#1D9E75" items={["9:16 vertical format is the only ratio that matters for social discovery", "85% of mobile videos watched on mute \u2014 captions and text overlays are non-negotiable", "71% of viewers decide within the first few seconds if a video is worth watching", "Platform-specific optimization: TikTok wants raw/authentic; Reels wants polished; YouTube wants substance", "Repurposing one shoot across 3+ platforms lowers cost per piece dramatically", "Color grading and LOG footage give a professional cinematic look DIY can\u2019t match"]} />
                </Card>
            </section>

            {/* ═══ 4. REAL ESTATE ═══ */}
            <section id="mp-realestate" style={{ paddingTop: 80 }}>
                <SectionTitle sub="The highest-margin, most repeatable video service in Atlanta">Real Estate Video + Drone</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                    {RE_STATS.map((s, i) => (
                        <Card key={i}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.08em", marginBottom: 10 }}>{s.label.toUpperCase()}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 900, margin: "0 0 4px", background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                            </p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40 }}>{s.sub}</p>
                        </Card>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 20 }}>
                    <Card style={{ borderLeft: "3px solid #E84B8A" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: "#E84B8A", marginBottom: 12 }}>What agents currently have</h4>
                        <BulletList color="#E84B8A" items={["Static iPhone photos or basic photographer shoots", "No video or outdated slideshow-style video", "No drone coverage on listings under $1M", "Inconsistent visual quality", "Social content identical to every other agent", "No personal brand video"]} />
                    </Card>
                    <Card style={{ borderLeft: "3px solid #1D9E75" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: "#1D9E75", marginBottom: 12 }}>What R.O.V. builds</h4>
                        <BulletList color="#1D9E75" items={["Cinematic listing video with drone flyover (2\u20133 min)", "Short-form social cut (30\u201360 sec Reel/TikTok) from same footage", "Neighborhood/lifestyle b-roll woven in", "Agent personal brand videos (dialogue-style intro, market updates)", "Community/development highlight reels", "Consistent color grade and visual identity", "LOG footage \u2192 premium color graded deliverables"]} />
                    </Card>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginTop: 20 }}>
                    {RE_VIDEO_TYPES.map((v, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 13, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{v.type}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 900, color: ACCENT, margin: "4px 0 12px" }}>{v.price}</p>
                            <BulletList color={tierColor(i)} items={v.features} />
                        </Card>
                    ))}
                </div>

                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 14, color: ACCENT, lineHeight: 1.6 }}>An agent who closes 15\u201320 deals/year should have a video for every listing, a personal brand reel, and consistent social content. R.O.V.&rsquo;s real estate retainer gives them a dedicated creative partner at a predictable monthly rate.</p>
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 16 }}>
                    {RE_RETAINERS.map((r, i) => (
                        <Card key={i} style={{ border: "highlighted" in r ? `2px solid ${ACCENT}` : `1px solid ${CARD_BORDER}`, position: "relative", overflow: "hidden" }}>
                            {"highlighted" in r && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: BROWN_GRADIENT }} />}
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 2 }}>{r.name}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 900, color: ACCENT, margin: "4px 0 4px" }}>{r.price}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_40, marginBottom: 12 }}>Best for: {r.best}</p>
                            <BulletList color={ACCENT} items={r.features} />
                        </Card>
                    ))}
                </div>
            </section>

            {/* ═══ 5. TARGET SEGMENTS ═══ */}
            <section id="mp-segments" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Who needs R.O.V.'s media production most in Atlanta">Target Segments</SectionTitle>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 24 }}>
                    {(Object.keys(MEDIA_SEGMENTS) as MediaSegKey[]).map(k => (
                        <button key={k} onClick={() => setActiveSegment(k)} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontFamily: FONT_HEADING, fontStyle: "italic", border: "none", cursor: "pointer", transition: "all 0.3s", color: activeSegment === k ? BG : TEXT_40, background: activeSegment === k ? BROWN_GRADIENT : "rgba(234,154,97,0.06)" }}>{MEDIA_SEGMENTS[k].label}</button>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                    <Card style={{ borderLeft: "3px solid #E84B8A" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: "#E84B8A", marginBottom: 12 }}>The Problem</h4>
                        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>{seg.problem}</p>
                    </Card>
                    <Card style={{ borderLeft: "3px solid #1D9E75" }}>
                        <h4 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: "#1D9E75", marginBottom: 12 }}>R.O.V.&rsquo;s Solution</h4>
                        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7 }}>{seg.solution}</p>
                    </Card>
                </div>
                <Card style={{ marginTop: 16, background: "rgba(234,154,97,0.04)", borderColor: "rgba(234,154,97,0.2)" }}>
                    <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 15, color: ACCENT, lineHeight: 1.6 }}>&ldquo;{seg.pitch}&rdquo;</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_40, marginTop: 8 }}><strong style={{ color: TEXT_60 }}>Price range:</strong> {seg.price}</p>
                </Card>
            </section>

            {/* ═══ 6. PRICING ═══ */}
            <section id="mp-pricing" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Per-project and retainer rates for every client type">Media Production Pricing</SectionTitle>
                <Card style={{ overflowX: "auto", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                                {["Video Type", "Market Budget", "Market Mid-Range", "R.O.V. Price"].map((h, i) => (
                                    <th key={h} style={{ textAlign: i === 0 ? "left" : "center", padding: "14px 16px", color: i === 3 ? ACCENT : TEXT_40, fontSize: 10, letterSpacing: "0.06em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PRICING_TABLE.map((r, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "12px 16px", color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 13 }}>{r.type}</td>
                                    <td style={{ padding: "12px 16px", textAlign: "center", color: TEXT_40 }}>{r.budget}</td>
                                    <td style={{ padding: "12px 16px", textAlign: "center", color: TEXT_40 }}>{r.mid}</td>
                                    <td style={{ padding: "12px 16px", textAlign: "center", color: ACCENT, fontWeight: 700 }}>{r.rov}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 20 }}>
                    {FREELANCE_TIERS.map((t, i) => (
                        <Card key={i} style={{ borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 8 }}>{t.tier}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>{t.body}</p>
                        </Card>
                    ))}
                </div>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Add-on Services</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                    {ADDONS.map((a, i) => (
                        <Card key={i} style={{ padding: 16 }}>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, marginBottom: 4 }}>{a.name}</p>
                            <p style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 800, color: ACCENT, margin: 0 }}>{a.price}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ═══ 7. RETAINER STRATEGY ═══ */}
            <section id="mp-retainers" style={{ paddingTop: 80 }}>
                <SectionTitle sub="Converting project clients into predictable recurring revenue">Monthly Video Retainers</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
                    {RETAINER_STATS.map((s, i) => <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />)}
                </div>

                <Card>
                    {RETAINER_PITCH_STEPS.map((s, i) => <TimelineStep key={i} num={i + 1} color={s.color} title={s.title} body={s.body} />)}
                </Card>

                <Card style={{ overflowX: "auto", padding: 0, marginTop: 20 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY, fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                                {["Client Type", "Starter", "Growth", "Full Partner"].map((h, i) => (
                                    <th key={h} style={{ textAlign: i === 0 ? "left" : "center", padding: "14px 16px", color: TEXT_40, fontSize: 10, letterSpacing: "0.06em", fontFamily: FONT_HEADING, fontStyle: "italic" }}>{h.toUpperCase()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {RETAINER_BY_CLIENT.map((r, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(234,154,97,0.05)" }}>
                                    <td style={{ padding: "12px 16px", color: TEXT_90, fontFamily: FONT_HEADING, fontStyle: "italic" }}>{r.type}</td>
                                    <td style={{ padding: "12px 16px", textAlign: "center", color: TEXT_60 }}>{r.starter}</td>
                                    <td style={{ padding: "12px 16px", textAlign: "center", color: TEXT_60 }}>{r.growth}</td>
                                    <td style={{ padding: "12px 16px", textAlign: "center", color: ACCENT, fontWeight: 600 }}>{r.full}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Retainer Objection Handling</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {RETAINER_OBJECTIONS.map((o, i) => (
                        <Card key={i} onClick={() => setExpandedObj(expandedObj === i ? null : i)} style={{ cursor: "pointer", borderLeft: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE }}>{o.q}</p>
                            <div style={{ maxHeight: expandedObj === i ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
                                <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_60, lineHeight: 1.7, paddingTop: 12 }}>{o.a}</p>
                            </div>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_20, marginTop: 8 }}>{expandedObj === i ? "click to collapse" : "click to expand"}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ═══ 8. DRONE + FAA ═══ */}
            <section id="mp-drone" style={{ paddingTop: 80 }}>
                <SectionTitle sub="FAA compliance, Atlanta airspace, and operational guidelines">Drone Operations</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
                    {DRONE_STATS.map((s, i) => (
                        <Card key={i}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 11, color: TEXT_40, letterSpacing: "0.08em", marginBottom: 10 }}>{s.label.toUpperCase()}</p>
                            {"isText" in s ? (
                                <p style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 900, color: ACCENT, margin: "0 0 4px" }}>{s.value}</p>
                            ) : (
                                <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 900, margin: "0 0 4px", background: BROWN_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                    <AnimatedCounter value={s.value as number} prefix={s.prefix!} suffix={s.suffix!} decimals={s.suffix === "B" ? 2 : 0} />
                                </p>
                            )}
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_40 }}>{s.sub}</p>
                        </Card>
                    ))}
                </div>

                <Card>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: WHITE, marginBottom: 20 }}>FAA Part 107 Requirements</p>
                    {FAA_STEPS.map((s, i) => <TimelineStep key={i} num={i + 1} color={tierColor(i)} title={s.title} body={s.body} sub={s.sub} />)}
                </Card>

                <Card style={{ marginTop: 16, borderLeft: "3px solid #E8A838" }}>
                    <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>Georgia-Specific Rules</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>Georgia state parks and historic sites: drone operation prohibited without prior written approval from the Division Director. Must submit a commercial film/photography request. Atlanta BeltLine and city parks: check city ordinances before flying &mdash; some areas have specific restrictions beyond FAA rules.</p>
                </Card>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "24px 0 12px" }}>App Toolkit for Drone Pilots</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                    {DRONE_APPS.map((a, i) => (
                        <Card key={i} style={{ padding: 16, borderTop: `3px solid ${tierColor(i)}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{a.name}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_60 }}>{a.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ═══ 9. GETTING CLIENTS ═══ */}
            <section id="mp-clients" style={{ paddingTop: 80, paddingBottom: 100 }}>
                <SectionTitle sub="How to fill the production pipeline">Client Acquisition for Media Production</SectionTitle>

                <Card>
                    {WALKIN_STEPS.map((s, i) => <TimelineStep key={i} num={i + 1} color={s.color} title={s.title} body={s.body} />)}
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginTop: 20 }}>
                    {OUTREACH_CHANNELS.map((o, i) => (
                        <Card key={i} style={{ borderLeft: `3px solid ${o.color}` }}>
                            <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 8 }}>{o.channel}</p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_60, lineHeight: 1.7 }}>{o.body}</p>
                        </Card>
                    ))}
                </div>

                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: 16, fontWeight: 700, color: WHITE, margin: "28px 0 12px" }}>Credibility Signals for Video Clients</p>
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
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
