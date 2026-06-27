"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — DESIGN GUIDE
// The founder's design lesson, set in the magazine. The wrong
// question, the brief (purpose / audience / context), the
// moodboard as a decision, the tools as instruments, and the
// senior truth: you can defend every choice. Honest and direct,
// like a senior designer in a crit. House theme: light.
//
// Two parts of one sector: Part 01 The Craft (this guide) and
// Part 02 The Tools (the stations below). Reuses the music
// guide's layout classes so the two toolkits share a system.
//
// NOTE: the interactive centerpiece (the design analog to the
// music page's mix globe) is intentionally not built yet. Its
// slot is marked below; we choose the concept last.
// ═══════════════════════════════════════════════════════

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { edLight as ed, Bleed, Kicker, Label, Rule } from "./editorial";
import DefendDecision from "./DefendDecision";

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

const BRIEF = [
  {
    n: "01",
    title: "purpose",
    body: "what is this trying to do. every color, every typeface, every gap is an answer to this question. the work comes from the brief, not from what looks cool right now.",
  },
  {
    n: "02",
    title: "audience",
    body: "who is it for. a downtown jazz crowd and a saas buyer want completely different things. you are designing for them, not for yourself.",
  },
  {
    n: "03",
    title: "context",
    body: "where does it live. a poster on a wall and a landing page on a phone exist in different worlds. the environment decides as much as the idea does.",
  },
];

const MOODBOARD = [
  { n: "01", name: "typography direction", level: "the voice before the words", body: "serif or sans, sharp or soft, loud or quiet. you are choosing how it speaks before you write a line." },
  { n: "02", name: "color temperature", level: "the mood, not the hex", body: "warm or cool, saturated or muted. the feeling gets locked here, long before any specific color value." },
  { n: "03", name: "texture", level: "how the surface feels", body: "clean and flat, or grain, paper, ink, noise. the difference between a thing that feels digital and one that feels made." },
  { n: "04", name: "density", level: "how much breathes", body: "packed and busy, or open and slow. density sets the pace a person reads at before they read anything." },
  { n: "05", name: "negative space", level: "what you leave out", body: "the most senior decision on the board. confidence is knowing what to remove and trusting the room it leaves." },
  { n: "06", name: "photography style", level: "shot on purpose", body: "lit and graded one way, deliberately. or no photography at all, which is also a decision, not a default." },
];

const TOOLS = [
  { k: "layout", title: "canva", body: "teaches you to place things on a page and make them sit right. it is where most people start, and there is nothing wrong with that." },
  { k: "systems", title: "figma", body: "teaches you why components exist, why constraints matter, and how a thing stays consistent as it scales across screens." },
  { k: "texture and light", title: "photoshop", body: "teaches you why blending modes exist, and how light, surface, and depth actually behave. the craft underneath the comp." },
];

export default function DesignGuide({ accent = ed.plum }: { accent?: string }) {
  return (
    <section style={{ background: "transparent", padding: "clamp(40px,6vw,80px) 0 0" }}>
      <Bleed>
        {/* ── Hero: the wrong question ── */}
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
              maxWidth: 1000,
            }}
          >
            how do i make this look good<br />
            is the wrong question<span style={{ color: accent }}>.</span>
          </h2>
        </Reveal>

        <div className="ctrla-guide-split" style={{ margin: "clamp(28px,4vw,48px) 0 0" }}>
          <Reveal>
            <div style={{ borderTop: `2px solid ${ed.hair}`, paddingTop: 18 }}>
              <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 12 }}>the question everyone asks</Label>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                it is the most common thing a beginner asks, and it is the reason most beginner work looks the same. the question is too open. it assumes the goal is aesthetics. it is not.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18 }}>
              <Label color={accent} style={{ display: "block", marginBottom: 12 }}>the better question</Label>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                design is not decoration. it is decision-making with a visual output. when the work looks good, it is because the right questions got asked first. when it looks like it is trying too hard, they did not.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── The brief: purpose / audience / context ── */}
        <div style={{ marginTop: "clamp(56px,8vw,104px)" }}>
          <Reveal>
            <Kicker color={accent}>Before the pixels · the brief</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              three questions, asked before you open a file
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(28px,4vw,40px)", maxWidth: 640 }}>
              before my friends at scad ever touch a pen or open figma, they answer three things. not a checklist. a way of thinking.
            </p>
          </Reveal>
          <div className="ctrla-guide-grid">
            {BRIEF.map((b, i) => (
              <Reveal key={b.n} delay={i * 0.06}>
                <div style={{ borderTop: `2px solid ${ed.ink}`, paddingTop: 18, height: "100%" }}>
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-0.03em", color: accent, display: "block", marginBottom: 10 }}>{b.n}</span>
                  <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.3vw,26px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px", textTransform: "lowercase" }}>{b.title}</h4>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* The proof: same word "good", two different problems */}
          <div className="ctrla-guide-split" style={{ marginTop: "clamp(32px,4vw,52px)" }}>
            <Reveal>
              <div style={{ borderTop: `2px solid ${ed.hair}`, paddingTop: 18 }}>
                <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 12 }}>a jazz poster downtown</Label>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                  a club, a friday night, printed and stuck on a wall. loud type, texture, ink. it can look incredible and break every rule a product page lives by.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18 }}>
                <Label color={accent} style={{ display: "block", marginBottom: 12 }}>a saas landing page</Label>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                  a startup, a buyer with a budget, read on a screen. clarity, system, restraint. both can look good and share almost nothing, because they solve different problems for different people in different places.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── The moodboard: lock the language ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The step everyone skips · the moodboard</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              lock the language before you make a thing
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 660 }}>
              a moodboard is not an aesthetic pinterest board. it is a decision. you are locking the visual language before any original work starts. pull from anywhere, film stills, architecture, fashion, packaging, editorial. curate until it has a point of view. when every reference feels like it belongs together, it is done. now every choice has a reference point. you are executing, not guessing. here is what the board actually decides.
            </p>
          </Reveal>

          <div className="ctrla-chain">
            {MOODBOARD.map((m, i) => (
              <Reveal key={m.n} delay={Math.min(i * 0.04, 0.2)}>
                <div className="ctrla-chain-step" style={{ borderLeft: `2px solid ${i === 0 ? accent : ed.hair}` }}>
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,3.4vw,42px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: i === 0 ? accent : `${ed.ink}`, opacity: i === 0 ? 1 : 0.32 }}>{m.n}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                      <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.4vw,30px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0, textTransform: "lowercase" }}>{m.name}</h4>
                      <Label color={i === 0 ? accent : ed.inkFaint}>{m.level}</Label>
                    </div>
                    <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 640 }}>{m.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Interactive centerpiece: defend every decision ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The proof · nothing is an accident</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              a poster, defended
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 640 }}>
              here is a real piece, built the way we build, no stock art. tap any part of it and it tells you why it is the size it is, the color it is, where it is. that is the whole job. a junior makes it look nice. a senior can defend every choice on the page.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <DefendDecision accent={accent} />
          </Reveal>
        </div>

        {/* ── The tools as instruments ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>Know your instruments · the tools</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              they are not competing
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(24px,3vw,40px)", maxWidth: 640 }}>
              different instruments, not interchangeable and not rivals. tools do not make the work. understanding what they are doing, and why, makes the work.
            </p>
          </Reveal>
          <div className="ctrla-guide-grid">
            {TOOLS.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.06}>
                <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18, height: "100%" }}>
                  <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 10 }}>{t.k}</Label>
                  <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px", textTransform: "lowercase" }}>{t.title}</h4>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Closer: the senior truth ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent} style={{ marginBottom: 22 }}>Junior to senior</Kicker>
            <p style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,4vw,52px)", lineHeight: 1.04, letterSpacing: "-0.03em", color: ed.ink, margin: 0, maxWidth: 1000, textTransform: "lowercase" }}>
              the gap is not software skill. it is the ability to <span style={{ color: accent }}>defend every decision</span>. why that size, why that color, why that much space between those two things. nothing arbitrary.
            </p>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(20px,2.5vw,28px) 0 0", maxWidth: 620 }}>
              the process before the pixels is what makes that possible. start there.
            </p>
          </Reveal>
        </div>

        {/* ── Chapter handoff: Part 02 · The Tools ── */}
        <div style={{ marginTop: "clamp(64px,9vw,120px)" }}>
          <Rule color={ed.hair} />
          <Reveal>
            <div style={{ paddingTop: "clamp(22px,3vw,32px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <Kicker color={accent}>Part 02 · The Tools</Kicker>
              <span style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.4, color: ed.inkSoft }}>
                now the software. the picks our designers actually reach for.
              </span>
            </div>
          </Reveal>
        </div>
      </Bleed>
    </section>
  );
}
