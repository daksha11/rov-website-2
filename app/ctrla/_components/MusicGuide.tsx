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

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { edLight as ed, Bleed, Kicker, Label, Rule } from "./editorial";
import MixGlobe from "./MixGlobe";

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
    title: "the gap is the room, not the gear",
    body: "the analog compressors and the saturation are real, those rooms have them. but the biggest difference is the room itself. treated walls, a dead space, monitors you trust. gear is the small half of the gap. the room is the big half.",
  },
  {
    n: "02",
    title: "you can close almost all of it",
    body: "here is the good news. the room is also the cheapest part to fix. some of your favorite songs were cut on the go, in a hotel, on a laptop. a fancy camera does not take the photo. the artist does.",
  },
  {
    n: "03",
    title: "order is everything",
    body: "the steps only work in sequence. capture clean, run the chain in order, then master. skip the first step and the rest becomes impossible. this is the part the how-to videos always rush past.",
  },
];

const CHAIN = [
  { n: "00", name: "clean input", level: "the one everyone skips", body: "the room is handled, now the take. pop filter up, about a fist back from the mic, and sing slightly off axis so plosives do not thump the capsule. kill the fan and anything sharp. record with headroom, peaks around -12 to -18, so nothing clips on the way in. more than half the work is here." },
  { n: "01", name: "manual tuning", level: "by hand, graphical", body: "open melodyne or your daw's pitch editor and fix the notes that drift, by eye and by ear. you are correcting a real performance, not leaning on a crutch." },
  { n: "02", name: "the tuner", level: "auto-tune on top", body: "now a real-time tuner rides over honest manual work. set it light when you want it invisible, hard when the locked sound is the whole point." },
  { n: "03", name: "de-esser", level: "tame the harshness", body: "the sharp sss and t sounds stab through a mix. pull them down here. compression later can wake them back up, so do not be surprised if you de-ess again near the end." },
  { n: "04", name: "eq, subtractive", level: "carve the space first", body: "start by taking away. high-pass the rumble, cut what muddies. this corrective pass goes before the compressor so the comp is not reacting to mud. save the bright tonal lifts for after it." },
  { n: "05", name: "compressor", level: "even it out", body: "control the gap between the loud words and the quiet ones so every word lands up front. two gentle compressors in series beat one working hard." },
  { n: "06", name: "multiband compressor", level: "the surgical pass", body: "the same control, split by frequency band. calm one trouble spot, a boomy low or a harsh upper mid, without squashing the whole vocal." },
  { n: "07", name: "saturation", level: "the analog warmth", body: "this is the sound those expensive rooms get for free. a touch of harmonic saturation adds presence and glue, and helps the vocal sit forward without just turning it up." },
  { n: "08", name: "wet effects on a bus", level: "reverb · delay · chorus", body: "depth and width go on last, and they go on a bus, a send, not straight onto the track. that separation is the whole point. it is what keeps every effect under your control." },
  { n: "09", name: "automation", level: "ride it home", body: "the move that does more than any compressor. ride the vocal volume line by line so every single word sits. this is where a good mix quietly becomes a finished one." },
];

const MASTER = [
  { k: "loudness, measured", title: "lufs targets", body: "spotify and youtube rest around -14 lufs, apple music nearer -16. so master for your genre and let each platform turn it down. chasing as loud as humanly possible just crushes your dynamics for nothing. meter it with something free like youlean, do not guess." },
  { k: "borrow good ears", title: "reference tracks", body: "pull a song you love in the same lane and match your master to it. but loudness-match first. the louder track always sounds better for the wrong reason. trust the reference over your own ears, which start lying after an hour." },
  { k: "the last gate", title: "true peak limiting", body: "catch the peaks so nothing clips when the file gets converted to mp3 or aac. keep a ceiling around -1 dbtp and your master stays clean on every speaker it lands on." },
];

export default function MusicGuide({ accent = ed.amber }: { accent?: string }) {
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
            the bedroom and the big room are<br />
            closer than they tell you<span style={{ color: accent }}>.</span>
          </h2>
        </Reveal>

        <div className="ctrla-guide-split" style={{ margin: "clamp(28px,4vw,48px) 0 0" }}>
          <Reveal>
            <div style={{ borderTop: `2px solid ${ed.hair}`, paddingTop: 18 }}>
              <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 12 }}>the hundred thousand dollar room</Label>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                what separates a sony studio downtown from your setup is mostly one thing, and it is not a magic plugin. it is a treated room and the gear that colors a clean signal. the analog compressors, the saturation, the limiters. that part is true, and worth being honest about.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18 }}>
              <Label color={accent} style={{ display: "block", marginBottom: 12 }}>your room</Label>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                but a fancy camera does not take a great photo, and fancy gear does not make great music. the artist does. we can recreate almost all of that quality at home. the process is simple, it is just hard to master. that is what we are here for.
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
                  <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.3vw,26px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px", textTransform: "lowercase" }}>{t.title}</h3>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── The room (the real gap, the cheap fix) ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>Before the chain · the room</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 0" }}>
              fix the room before you touch a plugin
            </h3>
          </Reveal>
          <div className="ctrla-guide-split" style={{ marginTop: "clamp(24px,3vw,36px)" }}>
            <Reveal>
              <div style={{ borderTop: `2px solid ${ed.hair}`, paddingTop: 18 }}>
                <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 12 }}>why it matters most</Label>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                  the single biggest gap between your setup and a hundred thousand dollar room is the room itself. an untreated space bounces sound back into the mic and bakes reverb into your take before you have done anything. you cannot eq your way out of a bad room, so you fix it at the source.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18 }}>
                <Label color={accent} style={{ display: "block", marginBottom: 12 }}>the cheap fix</Label>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                  sing into the dead end of the room, never a corner, never a window or a glass table. hang a thick blanket behind you and to the sides to kill the first reflections. a closet full of clothes beats a big empty bedroom every time. it costs almost nothing and it closes most of the gap.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── The vocal chain, in order ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The ROV vocal chain</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              the chain, start to finish
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 640 }}>
              free or paid, bandlab or garageband, the order does not change. run it top to bottom and the voice that comes out the other side sounds like a record.
            </p>
          </Reveal>

          <div className="ctrla-chain">
            {CHAIN.map((s, i) => (
              <Reveal key={s.n} delay={Math.min(i * 0.04, 0.2)}>
                <div className="ctrla-chain-step" style={{ borderLeft: `2px solid ${i === 0 ? accent : ed.hair}` }}>
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,3.4vw,42px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: i === 0 ? accent : `${ed.ink}`, opacity: i === 0 ? 1 : 0.32 }}>{s.n}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                      <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.4vw,30px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0, textTransform: "lowercase" }}>{s.name}</h4>
                      <Label color={i === 0 ? accent : ed.inkFaint}>{s.level}</Label>
                    </div>
                    <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 640 }}>{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bus explainer */}
          <Reveal>
            <div className="ctrla-bus-card" style={{ background: ed.panel, border: `1px solid ${ed.hair}` }}>
              <div>
                <Label color={accent} style={{ display: "block", marginBottom: 12 }}>Plain language</Label>
                <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3.4vw,40px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0, textTransform: "lowercase" }}>so what is a bus, actually?</h4>
              </div>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.62, color: ed.inkSoft, margin: 0 }}>
                a bus is just a separate mixer track you send sound to. instead of dropping reverb straight onto your vocal, you send a copy of it to a reverb bus. now you control the wet and the dry apart, you can run many things through one shared space, and your main track stays clean. pro touch: high-pass that reverb bus so it does not muddy the low end, and duck it under the dry vocal so depth never costs you clarity. it is most of the gap between a mix that sounds like a hobby and one that sounds like a release.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── Mix as a globe ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The visual that makes it click</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              your song is a 3d globe
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 640 }}>
              the lesson i teach every artist. the front sounds are dry and in your face. wet effects like reverb and delay send things to the back. panning moves them left and right. spin it, tap a sound, and watch every element claim its own pocket of space.
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
            <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: "12px 0 0", maxWidth: 620 }}>
              master from a mix with headroom, around -6 db on the master, then three things matter.
            </p>
          </Reveal>
          <div className="ctrla-guide-grid" style={{ marginTop: "clamp(24px,3vw,40px)" }}>
            {MASTER.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.06}>
                <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18, height: "100%" }}>
                  <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 10 }}>{m.k}</Label>
                  <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.4vw,28px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px", textTransform: "lowercase" }}>{m.title}</h3>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>{m.body}</p>
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
              <span style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.4, color: ed.inkSoft }}>
                now the gear. the picks our engineers actually run.
              </span>
            </div>
          </Reveal>
        </div>
      </Bleed>
    </section>
  );
}
