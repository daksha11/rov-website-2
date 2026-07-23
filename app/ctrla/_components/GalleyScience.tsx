"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A · The Galley — Kitchen Science
// The education layer of the Cookbook landing page. Five
// reactions that explain most of home cooking, each taught
// with a built SVG diagram (house palette, no stock photos),
// two sentences of science, and one practical "use it" line.
// Evergreen, so it lives here rather than in per-volume data.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import type { ReactNode } from "react";
import { ed, Bleed, Rule, Label, Kicker } from "./editorial";

// ── Diagram primitives ──────────────────────────────────
// Every diagram is a 260x180 SVG on the dark panel, drawn in
// the locked palette: gold for the subject, rose for heat and
// energy, cream for structure lines. Decorative, aria-hidden;
// the copy next to each carries the meaning.

const DIAGRAM_BG = ed.panel;
const CREAM = "rgba(240,230,224,0.8)";
const CREAM_FAINT = "rgba(240,230,224,0.3)";
const GOLD = ed.gold;
const ROSE = "#A56A67";

function DiagramFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div style={{ position: "relative", width: "100%", background: DIAGRAM_BG, border: `1px solid ${ed.hair}` }}>
      <svg viewBox="0 0 260 180" role="img" aria-hidden="true" style={{ display: "block", width: "100%", height: "auto" }}>
        {children}
      </svg>
      <span style={{ position: "absolute", left: 12, bottom: 10, fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD }}>
        {label}
      </span>
    </div>
  );
}

// 01 · Emulsion — split on the left, held together on the right.
function EmulsionDiagram() {
  return (
    <DiagramFrame label="Fig. 01 · Oil, water, and the coat that holds them">
      {/* Left half: broken. Oil floats on water in two layers. */}
      <rect x="16" y="28" width="100" height="52" fill={GOLD} opacity="0.85" />
      <rect x="16" y="80" width="100" height="62" fill="none" stroke={CREAM_FAINT} strokeWidth="1.5" />
      <rect x="16" y="28" width="100" height="114" fill="none" stroke={CREAM} strokeWidth="1.5" />
      <text x="66" y="162" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={CREAM_FAINT} letterSpacing="1.5">SPLIT</text>
      {/* Right half: emulsified. Droplets, each wearing a cream ring. */}
      <rect x="144" y="28" width="100" height="114" fill="none" stroke={CREAM} strokeWidth="1.5" />
      {[
        [166, 52, 9], [199, 44, 6], [226, 60, 8], [172, 86, 6],
        [206, 82, 10], [230, 108, 6], [162, 116, 8], [192, 118, 7], [220, 132, 5],
      ].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={GOLD} opacity="0.9" />
          <circle cx={cx} cy={cy} r={(r as number) + 3} fill="none" stroke={CREAM} strokeWidth="1.2" />
        </g>
      ))}
      <text x="194" y="162" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={CREAM_FAINT} letterSpacing="1.5">HELD</text>
    </DiagramFrame>
  );
}

// 02 · Maillard — a dry surface meeting real heat, crust forming.
function MaillardDiagram() {
  return (
    <DiagramFrame label="Fig. 02 · Heat plus a dry surface, new flavor">
      {/* The pan */}
      <rect x="24" y="128" width="212" height="8" fill={ROSE} />
      {/* Heat rising */}
      {[56, 96, 136, 176, 216].map((x, i) => (
        <path key={i} d={`M ${x} 156 q 6 -8 0 -16 q -6 -8 0 -16`} fill="none" stroke={ROSE} strokeWidth="1.5" opacity="0.7" />
      ))}
      {/* The food block */}
      <rect x="64" y="72" width="132" height="48" fill="none" stroke={CREAM} strokeWidth="1.5" />
      {/* Crust: the browned band where surface meets pan */}
      <rect x="64" y="108" width="132" height="12" fill={GOLD} opacity="0.9" />
      <rect x="64" y="100" width="132" height="8" fill={GOLD} opacity="0.45" />
      {/* Flavor compounds leaving the crust */}
      {[84, 116, 148, 180].map((x, i) => (
        <circle key={i} cx={x} cy={54 - (i % 2) * 10} r="2.5" fill={GOLD} />
      ))}
      <text x="130" y="40" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={CREAM_FAINT} letterSpacing="1.5">≈ 300°F AND DRY</text>
    </DiagramFrame>
  );
}

// 03 · Salt — particles travelling from the surface toward the center.
function SaltDiagram() {
  return (
    <DiagramFrame label="Fig. 03 · Salt travels, given time">
      <rect x="46" y="36" width="168" height="108" fill="none" stroke={CREAM} strokeWidth="1.5" />
      {/* Dense at the edges, sparse toward the middle */}
      {[
        [56, 46], [70, 58], [58, 76], [66, 98], [56, 120], [72, 134],
        [204, 48], [192, 62], [202, 84], [190, 104], [204, 126], [188, 136],
        [92, 50], [168, 52], [96, 130], [164, 128],
        [112, 70], [148, 74], [116, 112], [144, 108],
        [130, 90],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i < 12 ? 3 : i < 16 ? 2.4 : 1.8} fill={GOLD} opacity={i < 12 ? 0.95 : i < 16 ? 0.7 : 0.5} />
      ))}
      {/* Inward arrows */}
      <path d="M 30 90 L 42 90 M 38 86 L 42 90 L 38 94" fill="none" stroke={ROSE} strokeWidth="1.5" />
      <path d="M 230 90 L 218 90 M 222 86 L 218 90 L 222 94" fill="none" stroke={ROSE} strokeWidth="1.5" />
      <text x="130" y="162" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={CREAM_FAINT} letterSpacing="1.5">40 MIN AHEAD</text>
    </DiagramFrame>
  );
}

// 04 · Starch — tight granules swelling open and tangling in hot liquid.
function StarchDiagram() {
  return (
    <DiagramFrame label="Fig. 04 · Granules swell, liquid thickens">
      {/* Before: tight little granules */}
      {[
        [44, 62], [66, 84], [46, 106], [70, 126],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="7" fill="none" stroke={CREAM} strokeWidth="1.5" />
      ))}
      {/* Arrow across */}
      <path d="M 96 92 L 130 92 M 124 86 L 130 92 L 124 98" fill="none" stroke={ROSE} strokeWidth="1.5" />
      <text x="112" y="78" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={CREAM_FAINT} letterSpacing="1.5">HEAT</text>
      {/* After: swollen, bursting, strands tangling */}
      <circle cx="180" cy="72" r="18" fill={GOLD} opacity="0.35" />
      <circle cx="214" cy="104" r="15" fill={GOLD} opacity="0.35" />
      <circle cx="176" cy="122" r="12" fill={GOLD} opacity="0.35" />
      <path d="M 160 60 q 24 14 48 2 q -20 22 4 38 q -28 -4 -40 16 q 2 -24 -22 -30 q 22 -6 10 -26" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.9" />
      <text x="196" y="162" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={CREAM_FAINT} letterSpacing="1.5">SILK</text>
    </DiagramFrame>
  );
}

// 05 · Acid — the seesaw that brings rich food back into balance.
function AcidDiagram() {
  return (
    <DiagramFrame label="Fig. 05 · Acid balances fat and salt">
      {/* Pivot */}
      <path d="M 130 118 L 118 140 L 142 140 Z" fill="none" stroke={CREAM} strokeWidth="1.5" />
      {/* Level beam */}
      <line x1="52" y1="118" x2="208" y2="118" stroke={CREAM} strokeWidth="1.5" />
      {/* Left side: FAT, a heavy gold block */}
      <rect x="60" y="92" width="40" height="26" fill={GOLD} opacity="0.85" />
      <text x="80" y="84" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={CREAM_FAINT} letterSpacing="1.5">RICH</text>
      {/* Right side: ACID, a small bright wedge doing the same work */}
      <path d="M 170 118 L 196 118 L 183 94 Z" fill={ROSE} opacity="0.95" />
      <text x="183" y="84" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={CREAM_FAINT} letterSpacing="1.5">BRIGHT</text>
      {/* A squeeze: droplets falling onto the wedge */}
      {[
        [178, 52], [188, 42], [184, 62],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill={ROSE} />
      ))}
      <text x="130" y="164" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={CREAM_FAINT} letterSpacing="1.5">A LITTLE MOVES A LOT</text>
    </DiagramFrame>
  );
}

// ── Lesson content — two sentences of science, one practical move. ──
const LESSONS: {
  n: string;
  title: string;
  tag: string;
  science: string;
  useIt: string;
  Diagram: () => JSX.Element;
}[] = [
  {
    n: "01",
    title: "Emulsion",
    tag: "Why mayo is not magic",
    science:
      "Oil and water refuse to mix; shake a vinaigrette and it splits in minutes. An emulsifier like mustard or egg yolk has one end that grabs water and one that grabs fat, so it coats every oil droplet and holds the whole thing together as one creamy body.",
    useIt:
      "A spoon of mustard makes a vinaigrette that stays together. A yolk whisked slowly with oil is mayonnaise. Same reaction, two condiments.",
    Diagram: EmulsionDiagram,
  },
  {
    n: "02",
    title: "Maillard",
    tag: "The browning reaction",
    science:
      "Above roughly 300°F, proteins and sugars on a dry surface rearrange into hundreds of new flavor compounds. That deep crust on seared chicken or toasted bread is new chemistry, not almost-burnt.",
    useIt:
      "Pat the surface dry, get the pan properly hot, and give things room. A crowded pan steams, and steam caps out at 212°F, below where browning starts.",
    Diagram: MaillardDiagram,
  },
  {
    n: "03",
    title: "Salt",
    tag: "Timing is the skill",
    science:
      "Salt moves through food slowly, so salting early lets it travel inward and season the inside instead of just coating the surface. On meat it also loosens protein strands, which helps it stay juicy through the heat.",
    useIt:
      "Salt meat about 40 minutes ahead, or right before it hits the pan. And salt pasta water like you mean it; it is your only chance to season the noodle itself.",
    Diagram: SaltDiagram,
  },
  {
    n: "04",
    title: "Starch",
    tag: "The free thickener",
    science:
      "Heated in liquid, starch granules swell, burst, and release long molecules that tangle together and thicken whatever they are in. Pasta water is a ready-made starch solution, which is why it turns a thin sauce silky.",
    useIt:
      "Save a mug of pasta water before you drain. Finish the pasta in the sauce with a splash of it and the sauce will cling instead of sliding off.",
    Diagram: StarchDiagram,
  },
  {
    n: "05",
    title: "Acid",
    tag: "The volume knob",
    science:
      "Acid cuts through fat and wakes up flavors that salt alone cannot reach. Most of the time a dish that tastes flat and “needs something” is not missing salt, it is missing brightness.",
    useIt:
      "A squeeze of lemon or a splash of vinegar right at the end. Taste the dish before and after once, and you will never skip the step again.",
    Diagram: AcidDiagram,
  },
];

// ── Sources — the canon, collapsible. Also feeds the JSON-LD below. ──
const SCIENCE_SOURCES = [
  { label: "Harold McGee, On Food and Cooking (2004)", url: "https://en.wikipedia.org/wiki/On_Food_and_Cooking" },
  { label: "Samin Nosrat, Salt Fat Acid Heat", url: "https://www.saltfatacidheat.com/" },
  { label: "Emulsion, Encyclopaedia Britannica", url: "https://www.britannica.com/science/emulsion-chemistry" },
  { label: "Maillard reaction, Encyclopaedia Britannica", url: "https://www.britannica.com/science/Maillard-reaction" },
  { label: "Science of Cooking, Exploratorium", url: "https://www.exploratorium.edu/food" },
];

// JSON-LD: the lessons as an educational Article with citations,
// so generative search can quote the galley on how an emulsion works.
const SCIENCE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Kitchen Science for Creatives: Five Reactions That Explain Most of Cooking",
  about: [
    { "@type": "Thing", name: "Emulsion" },
    { "@type": "Thing", name: "Maillard reaction" },
    { "@type": "Thing", name: "Salting and seasoning" },
    { "@type": "Thing", name: "Starch gelatinization" },
    { "@type": "Thing", name: "Acid in cooking" },
  ],
  keywords:
    "food science basics, how does an emulsion work, Maillard reaction explained, when to salt meat, why save pasta water, acid in cooking, kitchen science for beginners",
  publisher: { "@type": "Organization", name: "Range Of View Studios" },
  citation: SCIENCE_SOURCES.map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })),
};

export default function GalleyScience() {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <section id="science" style={{ background: "transparent", padding: "clamp(40px,6vw,88px) 0", scrollMarginTop: 80 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCIENCE_JSONLD) }} />

      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(18px,2.4vw,26px)" }}>
          <Kicker color={ed.gold}>The Galley · Kitchen science</Kicker>
          <Label color={ed.gold}>Why cheap food tastes expensive</Label>
        </div>
        <Rule style={{ marginBottom: "clamp(24px,3.4vw,40px)" }} color={ed.hair} />

        <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(34px,5.4vw,76px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: 0, maxWidth: 900 }}>
          Why it works<span style={{ color: ed.gold }}>.</span>
        </h2>
        <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(18px,2.4vw,30px)", lineHeight: 1.3, color: ed.gold, margin: "clamp(14px,1.8vw,20px) 0 0", maxWidth: 720 }}>
          Cooking is chemistry you can eat. Five reactions explain most of what happens in your pan, and once you know them, you can improvise forever.
        </p>

        {/* The lessons — diagram + copy, alternating sides on desktop */}
        <div style={{ display: "grid", gap: "clamp(40px,6vw,80px)", margin: "clamp(36px,5vw,72px) 0 0" }}>
          {LESSONS.map((l, i) => (
            <div key={l.n} className="ctrla-sci-row">
              <div className="ctrla-sci-visual" style={{ order: i % 2 === 1 ? 2 : undefined }}>
                <l.Diagram />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(16px,1.7vw,20px)", letterSpacing: "-0.01em", color: ed.gold }}>{l.n}</span>
                  <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,3.2vw,44px)", letterSpacing: "-0.02em", lineHeight: 1, color: ed.ink, margin: 0 }}>{l.title}</h3>
                </div>
                <Label color={ed.gold} style={{ display: "block", marginBottom: "clamp(12px,1.6vw,18px)" }}>{l.tag}</Label>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.55, color: ed.inkSoft, margin: "0 0 14px", maxWidth: 560 }}>
                  {l.science}
                </p>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,17px)", lineHeight: 1.55, color: ed.inkSoft, margin: 0, maxWidth: 560, paddingLeft: 14, borderLeft: `2px solid ${ed.gold}` }}>
                  <span style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.gold, marginRight: 8 }}>Use it</span>
                  {l.useIt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pullquote — the point of teaching the reaction, not the recipe */}
        <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(22px,3.2vw,44px)", lineHeight: 1.22, letterSpacing: "-0.01em", color: ed.ink, margin: "clamp(40px,5.5vw,80px) 0 0", paddingLeft: "clamp(16px,2vw,24px)", borderLeft: `2px solid ${ed.gold}`, maxWidth: 860 }}>
          Recipes tell you what to do. Reactions tell you why, and why is what lets you cook without one.
        </p>

        {/* Sources — collapsible, present for trust + citability */}
        <div style={{ marginTop: "clamp(28px,3.6vw,48px)" }}>
          <button
            type="button"
            onClick={() => setSourcesOpen((v) => !v)}
            aria-expanded={sourcesOpen}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.inkFaint }}
          >
            {sourcesOpen ? "Hide sources" : `Sources · ${SCIENCE_SOURCES.length}`}
            <span aria-hidden style={{ transition: "transform .25s ease", transform: sourcesOpen ? "rotate(90deg)" : "none" }}>→</span>
          </button>
          {sourcesOpen && (
            <ul style={{ listStyle: "none", margin: "clamp(12px,1.4vw,18px) 0 0", padding: 0, display: "grid", gap: 8, maxWidth: 720 }}>
              {SCIENCE_SOURCES.map((s) => (
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
