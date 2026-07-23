"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — DEV GUIDE
// The founder's take on building in the AI era. The shift is
// already here and cuts two ways (create vs build), the trap is
// mistaking speed for progress, and the foundation under all of
// it is prompt engineering. Plus the living Claude crash course.
// Honest and direct. House theme: light.
//
// Two parts of one sector: Part 01 The Craft (this guide) and
// Part 02 The Tools (the stations below). Reuses the music and
// design guide layout classes so all three toolkits share a system.
//
// The interactive centerpiece (the dev analog to the music globe)
// is the Prompt Mixer, embedded under "the foundation" below: an
// instrument that assembles, scores live, and shares to a URL.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";
import { edLight as ed, Bleed, Kicker, Label, Rule } from "./editorial";
import PromptVault from "./PromptVault";
import BuildIdeas from "./BuildIdeas";
import ToolkitJumpNav from "./ToolkitJumpNav";

// Chapter list for the shared sticky jump-nav.
const CHAPTERS: [string, string][] = [
  ["dv-craft", "The Vault"],
  ["dv-thesis", "The Thesis"],
  ["dv-prompting", "Prompting"],
  ["dv-course", "Claude Code"],
  ["tk-stations", "The Stations"],
];

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
          <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.3vw,26px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>{title}</h4>
          <span className="ctrla-truth-plus" aria-hidden style={{ color: accent }}>+</span>
        </div>
        <div className="ctrla-truth-body" style={{ display: "grid", gridTemplateRows: "0fr", transition: "grid-template-rows 0.34s cubic-bezier(0.22,1,0.36,1)" }}>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: ed.inkSoft, margin: "12px 0 0" }}>{body}</p>
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
          <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "12px 0 0" }}>
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

const TRAP = [
  {
    n: "01",
    title: "The noise",
    body: "Agents, pipelines, systems that supposedly do everything for you. We have tried most of them, so you do not have to.",
  },
  {
    n: "02",
    title: "The cost",
    body: "Tokens cost money, time costs more. Without intention, all that automation is just an expensive way to produce slop.",
  },
  {
    n: "03",
    title: "Faster is not better",
    body: "An AI building the wrong thing faster is not progress. Speed without direction gets you to the wrong place sooner.",
  },
];

const COURSE = [
  { k: "reusable context", title: "Skill files", body: "Instructions and context you hand it once, so it knows how you work before you ask for anything." },
  { k: "one keystroke", title: "Slash commands", body: "Your repeatable moves saved as a command. A paragraph of setup becomes one word." },
  { k: "hand it off", title: "Subagents", body: "Send a whole task to a focused agent, and run several at once while you keep moving." },
  { k: "scripted jobs", title: "Workflows", body: "Multi step work scripted to run the same way every time, no babysitting required." },
  { k: "wire it in", title: "MCP tools", body: "Connect it to the apps you already use, so it can act, not just talk." },
  { k: "more for less", title: "Efficiency patterns", body: "Better output for fewer tokens and less back and forth. The line between a tool and a money pit." },
];

export default function DevGuide({ accent = ed.plum }: { accent?: string }) {
  return (
    <section style={{ background: "transparent", padding: 0 }}>
      <ToolkitJumpNav accent={accent} items={CHAPTERS} />
      <Bleed style={{ paddingTop: "clamp(40px,6vw,80px)" }}>
        {/* ── Hero: mission + the centerpiece, playable at scroll-zero ── */}
        <div id="dv-craft" style={{ scrollMarginTop: 64 }} />
        <Reveal>
          <Kicker color={accent}>The Dev Toolkit · Part 01 The Craft</Kicker>
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
            Tutorial hell to shipped, the gap is smaller than they tell you<span style={{ color: accent }}>.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <p style={{ fontFamily: ed.body, fontStyle: "normal", fontSize: "clamp(16px,2vw,24px)", lineHeight: 1.45, color: ed.inkSoft, margin: "clamp(16px,2.4vw,26px) 0 0", maxWidth: 800 }}>
            We teach the prompts, the workflow, and the tools that close it. Start here: the vault. <em style={{ fontStyle: "italic", color: accent }}>Steal the exact prompts we run</em>, then direct the output like a senior.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ marginTop: "clamp(22px,3.2vw,40px)" }}>
            <PromptVault />
          </div>
        </Reveal>

        {/* ── The thesis: the shift is already here ── */}
        <div id="dv-thesis" style={{ marginTop: "clamp(40px,5.5vw,76px)", scrollMarginTop: 64 }}>
          <Reveal>
            <Kicker color={accent}>The thesis</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 0", maxWidth: 900 }}>
              AI is coming for development. It already did
            </h3>
          </Reveal>
        </div>

        <div className="ctrla-guide-split" style={{ margin: "clamp(28px,4vw,48px) 0 0" }}>
          <Reveal>
            <Disclosure label="if you create" color={ed.inkFaint}>
              The gap between an idea and a working thing has never been lower. Whole experiences that used to need a team are <em style={{ fontStyle: "italic", color: accent }}>reachable right now</em>, if you know how to work the tools.
            </Disclosure>
          </Reveal>
          <Reveal delay={0.08}>
            <Disclosure label="if you build" color={accent}>
              Even senior engineers are not writing code line by line anymore. The skill moved up a level, from writing to <em style={{ fontStyle: "italic", color: accent }}>directing the output</em>, and catching it when it is wrong.
            </Disclosure>
          </Reveal>
        </div>

        {/* ── The trap ── */}
        <div style={{ marginTop: "clamp(40px,5.5vw,72px)" }}>
          <Reveal>
            <Kicker color={accent}>Where most people get it wrong</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 clamp(28px,4vw,40px)", maxWidth: 900 }}>
              The trap is mistaking speed for progress
            </h3>
          </Reveal>
          <div className="ctrla-guide-grid">
            {TRAP.map((t, i) => (
              <TruthCard key={t.n} n={t.n} title={t.title} body={t.body} accent={accent} delay={i * 0.06} />
            ))}
          </div>
        </div>

        {/* ── The foundation: prompt engineering ── */}
        <div id="dv-prompting" style={{ marginTop: "clamp(40px,5.5vw,76px)", scrollMarginTop: 64 }}>
          <Reveal>
            <Kicker color={accent}>The foundation · prompt engineering</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              The real skill is saying exactly what you mean
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 660 }}>
              Not the buzzword version. The actual skill of saying precisely what you want, with the right context and constraints, so the output is something you can use. It is <em style={{ fontStyle: "italic", color: accent }}>the most transferable skill</em> in this space right now. The vault at the top of this page is it, in practice.
            </p>
          </Reveal>
        </div>

        {/* ── The Claude Code crash course (its own chapter) ── */}
        <div id="dv-course" style={{ marginTop: "clamp(40px,5.5vw,76px)", scrollMarginTop: 64 }}>
          <Reveal>
            <Kicker color={accent}>The living course · Claude Code</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              The Claude Code crash course
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(24px,3vw,40px)", maxWidth: 660 }}>
              Claude Code is the tool we actually build in. This is the crash course, the real moves from our sessions, not the version posted for engagement. It updates with every shift, and more lands every month.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <a href="/ctrla/claude-code" className="ctrla-course-strip" aria-label="Open the full Claude Code course">
              <div className="ctrla-course-track">
                {COURSE.map((c, i) => (
                  <div key={c.title} className="ctrla-course-chip">
                    <span className="ctrla-course-chip-n" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
                    <div className="ctrla-course-chip-t" style={{ color: ed.ink, marginTop: 4 }}>{c.title}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 16, paddingTop: 14, borderTop: `1px solid ${ed.hair}` }}>
                <Label color={ed.inkFaint}>Six chapters · plus models, systems, and token craft</Label>
                <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(14px,1.6vw,17px)", letterSpacing: "-0.01em", color: accent, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  Open the full course <span className="ctrla-course-arrow" aria-hidden>→</span>
                </span>
              </div>
            </a>
          </Reveal>
        </div>

        {/* ── Applied: what you can build ── */}
        <div style={{ marginTop: "clamp(40px,5.5vw,76px)" }}>
          <Reveal>
            <Kicker color={accent}>Proof · what you can build</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              Beautiful things, no team required
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 660 }}>
              This is the whole point. The stuff that used to need a developer, or a whole team, is reachable now. Here is the range, and the kind of thing you would ask for.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <BuildIdeas accent={accent} />
          </Reveal>
        </div>

        {/* ── Closer: the window is open ── */}
        <div style={{ marginTop: "clamp(40px,5.5vw,76px)" }}>
          <Reveal>
            <Kicker color={accent} style={{ marginBottom: 22 }}>The window is open</Kicker>
            <p style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,4vw,52px)", lineHeight: 1.04, letterSpacing: "-0.03em", color: ed.ink, margin: 0, maxWidth: 1000 }}>
              The creative who learns to build right now, even imperfectly, has an <span style={{ color: accent }}>unfair advantage</span> for the next several years.
            </p>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(20px,2.5vw,28px) 0 0", maxWidth: 620 }}>
              The window is open. This is how we think about walking through it.
            </p>
          </Reveal>
        </div>

        {/* ── Chapter handoff: Part 02 · The Tools ── */}
        <div style={{ marginTop: "clamp(44px,6vw,84px)" }}>
          <Rule color={ed.hair} />
          <Reveal>
            <div style={{ paddingTop: "clamp(22px,3vw,32px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <Kicker color={accent}>Part 02 · The Tools</Kicker>
              <span style={{ fontFamily: ed.body, fontStyle: "normal", fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.4, color: ed.inkSoft }}>
                Now the stack. The tools we build and ship client work <em style={{ fontStyle: "italic", color: accent }}>on</em>.
              </span>
            </div>
          </Reveal>
        </div>
      </Bleed>
    </section>
  );
}
