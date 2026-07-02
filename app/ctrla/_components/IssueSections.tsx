"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — ISSUE SECTIONS
// Artist Showcase · ROV Spotlight · Events (condensed) · Vue Close
// ═══════════════════════════════════════════════════════

import type { CSSProperties } from "react";
import Image from "next/image";
import { ed, Bleed, Rule, Label, Kicker } from "./editorial";
import { taste, onRepeat, artForm, cookbook, spotlight, events, eventSources, eventsCover, vueClose } from "../data";

// ── Taste — the throughline manifesto ──────────────────

export function ArtistShowcase() {
  return (
    <section id="taste" style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0", scrollMarginTop: 0 }}>
      <Bleed>
        <Kicker color={ed.gold} style={{ marginBottom: 16 }}>{taste.eyebrow}</Kicker>
        {/* Manifesto head — the throughline of the magazine */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(48px,9vw,128px)", letterSpacing: "-0.03em", lineHeight: 0.86, color: ed.ink, margin: 0 }}>
            Taste<span style={{ color: ed.gold }}>.</span>
          </h2>
          <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(16px,2.1vw,28px)", lineHeight: 1.3, color: ed.gold, textAlign: "right", maxWidth: 420, margin: 0 }}>
            {taste.lede}
          </p>
        </div>
        <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(18px,2.4vw,28px) 0 0", maxWidth: 560 }}>
          {taste.note}
        </p>
      </Bleed>
    </section>
  );
}

// ── On Repeat — two songs the studio can't stop playing ──

export function OnRepeat() {
  return (
    <section style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        <Kicker color={ed.gold} style={{ marginBottom: 16 }}>{onRepeat.eyebrow}</Kicker>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(40px,7.5vw,104px)", letterSpacing: "-0.03em", lineHeight: 0.88, color: ed.ink, margin: 0 }}>
            Two on repeat<span style={{ color: ed.gold }}>.</span>
          </h2>
          <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(16px,2.1vw,28px)", lineHeight: 1.3, color: ed.gold, textAlign: "right", maxWidth: 420, margin: 0 }}>
            {onRepeat.note}
          </p>
        </div>

        <Rule style={{ margin: "clamp(32px,4.5vw,56px) 0" }} />

        <div className="ctrla-onrepeat">
          {onRepeat.tracks.map((t, i) => (
            <a
              key={t.url}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ctrla-track"
              style={{ display: "flex", flexDirection: "column", gap: 16, textDecoration: "none" }}
            >
              <Label color={ed.gold}>Track {String(i + 1).padStart(2, "0")}</Label>

              {/* Full square cover art */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", background: ed.panel, border: `1px solid ${ed.hair}` }}>
                <Image
                  src={t.image}
                  alt={`${t.title} — ${t.artist}`}
                  fill
                  sizes="(max-width: 720px) 92vw, 560px"
                  className="ctrla-track-img"
                  style={{ objectFit: "cover" }}
                />
                {/* Play affordance on hover */}
                <span className="ctrla-track-play" aria-hidden>
                  <span style={{ width: 0, height: 0, borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderLeft: `18px solid ${ed.void}`, marginLeft: 5 }} />
                </span>
              </div>

              {/* Title + artist */}
              <div>
                <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,2.8vw,36px)", letterSpacing: "-0.02em", lineHeight: 1, color: ed.ink, margin: "0 0 6px" }}>
                  {t.title}
                </h3>
                <Label color={ed.gold}>{t.artist}</Label>
              </div>
            </a>
          ))}
        </div>
      </Bleed>
    </section>
  );
}

// ── Form of the Volume — a rotating craft (Vol.01: kintsugi) ──

// Shows the volume's craft photo when one is set; otherwise a
// CSS/SVG "mended ceramic" so the section is never an empty frame.
function KintsugiPanel() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 5",
        overflow: "hidden",
        background: `radial-gradient(130% 120% at 32% 26%, ${ed.plum} 0%, ${ed.panel} 46%, ${ed.void} 100%)`,
        border: `1px solid ${ed.hair}`,
      }}
    >
      {artForm.image ? (
        <Image src={artForm.image} alt={`${artForm.form} — ${artForm.origin}`} fill sizes="(max-width: 820px) 92vw, 520px" style={{ objectFit: "cover" }} />
      ) : (
        <svg viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="ctrla-gold-seam" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F0E6E0" />
              <stop offset="0.5" stopColor="#E3C24A" />
              <stop offset="1" stopColor="#A56A67" />
            </linearGradient>
          </defs>
          {/* Mended seams — gold lacquer joining the broken shards */}
          <g fill="none" stroke="url(#ctrla-gold-seam)" strokeLinecap="round">
            <path d="M196 -10 L210 120 L150 230 L230 320 L188 510" strokeWidth="3.4" />
            <path d="M210 120 L330 96" strokeWidth="2.4" />
            <path d="M150 230 L36 210" strokeWidth="2.4" />
            <path d="M150 230 L70 360" strokeWidth="2" />
            <path d="M230 320 L350 350" strokeWidth="2.4" />
            <path d="M230 320 L300 470" strokeWidth="1.8" />
          </g>
          {/* Seam glow */}
          <g fill="none" stroke="#E3C24A" strokeOpacity="0.22" strokeLinecap="round" style={{ filter: "blur(3px)" }}>
            <path d="M196 -10 L210 120 L150 230 L230 320 L188 510" strokeWidth="8" />
          </g>
        </svg>
      )}
      {/* Scrim so the caption stays legible over any photo */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,8,32,0.72) 0%, rgba(15,8,32,0.12) 38%, transparent 64%)" }} />
      <span style={{ position: "absolute", left: 16, bottom: 14, fontFamily: ed.mono, fontSize: "clamp(8px,0.9vw,10px)", letterSpacing: "0.18em", textTransform: "uppercase", color: ed.gold }}>
        {artForm.form} · {artForm.origin}
      </span>
    </div>
  );
}

export function ArtForm() {
  return (
    <section style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(20px,2.6vw,32px)" }}>
          <Kicker color={ed.gold}>{artForm.eyebrow}</Kicker>
          <Label color={ed.gold}>One craft a volume</Label>
        </div>
        <Rule style={{ marginBottom: "clamp(28px,4vw,48px)" }} />

        <div className="ctrla-artform">
          <KintsugiPanel />

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Label color={ed.gold} style={{ display: "block", marginBottom: 12 }}>{artForm.origin}</Label>
            <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(40px,6vw,96px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: ed.ink, margin: "0 0 8px" }}>
              {artForm.form}<span style={{ color: ed.gold }}>.</span>
            </h2>
            <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(18px,2.4vw,30px)", lineHeight: 1.3, color: ed.gold, margin: "0 0 22px", maxWidth: 460 }}>
              {artForm.headline}
            </p>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 24px", maxWidth: 520 }}>
              {artForm.blurb}
            </p>
            <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(16px,2vw,24px)", lineHeight: 1.35, color: ed.ink, margin: "0 0 24px", paddingLeft: 16, borderLeft: `2px solid ${ed.gold}`, maxWidth: 460 }}>
              &ldquo;{artForm.pullquote}&rdquo;
            </p>
            <Label color={ed.gold} style={{ display: "block", maxWidth: 480, lineHeight: 1.7 }}>{artForm.note}</Label>
          </div>
        </div>
      </Bleed>
    </section>
  );
}

// ── Volume bento — three softer features condensed into one asymmetric
//    3x3 grid: the craft (large hero, 2x2), two songs on repeat (right
//    column squares), and the cookbook pick (full-width foot). ──

function BentoStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Label color={ed.inkFaint}>{label}</Label>
      <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(15px,1.6vw,20px)", letterSpacing: "-0.01em", color: ed.gold }}>{value}</span>
    </div>
  );
}

export function VolumeBento() {
  const [t1, t2] = onRepeat.tracks;
  const dish = cookbook.recipes.find((r) => r.featured) ?? cookbook.recipes[0];
  const tile: CSSProperties = { position: "relative", overflow: "hidden", border: `1px solid ${ed.hair}`, background: ed.panel, textDecoration: "none", display: "block" };
  const scrim = "linear-gradient(to top, rgba(15,8,32,0.92) 0%, rgba(15,8,32,0.32) 44%, transparent 72%)";
  const tracks = [
    { t: t1, n: 1, cls: "ctrla-bento-track1" },
    { t: t2, n: 2, cls: "ctrla-bento-track2" },
  ];

  return (
    <section id="cookbook" style={{ background: "transparent", padding: "clamp(40px,6vw,88px) 0", scrollMarginTop: 0 }}>
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(18px,2.4vw,30px)" }}>
          <Kicker color={ed.gold}>Off the clock · this volume</Kicker>
          <Label color={ed.gold}>Sound · Craft · Fuel</Label>
        </div>
        <Rule color={ed.hair} style={{ marginBottom: "clamp(18px,2.4vw,28px)" }} />

        <div className="ctrla-bento">
          {/* CRAFT — the hero, 2x2 */}
          <div className="ctrla-bento-art" style={tile}>
            {artForm.image ? (
              <Image src={artForm.image} alt={`${artForm.form} — ${artForm.origin}`} fill sizes="(max-width: 820px) 92vw, 720px" style={{ objectFit: "cover" }} />
            ) : (
              <span aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(130% 120% at 32% 26%, ${ed.plum} 0%, ${ed.panel} 46%, ${ed.void} 100%)` }} />
            )}
            <span aria-hidden style={{ position: "absolute", inset: 0, background: scrim }} />
            <div style={{ position: "absolute", left: "clamp(18px,2.4vw,34px)", right: "clamp(18px,2.4vw,34px)", bottom: "clamp(18px,2.4vw,32px)" }}>
              <Label color={ed.gold} style={{ display: "block", marginBottom: 12 }}>{artForm.eyebrow}</Label>
              <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(34px,4.4vw,72px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: ed.ink, margin: 0 }}>
                {artForm.form}<span style={{ color: ed.gold }}>.</span>
              </h3>
              <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(16px,1.9vw,26px)", lineHeight: 1.28, color: ed.gold, margin: "10px 0 0", maxWidth: 460 }}>
                {artForm.headline}
              </p>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.3vw,16px)", lineHeight: 1.55, color: ed.inkSoft, margin: "14px 0 0", maxWidth: 540 }}>
                &ldquo;{artForm.pullquote}&rdquo;
              </p>
            </div>
          </div>

          {/* SOUND — two songs on repeat, right-column squares */}
          {tracks.map(({ t, n, cls }) => (
            <a key={t.url} href={t.url} target="_blank" rel="noopener noreferrer" className={`ctrla-track ${cls}`} style={{ ...tile, aspectRatio: "1 / 1" }}>
              <Image src={t.image} alt={`${t.title} — ${t.artist}`} fill sizes="(max-width: 820px) 46vw, 360px" className="ctrla-track-img" style={{ objectFit: "cover" }} />
              <span aria-hidden style={{ position: "absolute", inset: 0, background: scrim }} />
              <span style={{ position: "absolute", top: 12, left: 12, fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: ed.gold }}>On repeat · {String(n).padStart(2, "0")}</span>
              <span className="ctrla-track-play" aria-hidden>
                <span style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: `15px solid ${ed.void}`, marginLeft: 4 }} />
              </span>
              <div style={{ position: "absolute", left: 14, right: 14, bottom: 12 }}>
                <span style={{ display: "block", fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(16px,1.5vw,22px)", letterSpacing: "-0.02em", lineHeight: 1.04, color: ed.ink }}>{t.title}</span>
                <span style={{ display: "block", marginTop: 4, fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: ed.gold }}>{t.artist}</span>
              </div>
            </a>
          ))}

          {/* FUEL — cookbook pick, full-width foot */}
          <a href="/ctrla/cookbook" className="ctrla-bento-food ctrla-feature-card" style={tile} aria-label="Open the galley fridge">
            <div className="ctrla-bento-food-grid">
              <div style={{ position: "relative", background: ed.panel }}>
                {dish.image ? (
                  <Image src={dish.image} alt={dish.name} fill sizes="(max-width: 820px) 92vw, 300px" style={{ objectFit: "cover" }} />
                ) : (
                  <span aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 130% at 30% 25%, ${ed.gold}2E 0%, ${ed.panel} 52%, ${ed.ground} 100%)` }} />
                )}
              </div>
              <div style={{ padding: "clamp(18px,2.6vw,34px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Label color={ed.gold} style={{ display: "block", marginBottom: 10 }}>This volume&apos;s pick · Fuel</Label>
                <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,3.2vw,48px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "0 0 8px" }}>
                  {dish.name}
                </h3>
                <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 14 }}>{dish.origin}{dish.by ? ` · ${dish.by}` : ""}</Label>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.4vw,16px)", lineHeight: 1.55, color: ed.inkSoft, margin: "0 0 18px", maxWidth: 540 }}>{dish.blurb}</p>
                <div style={{ display: "flex", gap: "clamp(18px,3vw,40px)", alignItems: "flex-end", flexWrap: "wrap" }}>
                  <BentoStat label="Time" value={dish.time} />
                  <BentoStat label="Cost" value={dish.cost} />
                  <BentoStat label="Serves" value={dish.serves} />
                  <span className="ctrla-feature-cta" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.gold }}>
                    Open the galley <span aria-hidden className="ctrla-feature-arrow" style={{ transition: "transform .25s" }}>→</span>
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </Bleed>
    </section>
  );
}

// ── Brand Kit Generator (featured tool) ────────────────

const BK_SWATCHES = [
  { c: "#0F0820", label: "Void" },
  { c: "#24123A", label: "Ink" },
  { c: "#4E3D73", label: "Plum" },
  { c: "#A56A67", label: "Rose" },
  { c: "#E3C24A", label: "Gold" },
  { c: "#F0E6E0", label: "Paper" },
];

const BK_FEATURES = ["Colour tokens", "Typography scale", "Voice & tone", "Export to .md"];

export function BrandKitFeature() {
  return (
    <section style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        {/* Standing-feature header — recurs every volume of CTRL-A */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(20px,2.6vw,32px)" }}>
          <Kicker color={ed.gold}>The Toolbox · A CTRL-A Standing Feature</Kicker>
          <Label color={ed.gold}>In every volume</Label>
        </div>
        <Rule style={{ marginBottom: "clamp(28px,4vw,48px)" }} />

        {/* Framed feature panel — emphasized as its own product */}
        <div style={{ border: `1px solid ${ed.hair}`, borderTop: `5px solid ${ed.amber}`, background: "rgba(240,230,224,0.05)" }}>
          <div className="ctrla-brandkit">
            {/* Left — copy */}
            <div style={{ padding: "clamp(28px,4vw,52px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Label color={ed.gold} style={{ display: "block", marginBottom: 14 }}>
                ROV Tool · Always On
              </Label>
              <h2
                style={{
                  fontFamily: ed.grotesque,
                  fontWeight: 800,
                  fontSize: "clamp(34px,5vw,68px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.92,
                  color: ed.ink,
                  margin: "0 0 18px",
                }}
              >
                Brand Kit
                <br />
                Generator
              </h2>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.6vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 24px", maxWidth: 460 }}>
                Drop in your colours, type, and tone. Walk away with a complete, structured
                system, exported to Markdown, ready to drop into any build or AI prompt.
              </p>

              {/* Feature chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                {BK_FEATURES.map((f) => (
                  <span
                    key={f}
                    style={{
                      fontFamily: ed.mono,
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: ed.ink,
                      border: `1px solid ${ed.hair}`,
                      padding: "5px 12px",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                href="/ctrla/brand-kit"
                className="ctrla-bk-cta"
                style={{
                  alignSelf: "flex-start",
                  fontFamily: ed.mono,
                  fontSize: "clamp(11px,1.2vw,13px)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: ed.paper,
                  background: ed.amber,
                  padding: "14px 28px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                Try the Generator <span aria-hidden>→</span>
              </a>
            </div>

            {/* Right — palette visual (on the ink panel) */}
            <div style={{ background: ed.panel, padding: "clamp(28px,4vw,52px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.1em", color: "rgba(240,230,224,0.5)", marginBottom: 18 }}>
                ## Colour Tokens
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {BK_SWATCHES.map((s) => (
                  <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ width: "100%", aspectRatio: "1 / 1", background: s.c, border: "1px solid rgba(240,230,224,0.14)" }} />
                    <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,230,224,0.55)" }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Bleed>
    </section>
  );
}

// ── ROV Spotlight ──────────────────────────────────────

export function RovSpotlight() {
  return (
    <section style={{ background: ed.panel, padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        <Label color={ed.gold} style={{ display: "block", marginBottom: 20 }}>{spotlight.eyebrow}</Label>
        <div className="ctrla-spotlight">
          {/* Image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 3",
              background: ed.plum,
              overflow: "hidden",
              backgroundImage: spotlight.image ? `url('${spotlight.image}')` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(28px,3.6vw,48px)",
                letterSpacing: "-0.02em",
                lineHeight: 0.98,
                color: ed.paper,
                margin: "0 0 18px",
              }}
            >
              {spotlight.headline}
            </h2>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.65, color: "rgba(240,230,224,0.72)", margin: "0 0 22px", maxWidth: 540 }}>
              {spotlight.body}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {spotlight.tools.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: ed.mono,
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: ed.gold,
                    border: `1px solid ${ed.gold}`,
                    padding: "5px 12px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Bleed>
    </section>
  );
}

// ── ATL Events (condensed) ─────────────────────────────

export function CondensedEvents() {
  // schema.org SportsEvent structured data — helps SEO + GEO (AI engines
  // can parse and cite the Atlanta World Cup fixtures).
  const eventsJsonLd = {
    "@context": "https://schema.org",
    "@graph": events.map((e) => ({
      "@type": "SportsEvent",
      name: e.name,
      startDate: e.isoDate,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: e.location,
        address: e.venue,
      },
      url: e.url,
      isAccessibleForFree: e.badge === "Free",
      sport: "Soccer",
      organizer: { "@type": "Organization", name: "FIFA", url: "https://www.fifa.com/" },
    })),
  };

  return (
    <section id="events" style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0", scrollMarginTop: 0 }}>
      {/* Structured data for search + generative engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Kicker color={ed.gold} style={{ marginBottom: 14 }}>FIFA World Cup 26</Kicker>
            <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,5vw,64px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>
              ATL Events
            </h2>
            <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(13px,1.5vw,16px)", color: ed.inkSoft, margin: "8px 0 0", maxWidth: 540 }}>
              We are an Atlanta studio, so we cover our city&apos;s biggest stages. This summer the whole world arrives: the FIFA World Cup 26™ comes to Mercedes-Benz Stadium.
            </p>
          </div>
          <a href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026" target="_blank" rel="noopener" className="ctrla-seeall" style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.18em", textTransform: "uppercase", color: ed.gold, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            Full match schedule <span aria-hidden>→</span>
          </a>
        </div>
        {/* Section cover image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 7",
            minHeight: 200,
            background: ed.panel,
            overflow: "hidden",
            margin: "clamp(24px,3vw,40px) 0 0",
            backgroundImage: `url('${eventsCover.src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(15,8,32,0.66) 0%, transparent 52%)",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 16,
              bottom: 12,
              fontFamily: ed.mono,
              fontSize: "clamp(8px,0.9vw,10px)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(240,230,224,0.88)",
            }}
          >
            {eventsCover.label}
          </span>
        </div>

        <Rule style={{ margin: "clamp(24px,3vw,40px) 0 0" }} />

        <div>
          {events.map((e) => {
            const isFree = e.badge === "Free";
            return (
              <a
                key={e.name}
                href={e.url}
                target="_blank"
                rel="noopener"
                className="ctrla-event-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(72px, 0.6fr) minmax(0, 2.4fr) minmax(0, 1.6fr) auto",
                  alignItems: "center",
                  gap: "clamp(12px,2vw,28px)",
                  padding: "clamp(18px,2.4vw,26px) clamp(12px,1.5vw,18px)",
                  borderBottom: `1px solid ${ed.hair}`,
                  borderLeft: `3px solid ${isFree ? ed.amber : "transparent"}`,
                  background: isFree ? "rgba(165,106,103,0.06)" : "transparent",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontFamily: ed.mono, fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.08em", textTransform: "uppercase", color: ed.gold }}>
                  {e.date}
                </span>
                <span className="ctrla-event-name" style={{ fontFamily: ed.grotesque, fontWeight: isFree ? 800 : 700, fontSize: "clamp(18px,2.2vw,28px)", letterSpacing: "-0.01em", color: ed.ink }}>
                  {e.name}
                </span>
                <span style={{ fontFamily: ed.body, fontSize: "clamp(12px,1.3vw,14px)", color: ed.inkSoft }}>
                  {e.location}
                </span>
                <span
                  style={{
                    justifySelf: "end",
                    fontFamily: ed.mono,
                    fontWeight: isFree ? 700 : 400,
                    fontSize: isFree ? 10 : 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: isFree ? ed.paper : ed.inkFaint,
                    background: isFree ? ed.amber : "transparent",
                    border: `1px solid ${isFree ? ed.amber : ed.hair}`,
                    padding: isFree ? "5px 12px" : "4px 10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isFree ? "Free Entry" : "Ticketed"}
                </span>
              </a>
            );
          })}
        </div>

        {/* Official sources — outbound authority links (SEO / GEO) */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 18px", marginTop: "clamp(24px,3vw,36px)" }}>
          <Label color={ed.gold}>Official sources:</Label>
          {eventSources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener"
              className="ctrla-seeall"
              style={{ fontFamily: ed.body, fontSize: "clamp(12px,1.3vw,14px)", color: ed.gold, textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </Bleed>
    </section>
  );
}

// ── Vue Close ──────────────────────────────────────────

export function VueClose() {
  return (
    <section style={{ background: "transparent", padding: "clamp(64px,9vw,128px) 0" }}>
      <Bleed>
        {/* Vue mascot illustration goes here (skipped for now) */}
        <div style={{ maxWidth: 660, borderLeft: `3px solid ${ed.plum}`, paddingLeft: "clamp(20px,3vw,40px)" }}>
          <Kicker color={ed.gold} style={{ marginBottom: 20 }}>{vueClose.eyebrow}</Kicker>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.9vw,21px)", lineHeight: 1.7, color: ed.ink, margin: "0 0 24px" }}>
            {vueClose.body}
          </p>
          <p
            style={{
              fontFamily: ed.serif,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(20px,2.6vw,30px)",
              color: ed.gold,
              margin: "0 0 28px",
            }}
          >
            {vueClose.signoff}
          </p>
          <Label color={ed.inkSoft}>{vueClose.signature}</Label>
        </div>
      </Bleed>
    </section>
  );
}
