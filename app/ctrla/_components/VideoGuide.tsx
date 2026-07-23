"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — VIDEO / FILM GUIDE
// The film team's craft lesson, set in the magazine. What
// actually makes an image cinematic (the light, not the body),
// the three-point mental model built in order, exposure that
// protects the highlights, the Light Bench visual where a scene
// speaks its own mood, and the honest truth about "fix it in
// post." House theme: light.
//
// ⚠️ DRAFT FOR ANDI TO VERIFY. This is a plausible, ROV-voice
// reconstruction of the film team's approach, not a confirmed
// transcript. Confirm the specifics before it ships.
//
// Two parts of one sector: Part 01 The Craft (this guide) and
// Part 02 The Tools (the stations below).
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";
import { edLight as ed, Bleed, Kicker, Label, Rule } from "./editorial";
import LightBench from "./LightBench";
import NegativeFill from "./NegativeFill";
import ToolkitJumpNav from "./ToolkitJumpNav";

// Chapter list for the shared sticky jump-nav.
const CHAPTERS: [string, string][] = [
  ["vg-craft", "The Bench"],
  ["vg-location", "The Location"],
  ["vg-chain", "The Chain"],
  ["vg-exposure", "Exposure"],
  ["tk-stations", "The Stations"],
];

// Legibility tokens for this guide, matching the Music guide: the shared
// inkSoft reads dim on cream, so body copy and labels are darkened here.
const READABLE = "rgba(22,12,40,0.88)";
const META_INK = "rgba(22,12,40,0.58)";

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
    title: "The camera never made it cinematic",
    body: "The body buys latitude and clean shadows, sure. But the look you chase is light, lens, and motion, and a phone in controlled light beats a cinema camera in a flat room.",
  },
  {
    n: "02",
    title: "Most of lighting is subtraction",
    body: "Beginners add lights, gaffers take light away. One good source, a flag to cut the spill, a black flag for negative fill, and a face gains shape. Shaping the one light you have is the skill.",
  },
  {
    n: "03",
    title: "You cannot fix it in post",
    body: "Post amplifies what you captured, it never invents it. A blown highlight is gone, soft focus stays soft. The grade is polish, the image is made in the room.",
  },
];

const CHAIN = [
  { n: "00", name: "Motivate the source", level: "the one everyone skips", tool: "", body: "Before a fixture goes up, decide where the light comes from: a window, a lamp, the low sun. Every light you add should sell that one direction. Unmotivated light is what makes a shot read as filmed, not felt." },
  { n: "01", name: "The key", level: "the main light, alone", tool: "Aputure LS 600d Pro", body: "Kill everything else and place the key alone. Walk it around the subject and watch the shadow it carves down the face. It sets the mood before anything else joins, so get it right in the dark." },
  { n: "02", name: "Shape it", level: "modify and flag", tool: "Matthews C-Stand", body: "Raw light is harsh and spills everywhere. Soften it through diffusion or a bounce, then flag it off the walls and the lens. Shaping the key is most of the gap between a snapshot and a frame." },
  { n: "03", name: "The fill", level: "set the shadow depth", tool: "", body: "Decide how dark the shadow side falls: a soft bounce opposite the key opens it up, less fill keeps it moody. That ratio, key against fill, is what people mean by dramatic or flat." },
  { n: "04", name: "Negative fill", level: "take light away", tool: "Matthews C-Stand", body: "If the shadow side looks too open and flat, subtract instead of add. A black flag on the fill side drinks the ambient bounce and deepens the shadow. This is the move that reads as expensive." },
  { n: "05", name: "The back light", level: "separate from the world", tool: "", body: "A rim behind the subject draws a bright edge that lifts them off the backdrop. Without it they melt into the background, with it, depth. Keep it a kiss of an edge, not a halo." },
  { n: "06", name: "The background", level: "give the world depth", tool: "Aputure LS 600d Pro", body: "Light the space behind the subject on its own so it is not one dead tone: a pool of light, a practical, a gel for colour. It is the difference between a person on a stage and a person in a place." },
  { n: "07", name: "White balance on purpose", level: "set the colour, do not guess", tool: "Blackmagic Pocket Cinema Camera 6K Pro", body: "Set white balance to a decision, not auto. Warm toward evening or cool toward daylight, but choose it and hold it across the coverage so the cut does not shift colour." },
];

const EXPOSE = [
  { k: "protect the top", title: "Expose for highlights", body: "The bright end is the fragile end. Use false colour and hold highlights just under clipping. Shadows lift cleanly in the grade, a blown highlight is gone for good." },
  { k: "read the tools, not your eyes", title: "Meter, do not guess", body: "Your eyes adapt and start lying within minutes. A waveform and false colour tell the truth, so set skin tones on the scale and trust the scope over an uncalibrated monitor." },
  { k: "log needs discipline", title: "Only shoot flat if you will grade", body: "Log and raw hold more range, but only pay off with correct exposure and a real grade after. If you cannot do both, a good picture profile beats mishandled log. The format is not the look." },
];

export default function VideoGuide({ accent = ed.plum }: { accent?: string }) {
  return (
    <section style={{ background: "transparent", padding: 0 }}>
      <ToolkitJumpNav accent={accent} items={CHAPTERS} />
      <Bleed style={{ paddingTop: "clamp(40px,6vw,80px)" }}>
        {/* ── Hero: mission + the centerpiece, playable at scroll-zero ── */}
        <div id="vg-craft" style={{ scrollMarginTop: 64 }} />
        <Reveal>
          <Kicker color={accent}>The Video Toolkit · Part 01 The Craft</Kicker>
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
            Phone footage to cinema, the gap is smaller than they tell you<span style={{ color: accent }}>.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <p style={{ fontFamily: ed.body, fontStyle: "normal", fontSize: "clamp(16px,2vw,24px)", lineHeight: 1.45, color: READABLE, margin: "clamp(16px,2.4vw,26px) 0 0", maxWidth: 800 }}>
            We teach the light, the frame, and the tools that close it. Start here: the bench. A key, a fill, and a back light. <em style={{ fontStyle: "italic", color: accent }}>Drag them around the scene</em> and watch the mood change.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ marginTop: "clamp(22px,3.2vw,40px)" }}>
            <LightBench accent={accent} />
          </div>
        </Reveal>

        {/* ── The thesis: the body vs the light ── */}
        <div style={{ marginTop: "clamp(40px,5.5vw,76px)" }}>
          <Reveal>
            <Kicker color={accent}>The thesis</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 0", maxWidth: 900 }}>
              Cinematic was never the camera. It was the light
            </h3>
          </Reveal>
        </div>

        <div className="ctrla-guide-split" style={{ margin: "clamp(28px,4vw,48px) 0 0" }}>
          <Reveal>
            <Disclosure label="the fifty thousand dollar package" color={META_INK}>
              The rented body, the prime set, trucks of lighting and grip. It is real, and it buys latitude and control, the same way the treated room is real in music.
            </Disclosure>
          </Reveal>
          <Reveal delay={0.08}>
            <Disclosure label="what you actually control" color={accent}>
              But the look lives in <em style={{ fontStyle: "italic", color: accent }}>free decisions</em>: where the light comes from, how deep the shadow falls, what you leave dark. A window, a bounce, and a black flag out-shoot a flat room full of gear.
            </Disclosure>
          </Reveal>
        </div>

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

        {/* ── Before the shoot: the location (control the light) ── */}
        <div id="vg-location" style={{ marginTop: "clamp(40px,5.5vw,76px)", scrollMarginTop: 64 }}>
          <Reveal>
            <Kicker color={accent}>Before the lights · the location</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 0" }}>
              Scout for control, not for pretty
            </h3>
          </Reveal>
          <div className="ctrla-guide-split" style={{ marginTop: "clamp(24px,3vw,36px)" }}>
            <Reveal>
              <Disclosure label="Why it matters most" color={META_INK}>
                A beautiful room you cannot control fights you all day: mixed colour, hard-wall sound, nowhere to place a light. The location is the room from the music lesson, fix it at the source or pay for it in every frame.
              </Disclosure>
            </Reveal>
            <Reveal delay={0.08}>
              <Disclosure label="The cheap fix" color={accent}>
                Pick the spot where you own the light. Kill the overheads, flag the window or make it your key, and shoot away from the reflective end. One controllable direction beats a gorgeous space you cannot tame.
              </Disclosure>
            </Reveal>
          </div>
        </div>

        {/* ── The lighting chain, in order ── */}
        <div id="vg-chain" style={{ marginTop: "clamp(40px,5.5vw,76px)", scrollMarginTop: 64 }}>
          <Reveal>
            <Kicker color={accent}>The ROV lighting chain</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              Build the scene, one light at a time
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: READABLE, margin: 0, maxWidth: 640 }}>
              Two lights or ten, budget or blockbuster, the order does not change. Add one light, judge it, then add the next. A scene lit in sequence has intention. A scene lit all at once is a guess.
            </p>
          </Reveal>

          <div className="ctrla-chain">
            {CHAIN.map((s, i) => (
              <Reveal key={s.n} delay={Math.min(i * 0.04, 0.2)}>
                <div
                  className="ctrla-chain-step"
                  style={{
                    borderLeft: `3px solid ${ed.hair}`,
                    opacity: 0.96,
                  }}
                >
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,3.4vw,42px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: ed.ink, opacity: 0.5 }}>{s.n}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                      <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.4vw,30px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>{s.name}</h4>
                      <Label color={META_INK}>{s.level}</Label>
                    </div>
                    <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.6, color: READABLE, margin: 0, maxWidth: 640 }}>{s.body}</p>
                    {s.tool && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12, fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.04em", color: META_INK, border: `1px solid ${ed.hair}`, borderRadius: 999, padding: "5px 12px" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: META_INK }} aria-hidden />
                        we reach for {s.tool}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Negative fill explainer — plain language + the before/after visual */}
          <div className="ctrla-negfill-block">
            <Reveal>
              <div>
                <Label color={accent} style={{ display: "block", marginBottom: 14 }}>Plain language · drag to see it</Label>
                <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3.4vw,40px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 18px" }}>So what is negative fill?</h4>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.62, color: READABLE, margin: 0 }}>
                  Negative fill is lighting by taking away. Instead of adding a light to the shadow side, you put something black there, a flag or a black sheet, to soak up the stray bounce filling that shadow in. The shadow deepens, the face gains shape, and the frame reads three-dimensional. That ratio between the lit side and the dark side is most of the gap between footage that looks like a home video and footage that looks like a film.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <NegativeFill accent={accent} />
            </Reveal>
          </div>
        </div>

        {/* ── Exposure basics ── */}
        <div id="vg-exposure" style={{ marginTop: "clamp(40px,5.5vw,76px)", scrollMarginTop: 64 }}>
          <Reveal>
            <Kicker color={accent}>Exposure, the basics</Kicker>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.6, color: READABLE, margin: "12px 0 0", maxWidth: 620 }}>
              Once the scene is lit, three things keep the image clean from capture to grade.
            </p>
          </Reveal>
          <div className="ctrla-guide-grid" style={{ marginTop: "clamp(24px,3vw,40px)" }}>
            {EXPOSE.map((m, i) => (
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
        <div style={{ marginTop: "clamp(44px,6vw,84px)" }}>
          <Rule color={ed.hair} />
          <Reveal>
            <div style={{ paddingTop: "clamp(22px,3vw,32px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <Kicker color={accent}>Part 02 · The Tools</Kicker>
              <span style={{ fontFamily: ed.body, fontStyle: "normal", fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.4, color: READABLE }}>
                Now the gear. The bodies, glass, and light our film team <em style={{ fontStyle: "italic", color: accent }}>runs</em>.
              </span>
            </div>
          </Reveal>
        </div>
      </Bleed>
    </section>
  );
}
