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

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { edLight as ed, Bleed, Kicker, Label, Rule } from "./editorial";
import LightBench from "./LightBench";

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

const TRUTHS = [
  {
    n: "01",
    title: "The camera never made it cinematic",
    body: "the expensive body helps, it is true, more latitude, cleaner shadows, gradeable raw. but the look you are chasing is light, lens, and motion. a phone in beautiful, controlled light beats a cinema camera in a flat room every single time.",
  },
  {
    n: "02",
    title: "Most of lighting is subtraction",
    body: "beginners add lights. gaffers take light away. one good source, then a flag to cut the spill and a black flag for negative fill, carves shape into a face. counting fixtures is not the skill. shaping the one you have is.",
  },
  {
    n: "03",
    title: "You cannot fix it in post",
    body: "post amplifies what you captured, it does not invent it. a blown highlight is gone, soft focus stays soft, and muddy location audio stays muddy. the grade is polish. the image is made in the room, on the day.",
  },
];

const CHAIN = [
  { n: "00", name: "Motivate the source", level: "the one everyone skips", tool: "", body: "before a single fixture goes up, decide where the light in this scene comes from: a window, a practical lamp, the low sun. every light you add should sell that one direction. unmotivated light is exactly what makes a shot read as filmed instead of felt." },
  { n: "01", name: "The key", level: "the main light, alone", tool: "Aputure LS 600d Pro", body: "kill everything else and place the key by itself. walk it around the subject and watch the shadow it carves down the face. the key sets the entire mood before anything else joins, so get it right in the dark first." },
  { n: "02", name: "Shape it", level: "modify and flag", tool: "Matthews C-Stand", body: "raw light is harsh and it spills everywhere. soften it through a diffusion or a bounce for a gentler wrap, then flag the light off the walls and the lens. shaping the key is most of the difference between a snapshot and a frame." },
  { n: "03", name: "The fill", level: "set the shadow depth", tool: "", body: "now decide how dark the shadow side falls. a soft bounce opposite the key opens it up, less fill keeps it moody and contrasty. this single ratio, key against fill, is what people mean when they say a shot looks dramatic or looks flat." },
  { n: "04", name: "Negative fill", level: "take light away", tool: "Matthews C-Stand", body: "if the shadow side is too open and the face looks flat, add nothing, subtract. a black flag or a floppy on the fill side drinks the ambient bounce and deepens the shadow. this is the move that reads as expensive." },
  { n: "05", name: "The back light", level: "separate from the world", tool: "", body: "a rim or hair light behind the subject draws a bright edge that lifts them clean off the backdrop. without it the subject melts into the background. with it, depth. keep it honest, a kiss of an edge, not a halo." },
  { n: "06", name: "The background", level: "give the world depth", tool: "Aputure LS 600d Pro", body: "light the space behind the subject on its own so it is not one dead tone. a pool of light, a practical lamp, a gel for colour. a lit background is the difference between a person on a stage and a person in a place." },
  { n: "07", name: "White balance on purpose", level: "set the colour, do not guess", tool: "Blackmagic Pocket Cinema Camera 6K Pro", body: "set your white balance to a decision, not auto. warm the frame toward evening or cool it toward daylight, but choose it, and keep it consistent across the coverage so the cut does not shift colour every shot." },
];

const EXPOSE = [
  { k: "protect the top", title: "Expose for highlights", body: "the bright end is the fragile end. use false colour or zebras and hold your highlights just under clipping. shadows lift cleanly in the grade, a blown highlight is gone for good. when in doubt, sit a touch under and raise it later." },
  { k: "read the tools, not your eyes", title: "Meter, do not guess", body: "your eyes adapt and start lying within minutes. a waveform and false colour tell the truth. set skin tones where they belong on the scale and trust the scope over the vibe on the monitor, which is rarely calibrated on location." },
  { k: "log needs discipline", title: "Only shoot flat if you will grade", body: "log and raw hold more range, but only pay off with correct exposure and a real grade after. if you cannot expose it right and colour it later, a good picture profile beats muddy, mishandled log every time. the format is not the look." },
];

export default function VideoGuide({ accent = ed.plum }: { accent?: string }) {
  return (
    <section style={{ background: "transparent", padding: "clamp(40px,6vw,80px) 0 0" }}>
      <Bleed>
        {/* ── Hero: the body vs the light ── */}
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
            Cinematic was never the camera.<br />
            It was the light<span style={{ color: accent }}>.</span>
          </h2>
        </Reveal>

        <div className="ctrla-guide-split" style={{ margin: "clamp(28px,4vw,48px) 0 0" }}>
          <Reveal>
            <div style={{ borderTop: `2px solid ${ed.hair}`, paddingTop: 18 }}>
              <Label color={META_INK} style={{ display: "block", marginBottom: 12 }}>the fifty thousand dollar package</Label>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: READABLE, margin: 0 }}>
                the rented cinema body, the prime set, the trucks of lighting and grip. it is real, and it buys latitude and control that make hard days easier. that part is worth being honest about, the same way the treated room is real in music.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18 }}>
              <Label color={accent} style={{ display: "block", marginBottom: 12 }}>what you actually control</Label>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: READABLE, margin: 0 }}>
                but the look lives in decisions that cost nothing: where the light comes from, how deep the shadow falls, what you leave in the dark. a window, a bounce, and a black flag will out-shoot a flat room full of gear. the craft is free. it is just hard to master.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── Three honest truths ── */}
        <div style={{ marginTop: "clamp(56px,8vw,104px)" }}>
          <Reveal>
            <Kicker color={accent} style={{ marginBottom: 22 }}>The honest truth</Kicker>
          </Reveal>
          <div className="ctrla-guide-grid">
            {TRUTHS.map((t, i) => (
              <Reveal key={t.n} delay={i * 0.06}>
                <div style={{ borderTop: `2px solid ${ed.ink}`, paddingTop: 18, height: "100%" }}>
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-0.03em", color: accent, display: "block", marginBottom: 10 }}>{t.n}</span>
                  <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.3vw,26px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px" }}>{t.title}</h3>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: READABLE, margin: 0 }}>{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Before the shoot: the location (control the light) ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>Before the lights · the location</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 0" }}>
              Scout for control, not for pretty
            </h3>
          </Reveal>
          <div className="ctrla-guide-split" style={{ marginTop: "clamp(24px,3vw,36px)" }}>
            <Reveal>
              <div style={{ borderTop: `2px solid ${ed.hair}`, paddingTop: 18 }}>
                <Label color={META_INK} style={{ display: "block", marginBottom: 12 }}>why it matters most</Label>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: READABLE, margin: 0 }}>
                  a beautiful room you cannot control will fight you all day. mixed colour from windows and overhead bulbs, sound bouncing off hard walls, no way to place a light where the shot needs it. the location is the room from the music lesson: fix it at the source or pay for it in every frame.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18 }}>
                <Label color={accent} style={{ display: "block", marginBottom: 12 }}>the cheap fix</Label>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: READABLE, margin: 0 }}>
                  pick the spot where you own the light. kill the overheads, flag the window or turn it into your key, and shoot away from the reflective, noisy end of the room. one controllable direction beats a gorgeous space you cannot tame. it costs nothing but the decision.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── The lighting chain, in order ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The ROV lighting chain</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              Build the scene, one light at a time
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: READABLE, margin: 0, maxWidth: 640 }}>
              two lights or ten, budget or blockbuster, the order does not change. add one light, judge it, then add the next. a scene lit in sequence has intention. a scene lit all at once is a guess.
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

          {/* Negative fill explainer (plain language) */}
          <Reveal>
            <div className="ctrla-bus-card" style={{ background: ed.panel, border: `1px solid ${ed.hair}` }}>
              <div>
                <Label color={accent} style={{ display: "block", marginBottom: 12 }}>Plain language</Label>
                <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3.4vw,40px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>So what is negative fill?</h4>
              </div>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.62, color: READABLE, margin: 0 }}>
                negative fill is lighting by taking away. instead of adding a light to the shadow side, you put something black there, a flag, a floppy, a black sheet, to soak up the stray bounce filling that shadow in. the shadow deepens, the face gains shape, and the frame reads three-dimensional. it is the cheapest, most-skipped tool on set: you already own a black jacket. that ratio between the lit side and the dark side is most of the gap between footage that looks like a home video and footage that looks like a film.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── The Light Bench ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The visual that makes it click</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              A scene is three lights
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: READABLE, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 640 }}>
              the lesson our film team teaches on every set. a key for mood, a fill for how deep the shadows fall, a back light for separation. drag each one, ride its intensity and colour, and watch the scene re-light. the readout calls the mood out loud the way a gaffer would.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <LightBench accent={accent} />
          </Reveal>
        </div>

        {/* ── Exposure basics ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>Exposure, the basics</Kicker>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.6, color: READABLE, margin: "12px 0 0", maxWidth: 620 }}>
              once the scene is lit, three things keep the image clean from capture to grade.
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
        <div style={{ marginTop: "clamp(64px,9vw,120px)" }}>
          <Rule color={ed.hair} />
          <Reveal>
            <div style={{ paddingTop: "clamp(22px,3vw,32px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <Kicker color={accent}>Part 02 · The Tools</Kicker>
              <span style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.4, color: READABLE }}>
                now the gear. the bodies, glass, and light our film team runs.
              </span>
            </div>
          </Reveal>
        </div>
      </Bleed>
    </section>
  );
}
