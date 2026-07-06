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

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "12px 0 0" }}>
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

// Each question carries its meaning plus how the two example briefs answer
// it, so selecting a question tells a small story instead of listing facts.
const BRIEF = [
  {
    n: "01",
    title: "Purpose",
    prompt: "what is this trying to do",
    body: "Every color, every typeface, every gap is an answer to this. The work comes from the brief, not from what looks cool right now.",
    jazz: "Sell out a Friday night. Make someone stop on the street and feel the noise before they read the date.",
    saas: "Earn a busy buyer's demo. Remove doubt, don't add flourish.",
  },
  {
    n: "02",
    title: "Audience",
    prompt: "who is it for",
    body: "A downtown jazz crowd and a SaaS buyer want completely different things. You are designing for them, not for yourself.",
    jazz: "Night people walking past, half-distracted. They answer to energy and mood, not bullet points.",
    saas: "A decision-maker with a budget and no time. They answer to clarity, proof, and restraint.",
  },
  {
    n: "03",
    title: "Context",
    prompt: "where does it live",
    body: "A poster on a wall and a landing page on a phone exist in different worlds. The environment decides as much as the idea does.",
    jazz: "Printed, pasted on a wall, seen from six feet away at night. It can shout.",
    saas: "A phone screen at a desk, one tab of many. It has to be calm and instantly legible.",
  },
];

const BRIEF_EXAMPLES = {
  jazz: { label: "A jazz poster, downtown", tone: "loud · texture · ink" },
  saas: { label: "A SaaS landing page", tone: "clarity · system · restraint" },
};

const MOODBOARD = [
  { n: "01", name: "Typography direction", level: "the voice before the words", body: "Serif or sans, sharp or soft, loud or quiet. You are choosing how it speaks before you write a line." },
  { n: "02", name: "Color temperature", level: "the mood, not the hex", body: "Warm or cool, saturated or muted. The feeling gets locked here, long before any specific color value." },
  { n: "03", name: "Texture", level: "how the surface feels", body: "Clean and flat, or grain, paper, ink, noise. The difference between a thing that feels digital and one that feels made." },
  { n: "04", name: "Density", level: "how much breathes", body: "Packed and busy, or open and slow. Density sets the pace a person reads at before they read anything." },
  { n: "05", name: "Negative space", level: "what you leave out", body: "The most senior decision on the board. Confidence is knowing what to remove and trusting the room it leaves." },
  { n: "06", name: "Photography style", level: "shot on purpose", body: "Lit and graded one way, deliberately. Or no photography at all, which is also a decision, not a default." },
];

const TOOLS = [
  { k: "layout", title: "Canva", body: "Teaches you to place things on a page and make them sit right. It is where most people start, and there is nothing wrong with that." },
  { k: "systems", title: "Figma", body: "Teaches you why components exist, why constraints matter, and how a thing stays consistent as it scales across screens." },
  { k: "texture and light", title: "Photoshop", body: "Teaches you why blending modes exist, and how light, surface, and depth actually behave. The craft underneath the comp." },
];

// The brief, made interactive: the three questions become a selector.
// Hover to preview, click to hold. Choosing one reveals what it means and
// shows the two example briefs answering that same question differently, so
// the reader feels the thesis (one goal, different answers) instead of reading it.
function InteractiveBrief({ accent }: { accent: string }) {
  const [selected, setSelected] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? selected;
  const q = BRIEF[active];

  return (
    <div>
      {/* Selector — three questions */}
      <div className="ctrla-guide-grid" onMouseLeave={() => setHover(null)}>
        {BRIEF.map((b, i) => {
          const on = active === i;
          return (
            <button
              key={b.n}
              type="button"
              onClick={() => setSelected(i)}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-pressed={on}
              style={{ textAlign: "left", background: "none", border: "none", borderTop: `2px solid ${on ? accent : ed.hair}`, padding: "16px 0 0", cursor: "pointer", width: "100%", transition: "border-color .3s ease" }}
            >
              <span style={{ display: "block", fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-0.03em", color: on ? accent : ed.ink, opacity: on ? 1 : 0.26, transition: "color .3s ease, opacity .3s ease", marginBottom: 8 }}>{b.n}</span>
              <span style={{ display: "block", fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.3vw,26px)", letterSpacing: "-0.02em", color: ed.ink, marginBottom: 6 }}>{b.title}</span>
              <span style={{ display: "block", fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.14em", textTransform: "uppercase", color: on ? accent : ed.inkFaint, transition: "color .3s ease" }}>{b.prompt}</span>
            </button>
          );
        })}
      </div>

      {/* Stage — the active question's meaning + the two briefs answering it */}
      <div style={{ marginTop: "clamp(28px,4vw,44px)", minHeight: 200 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={q.n}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <p style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(18px,2.2vw,26px)", lineHeight: 1.4, letterSpacing: "-0.01em", color: ed.ink, margin: "0 0 clamp(22px,3vw,34px)", maxWidth: 760 }}>
              {q.body}
            </p>
            <div className="ctrla-guide-split">
              <div style={{ borderTop: `2px solid ${ed.hair}`, paddingTop: 18 }}>
                <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 6 }}>{BRIEF_EXAMPLES.jazz.label}</Label>
                <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 14, opacity: 0.65 }}>{BRIEF_EXAMPLES.jazz.tone}</Label>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>{q.jazz}</p>
              </div>
              <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18 }}>
                <Label color={accent} style={{ display: "block", marginBottom: 6 }}>{BRIEF_EXAMPLES.saas.label}</Label>
                <Label color={accent} style={{ display: "block", marginBottom: 14, opacity: 0.7 }}>{BRIEF_EXAMPLES.saas.tone}</Label>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>{q.saas}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <p style={{ fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.18em", textTransform: "uppercase", color: ed.inkFaint, margin: "clamp(18px,2.4vw,28px) 0 0" }}>
        Hover or tap a question · one goal, two briefs, two answers
      </p>
    </div>
  );
}

// The moodboard chain lights up as you scroll: the step crossing the center
// of the viewport becomes active (accent number, border, and label; full
// opacity), the rest recede. Driven by an IntersectionObserver on a thin
// center band so exactly one step reads as "current" at a time.
function MoodboardChain({ accent }: { accent: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.idx));
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="ctrla-chain">
      {MOODBOARD.map((m, i) => {
        const on = i === active;
        return (
          <Reveal key={m.n} delay={Math.min(i * 0.04, 0.2)}>
            <div
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-idx={i}
              className="ctrla-chain-step"
              style={{ borderLeft: `2px solid ${on ? accent : ed.hair}`, transition: "border-color .45s ease" }}
            >
              <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,3.4vw,42px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: on ? accent : ed.ink, opacity: on ? 1 : 0.3, transition: "color .45s ease, opacity .45s ease" }}>{m.n}</span>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.4vw,30px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0, opacity: on ? 1 : 0.6, transition: "opacity .45s ease" }}>{m.name}</h4>
                  <Label color={on ? accent : ed.inkFaint}>{m.level}</Label>
                </div>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 640, opacity: on ? 1 : 0.72, transition: "opacity .45s ease" }}>{m.body}</p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

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
            How do I make this look good<br />
            is the wrong question<span style={{ color: accent }}>.</span>
          </h2>
        </Reveal>

        <div className="ctrla-guide-split" style={{ margin: "clamp(28px,4vw,48px) 0 0" }}>
          <Reveal>
            <Disclosure label="the question everyone asks" color={ed.inkFaint}>
              Too open a question, and the reason most beginner work looks the same. It assumes the goal is <em style={{ fontStyle: "italic", color: accent }}>aesthetics</em>. It is not.
            </Disclosure>
          </Reveal>
          <Reveal delay={0.08}>
            <Disclosure label="the better question" color={accent}>
              Design is <em style={{ fontStyle: "italic", color: accent }}>decision-making with a visual output</em>, not decoration. When it looks good, the right questions got asked first.
            </Disclosure>
          </Reveal>
        </div>

        {/* ── The brief: purpose / audience / context ── */}
        <div style={{ marginTop: "clamp(56px,8vw,104px)" }}>
          <Reveal>
            <Kicker color={accent}>Before the pixels · the brief</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              Three questions, asked before you open a file
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(28px,4vw,40px)", maxWidth: 640 }}>
              Before my friends at SCAD ever touch a pen or open Figma, they answer three things. Not a checklist. A way of thinking.
            </p>
          </Reveal>
          <Reveal>
            <InteractiveBrief accent={accent} />
          </Reveal>
        </div>

        {/* ── The moodboard: lock the language ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The step everyone skips · the moodboard</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              Lock the language before you make a thing
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 660 }}>
              A moodboard is not a Pinterest board, it is <em style={{ fontStyle: "italic", color: accent }}>a decision</em>. Lock the visual language before any original work starts, so every choice has a reference point and you are executing, not guessing. Here is what the board actually decides.
            </p>
          </Reveal>

          <MoodboardChain accent={accent} />
        </div>

        {/* ── Interactive centerpiece: defend every decision ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The proof · a poster you can play</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              A poster, defended
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 640 }}>
              A real piece, built the way we build, no stock art. Play the bench, swap the palette, and tap any part to hear why it is the size, color, and place it is. A junior makes it look nice, a senior can <em style={{ fontStyle: "italic", color: accent }}>defend every choice</em>.
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
              They are not competing
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(24px,3vw,40px)", maxWidth: 640 }}>
              Different instruments, not interchangeable and not rivals. Tools do not make the work. Understanding what they are doing, and why, makes the work.
            </p>
          </Reveal>
          <div className="ctrla-guide-grid">
            {TOOLS.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.06}>
                <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18, height: "100%" }}>
                  <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 10 }}>{t.k}</Label>
                  <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px" }}>{t.title}</h4>
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
            <p style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,4vw,52px)", lineHeight: 1.04, letterSpacing: "-0.03em", color: ed.ink, margin: 0, maxWidth: 1000 }}>
              The gap is not software skill. It is the ability to <span style={{ color: accent }}>defend every decision</span>. Why that size, why that color, why that much space between those two things. Nothing arbitrary.
            </p>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(20px,2.5vw,28px) 0 0", maxWidth: 620 }}>
              The process before the pixels is what makes that possible. Start there.
            </p>
          </Reveal>
        </div>

        {/* ── Chapter handoff: Part 02 · The Tools ── */}
        <div style={{ marginTop: "clamp(64px,9vw,120px)" }}>
          <Rule color={ed.hair} />
          <Reveal>
            <div style={{ paddingTop: "clamp(22px,3vw,32px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <Kicker color={accent}>Part 02 · The Tools</Kicker>
              <span style={{ fontFamily: ed.body, fontStyle: "normal", fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.4, color: ed.inkSoft }}>
                Now the software. The picks our designers <em style={{ fontStyle: "italic", color: accent }}>actually reach for</em>.
              </span>
            </div>
          </Reveal>
        </div>
      </Bleed>
    </section>
  );
}
