"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE POSTER BENCH
// The design analog to the music page's mix globe. Not an
// exhibit you read, an instrument you play. A real gig poster,
// composed in our own type and palette (no stock art), sitting
// on a bench with three live controls:
//   · scale contrast — the type-size ratio, headline vs detail
//   · grid — reveal the columns and baselines it is built on
//   · palette — swap between curated CTRL-A colour schemes
// Every move re-renders the poster live AND rewrites the defence
// in plain senior-designer words: what the choice buys, what it
// trades. The original tap-a-part-to-defend mechanic still works
// underneath. State serializes to a shareable URL token so a
// composed poster travels as a link, mirroring the mix globe.
//
// The poster is its own dark artifact on the cream page. Type
// scales to the poster width via container query units, so it
// holds its composition at any size. Inline styles throughout,
// matching the CTRL-A idiom.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { edLight as ed } from "./editorial";

// ── Tap-a-part decisions (the original mechanic, preserved) ──
type Decision = {
  id: string;
  badge: string;
  title: string;
  why: string; // color's `why` is overridden live by the active palette
  box: { top?: string; left?: string; right?: string; bottom?: string; width?: string; height?: string };
  round?: boolean;
};

const DECISIONS: Decision[] = [
  {
    id: "space",
    badge: "1",
    title: "the space up top",
    why: "the silence is on purpose. it lets the poster breathe and reads like a venue, not a flyer stapled to a pole. crowded would feel cheap. confidence is what you leave out.",
    box: { top: "3%", left: "5%", width: "90%", height: "17%" },
  },
  {
    id: "headline",
    badge: "2",
    title: "the headline, oversized",
    why: "the night's name is the loudest thing on the page because the brief is simple, draw a crowd. it leads, everything else supports it. the size gap is the hierarchy, you read it in order without thinking. ride the scale control to feel it move.",
    box: { top: "23%", left: "5%", width: "78%", height: "27%" },
  },
  {
    id: "type",
    badge: "3",
    title: "two typefaces, two jobs",
    why: "an expressive serif for the feeling, a plain grotesque for the facts. the contrast is deliberate. the big type sets the mood, the small type answers the practical questions without getting in the way.",
    box: { top: "52%", left: "5%", width: "70%", height: "9%" },
  },
  {
    id: "date",
    badge: "4",
    title: "the date, tucked low",
    why: "anyone who already wants to come will hunt for the when and where. it does not need to shout, so it does not. small and low keeps the mood up top intact.",
    box: { top: "70%", left: "5%", width: "58%", height: "17%" },
  },
  {
    id: "color",
    badge: "5",
    title: "the colour, chosen",
    why: "", // filled live from the active palette
    box: { top: "58%", right: "8%", width: "13%", height: "11%" },
    round: true,
  },
];

// ── Control 1 · scale contrast ──
// Stepped type-size ratio. All values in cqw (poster-relative), so the
// composition holds at any size. The default (index 2, "clear") reproduces
// the original poster exactly. `ratio` = headline / smallest type.
type Scale = { key: string; label: string; head: number; kicker: number; sub: number; details: number; foot: number; why: string };
const SCALES: Scale[] = [
  {
    key: "flat", label: "flat", head: 11, kicker: 3.6, sub: 5.4, details: 3.8, foot: 3.2,
    why: "low contrast: every line asks for near-equal attention, so nothing truly leads. it stays readable, but the eye has no first stop. this is what looks fine but says nothing feels like.",
  },
  {
    key: "gentle", label: "gentle", head: 15, kicker: 3.2, sub: 5.2, details: 3.4, foot: 2.9,
    why: "gentle contrast: a soft hierarchy. the headline leads by a nose and the room stays calm. good when the mood is quiet, but it trades urgency for composure.",
  },
  {
    key: "clear", label: "clear", head: 19, kicker: 3.0, sub: 5.4, details: 3.2, foot: 2.5,
    why: "clear contrast: the headline wins decisively, so the eye lands on the name of the night first, then works its way down without thinking. this is the senior default.",
  },
  {
    key: "commanding", label: "commanding", head: 23, kicker: 2.8, sub: 5.6, details: 3.0, foot: 2.1,
    why: "commanding contrast: the headline dominates and the details drop to a whisper. loud from across the street. push it any further and the practical info starts to get hard to find, that is the trade.",
  },
];

// ── Control 3 · palette ──
// A constrained set, all in the CTRL-A register (ground, gold, rose, plum,
// cream). Each palette re-colours the poster and carries its own defence,
// which also becomes the tap-to-defend text for the colour hotspot.
type Palette = {
  key: string; name: string; tone: string;
  bg: string; chip: string;
  head: string; kicker: string; sub: string; ruleFrom: string;
  details: string; footMuted: string; footAccent: string;
  why: string;
};
const CREAM = "#F0E6E0";
const GOLD = "#E3C24A";
const ROSE = "#C98C7E";
const ROSE_DEEP = "#A56A67";
const DETAIL = "rgba(240,230,224,0.74)";
const FOOT_MUTED = "rgba(240,230,224,0.6)";

const PALETTES: Palette[] = [
  {
    key: "afterhours", name: "after hours", tone: "warm · ember · gold",
    bg:
      "radial-gradient(90% 50% at 50% 106%, rgba(227,194,74,0.16) 0%, transparent 60%)," +
      "radial-gradient(120% 90% at 50% -12%, rgba(150,80,100,0.32) 0%, transparent 55%)," +
      "linear-gradient(180deg, #2A1626 0%, #1A0E1C 55%, #110912 100%)",
    chip: "#1A0E1C",
    head: CREAM, kicker: GOLD, sub: ROSE, ruleFrom: GOLD,
    details: DETAIL, footMuted: FOOT_MUTED, footAccent: GOLD,
    why: "warm, dark, intimate. jazz is late and close, so the palette matches the room it is selling. gold on ember reads like lamplight. a cool corporate blue would be perfectly legible and completely wrong.",
  },
  {
    key: "coldpress", name: "cold press", tone: "cool · plum · formal",
    bg:
      "radial-gradient(100% 60% at 50% 110%, rgba(78,61,115,0.42) 0%, transparent 60%)," +
      "linear-gradient(180deg, #181235 0%, #0F0A24 55%, #0B0718 100%)",
    chip: "#0F0A24",
    head: CREAM, kicker: ROSE_DEEP, sub: GOLD, ruleFrom: ROSE_DEEP,
    details: DETAIL, footMuted: FOOT_MUTED, footAccent: ROSE_DEEP,
    why: "cool and composed. the same headline in a colder room. perfectly readable, but it trades the late-night warmth for something more formal. colour carries the brief before a single word is read.",
  },
  {
    key: "goldleaf", name: "gold leaf", tone: "loud · luxe · high-key",
    bg:
      "radial-gradient(120% 90% at 50% -10%, rgba(227,194,74,0.18) 0%, transparent 55%)," +
      "linear-gradient(180deg, #211018 0%, #150B14 55%, #0E0710 100%)",
    chip: "#150B14",
    head: GOLD, kicker: ROSE, sub: CREAM, ruleFrom: GOLD,
    details: DETAIL, footMuted: FOOT_MUTED, footAccent: GOLD,
    why: "gold takes the headline itself, so the name of the night becomes the light source. loud and luxe. the risk: gold on dark can lose the smaller type, which is why the details lean on cream to stay legible.",
  },
  {
    key: "rosenoir", name: "rose noir", tone: "soft · velvet · one accent",
    bg:
      "radial-gradient(110% 80% at 50% 108%, rgba(165,106,103,0.3) 0%, transparent 60%)," +
      "linear-gradient(180deg, #2A1622 0%, #1A0E18 55%, #110910 100%)",
    chip: "#1A0E18",
    head: CREAM, kicker: ROSE_DEEP, sub: ROSE_DEEP, ruleFrom: ROSE_DEEP,
    details: DETAIL, footMuted: FOOT_MUTED, footAccent: ROSE_DEEP,
    why: "rose all the way through. warmer and softer than gold, more velvet than neon. one accent used with discipline reads more expensive than three fighting for the same wall.",
  },
];

// ── Control 2 · grid — reveal the structure ──
// Columns and baselines the poster is actually built on: content margin at
// 7.5% / 92.5%, a four-column field between, and horizontal guides at each
// anchor the type lands on. Drawn as thin lines, not a busy blueprint.
const GRID_COLS = [7.5, 28.75, 50, 71.25, 92.5];
const GRID_ROWS = [9, 22, 53, 64, 72, 93];
const GRID_WHY_ON =
  "grid on: every edge lines up to the same columns and baselines. it shows the poster is built on structure, not vibes. the margin is a decision, the alignment is a decision, none of it is eyeballed.";
const GRID_WHY_OFF =
  "grid off: you see the finished surface, not the scaffolding. the structure is still there holding everything in place, you just stop noticing it. that quiet is the whole point of doing it right.";

// ── URL serialization (mirrors MixGlobe's encodeMix / decodeMix) ──
// The poster state is a short token: "<scale>.<grid>.<palette>", integers,
// e.g. "3.1.2". Restored on load from ?poster=, copied by Share this poster.
type PosterState = { scale: number; grid: boolean; palette: number };
function encodePoster(s: PosterState): string {
  return `${s.scale}.${s.grid ? 1 : 0}.${s.palette}`;
}
function decodePoster(str: string): PosterState | null {
  if (!str) return null;
  const parts = str.split(".");
  if (parts.length < 3) return null;
  const scale = Number(parts[0]);
  const grid = Number(parts[1]);
  const palette = Number(parts[2]);
  if (![scale, grid, palette].every((n) => Number.isFinite(n))) return null;
  return {
    scale: clampIdx(scale, SCALES.length),
    grid: grid === 1,
    palette: clampIdx(palette, PALETTES.length),
  };
}
function clampIdx(n: number, len: number) {
  return Math.min(len - 1, Math.max(0, Math.round(n)));
}

type Focus =
  | { kind: "part"; i: number }
  | { kind: "scale" }
  | { kind: "grid" }
  | { kind: "palette" };

export default function DefendDecision({ accent = ed.plum }: { accent?: string }) {
  const [scaleIdx, setScaleIdx] = useState(2); // "clear" reproduces the original
  const [grid, setGrid] = useState(false);
  const [palIdx, setPalIdx] = useState(0);
  const [focus, setFocus] = useState<Focus>({ kind: "part", i: 0 });
  const [toast, setToast] = useState<string | null>(null);
  const touched = useRef(false);

  const scale = SCALES[scaleIdx];
  const pal = PALETTES[palIdx];

  // Restore a shared poster from the URL on first load (mirrors the globe).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const decoded = decodePoster(params.get("poster") || "");
    if (decoded) {
      setScaleIdx(decoded.scale);
      setGrid(decoded.grid);
      setPalIdx(decoded.palette);
      touched.current = true; // a shared state is a deliberate composition
    }
  }, []);

  // Auto-cycle the tap-to-defend parts to invite interaction, until the
  // reader takes over any control. Held for reduced-motion.
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => {
      if (touched.current) return;
      setFocus((f) => (f.kind === "part" ? { kind: "part", i: (f.i + 1) % DECISIONS.length } : f));
    }, 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const take = () => { touched.current = true; };
  const pickPart = (i: number) => { take(); setFocus({ kind: "part", i }); };
  const chooseScale = (i: number) => { take(); setScaleIdx(i); setFocus({ kind: "scale" }); };
  const toggleGrid = () => { take(); setGrid((g) => !g); setFocus({ kind: "grid" }); };
  const choosePalette = (i: number) => { take(); setPalIdx(i); setFocus({ kind: "palette" }); };

  const sharePoster = () => {
    const token = encodePoster({ scale: scaleIdx, grid, palette: palIdx });
    const url = `${window.location.origin}${window.location.pathname}?poster=${token}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => setToast("poster link copied")).catch(() => window.prompt("Copy this link:", url));
    } else {
      window.prompt("Copy this link:", url);
    }
  };

  // Resolve the active part index (for hotspot highlighting).
  const activePart = focus.kind === "part" ? focus.i : -1;
  const ratio = (scale.head / scale.foot).toFixed(1);

  // The defence, in words, keyed to whatever the reader last touched.
  const defense = buildDefense(focus, scale, grid, pal, ratio);

  return (
    <div className="ctrla-defend">
      {/* ── The poster + the bench of controls ── */}
      <div className="ctrla-poster-wrap">
        <div
          className="ctrla-poster"
          role="group"
          aria-label="A jazz gig poster you can retune"
          style={{ background: pal.bg }}
        >
          <span className="ctrla-poster-kicker" style={{ color: pal.kicker, fontSize: `${scale.kicker}cqw` }}>
            saturday · the cellar room
          </span>

          <h4 className="ctrla-poster-head" style={{ color: pal.head, fontSize: `${scale.head}cqw` }}>
            after<br />hours
          </h4>

          <span className="ctrla-poster-sub" style={{ color: pal.sub, fontSize: `${scale.sub}cqw` }}>
            the maya reed quartet
          </span>

          <span
            aria-hidden
            className="ctrla-poster-rule"
            style={{ background: `linear-gradient(to right, ${pal.ruleFrom}, transparent)` }}
          />

          <div className="ctrla-poster-details" style={{ color: pal.details, fontSize: `${scale.details}cqw` }}>
            <span>nov 16</span>
            <span>doors 9 · first set 10</span>
            <span>$15 at the door</span>
          </div>

          <div className="ctrla-poster-foot" style={{ fontSize: `${scale.foot}cqw` }}>
            <span style={{ color: pal.footMuted }}>62 mercer st · atlanta</span>
            <span style={{ color: pal.footAccent }}>CTRL-A presents</span>
          </div>

          {/* Grid overlay — the structure under the surface */}
          {grid && (
            <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
              {GRID_COLS.map((x, i) => {
                const edge = i === 0 || i === GRID_COLS.length - 1;
                return (
                  <span
                    key={`c${x}`}
                    style={{
                      position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: 1,
                      background: edge ? accent : "rgba(240,230,224,0.22)",
                      opacity: edge ? 0.9 : 1,
                    }}
                  />
                );
              })}
              {GRID_ROWS.map((y, i) => {
                const edge = i === 0 || i === GRID_ROWS.length - 1;
                return (
                  <span
                    key={`r${y}`}
                    style={{
                      position: "absolute", left: 0, right: 0, top: `${y}%`, height: 1,
                      background: edge ? accent : "rgba(240,230,224,0.16)",
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Clickable hotspots — the original tap-to-defend mechanic */}
          {DECISIONS.map((d, i) => {
            const on = i === activePart;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => pickPart(i)}
                aria-label={d.title}
                data-active={on}
                className={`ctrla-poster-hotspot${d.round ? " is-round" : ""}`}
                style={{ ...d.box, zIndex: 2, borderColor: on ? accent : "transparent", background: on ? `${accent}1F` : "transparent" }}
              >
                <span
                  className="ctrla-hot-badge"
                  style={{
                    background: on ? accent : "rgba(14,7,20,0.55)",
                    color: on ? CREAM : "rgba(240,230,224,0.7)",
                    borderColor: on ? accent : "rgba(240,230,224,0.35)",
                  }}
                >
                  {d.badge}
                </span>
              </button>
            );
          })}
        </div>

        <span className="ctrla-poster-hint" style={{ fontFamily: ed.mono, color: ed.inkFaint }}>
          tap any part · or play the bench below
        </span>

        {/* ── The bench: three live controls ── */}
        <div
          style={{
            width: "100%", maxWidth: 420, marginTop: 6,
            border: `1px solid ${ed.hair}`, borderRadius: 14,
            padding: "clamp(14px,3vw,20px)", display: "grid", gap: 18,
            background: "rgba(22,12,40,0.02)",
          }}
        >
          {/* Scale contrast */}
          <BenchRow label="scale contrast" accent={accent} readout={`≈ ${ratio}× · ${scale.label}`}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SCALES.map((s, i) => {
                const on = i === scaleIdx;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => chooseScale(i)}
                    aria-pressed={on}
                    style={{
                      flex: "1 1 0", minWidth: 64, cursor: "pointer",
                      fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.04em", textTransform: "lowercase",
                      padding: "8px 6px", borderRadius: 8,
                      border: `1px solid ${on ? accent : ed.hair}`,
                      background: on ? accent : "transparent",
                      color: on ? "#F0E6E0" : ed.inkSoft,
                      transition: "background .2s ease, color .2s ease, border-color .2s ease",
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </BenchRow>

          {/* Grid */}
          <BenchRow label="grid" accent={accent} readout={grid ? "on · structure shown" : "off · surface only"}>
            <button
              type="button"
              onClick={toggleGrid}
              aria-pressed={grid}
              style={{
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10,
                fontFamily: ed.mono, fontSize: 12, letterSpacing: "0.04em", textTransform: "lowercase",
                padding: "8px 14px", borderRadius: 999,
                border: `1px solid ${grid ? accent : ed.hair}`,
                background: grid ? accent : "transparent",
                color: grid ? "#F0E6E0" : ed.inkSoft,
                transition: "background .2s ease, color .2s ease, border-color .2s ease",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 26, height: 15, borderRadius: 999, position: "relative", flexShrink: 0,
                  background: grid ? "rgba(240,230,224,0.35)" : ed.hair, transition: "background .2s ease",
                }}
              >
                <span
                  style={{
                    position: "absolute", top: 2, left: grid ? 13 : 2, width: 11, height: 11, borderRadius: "50%",
                    background: grid ? "#F0E6E0" : ed.inkFaint, transition: "left .2s ease",
                  }}
                />
              </span>
              {grid ? "reveal structure" : "show grid"}
            </button>
          </BenchRow>

          {/* Palette */}
          <BenchRow label="palette" accent={accent} readout={`${pal.name} · ${pal.tone}`}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {PALETTES.map((p, i) => {
                const on = i === palIdx;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => choosePalette(i)}
                    aria-pressed={on}
                    aria-label={`${p.name} palette`}
                    title={p.name}
                    style={{
                      cursor: "pointer", padding: 3, borderRadius: 10, lineHeight: 0,
                      border: `1.5px solid ${on ? accent : ed.hair}`,
                      background: "transparent", transition: "border-color .2s ease",
                    }}
                  >
                    <span
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                        width: 46, height: 30, borderRadius: 6, background: p.chip,
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.head }} />
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.kicker }} />
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.sub }} />
                    </span>
                  </button>
                );
              })}
            </div>
          </BenchRow>

          {/* Share */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingTop: 4, borderTop: `1px solid ${ed.hair}` }}>
            <button
              type="button"
              onClick={sharePoster}
              style={{
                cursor: "pointer", fontFamily: ed.mono, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "9px 16px", borderRadius: 999, border: `1px solid ${accent}`,
                background: accent, color: "#F0E6E0",
              }}
            >
              Share this poster
            </button>
            <span aria-live="polite" style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.02em", color: ed.inkFaint, minHeight: 14 }}>
              {toast ?? "state travels as a link"}
            </span>
          </div>
        </div>
      </div>

      {/* ── The legend: the defence, in words ── */}
      <div className="ctrla-defend-legend">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <span aria-hidden style={{ width: 18, height: 2, background: accent }} />
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: accent }}>
            {defense.kicker}
          </span>
        </span>

        <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3vw,34px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px", textTransform: "lowercase", display: "flex", alignItems: "center", gap: 10 }}>
          {defense.badge && (
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: accent, color: "#F0E6E0", fontSize: 13, flexShrink: 0 }}>
              {defense.badge}
            </span>
          )}
          {defense.title}
        </h4>
        <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 24px" }}>
          {defense.body}
        </p>

        {/* Navigate every part (the tap-to-defend index, kept) */}
        <div className="ctrla-defend-list">
          {DECISIONS.map((d, i) => {
            const on = i === activePart;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => pickPart(i)}
                className="ctrla-defend-chip"
                style={{
                  color: on ? "#0F0820" : ed.inkSoft,
                  background: on ? accent : "transparent",
                  borderColor: on ? accent : ed.hair,
                }}
              >
                <span style={{ opacity: 0.7 }}>{d.badge}</span>
                {d.title}
              </button>
            );
          })}
        </div>

        <p style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.5, color: ed.inkFaint, margin: "22px 0 0", paddingTop: 18, borderTop: `1px solid ${ed.hair}` }}>
          a junior makes it look nice. a senior can play with every variable and still defend where it lands.
        </p>
      </div>
    </div>
  );
}

// The defence text is chosen by whatever the reader last touched: a poster
// part, or one of the three controls. This is the speaks-words requirement.
function buildDefense(
  focus: Focus,
  scale: Scale,
  grid: boolean,
  pal: Palette,
  ratio: string,
): { kicker: string; badge: string | null; title: string; body: string } {
  if (focus.kind === "scale") {
    return { kicker: "You moved · scale contrast", badge: null, title: `contrast · ${scale.label}`, body: scale.why };
  }
  if (focus.kind === "grid") {
    return { kicker: "You moved · the grid", badge: null, title: grid ? "grid, revealed" : "grid, hidden", body: grid ? GRID_WHY_ON : GRID_WHY_OFF };
  }
  if (focus.kind === "palette") {
    return { kicker: "You moved · the palette", badge: null, title: `palette · ${pal.name}`, body: pal.why };
  }
  const d = DECISIONS[focus.i];
  const body = d.id === "color" ? pal.why : d.why;
  const title = d.id === "headline" ? `${d.title} · ≈ ${ratio}×` : d.title;
  return { kicker: "The poster, defended", badge: d.badge, title, body };
}

function BenchRow({
  label, readout, accent, children,
}: {
  label: string; readout: string; accent: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: 9 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: accent }}>{label}</span>
        <span style={{ fontFamily: ed.mono, fontSize: 10.5, letterSpacing: "0.02em", color: ed.inkFaint, textAlign: "right" }}>{readout}</span>
      </div>
      {children}
    </div>
  );
}
