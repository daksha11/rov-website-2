"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A · ATL — the local field guide (evergreen)
// Roots · why Atlanta is a creative capital. Standing content,
// the same every volume, so it lives here rather than in the
// per-volume data. Rooms and Open calls join this module later.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { ed, Bleed, Rule, Label, Kicker } from "./editorial";

// ── Roots content — the three threads of Atlanta's creative lineage.
// Facts drawn from a sourced research pass; only independently-defensible
// claims are used (studio marketing superlatives and unverified quotes were
// left out). Citations live in ROOTS_SOURCES + JSON-LD below. ──
const ROOTS_THREADS = [
  {
    n: "01",
    title: "The Sound",
    body:
      "The world's pop music speaks with an Atlanta accent. LaFace Records opened here in 1989 and turned the city into the new Motown. Out of a basement in East Point, the Dungeon Family gave us OutKast and Goodie Mob. Jermaine Dupri's So So Def followed in 1993. Then trap was born here, T.I.'s Trap Muzik named it in 2003, and the city has set the tempo for hip-hop ever since.",
    tags: ["LaFace · 1989", "Dungeon Family · East Point", "So So Def · 1993", "Trap Muzik · 2003"],
  },
  {
    n: "02",
    title: "The Screen",
    body:
      "They call it Y'allywood, and the numbers earned the name. A 2008 tax credit lit the fuse, and film and TV now spend billions in Georgia every year. Tyler Perry bought a former army base and built the first major studio solely owned by a Black filmmaker. The Walking Dead, the Marvel films, Stranger Things, and Donald Glover's Atlanta all shot in these neighborhoods.",
    tags: ["Tax credit · 2008", "$2.6B spent · FY2024", "Tyler Perry Studios · 330 acres", "Atlanta · FX"],
  },
  {
    n: "03",
    title: "The Scene",
    body:
      "The culture has a campus and a canvas. The Atlanta University Center, the largest group of private HBCUs in the world, has been the engine of the city's Black creative leadership since 1929. SCAD Atlanta and the High feed the design and gallery world. The BeltLine turned an old rail line into the country's biggest outdoor show, and Living Walls has put 500-plus murals on the city.",
    tags: ["AUC · since 1929", "SCAD Atlanta", "Art on the BeltLine", "Living Walls"],
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

        {/* Headline + thesis deck */}
        <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(34px,5.4vw,76px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: 0, maxWidth: 900 }}>
          The city that built its own stage<span style={{ color: ed.gold }}>.</span>
        </h2>
        <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(18px,2.4vw,30px)", lineHeight: 1.3, color: ed.gold, margin: "clamp(14px,1.8vw,20px) 0 0", maxWidth: 720 }}>
          Atlanta didn&rsquo;t wait for permission. It built the studios, the labels, and the schools itself, and the world followed the sound.
        </p>
        <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(16px,2vw,24px) 0 0", maxWidth: 720 }}>
          If you&rsquo;re making something here, you&rsquo;re standing on deep ground. Atlanta became a creative capital for one
          reason: the people who came up here built their own institutions instead of leaving for New York or LA.
          Basement studios became labels. Black colleges became a pipeline. A line in the tax code became Y&rsquo;allywood.
        </p>

        {/* The three threads */}
        <div className="ctrla-roots-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "clamp(20px,2.6vw,36px)", margin: "clamp(32px,4.4vw,60px) 0 0" }}>
          {ROOTS_THREADS.map((t) => (
            <div key={t.n} style={{ borderTop: `2px solid ${ed.gold}`, paddingTop: "clamp(16px,1.8vw,22px)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(16px,1.7vw,20px)", letterSpacing: "-0.01em", color: ed.gold }}>{t.n}</span>
                <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,2.6vw,34px)", letterSpacing: "-0.02em", lineHeight: 1, color: ed.ink, margin: 0 }}>{t.title}</h3>
              </div>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.55vw,17px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 18px" }}>{t.body}</p>
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
