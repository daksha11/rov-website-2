"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE MEDICINE CABINET  (Web Dev toolkit · Part 03)
// The custom Claude Code skills we actually built for this repo,
// shelved like a medicine cabinet. Each skill is a prescription
// bottle: funny name on the label, a real job inside. The strength
// rating (Aspirin / Advil / Migraine) is the same headache scale the
// skills themselves score with, so the site and the tools speak the
// same language.
//
// Interaction: hover (desktop) or tap (touch) flips the label to the
// back — active ingredient, side effects it prevents, a warning in
// the ROV voice. Reuses the light editorial system so it sits in the
// same magazine as Parts 01 and 02.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { edLight as ed, Bleed, Kicker, Rule, Label } from "./editorial";

// Strength scale — the headache score, as pill grades. Muted to sit on cream.
const GRADE = {
  1: { name: "Aspirin", color: "#5C7C5A" }, // low risk, take freely
  2: { name: "Advil", color: "#B9793A" }, // real, respect it
  3: { name: "Migraine", color: "#90422C" }, // stop and plan
} as const;

type Level = keyof typeof GRADE;

type Skill = {
  rx: string;
  level: Level;
  strengthNote?: string; // overrides the plain grade name on the label
  take: string; // "take when"
  dose: string; // directions, mono
  ingredient: string; // what it actually does
  prevents: string[]; // side effects it prevents
  warning: string; // ROV-voice fine print
  live?: boolean; // shipped vs. in the lab
};

const SKILLS: Skill[] = [
  {
    rx: "will-this-give-me-a-headache",
    level: 3,
    strengthNote: "Migraine-grade",
    take: "Before you move, rename, split, or delete anything with reach.",
    dose: "1 run before any big structural change",
    ingredient:
      "Maps the full blast radius of a change across code, routes, SEO, data, and infra, then sorts every break by when it hits: now, soon, or the quiet tax later.",
    prevents: ["Broken links", "Dead imports", "Lost SEO", "Stale .next cache", "Orphaned redirects"],
    warning: "Read-only. It tells you what the change costs in Advil. It does not make the change.",
    live: true,
  },
  {
    rx: "is-this-actually-done",
    level: 2,
    take: "When you think a feature is finished and want to ship.",
    dose: "1 run before you call it done",
    ingredient:
      "Checks the stuff that feels done but isn't: missing metadata and layout on new pages, sitemap gaps, leftover TODOs, undocumented env vars, orphaned imports.",
    prevents: ["Ships-green-breaks-Monday", "Sitemap gaps", "Leftover TODOs", "Undocumented env"],
    warning: "The friend who asks 'did you test it on mobile?' before you tell the client it's live.",
  },
  {
    rx: "does-this-sound-like-us",
    level: 1,
    take: "Before any copy leaves the building.",
    dose: "1 run per piece of writing",
    ingredient:
      "Runs copy against the ROV voice guardrails: grounded, warm, refined. Kills em dashes, flags LinkedIn-slop and 3am-infomercial sentences, checks pages against the blog design standard.",
    prevents: ["Em dashes", "LinkedIn-slop", "Off-voice sentences", "Cheap CTAs"],
    warning: "Brand police for words and pixels. It will make you rewrite the sentence you loved.",
  },
  {
    rx: "did-i-leave-the-oven-on",
    level: 2,
    take: "At the end of a work session, before you walk away.",
    dose: "1 run when you're done for the day",
    ingredient:
      "End-of-session sweep for the stuff you forgot: uncommitted work, half-finished edits, stray console.logs, commented-out blocks, scratch files, a branch you didn't mean to be on.",
    prevents: ["Uncommitted work", "Stray console.log", "Debug blocks", "Wrong-branch commits"],
    warning: "Peace of mind in a bottle. Run it so tomorrow-you doesn't inherit today-you's mess.",
  },
  {
    rx: "am-i-overengineering-this",
    level: 3,
    take: "When you're three abstractions deep and it feels clever.",
    dose: "As needed, at the first 'let me just make this generic'",
    ingredient:
      "Asks if the boring version is better. Finds premature generalization and the clever-but-fragile path, then proposes the smaller thing that actually ships.",
    prevents: ["Premature abstraction", "Config for one caller", "The fragile clever version"],
    warning: "Reality-check, not a hater. Sometimes the answer is 'no, you're fine' and that's the point.",
  },
];

// A single prescription bottle — front label flips to the back on hover/tap.
function Bottle({ skill, accent, delay }: { skill: Skill; accent: string; delay: number }) {
  const [flipped, setFlipped] = useState(false);
  const grade = GRADE[skill.level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      style={{ perspective: 1200 }}
    >
      <button
        type="button"
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped((v) => !v)}
        aria-expanded={flipped}
        aria-label={`${skill.rx} — ${grade.name} strength. ${flipped ? "Showing details." : "Tap for details."}`}
        style={{
          appearance: "none",
          border: "none",
          background: "transparent",
          padding: 0,
          margin: 0,
          width: "100%",
          height: "100%",
          minHeight: 300,
          cursor: "pointer",
          textAlign: "left",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          transform: flipped ? "rotateY(180deg)" : "none",
        }}
      >
        {/* ── FRONT: the label ── */}
        <span style={faceStyle(false)}>
          {/* Cap strip — strength colour band across the top of the bottle */}
          <span aria-hidden style={{ position: "absolute", inset: "0 0 auto 0", height: 8, background: grade.color, borderRadius: "13px 13px 0 0" }} />

          <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <Label color={ed.inkFaint} style={{ fontSize: 10 }}>℞ · CTRL-A LABS</Label>
            <StrengthDots level={skill.level} color={grade.color} />
          </span>

          <span
            style={{
              display: "block",
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(19px,2.2vw,25px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
              color: ed.ink,
              margin: "16px 0 0",
              wordBreak: "break-word",
            }}
          >
            {skill.rx}
          </span>

          <span style={{ display: "block", marginTop: 10 }}>
            <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: 13, color: grade.color }}>
              {skill.strengthNote ?? `${grade.name} strength`}
            </span>
          </span>

          {/* Perforated divider — the tear line on a label */}
          <span aria-hidden style={{ display: "block", margin: "16px 0", borderTop: `1.5px dashed ${ed.hair}` }} />

          <span style={{ display: "block" }}>
            <Label color={accent} style={{ fontSize: 10 }}>Take when</Label>
            <span style={{ display: "block", fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.5, color: ed.inkSoft, margin: "7px 0 0" }}>
              {skill.take}
            </span>
          </span>

          <span style={{ display: "block", marginTop: "auto", paddingTop: 16 }}>
            <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.06em", color: ed.inkFaint }}>
              DIRECTIONS · {skill.dose}
            </span>
          </span>

          <span aria-hidden style={{ position: "absolute", right: 16, bottom: 14, fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.14em", color: accent }}>
            {skill.live ? "IN STOCK" : "IN THE LAB"} · FLIP →
          </span>
        </span>

        {/* ── BACK: active ingredient + side effects it prevents ── */}
        <span style={faceStyle(true)}>
          <span aria-hidden style={{ position: "absolute", inset: "0 0 auto 0", height: 8, background: grade.color, borderRadius: "13px 13px 0 0" }} />

          <Label color={ed.inkFaint} style={{ fontSize: 10 }}>Active ingredient</Label>
          <span style={{ display: "block", fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.5, color: ed.ink, margin: "9px 0 0" }}>
            {skill.ingredient}
          </span>

          <span style={{ display: "block", marginTop: 16 }}>
            <Label color={grade.color} style={{ fontSize: 10 }}>Prevents</Label>
            <span style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 9 }}>
              {skill.prevents.map((p) => (
                <span
                  key={p}
                  style={{
                    fontFamily: ed.mono,
                    fontSize: 11,
                    letterSpacing: "0.02em",
                    color: ed.inkSoft,
                    border: `1px solid ${ed.hair}`,
                    borderRadius: 999,
                    padding: "3px 9px",
                  }}
                >
                  {p}
                </span>
              ))}
            </span>
          </span>

          <span style={{ display: "block", marginTop: "auto", paddingTop: 16 }}>
            <span aria-hidden style={{ display: "block", marginBottom: 8, borderTop: `1.5px dashed ${ed.hair}` }} />
            <span style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(12.5px,1.4vw,14px)", lineHeight: 1.45, color: ed.inkFaint }}>
              ⚠ {skill.warning}
            </span>
          </span>
        </span>
      </button>
    </motion.div>
  );
}

// Three dosage dots, filled up to the strength level.
function StrengthDots({ level, color }: { level: Level; color: string }) {
  return (
    <span aria-hidden style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: i <= level ? color : "transparent",
            border: `1.5px solid ${i <= level ? color : ed.hair}`,
          }}
        />
      ))}
    </span>
  );
}

// Shared face styling for the two sides of the flip card.
function faceStyle(back: boolean): CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    padding: "22px 18px 18px",
    background: ed.ground,
    border: `1px solid ${ed.hair}`,
    borderRadius: 14,
    boxShadow: "0 1px 0 rgba(22,12,40,0.04), 0 18px 40px -30px rgba(22,12,40,0.5)",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: back ? "rotateY(180deg)" : "none",
    overflow: "hidden",
  };
}

export default function MedicineCabinet({ accent = ed.plum }: { accent?: string }) {
  return (
    <section style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0 clamp(40px,6vw,72px)" }}>
      <Bleed>
        <Rule color={ed.hair} />
        <div style={{ paddingTop: "clamp(28px,4vw,44px)" }}>
          <Kicker color={accent}>Part 03 · The Cabinet</Kicker>
          <h2
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(30px,5vw,64px)",
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
              color: ed.ink,
              margin: "16px 0 0",
              maxWidth: 900,
            }}
          >
            Skills we actually take<span style={{ color: accent }}>.</span>
          </h2>
          <p
            style={{
              fontFamily: ed.body,
              fontSize: "clamp(15px,1.7vw,19px)",
              lineHeight: 1.6,
              color: ed.inkSoft,
              margin: "clamp(16px,2vw,22px) 0 0",
              maxWidth: 640,
            }}
          >
            Custom Claude Code skills we built for this exact repo. Funny name on the label, dead-serious job inside.
            The strength rating is the same headache scale the skills score with. Take as needed.
          </p>
        </div>

        {/* The shelf */}
        <div
          style={{
            marginTop: "clamp(28px,4vw,48px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "clamp(14px,1.6vw,20px)",
          }}
        >
          {SKILLS.map((s, i) => (
            <Bottle key={s.rx} skill={s} accent={accent} delay={i * 0.05} />
          ))}
        </div>

        {/* Strength legend — reads the pill dots */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 22px", marginTop: "clamp(20px,2.5vw,30px)" }}>
          <Label color={ed.inkFaint}>Strength</Label>
          {(Object.keys(GRADE) as unknown as Level[]).map((lvl) => (
            <span key={lvl} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <StrengthDots level={lvl} color={GRADE[lvl].color} />
              <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.06em", color: ed.inkSoft }}>
                {GRADE[lvl].name.toUpperCase()}
              </span>
            </span>
          ))}
        </div>
      </Bleed>
    </section>
  );
}
