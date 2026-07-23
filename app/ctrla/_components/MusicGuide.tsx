"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — MUSIC GUIDE
// The founder's lesson, set in the magazine and checked by an
// engineer. What actually separates a bedroom from a big room
// (the room, not the gear), the capture take, the vocal chain
// in order with saturation and automation, the bus explained,
// the mix-as-a-globe visual, and mastering basics. Honest and
// direct, like a friend who has done it. House theme: light.
//
// Two parts of one sector: Part 01 The Craft (this guide) and
// Part 02 The Tools (the stations below).
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";
import { edLight as ed, Bleed, Kicker, Label, Rule } from "./editorial";
import MixGlobe from "./MixGlobe";
import ToolkitJumpNav from "./ToolkitJumpNav";

// Legibility tokens for this guide. The shared inkSoft (0.66 alpha) reads as a
// dim grey on the cream gradient, so body copy and meta labels are darkened
// here for real contrast without touching the rest of the editorial system.
const READABLE = "rgba(22,12,40,0.88)"; // body paragraphs
const META_INK = "rgba(22,12,40,0.70)"; // small caps labels

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// Truth card — a big circular number badge and title, with the body tucked
// into a hover-reveal collapsible (also taps open on touch).
function TruthCard({ n, title, body, accent, delay }: { n: string; title: string; body: string; accent: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        className="ctrla-truth"
        data-open={open ? "true" : "false"}
        onClick={() => setOpen((v) => !v)}
        style={{ ["--acc" as string]: accent, borderTop: `2px solid ${ed.ink}`, paddingTop: 22, height: "100%", cursor: "pointer" } as CSSProperties}
      >
        <span className="ctrla-truth-num">{n}</span>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, margin: "16px 0 0" }}>
          <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.3vw,26px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>{title}</h3>
          <span className="ctrla-truth-plus" aria-hidden style={{ color: accent }}>+</span>
        </div>
        <div className="ctrla-truth-body" style={{ display: "grid", gridTemplateRows: "0fr", transition: "grid-template-rows 0.34s cubic-bezier(0.22,1,0.36,1)" }}>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: READABLE, margin: "12px 0 0" }}>{body}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// Signal-flow diagram for the bus explainer, made interactive. The dry vocal
// always runs to the mix; toggle the reverb send to see the parallel wet path
// appear and return into the mix. Hover a path to highlight it.
function BusDiagram({ accent }: { accent: string }) {
  const [sendOn, setSendOn] = useState(true);
  const [hover, setHover] = useState<null | "dry" | "wet">(null);

  const fillSoft = `color-mix(in srgb, ${accent} 7%, transparent)`;
  const fillMid = `color-mix(in srgb, ${accent} 16%, transparent)`;
  const strokeSoft = `color-mix(in srgb, ${accent} 42%, transparent)`;
  const wireIdle = `color-mix(in srgb, ${accent} 62%, transparent)`;
  const name = { fontFamily: ed.grotesque, fontWeight: 800, fill: ed.ink } as const;
  const role = { fontFamily: ed.mono, fill: META_INK, letterSpacing: "0.16em", textTransform: "uppercase" as const };
  const tag = { fontFamily: ed.mono, letterSpacing: "0.16em", textTransform: "uppercase" as const };

  const dryHi = hover === "dry";
  const wetHi = hover === "wet" && sendOn;
  const dryW = dryHi ? 3.4 : 2.4;
  const wetW = wetHi ? 3.4 : 2.4;
  const dryCol = dryHi ? accent : wireIdle;
  const wetCol = accent;

  return (
    <div>
      <svg viewBox="0 0 760 300" role="img" aria-label="Signal flow: the dry vocal runs to the main mix, and when the reverb send is on, a copy is sent to a reverb bus that returns wet into the mix." style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <marker id="bus-arrow" markerWidth="8" markerHeight="8" refX="5.5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" fill={accent} />
          </marker>
          <marker id="bus-arrow-idle" markerWidth="8" markerHeight="8" refX="5.5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" fill={wireIdle} />
          </marker>
        </defs>

        {/* ── Dry path (always on) ── */}
        <path d="M180,140 L592,132" fill="none" stroke={dryCol} strokeWidth={dryW} markerEnd={dryHi ? "url(#bus-arrow)" : "url(#bus-arrow-idle)"} style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }} />
        <text x="386" y="112" fontSize="13" textAnchor="middle" style={{ ...tag, fill: dryHi ? accent : META_INK, transition: "fill 0.3s ease" }}>Dry · untouched</text>

        {/* ── Wet path (send + return), fades when the send is off ── */}
        <g style={{ opacity: sendOn ? 1 : 0.14, transition: "opacity 0.4s ease" }}>
          <path d="M104,180 C104,232 176,246 300,246" fill="none" stroke={wetCol} strokeWidth={wetW} strokeDasharray="7 6" markerEnd="url(#bus-arrow)" style={{ transition: "stroke-width 0.3s ease" }} />
          <path d="M486,246 C548,246 566,206 592,190" fill="none" stroke={wetCol} strokeWidth={wetW} markerEnd="url(#bus-arrow)" style={{ transition: "stroke-width 0.3s ease" }} />
          <text x="120" y="250" fontSize="13" textAnchor="start" style={{ ...tag, fill: wetHi ? accent : META_INK, transition: "fill 0.3s ease" }}>Send a copy</text>
          <text x="500" y="212" fontSize="13" textAnchor="start" style={{ ...tag, fill: wetHi ? accent : META_INK, transition: "fill 0.3s ease" }}>Returns wet</text>

          {/* Reverb bus node */}
          <g>
            <rect x="300" y="212" width="186" height="68" rx="14" fill={fillSoft} stroke={wetHi ? accent : strokeSoft} strokeWidth={wetHi ? 2 : 1.5} style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }} />
            <text x="393" y="242" textAnchor="middle" fontSize="19" style={name}>Reverb bus</text>
            <text x="393" y="262" textAnchor="middle" fontSize="9.5" style={role}>the send</text>
          </g>
        </g>

        {/* ── Source + destination nodes ── */}
        <g>
          <rect x="24" y="106" width="156" height="68" rx="14" fill={fillSoft} stroke={strokeSoft} strokeWidth="1.5" />
          <text x="102" y="136" textAnchor="middle" fontSize="19" style={name}>Vocal</text>
          <text x="102" y="156" textAnchor="middle" fontSize="9.5" style={role}>the source</text>
        </g>
        <g>
          <rect x="592" y="82" width="156" height="136" rx="14" fill={fillMid} stroke={accent} strokeWidth="1.75" />
          <text x="670" y="146" textAnchor="middle" fontSize="20" style={name}>Main mix</text>
          <text x="670" y="167" textAnchor="middle" fontSize="9.5" style={role}>the output</text>
        </g>

        {/* ── Invisible hover hit-areas ── */}
        <path d="M180,140 L592,132" fill="none" stroke="transparent" strokeWidth="26" style={{ cursor: "pointer" }} onMouseEnter={() => setHover("dry")} onMouseLeave={() => setHover(null)} />
        {sendOn && (
          <path d="M104,180 C104,232 176,246 300,246 M486,246 C548,246 566,206 592,190" fill="none" stroke="transparent" strokeWidth="26" style={{ cursor: "pointer" }} onMouseEnter={() => setHover("wet")} onMouseLeave={() => setHover(null)} />
        )}
      </svg>

      {/* ── Interactive controls ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2vw,24px)", flexWrap: "wrap", marginTop: "clamp(14px,2vw,20px)" }}>
        <button
          type="button"
          onClick={() => setSendOn((v) => !v)}
          aria-pressed={sendOn}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <span
            aria-hidden
            style={{ position: "relative", width: 44, height: 24, borderRadius: 999, background: sendOn ? accent : "color-mix(in srgb, " + ed.ink + " 18%, transparent)", transition: "background 0.3s ease", flexShrink: 0 }}
          >
            <span style={{ position: "absolute", top: 3, left: sendOn ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#F6EFE8", transition: "left 0.28s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} />
          </span>
          <span style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.14em", textTransform: "uppercase", color: ed.ink }}>
            Reverb send · {sendOn ? "On" : "Off"}
          </span>
        </button>
        <p style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.4vw,15px)", lineHeight: 1.5, color: META_INK, margin: 0, flex: 1, minWidth: 220 }}>
          {sendOn
            ? "The reverb runs in parallel. Blend as much space as you want without ever touching the dry vocal."
            : "Send off: the main mix hears the vocal completely dry. Flip it on to route a copy through the bus."}
        </p>
      </div>
    </div>
  );
}

// Collapsible disclosure — keeps supporting detail out of the way until asked.
// Summary label acts as the toggle; the body reveals on click.
function Disclosure({ label, color, children }: { label: string; color: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ borderTop: `2px solid ${color}`, paddingTop: 16 }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
      >
        <Label color={color}>{label}</Label>
        <span aria-hidden style={{ display: "inline-flex", color, transition: "transform 0.28s ease", transform: open ? "rotate(45deg)" : "none", fontSize: 18, lineHeight: 1 }}>+</span>
      </button>
      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.32s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ overflow: "hidden" }}>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: READABLE, margin: "12px 0 0" }}>
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

// Chapter list for the shared sticky jump-nav (see ToolkitJumpNav).
const CHAPTERS: [string, string][] = [
  ["mg-craft", "The Globe"],
  ["mg-room", "The Room"],
  ["mg-chain", "The Chain"],
  ["mg-master", "Mastering"],
  ["mg-tools", "The Tools"],
  ["tk-stations", "The Stations"],
];

// The vocal chain as an actual signal chain: a rack of modules wired IN → OUT,
// the whole sequence visible in one viewport. The wire lights up to the active
// module; the detail reads in a fixed panel below. Mobile: tap-open accordion.
function ChainRack({ accent }: { accent: string }) {
  const [active, setActive] = useState(0);
  const [mOpen, setMOpen] = useState<number>(0);
  const step = CHAIN[active];
  const rows = [CHAIN.slice(0, 5), CHAIN.slice(5)];

  const Wire = ({ lit }: { lit: boolean }) => (
    <span aria-hidden style={{ flex: "0 0 clamp(8px,1.2vw,18px)", alignSelf: "center", height: 2, background: lit ? accent : ed.hair, transition: "background 0.3s ease" }} />
  );
  const Cap = ({ label, lit }: { label: string; lit: boolean }) => (
    <span style={{ alignSelf: "center", flexShrink: 0, fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: lit ? accent : META_INK, border: `1px solid ${lit ? accent : ed.hair}`, borderRadius: 999, padding: "4px 10px", transition: "color 0.3s ease, border-color 0.3s ease" }}>
      {label}
    </span>
  );
  const Module = ({ idx }: { idx: number }) => {
    const s = CHAIN[idx];
    const on = idx === active;
    const passed = idx <= active;
    return (
      <button
        type="button"
        onClick={() => setActive(idx)}
        aria-pressed={on}
        style={{
          flex: "1 1 0",
          minWidth: 0,
          textAlign: "left",
          padding: "11px 12px 13px",
          borderRadius: 12,
          border: `1.5px solid ${on ? accent : ed.hair}`,
          background: on ? `color-mix(in srgb, ${accent} 9%, transparent)` : "transparent",
          boxShadow: on ? `0 6px 18px -8px color-mix(in srgb, ${accent} 55%, transparent)` : "none",
          cursor: "pointer",
          transition: "border-color 0.28s ease, background 0.28s ease, box-shadow 0.28s ease",
        }}
      >
        <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.14em", color: passed ? accent : META_INK, transition: "color 0.3s ease" }}>{s.n}</span>
        <span style={{ display: "block", marginTop: 5, fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(12px,1.15vw,15px)", letterSpacing: "-0.01em", lineHeight: 1.12, color: ed.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {s.short}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* ── Desktop: the rack ── */}
      <div className="hidden md:block" style={{ marginTop: "clamp(22px,3vw,36px)", background: ed.panel, border: `1px solid ${ed.hair}`, borderRadius: 18, padding: "clamp(18px,2.6vw,30px)" }}>
        <div style={{ display: "flex", gap: 0 }}>
          <Cap label="In" lit />
          <Wire lit />
          {rows[0].map((s, i) => (
            <span key={s.n} style={{ display: "contents" }}>
              {i > 0 && <Wire lit={active >= i} />}
              <Module idx={i} />
            </span>
          ))}
        </div>
        {/* Return wire: signal drops from the end of row one back to row two */}
        <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden style={{ display: "block", margin: "3px 0" }}>
          <path d="M97,0 L97,12 L3,12 L3,24" fill="none" stroke={active >= 5 ? accent : ed.hair} strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ transition: "stroke 0.3s ease" }} />
        </svg>
        <div style={{ display: "flex", gap: 0 }}>
          {rows[1].map((s, i) => (
            <span key={s.n} style={{ display: "contents" }}>
              {i > 0 && <Wire lit={active >= 5 + i} />}
              <Module idx={5 + i} />
            </span>
          ))}
          <Wire lit={active === 9} />
          <Cap label="Out" lit={active === 9} />
        </div>

        {/* ── Fixed detail panel ── */}
        <div style={{ marginTop: "clamp(18px,2.4vw,26px)", borderTop: `2px solid ${ed.ink}`, paddingTop: 16, minHeight: 138 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
              <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,3vw,38px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: accent }}>{step.n}</span>
              <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>{step.name}</h4>
              <Label color={accent}>{step.level}</Label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[["←", -1], ["→", 1]].map(([g, d]) => (
                <button
                  key={g as string}
                  type="button"
                  aria-label={d === -1 ? "Previous step" : "Next step"}
                  onClick={() => setActive((a) => Math.min(9, Math.max(0, a + (d as number))))}
                  style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${ed.hair}`, background: "none", color: ed.ink, cursor: "pointer", fontSize: 14, lineHeight: 1 }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.6, color: READABLE, margin: "10px 0 0", maxWidth: 760 }}>{step.body}</p>
          {step.tool && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12, fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.04em", color: accent, background: `color-mix(in srgb, ${accent} 9%, transparent)`, border: `1px solid ${accent}`, borderRadius: 999, padding: "5px 12px" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent }} aria-hidden />
              we reach for {step.tool}
            </span>
          )}
        </div>
      </div>

      {/* ── Mobile: compact accordion ── */}
      <div className="md:hidden" style={{ marginTop: 22 }}>
        {CHAIN.map((s, i) => {
          const open = mOpen === i;
          return (
            <div key={s.n} style={{ borderTop: `1px solid ${ed.hair}` }}>
              <button
                type="button"
                onClick={() => setMOpen(open ? -1 : i)}
                aria-expanded={open}
                style={{ width: "100%", display: "flex", alignItems: "baseline", gap: 12, padding: "13px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.12em", color: accent }}>{s.n}</span>
                <span style={{ flex: 1, fontFamily: ed.grotesque, fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em", color: ed.ink }}>{s.name}</span>
                <span aria-hidden style={{ color: accent, fontSize: 18, lineHeight: 1, transition: "transform 0.28s ease", transform: open ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.32s cubic-bezier(0.22,1,0.36,1)" }}>
                <div style={{ overflow: "hidden" }}>
                  <p style={{ fontFamily: ed.body, fontSize: 14, lineHeight: 1.6, color: READABLE, margin: "0 0 6px" }}>{s.body}</p>
                  {s.tool && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, margin: "4px 0 14px", fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.04em", color: accent, border: `1px solid ${accent}`, borderRadius: 999, padding: "4px 10px" }}>
                      we reach for {s.tool}
                    </span>
                  )}
                  {!s.tool && <span style={{ display: "block", height: 8 }} />}
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ borderTop: `1px solid ${ed.hair}` }} />
      </div>
    </>
  );
}

const TRUTHS = [
  {
    n: "01",
    title: "The gap is the room, not the gear",
    body: "The analog compressors and the saturation are real, those rooms have them. But the biggest difference is the room itself. Treated walls, a dead space, monitors you trust. Gear is the small half of the gap. The room is the big half.",
  },
  {
    n: "02",
    title: "You can close almost all of it",
    body: "Here is the good news. The room is also the cheapest part to fix. Some of your favorite songs were cut on the go, in a hotel, on a laptop. A fancy camera does not take the photo. The artist does.",
  },
  {
    n: "03",
    title: "Order is everything",
    body: "The steps only work in sequence. Capture clean, run the chain in order, then master. Skip the first step and the rest becomes impossible. This is the part the how-to videos always rush past.",
  },
];

const CHAIN = [
  { n: "00", name: "Clean input", short: "Clean input", level: "the one everyone skips", tool: "", body: "Pop filter up, a fist off the mic, sing slightly off axis, and record with headroom so nothing clips. More than half the work is here." },
  { n: "01", name: "Manual tuning", short: "Manual tune", level: "by hand, graphical", tool: "Antares Auto-Tune (Graph)", body: "Fix the notes that drift in the graph editor, by eye and by ear. You are correcting a real performance, not leaning on a crutch." },
  { n: "02", name: "The tuner", short: "Tuner", level: "auto-tune on top", tool: "Antares Auto-Tune", body: "A real-time tuner rides over the manual work. Light retune to stay invisible, near zero when the locked sound is the point." },
  { n: "03", name: "De-esser", short: "De-esser", level: "tame the harshness", tool: "FabFilter Pro-DS", body: "Pull down the sharp sss and t sounds that stab through a mix. You may need to de-ess again near the end." },
  { n: "04", name: "EQ, subtractive", short: "EQ cut", level: "carve the space first", tool: "FabFilter Pro-Q 3", body: "Take away before you add. High-pass the rumble and cut the mud before the compressor, save the bright lifts for after." },
  { n: "05", name: "Compressor", short: "Compressor", level: "even it out", tool: "Waves CLA-2A", body: "Even out the loud and quiet words so every one lands up front. Two gentle compressors beat one working hard." },
  { n: "06", name: "Multiband compressor", short: "Multiband", level: "the surgical pass", tool: "FabFilter Pro-Q 3 (dynamic)", body: "The same control, split by frequency. Calm a boomy low or harsh mid without squashing the whole vocal." },
  { n: "07", name: "Saturation", short: "Saturation", level: "the analog warmth", tool: "CamelCrusher", body: "The warmth those expensive rooms get for free. A touch of harmonic saturation helps the vocal sit forward." },
  { n: "08", name: "Wet effects on a bus", short: "Wet FX bus", level: "reverb · delay · doubling", tool: "Pro-R · EchoBoy · Doubler", body: "Depth and width go on last, on a send, never straight on the track. Reverb for space, delay for throws, a doubler for width." },
  { n: "09", name: "Automation", short: "Automation", level: "ride it home", tool: "", body: "Ride the vocal volume line by line so every word sits. This is where a good mix quietly becomes finished." },
];

const MASTER = [
  { k: "loudness, measured", title: "LUFS targets", body: "Spotify and YouTube rest around -14 LUFS, Apple Music nearer -16. So master for your genre and let each platform turn it down. Chasing as loud as humanly possible just crushes your dynamics for nothing. Meter it with something free like Youlean, do not guess." },
  { k: "borrow good ears", title: "Reference tracks", body: "Pull a song you love in the same lane and match your master to it. But loudness-match first. The louder track always sounds better for the wrong reason. Trust the reference over your own ears, which start lying after an hour." },
  { k: "the last gate", title: "True peak limiting", body: "Catch the peaks so nothing clips when the file gets converted to MP3 or AAC. Keep a ceiling around -1 dBTP and your master stays clean on every speaker it lands on." },
];

export default function MusicGuide({ accent = ed.amber }: { accent?: string }) {
  return (
    <section style={{ background: "transparent", padding: 0 }}>
      <ToolkitJumpNav accent={accent} items={CHAPTERS} />
      <div aria-hidden style={{ height: "clamp(28px,4vw,52px)" }} />
      <Bleed>
        {/* ── Hero: mission + the centerpiece, playable at scroll-zero ── */}
        <div id="mg-craft" style={{ scrollMarginTop: 64 }} />
        <Reveal>
          <Kicker color={accent}>The Music Toolkit · Part 01 The Craft</Kicker>
          <h2
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(32px,5.2vw,68px)",
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
              color: ed.ink,
              margin: "16px 0 0",
              maxWidth: 920,
            }}
          >
            Bedroom to big room, the gap is smaller than they tell you<span style={{ color: accent }}>.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <p style={{ fontFamily: ed.body, fontStyle: "normal", fontSize: "clamp(16px,2vw,24px)", lineHeight: 1.45, color: READABLE, margin: "clamp(16px,2.4vw,26px) 0 0", maxWidth: 800 }}>
            We teach the room, the chain, and the tools that close it. Start here: every record is a globe of space. Dry sits up front, wet drifts back, panning spreads it wide. <em style={{ fontStyle: "italic", color: accent }}>Spin it, tap a sound</em>, and watch each element claim its pocket.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ marginTop: "clamp(22px,3.2vw,40px)" }}>
            <MixGlobe accent={accent} />
          </div>
        </Reveal>

        {/* ── Three honest truths ── */}
        <div style={{ marginTop: "clamp(40px,5.5vw,72px)" }}>
          <Reveal>
            <Kicker color={accent} style={{ marginBottom: 22 }}>The honest truth</Kicker>
          </Reveal>
          <div className="ctrla-guide-grid">
            {TRUTHS.map((t, i) => (
              <TruthCard key={t.n} n={t.n} title={t.title} body={t.body} accent={accent} delay={i * 0.06} />
            ))}
          </div>
        </div>

        {/* ── The room (the real gap, the cheap fix) ── */}
        <div id="mg-room" style={{ marginTop: "clamp(40px,5.5vw,76px)", scrollMarginTop: 64 }}>
          <Reveal>
            <Kicker color={accent}>Before the chain · the room</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 0" }}>
              Fix the room before you touch a plugin
            </h3>
          </Reveal>
          <div className="ctrla-guide-split" style={{ marginTop: "clamp(24px,3vw,36px)" }}>
            <Reveal>
              <Disclosure label="Why it matters most" color={META_INK}>
                An untreated space bounces sound back into the mic and bakes reverb into your take before you have done anything. You cannot EQ your way out of a bad room, so you fix it at the source.
              </Disclosure>
            </Reveal>
            <Reveal delay={0.08}>
              <Disclosure label="The cheap fix" color={accent}>
                Sing into the dead end of the room, never a corner or a window. Hang a thick blanket behind and beside you to kill first reflections. A closet full of clothes beats a big empty bedroom, and it closes most of the gap.
              </Disclosure>
            </Reveal>
          </div>
        </div>

        {/* ── The vocal chain, in order ── */}
        <div id="mg-chain" style={{ marginTop: "clamp(40px,5.5vw,76px)", scrollMarginTop: 64 }}>
          <Reveal>
            <Kicker color={accent}>The ROV vocal chain</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              The chain, start to finish
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: READABLE, margin: 0, maxWidth: 640 }}>
              Free or paid, BandLab or GarageBand, the order does not change. Run it top to bottom and the voice that comes out the other side sounds like a record.
            </p>
          </Reveal>

          <ChainRack accent={accent} />

          {/* Bus explainer */}
          <Reveal>
            <div className="ctrla-bus-card" style={{ background: ed.panel, border: `1px solid ${ed.hair}` }}>
              <div>
                <Label color={accent} style={{ display: "block", marginBottom: 12 }}>Plain language</Label>
                <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3.4vw,40px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>So what is a bus, actually?</h4>
              </div>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.62, color: READABLE, margin: 0 }}>
                A bus is a separate mixer track you send sound to. Send a copy of your vocal to a reverb bus and you control the wet and dry apart, while the main track stays clean. It is most of the gap between a mix that sounds like a hobby and one that sounds like a release.
              </p>
              {/* Signal-flow diagram: dry straight to the mix, a copy sent to the reverb bus and back */}
              <div style={{ gridColumn: "1 / -1", marginTop: "clamp(8px,1.5vw,16px)" }}>
                <BusDiagram accent={accent} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Mastering basics ── */}
        <div id="mg-master" style={{ marginTop: "clamp(40px,5.5vw,76px)", scrollMarginTop: 64 }}>
          <Reveal>
            <Kicker color={accent}>Mastering, the basics</Kicker>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.6, color: READABLE, margin: "12px 0 0", maxWidth: 620 }}>
              Master from a mix with headroom, around -6 dB on the master, then three things matter.
            </p>
          </Reveal>
          <div className="ctrla-guide-grid" style={{ marginTop: "clamp(24px,3vw,40px)" }}>
            {MASTER.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.06}>
                <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18, height: "100%" }}>
                  <Label color={META_INK} style={{ display: "block", marginBottom: 10 }}>{m.k}</Label>
                  <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.4vw,28px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px" }}>{m.title}</h3>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: READABLE, margin: 0 }}>{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Chapter handoff: Part 02 · The Tools ── */}
        <div id="mg-tools" style={{ marginTop: "clamp(44px,6vw,84px)", scrollMarginTop: 64 }}>
          <Rule color={ed.hair} />
          <Reveal>
            <div style={{ paddingTop: "clamp(22px,3vw,32px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <Kicker color={accent}>Part 02 · The Tools</Kicker>
              <span style={{ fontFamily: ed.body, fontStyle: "normal", fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.4, color: READABLE }}>
                Now the gear. The picks our engineers <em style={{ fontStyle: "italic", color: accent }}>actually run</em>.
              </span>
            </div>
          </Reveal>
        </div>
      </Bleed>
    </section>
  );
}
