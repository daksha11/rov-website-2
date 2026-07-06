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

import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";
import { edLight as ed, Bleed, Kicker, Label, Rule } from "./editorial";
import MixGlobe from "./MixGlobe";

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
  { n: "00", name: "Clean input", level: "the one everyone skips", tool: "", body: "Pop filter up, a fist off the mic, sing slightly off axis, and record with headroom so nothing clips. More than half the work is here." },
  { n: "01", name: "Manual tuning", level: "by hand, graphical", tool: "Antares Auto-Tune (Graph)", body: "Fix the notes that drift in the graph editor, by eye and by ear. You are correcting a real performance, not leaning on a crutch." },
  { n: "02", name: "The tuner", level: "auto-tune on top", tool: "Antares Auto-Tune", body: "A real-time tuner rides over the manual work. Light retune to stay invisible, near zero when the locked sound is the point." },
  { n: "03", name: "De-esser", level: "tame the harshness", tool: "FabFilter Pro-DS", body: "Pull down the sharp sss and t sounds that stab through a mix. You may need to de-ess again near the end." },
  { n: "04", name: "EQ, subtractive", level: "carve the space first", tool: "FabFilter Pro-Q 3", body: "Take away before you add. High-pass the rumble and cut the mud before the compressor, save the bright lifts for after." },
  { n: "05", name: "Compressor", level: "even it out", tool: "Waves CLA-2A", body: "Even out the loud and quiet words so every one lands up front. Two gentle compressors beat one working hard." },
  { n: "06", name: "Multiband compressor", level: "the surgical pass", tool: "FabFilter Pro-Q 3 (dynamic)", body: "The same control, split by frequency. Calm a boomy low or harsh mid without squashing the whole vocal." },
  { n: "07", name: "Saturation", level: "the analog warmth", tool: "CamelCrusher", body: "The warmth those expensive rooms get for free. A touch of harmonic saturation helps the vocal sit forward." },
  { n: "08", name: "Wet effects on a bus", level: "reverb · delay · doubling", tool: "Pro-R · EchoBoy · Doubler", body: "Depth and width go on last, on a send, never straight on the track. Reverb for space, delay for throws, a doubler for width." },
  { n: "09", name: "Automation", level: "ride it home", tool: "", body: "Ride the vocal volume line by line so every word sits. This is where a good mix quietly becomes finished." },
];

const MASTER = [
  { k: "loudness, measured", title: "LUFS targets", body: "Spotify and YouTube rest around -14 LUFS, Apple Music nearer -16. So master for your genre and let each platform turn it down. Chasing as loud as humanly possible just crushes your dynamics for nothing. Meter it with something free like Youlean, do not guess." },
  { k: "borrow good ears", title: "Reference tracks", body: "Pull a song you love in the same lane and match your master to it. But loudness-match first. The louder track always sounds better for the wrong reason. Trust the reference over your own ears, which start lying after an hour." },
  { k: "the last gate", title: "True peak limiting", body: "Catch the peaks so nothing clips when the file gets converted to MP3 or AAC. Keep a ceiling around -1 dBTP and your master stays clean on every speaker it lands on." },
];

export default function MusicGuide({ accent = ed.amber }: { accent?: string }) {
  // Scroll-spy for the vocal chain: the step crossing the middle band of the
  // viewport becomes active. Replaces the old hardcoded "step 00 is always lit"
  // that read as a stuck highlight. IntersectionObserver works under Lenis
  // smooth-scroll since it is layout based, not scroll-event based.
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visible = useRef<Set<number>>(new Set());
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = stepRefs.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = Number((e.target as HTMLElement).dataset.idx);
          if (e.isIntersecting) visible.current.add(idx);
          else visible.current.delete(idx);
        }
        if (visible.current.size) setActive(Math.min(...Array.from(visible.current)));
      },
      // Thin detection band ~centered vertically, so one step is active at a time.
      { rootMargin: "-42% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section style={{ background: "transparent", padding: "clamp(40px,6vw,80px) 0 0" }}>
      <Bleed>
        {/* ── Hero: bedroom vs big room ── */}
        <Reveal>
          <Kicker color={accent}>Part 01 · The Craft</Kicker>
          <h2
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(34px,6vw,80px)",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: ed.ink,
              margin: "16px 0 0",
              maxWidth: 980,
            }}
          >
            The bedroom and the big room are<br />
            closer than they tell you<span style={{ color: accent }}>.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <p style={{ fontFamily: ed.body, fontStyle: "normal", fontSize: "clamp(18px,2.4vw,30px)", lineHeight: 1.4, color: READABLE, margin: "clamp(20px,3vw,32px) 0 0", maxWidth: 860 }}>
            What separates a downtown studio from your setup is mostly the room, not a magic plugin, and the room is <em style={{ fontStyle: "italic", color: accent }}>the cheapest part to fix</em>.
          </p>
        </Reveal>

        {/* ── Three honest truths ── */}
        <div style={{ marginTop: "clamp(56px,8vw,104px)" }}>
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
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
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
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The ROV vocal chain</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              The chain, start to finish
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: READABLE, margin: 0, maxWidth: 640 }}>
              Free or paid, BandLab or GarageBand, the order does not change. Run it top to bottom and the voice that comes out the other side sounds like a record.
            </p>
          </Reveal>

          <div className="ctrla-chain">
            {CHAIN.map((s, i) => {
              const isActive = i === active;
              return (
              <Reveal key={s.n} delay={Math.min(i * 0.04, 0.2)}>
                <div
                  ref={(el) => { stepRefs.current[i] = el; }}
                  data-idx={i}
                  className="ctrla-chain-step"
                  style={{
                    borderLeft: `3px solid ${isActive ? accent : ed.hair}`,
                    opacity: isActive ? 1 : 0.92,
                    transition: "border-color 0.35s ease, opacity 0.35s ease",
                  }}
                >
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,3.4vw,42px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: isActive ? accent : ed.ink, opacity: isActive ? 1 : 0.5, transition: "color 0.35s ease, opacity 0.35s ease" }}>{s.n}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                      <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.4vw,30px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>{s.name}</h4>
                      <Label color={isActive ? accent : META_INK}>{s.level}</Label>
                    </div>
                    <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.6, color: READABLE, margin: 0, maxWidth: 640 }}>{s.body}</p>
                    {s.tool && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12, fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.04em", color: isActive ? accent : META_INK, background: isActive ? "rgba(165,106,103,0.1)" : "transparent", border: `1px solid ${isActive ? accent : ed.hair}`, borderRadius: 999, padding: "5px 12px", transition: "color 0.35s ease, border-color 0.35s ease, background 0.35s ease" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: isActive ? accent : META_INK, transition: "background 0.35s ease" }} aria-hidden />
                        we reach for {s.tool}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
              );
            })}
          </div>

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

        {/* ── Mix as a globe ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The visual that makes it click</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              Your song is a 3D globe
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: READABLE, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 640 }}>
              The lesson I teach every artist. The front sounds are dry and in your face. Wet effects like reverb and delay send things to the back. Panning moves them left and right. Spin it, tap a sound, and watch every element claim its own pocket of space.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <MixGlobe accent={accent} />
          </Reveal>
        </div>

        {/* ── Mastering basics ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
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
        <div style={{ marginTop: "clamp(64px,9vw,120px)" }}>
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
