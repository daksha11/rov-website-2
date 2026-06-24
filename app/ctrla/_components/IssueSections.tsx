"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — ISSUE SECTIONS
// Artist Showcase · ROV Spotlight · Events (condensed) · Vue Close
// ═══════════════════════════════════════════════════════

import { ed, Bleed, Rule, Label } from "./editorial";
import { artists, spotlight, events, eventSources, eventsCover, vueClose, type Artist } from "../data";

// ── ATL Artist Showcase ────────────────────────────────

function ArtistCard({ artist }: { artist: Artist }) {
  const feature = !!artist.feature;
  return (
    <div
      className={feature ? "ctrla-artist-feat" : "ctrla-artist"}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* Full-bleed image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: feature ? "4 / 5" : "4 / 3",
          background: ed.panel,
          overflow: "hidden",
          backgroundImage: artist.image ? `url('${artist.image}')` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Eyebrow */}
      <Label style={{ display: "block", margin: "16px 0 8px" }}>{artist.discipline}</Label>
      {/* Name */}
      <h3
        style={{
          fontFamily: ed.grotesque,
          fontWeight: 800,
          fontSize: feature ? "clamp(28px,3.5vw,44px)" : "clamp(22px,2.4vw,28px)",
          letterSpacing: "-0.02em",
          color: ed.ink,
          margin: "0 0 10px",
        }}
      >
        {artist.name}
      </h3>
      {/* Blurb */}
      <p
        style={{
          fontFamily: ed.body,
          fontSize: feature ? "clamp(14px,1.5vw,16px)" : "clamp(13px,1.4vw,14px)",
          lineHeight: 1.6,
          color: ed.inkSoft,
          margin: "0 0 16px",
          maxWidth: 520,
        }}
      >
        {artist.blurb}
      </p>
      {/* Quote */}
      <p
        style={{
          fontFamily: ed.serif,
          fontStyle: "italic",
          fontSize: feature ? "clamp(16px,1.8vw,20px)" : "clamp(14px,1.5vw,16px)",
          lineHeight: 1.45,
          color: ed.ink,
          margin: 0,
          paddingLeft: 16,
          borderLeft: `2px solid ${ed.amber}`,
        }}
      >
        &ldquo;{artist.quote}&rdquo;
      </p>
    </div>
  );
}

export function ArtistShowcase() {
  const feature = artists.find((a) => a.feature) ?? artists[0];
  const rest = artists.filter((a) => a !== feature);
  return (
    <section style={{ background: ed.ground, padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,5vw,64px)", letterSpacing: "-0.02em", lineHeight: 0.95, color: ed.ink, margin: 0 }}>
            ATL Artist Showcase
          </h2>
          <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(12px,1.4vw,15px)", color: ed.inkSoft, textAlign: "right", maxWidth: 280, margin: 0 }}>
            Three creatives worth knowing right now.
          </p>
        </div>
        <Rule style={{ margin: "clamp(28px,4vw,48px) 0" }} />

        <div className="ctrla-artist-grid">
          <div style={{ gridArea: "feat" }}>
            <ArtistCard artist={feature} />
          </div>
          <div style={{ gridArea: "a" }}>
            <ArtistCard artist={rest[0]} />
          </div>
          <div style={{ gridArea: "b" }}>
            <ArtistCard artist={rest[1]} />
          </div>
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
    <section style={{ background: ed.ground, padding: "clamp(56px,8vw,104px) 0" }}>
      <Bleed>
        {/* Standing-feature header — recurs every volume of CTRL-A */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(20px,2.6vw,32px)" }}>
          <Label color={ed.ink}>The Toolbox · A CTRL-A Standing Feature</Label>
          <Label color={ed.inkFaint}>In every volume</Label>
        </div>
        <Rule style={{ marginBottom: "clamp(28px,4vw,48px)" }} />

        {/* Framed feature panel — emphasized as its own product */}
        <div style={{ border: `1px solid ${ed.hair}`, borderTop: `5px solid ${ed.amber}`, background: "rgba(240,230,224,0.05)" }}>
          <div className="ctrla-brandkit">
            {/* Left — copy */}
            <div style={{ padding: "clamp(28px,4vw,52px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Label color={ed.amber} style={{ display: "block", marginBottom: 14 }}>
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
    <section id="events" style={{ background: ed.ground, padding: "clamp(56px,8vw,104px) 0", scrollMarginTop: 0 }}>
      {/* Structured data for search + generative engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,5vw,64px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>
              ATL Events
            </h2>
            <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(13px,1.5vw,16px)", color: ed.inkSoft, margin: "8px 0 0" }}>
              The FIFA World Cup 26™ comes to Atlanta. Mercedes-Benz Stadium hosts the world.
            </p>
          </div>
          <a href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026" target="_blank" rel="noopener" className="ctrla-seeall" style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.18em", textTransform: "uppercase", color: ed.amber, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
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
                <span style={{ fontFamily: ed.mono, fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.08em", textTransform: "uppercase", color: ed.amber }}>
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
          <Label color={ed.inkFaint}>Official sources:</Label>
          {eventSources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener"
              className="ctrla-seeall"
              style={{ fontFamily: ed.body, fontSize: "clamp(12px,1.3vw,14px)", color: ed.amber, textDecoration: "underline", textUnderlineOffset: 3 }}
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
    <section style={{ background: ed.ground, padding: "clamp(64px,9vw,128px) 0" }}>
      <Bleed>
        {/* Vue mascot illustration goes here (skipped for now) */}
        <div style={{ maxWidth: 640 }}>
          <Label style={{ display: "block", marginBottom: 20 }}>{vueClose.eyebrow}</Label>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.9vw,21px)", lineHeight: 1.7, color: ed.ink, margin: "0 0 24px" }}>
            {vueClose.body}
          </p>
          <p
            style={{
              fontFamily: ed.serif,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(20px,2.6vw,30px)",
              color: ed.ink,
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
