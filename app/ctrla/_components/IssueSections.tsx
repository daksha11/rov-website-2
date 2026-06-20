"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — ISSUE SECTIONS
// Artist Showcase · ROV Spotlight · Events (condensed) · Vue Close
// ═══════════════════════════════════════════════════════

import { ed, Bleed, Rule, Label } from "./editorial";
import { artists, spotlight, events, eventSources, vueClose, type Artist } from "../data";

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
          background: ed.ink,
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
    <section style={{ background: ed.paper, padding: "clamp(56px,8vw,104px) 0" }}>
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

// ── ROV Spotlight ──────────────────────────────────────

export function RovSpotlight() {
  return (
    <section style={{ background: ed.ink, padding: "clamp(56px,8vw,104px) 0" }}>
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
    <section style={{ background: ed.paper, padding: "clamp(56px,8vw,104px) 0" }}>
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
              The FIFA World Cup 26™ comes to Atlanta — Mercedes-Benz Stadium hosts the world.
            </p>
          </div>
          <a href="/ctrla/events" className="ctrla-seeall" style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.18em", textTransform: "uppercase", color: ed.amber, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            See all events <span aria-hidden>→</span>
          </a>
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
    <section style={{ background: "#F0E6E0", padding: "clamp(64px,9vw,128px) 0" }}>
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
