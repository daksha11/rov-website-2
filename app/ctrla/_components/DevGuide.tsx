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
// NOTE: the interactive centerpiece (the dev analog to the music
// globe and the design poster) is intentionally not built yet.
// Its slot is marked below; we choose the concept last.
// ═══════════════════════════════════════════════════════

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { edLight as ed, Bleed, Kicker, Label, Rule } from "./editorial";
import PromptVault from "./PromptVault";
import BuildIdeas from "./BuildIdeas";

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

const TRAP = [
  {
    n: "01",
    title: "The noise",
    body: "there is a lot of hype right now. agents, pipelines, systems that supposedly do everything for you. we have tried most of them, so you do not have to.",
  },
  {
    n: "02",
    title: "The cost",
    body: "tokens cost money. time costs more. if you are not intentional with every step, all that automation becomes a very expensive way to produce slop.",
  },
  {
    n: "03",
    title: "Faster is not better",
    body: "an ai confidently building the wrong thing faster is not progress. speed without direction just gets you to the wrong place sooner.",
  },
];

const COURSE = [
  { k: "reusable context", title: "Skill files", body: "instructions and context you hand it once, so it knows how you work before you ask for anything." },
  { k: "one keystroke", title: "Slash commands", body: "your repeatable moves saved as a command. a paragraph of setup becomes one word." },
  { k: "hand it off", title: "Subagents", body: "send a whole task to a focused agent, and run several at once while you keep moving." },
  { k: "scripted jobs", title: "Workflows", body: "multi step work scripted to run the same way every time, no babysitting required." },
  { k: "wire it in", title: "MCP tools", body: "connect it to the apps you already use, so it can act, not just talk." },
  { k: "more for less", title: "Efficiency patterns", body: "better output for fewer tokens and less back and forth. the line between a tool and a money pit." },
];

export default function DevGuide({ accent = ed.plum }: { accent?: string }) {
  return (
    <section style={{ background: "transparent", padding: "clamp(40px,6vw,80px) 0 0" }}>
      <Bleed>
        {/* ── Hero: the shift is already here ── */}
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
            AI is coming for development.<br />
            It already did<span style={{ color: accent }}>.</span>
          </h2>
        </Reveal>

        <div className="ctrla-guide-split" style={{ margin: "clamp(28px,4vw,48px) 0 0" }}>
          <Reveal>
            <div style={{ borderTop: `2px solid ${ed.hair}`, paddingTop: 18 }}>
              <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 12 }}>if you create</Label>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                the barrier between an idea and a working thing has never been lower. web pages, data visualizations, small tools that solve your specific annoying problem, experiences that used to need a whole team. all of it is reachable right now, if you know how to work with the tools.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18 }}>
              <Label color={accent} style={{ display: "block", marginBottom: 12 }}>if you build</Label>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                even the most senior engineers are not writing code line by line anymore. the ones winning are not resisting that. they understand the output well enough to direct it, catch it when it is wrong, and push it further than it would go alone. the skill moved up a level, from writing to directing.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── The trap ── */}
        <div style={{ marginTop: "clamp(56px,8vw,104px)" }}>
          <Reveal>
            <Kicker color={accent}>Where most people get it wrong</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 clamp(28px,4vw,40px)", maxWidth: 900 }}>
              The trap is mistaking speed for progress
            </h3>
          </Reveal>
          <div className="ctrla-guide-grid">
            {TRAP.map((t, i) => (
              <Reveal key={t.n} delay={i * 0.06}>
                <div style={{ borderTop: `2px solid ${ed.ink}`, paddingTop: 18, height: "100%" }}>
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-0.03em", color: accent, display: "block", marginBottom: 10 }}>{t.n}</span>
                  <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.3vw,26px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px" }}>{t.title}</h4>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── The foundation: prompt engineering ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The foundation · prompt engineering</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              The real skill is saying exactly what you mean
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 660 }}>
              not the buzzword version. the actual skill of communicating precisely what you want, in the right context, with the right constraints, so the output is something you can use. it is the most transferable skill in this entire space right now, and we are going deep on it as its own entity in this toolkit, because it deserves that treatment.
            </p>
          </Reveal>

          <div style={{ marginTop: "clamp(28px,4vw,44px)" }}>
            <Reveal delay={0.06}>
              <PromptVault />
            </Reveal>
          </div>
        </div>

        {/* ── The Claude Code crash course (its own chapter) ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>The living course · Claude Code</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              The Claude Code crash course
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(24px,3vw,40px)", maxWidth: 660 }}>
              claude code is the tool we actually build in. this is the crash course for it, the real moves from our sessions, not the version posted for engagement. it lives here, updates with every shift, and more lands every month.
            </p>
          </Reveal>
          <div className="ctrla-guide-grid">
            {COURSE.map((c, i) => (
              <Reveal key={c.title} delay={Math.min(i * 0.05, 0.2)}>
                <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 18, height: "100%" }}>
                  <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 10 }}>{c.k}</Label>
                  <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.4vw,28px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px" }}>{c.title}</h4>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Applied: what you can build ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent}>Proof · what you can build</Kicker>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: "14px 0 10px" }}>
              Beautiful things, no team required
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 660 }}>
              this is the whole point. the stuff that used to need a developer, or a whole team, is reachable now. here is the range, and the kind of thing you would ask for.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <BuildIdeas accent={accent} />
          </Reveal>
        </div>

        {/* ── Closer: the window is open ── */}
        <div style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={accent} style={{ marginBottom: 22 }}>The window is open</Kicker>
            <p style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,4vw,52px)", lineHeight: 1.04, letterSpacing: "-0.03em", color: ed.ink, margin: 0, maxWidth: 1000 }}>
              The creative who learns to build right now, even imperfectly, has an <span style={{ color: accent }}>unfair advantage</span> for the next several years.
            </p>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(20px,2.5vw,28px) 0 0", maxWidth: 620 }}>
              the window is open. this is how we think about walking through it.
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
                now the stack. the tools we build and ship client work on.
              </span>
            </div>
          </Reveal>
        </div>
      </Bleed>
    </section>
  );
}
