"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A · ATL — the local field guide (evergreen)
// Roots · why Atlanta is a creative capital. Standing content,
// the same every volume, so it lives here rather than in the
// per-volume data. Rooms and Open calls join this module later.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { ed, Bleed, Rule, Label, Kicker, ImageBlock } from "./editorial";

// ── Roots content — the three threads of Atlanta's creative lineage,
// VISUAL-FIRST: each thread is an image card (labelled wireframe placeholder
// until the real shot drops into /public/ctrla/atl/) with ONE line of copy.
// Facts drawn from a sourced research pass; citations live in ROOTS_SOURCES
// + JSON-LD below, so the page stays citable while reading light. ──
const ROOTS_THREADS = [
  {
    n: "01",
    title: "The Sound",
    line: "LaFace, the Dungeon Family, So So Def, then trap. Atlanta has set hip-hop's tempo since 1989.",
    tags: ["LaFace · 1989", "OutKast · East Point", "Trap Muzik · 2003"],
    // Swap for a real shot: /ctrla/atl/roots-sound.webp
    img: undefined as string | undefined,
    shot: "Shot · The basement studio, East Point",
  },
  {
    n: "02",
    title: "The Screen",
    line: "A 2008 tax credit built Y'allywood. Billions in film and TV now shoot in these neighborhoods.",
    tags: ["Tax credit · 2008", "$2.6B · FY2024", "Tyler Perry · 330 acres"],
    // Swap for a real shot: /ctrla/atl/roots-screen.webp
    img: undefined as string | undefined,
    shot: "Shot · A Y'allywood soundstage",
  },
  {
    n: "03",
    title: "The Scene",
    line: "The AUC, SCAD, the High, and a BeltLine of murals. The culture has a campus and a canvas.",
    tags: ["AUC · since 1929", "BeltLine art", "Living Walls · 500+"],
    // Swap for a real shot: /ctrla/atl/roots-scene.webp
    img: undefined as string | undefined,
    shot: "Shot · BeltLine mural walk",
  },
];

// Highest-authority citation per load-bearing claim (New Georgia Encyclopedia,
// Britannica, Georgia.org and primary institutions preferred over Wikipedia).
const ROOTS_SOURCES = [
  { label: "LaFace Records, founded Atlanta 1989", url: "https://www.georgiaencyclopedia.org/articles/arts-culture/laface-records/" },
  { label: "Dungeon Family / OutKast, East Point", url: "https://en.wikipedia.org/wiki/Dungeon_Family" },
  { label: "So So Def Recordings, founded 1993", url: "https://en.wikipedia.org/wiki/So_So_Def_Recordings" },
  { label: "Trap music, T.I.'s Trap Muzik (2003)", url: "https://www.britannica.com/art/trap-music" },
  { label: "Georgia film tax credit, 2008 Act", url: "https://georgia.org/newsroom/press-releases/georgia-boosts-incentives-for-entertainment-industry" },
  { label: "Georgia film & TV spend, $2.6B FY2024", url: "https://georgia.org/press-release/celebrating-50-years-georgia-film-office-film-tv-productions-spend-41b-state-fy23" },
  { label: "Tyler Perry Studios, 330-acre Fort McPherson", url: "https://www.ajc.com/news/things-know-about-tyler-perry-studios-atlanta/p0Keh9FxmTRqoJTF8KkNoO/" },
  { label: "Atlanta University Center, HBCU consortium since 1929", url: "https://aucenter.edu/history/" },
  { label: "SCAD Atlanta", url: "https://www.scad.edu/locations/atlanta" },
  { label: "Art on the Atlanta BeltLine", url: "https://art.beltline.org/about/" },
  { label: "Living Walls, The City Speaks", url: "https://en.wikipedia.org/wiki/Living_Walls" },
];

// JSON-LD: a CreativeWork about Atlanta's creative history with the sourced
// citations attached — the citability play for AI / generative search (GEO).
const ROOTS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Why Atlanta Is a Creative Capital",
  about: [
    { "@type": "Thing", name: "Atlanta hip-hop" },
    { "@type": "Thing", name: "Georgia film industry" },
    { "@type": "Thing", name: "Atlanta visual art and institutions" },
  ],
  keywords:
    "Atlanta creative history, Atlanta hip-hop, LaFace Records, OutKast, trap music, Y'allywood, Georgia film tax credit, Atlanta University Center, Atlanta creatives",
  publisher: { "@type": "Organization", name: "Range Of View Studios" },
  citation: ROOTS_SOURCES.map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })),
};

export function ATLRoots() {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <section id="atl-roots" style={{ background: "transparent", padding: "clamp(40px,6vw,80px) 0", scrollMarginTop: 80 }}>
      {/* Citations for generative search — invisible, high value */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ROOTS_JSONLD) }} />

      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(18px,2.4vw,26px)" }}>
          <Kicker color={ed.gold}>Roots · Why Atlanta</Kicker>
          <Label color={ed.gold}>The lineage you are part of</Label>
        </div>
        <Rule style={{ marginBottom: "clamp(24px,3.4vw,40px)" }} />

        {/* Headline + one serif line — that is ALL the intro copy */}
        <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(34px,5.4vw,76px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: 0, maxWidth: 900 }}>
          The city that built its own stage<span style={{ color: ed.gold }}>.</span>
        </h2>
        <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(18px,2.4vw,30px)", lineHeight: 1.3, color: ed.gold, margin: "clamp(14px,1.8vw,20px) 0 0", maxWidth: 720 }}>
          Atlanta didn&rsquo;t wait for permission. It built the studios, the labels, and the schools itself, and the world followed the sound.
        </p>

        {/* The three threads — image cards, one line each */}
        <div className="ctrla-roots-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "clamp(20px,2.6vw,36px)", margin: "clamp(28px,4vw,56px) 0 0" }}>
          {ROOTS_THREADS.map((t) => (
            <div key={t.n}>
              {/* The visual leads. Wireframe placeholder until the real shot lands. */}
              <ImageBlock src={t.img} alt={t.shot} ratio="4 / 5">
                {!t.img && (
                  <span style={{ position: "absolute", left: 12, bottom: 10, fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(36,18,58,0.75)" }}>
                    {t.shot}
                  </span>
                )}
              </ImageBlock>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "clamp(14px,1.8vw,20px) 0 8px" }}>
                <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(16px,1.7vw,20px)", letterSpacing: "-0.01em", color: ed.gold }}>{t.n}</span>
                <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,2.6vw,34px)", letterSpacing: "-0.02em", lineHeight: 1, color: ed.ink, margin: 0 }}>{t.title}</h3>
              </div>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.55vw,17px)", lineHeight: 1.5, color: ed.inkSoft, margin: "0 0 14px" }}>{t.line}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {t.tags.map((tag) => (
                  <span key={tag} style={{ fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.08em", textTransform: "uppercase", color: ed.gold, border: `1px solid rgba(227,194,74,0.4)`, borderRadius: 999, padding: "5px 11px" }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pullquote — belonging, aimed at the student coming up */}
        <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(22px,3.2vw,44px)", lineHeight: 1.22, letterSpacing: "-0.01em", color: ed.ink, margin: "clamp(36px,5vw,72px) 0 0", paddingLeft: "clamp(16px,2vw,24px)", borderLeft: `2px solid ${ed.gold}`, maxWidth: 860 }}>
          You&rsquo;re not coming up on the edge of anything. You&rsquo;re coming up at the center.
        </p>

        {/* Sources — collapsible, low-key, but present for trust + citability */}
        <div style={{ marginTop: "clamp(28px,3.6vw,48px)" }}>
          <button
            type="button"
            onClick={() => setSourcesOpen((v) => !v)}
            aria-expanded={sourcesOpen}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.inkFaint }}
          >
            {sourcesOpen ? "Hide sources" : `Sources · ${ROOTS_SOURCES.length}`}
            <span aria-hidden style={{ transition: "transform .25s ease", transform: sourcesOpen ? "rotate(90deg)" : "none" }}>→</span>
          </button>
          {sourcesOpen && (
            <ul style={{ listStyle: "none", margin: "clamp(12px,1.4vw,18px) 0 0", padding: 0, display: "grid", gap: 8, maxWidth: 720 }}>
              {ROOTS_SOURCES.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: ed.body, fontSize: "clamp(12px,1.3vw,14px)", lineHeight: 1.5, color: ed.inkSoft, textDecoration: "none", borderBottom: `1px solid rgba(227,194,74,0.35)` }}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Bleed>
    </section>
  );
}
