"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE CLAUDE CODE COURSE
// A living, visual, interactive course on building with Claude
// Code. Cream light theme (matches the Development toolkit it
// links from). Structure follows the standalone-page convention:
// accent bar -> back-nav -> hero -> numbered chapters -> FAQ ->
// CTA -> footer. The nav itself is mounted once in app/ctrla/layout.
//
// Three real interactive centerpieces:
//   1. Model Picker      · click a task, the right model lights up
//   2. Command Palette    · type to filter example slash commands
//   3. Token Optimizer    · toggle practices, watch the spend drop
//
// Copy is proper-cased, no em dashes, ROV voice. Model facts are
// framed by purpose (Opus / Sonnet / Haiku), not version trivia,
// so the page ages gracefully.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";
import EditorialFooter from "../_components/EditorialFooter";
import { edLight as ed, Bleed, Kicker, Label, Rule } from "../_components/editorial";
import CtrlASignup from "../_components/CtrlASignup";
import ToolGate from "../_components/ToolGate";
import GuideComplete from "../_components/GuideComplete";
import { currentVolume } from "../_volumes";

// This course is the flagship email-gated guide. The slug ties the unlock
// event, the completion reward, and the Klaviyo nurture flow together.
const GUIDE_SLUG = "claude-code-crash-course";

const PLUM = ed.plum; // #4E3D73 — primary accent, legible on cream
const ROSE = "#A56A67"; // secondary accent

// ── Scroll-in reveal (same easing as the rest of the magazine) ──
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

// ── Chapter frame: numbered kicker + big title + lede ──
function Chapter({
  n,
  kicker,
  title,
  lede,
  id,
  children,
}: {
  n: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  id: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} style={{ marginTop: "clamp(56px,8vw,116px)", scrollMarginTop: 90 }}>
      <Reveal>
        <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(12px,2vw,22px)" }}>
          <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,5vw,58px)", letterSpacing: "-0.03em", color: ROSE, lineHeight: 0.9 }}>{n}</span>
          <div style={{ flex: 1 }}>
            <Kicker color={PLUM}>{kicker}</Kicker>
            <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4.4vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.96, color: ed.ink, margin: "12px 0 0" }}>{title}</h2>
          </div>
        </div>
        {lede && (
          <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.9vw,21px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(16px,2vw,22px) 0 0", maxWidth: 720 }}>{lede}</p>
        )}
      </Reveal>
      {children && <div style={{ marginTop: "clamp(24px,3.5vw,44px)" }}>{children}</div>}
    </section>
  );
}

// A pull-stat callout, reference style (the big number + label).
function PullStat({ figure, label, accent = PLUM }: { figure: string; label: string; accent?: string }) {
  return (
    <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: "clamp(14px,1.8vw,20px)" }}>
      <div style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: ed.ink }}>{figure}</div>
      <div style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,17px)", lineHeight: 1.4, color: ed.inkSoft, marginTop: 8, maxWidth: 240 }}>{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// INTERACTIVE 1 — MODEL PICKER
// Click a task; the model tuned for it lights up with the why.
// ═══════════════════════════════════════════════════════
type ModelId = "opus" | "sonnet" | "haiku";
const MODELS: { id: ModelId; name: string; tag: string; blurb: string; note: string }[] = [
  {
    id: "opus",
    name: "Opus 4.8",
    tag: "The heavy lifter",
    blurb: "The deepest reasoning in the family. Reach for it on hard architecture, gnarly debugging, and planning that has to hold a lot in its head at once.",
    note: "Costs the most, so save it for the work that earns it. Turn on /fast for the same Opus with quicker output.",
  },
  {
    id: "sonnet",
    name: "Sonnet 5",
    tag: "The daily driver",
    blurb: "The balanced default. It handles most coding cleanly and quickly, at a fraction of the cost. Start here, and step up only when a task fights back.",
    note: "If you are not sure which to use, this is the answer nine times out of ten.",
  },
  {
    id: "haiku",
    name: "Haiku 4.5",
    tag: "The fast one",
    blurb: "The quickest and cheapest. Built for volume: mechanical edits, quick lookups, and the noisy background work you hand to subagents.",
    note: "Speed and price make it perfect for running many small jobs at once.",
  },
];
const TASKS: { label: string; model: ModelId }[] = [
  { label: "Design a system from scratch", model: "opus" },
  { label: "Debug something subtle", model: "opus" },
  { label: "Plan a big refactor", model: "opus" },
  { label: "Build a feature", model: "sonnet" },
  { label: "Fix a normal bug", model: "sonnet" },
  { label: "Write everyday code", model: "sonnet" },
  { label: "Rename across the repo", model: "haiku" },
  { label: "Quick lookup or edit", model: "haiku" },
  { label: "Bulk mechanical work", model: "haiku" },
];

function ModelPicker() {
  const [active, setActive] = useState<number | null>(null);
  const litModel: ModelId | null = active === null ? null : TASKS[active].model;
  return (
    <div>
      <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 14 }}>Pick a task, see the model</Label>
      <div className="ctrla-cc-taskrow" role="listbox" aria-label="Pick a task">
        {TASKS.map((t, i) => {
          const on = active === i;
          return (
            <button
              key={t.label}
              type="button"
              className="ctrla-cc-task"
              aria-pressed={on}
              onClick={() => setActive(on ? null : i)}
              style={{
                color: on ? ed.ground : ed.ink,
                background: on ? PLUM : "transparent",
                borderColor: on ? PLUM : "rgba(22,12,40,0.2)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="ctrla-cc-models" style={{ marginTop: "clamp(20px,2.6vw,30px)" }}>
        {MODELS.map((m) => {
          const lit = litModel === m.id;
          return (
            <div
              key={m.id}
              className="ctrla-cc-model"
              data-lit={lit ? "true" : "false"}
              style={{
                borderColor: lit ? PLUM : "rgba(22,12,40,0.14)",
                background: lit ? "rgba(78,61,115,0.07)" : "rgba(22,12,40,0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(18px,2vw,23px)", letterSpacing: "-0.02em", color: ed.ink }}>{m.name}</span>
                {lit && <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: PLUM }}>Reach for it</span>}
              </div>
              <div style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: ROSE, margin: "8px 0 12px" }}>{m.tag}</div>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.55, color: ed.inkSoft, margin: 0 }}>{m.blurb}</p>
              <div style={{ display: "grid", gridTemplateRows: lit ? "1fr" : "0fr", transition: "grid-template-rows 0.34s cubic-bezier(0.22,1,0.36,1)", marginTop: lit ? 12 : 0 }}>
                <div style={{ overflow: "hidden" }}>
                  <p style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: "clamp(13px,1.4vw,15px)", lineHeight: 1.5, color: PLUM, margin: 0 }}>{m.note}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.5vw,16px)", lineHeight: 1.6, color: ed.inkFaint, margin: "clamp(16px,2vw,22px) 0 0", maxWidth: 640 }}>
        Switch any time with <code style={mono}>/model</code>. Fable 5 rounds out the Claude 5 family too. The rule of thumb: default to Sonnet, drop to Haiku for volume, step up to Opus for the hard parts.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// INTERACTIVE 2 — COMMAND PALETTE
// Type to filter a list of example slash commands; each opens.
// ═══════════════════════════════════════════════════════
const COMMANDS: { cmd: string; what: string }[] = [
  { cmd: "/compact", what: "Swaps your conversation history for a tight summary to free up context. Use it at the seam between tasks, never mid task. Add a focus, like /compact keep the auth work, to steer what survives." },
  { cmd: "/clear", what: "Wipes the slate and starts fresh. Reach for it when the next task shares nothing with the last one, so no old context bleeds in." },
  { cmd: "/model", what: "Switches the model for the session without restarting. Move to Opus for a hard stretch, back to Sonnet when it is routine." },
  { cmd: "/fast", what: "Turns on fast mode: the same Opus, quicker output. Flip it on at the start of a session rather than mid conversation to keep the cost down." },
  { cmd: "/plan", what: "Enters plan mode. Claude researches and proposes, but makes no edits, until you approve. Best before anything you would hate to get wrong." },
  { cmd: "/init", what: "Reads your project and drafts a CLAUDE.md, the standing instructions loaded every session. A strong starting point you then trim." },
  { cmd: "/your-command", what: "Your own repeatable move, saved as a markdown file in .claude/commands. A paragraph of setup becomes one word you type." },
];

function CommandPalette() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>("/compact");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COMMANDS;
    return COMMANDS.filter((c) => c.cmd.toLowerCase().includes(s) || c.what.toLowerCase().includes(s));
  }, [q]);
  return (
    <div className="ctrla-cc-palette">
      <div className="ctrla-cc-palette-bar">
        <span aria-hidden style={{ color: PLUM, fontFamily: mono.fontFamily, fontSize: 15 }}>/</span>
        <input
          className="ctrla-cc-palette-input"
          placeholder="Type to filter commands..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Filter commands"
        />
        <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: ed.inkFaint }}>{filtered.length}</span>
      </div>
      {filtered.length === 0 ? (
        <div style={{ padding: "18px 16px", fontFamily: ed.body, fontSize: 15, color: ed.inkFaint }}>Nothing matches. Real power is that you can write your own.</div>
      ) : (
        filtered.map((c) => {
          const isOpen = open === c.cmd;
          return (
            <button
              key={c.cmd}
              type="button"
              className="ctrla-cc-cmd"
              data-open={isOpen ? "true" : "false"}
              onClick={() => setOpen(isOpen ? null : c.cmd)}
              style={{ color: PLUM }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontFamily: mono.fontFamily, fontSize: "clamp(13px,1.5vw,15px)", color: ed.ink, fontWeight: 500 }}>{c.cmd}</span>
                <span aria-hidden style={{ color: PLUM, transition: "transform 0.28s ease", transform: isOpen ? "rotate(45deg)" : "none", fontSize: 16 }}>+</span>
              </div>
              <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1)" }}>
                <div style={{ overflow: "hidden" }}>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.55, color: ed.inkSoft, margin: "10px 0 0" }}>{c.what}</p>
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// INTERACTIVE 3 — TOKEN OPTIMIZER
// Toggle practices; a live bar shows the spend dropping, with a
// spoken readout. Same live-scoring spirit as the Prompt Mixer.
// ═══════════════════════════════════════════════════════
const PRACTICES: { id: string; label: string; save: number; why: string }[] = [
  { id: "specific", label: "Be specific up front", save: 22, why: "Fewer corrections means fewer round trips. The clearest single lever there is." },
  { id: "plan", label: "Plan before you build", save: 14, why: "Research once, refine the plan, then build. Cheaper than iterating live on real edits." },
  { id: "subagents", label: "Send search to subagents", save: 26, why: "The noisy reading happens in a separate context and only the answer comes back. Your main thread stays lean." },
  { id: "skills", label: "Load skills on demand", save: 12, why: "Instructions load only when they are needed, not stuffed into every message from the start." },
  { id: "compact", label: "Compact at the seams", save: 18, why: "Between tasks, trade a wall of history for a tight summary and keep moving with room to think." },
];
const BASE = 100;

function TokenOptimizer() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const totalSave = PRACTICES.reduce((s, p) => s + (on[p.id] ? p.save : 0), 0);
  const spend = Math.max(18, BASE - totalSave); // never claim zero
  const activeCount = PRACTICES.filter((p) => on[p.id]).length;
  const readout =
    activeCount === 0
      ? "Every default, nothing tuned. This is the money pit."
      : spend <= 30
        ? "Lean. This is the difference between a tool and a bill."
        : spend <= 55
          ? "Sharp. You are getting real leverage now."
          : "Better already. Keep stacking the habits.";
  const barColor = spend <= 30 ? PLUM : spend <= 55 ? "#7A6199" : ROSE;
  return (
    <div className="ctrla-cc-token">
      <div>
        {PRACTICES.map((p) => {
          const isOn = !!on[p.id];
          return (
            <button
              key={p.id}
              type="button"
              className="ctrla-cc-practice"
              data-on={isOn ? "true" : "false"}
              onClick={() => setOn((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
              style={{ borderColor: isOn ? "rgba(78,61,115,0.5)" : "rgba(22,12,40,0.14)" }}
            >
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(15px,1.7vw,18px)", letterSpacing: "-0.01em", color: ed.ink }}>{p.label}</span>
                <span style={{ display: "grid", gridTemplateRows: isOn ? "1fr" : "0fr", transition: "grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1)" }}>
                  <span style={{ overflow: "hidden" }}>
                    <span style={{ display: "block", fontFamily: ed.body, fontSize: "clamp(13px,1.4vw,15px)", lineHeight: 1.5, color: ed.inkSoft, marginTop: 6 }}>{p.why}</span>
                  </span>
                </span>
              </span>
              <span
                className="ctrla-cc-switch"
                aria-hidden
                style={{ background: isOn ? "rgba(78,61,115,0.22)" : "transparent", borderColor: isOn ? PLUM : "rgba(22,12,40,0.3)" }}
              />
            </button>
          );
        })}
      </div>

      <div>
        <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 12 }}>Relative token spend</Label>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(46px,8vw,80px)", letterSpacing: "-0.04em", lineHeight: 0.82, color: ed.ink }}>{spend}</span>
          <span style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,18px)", color: ed.inkFaint, marginBottom: 8 }}>of 100</span>
        </div>
        <div style={{ marginTop: 16, height: 12, borderRadius: 999, background: "rgba(22,12,40,0.08)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${spend}%`, background: barColor, borderRadius: 999, transition: "width 0.5s cubic-bezier(0.22,1,0.36,1), background 0.4s ease" }} />
        </div>
        <p style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: "clamp(15px,1.8vw,20px)", lineHeight: 1.4, color: barColor, margin: "16px 0 0" }}>{readout}</p>
        <p style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.5vw,16px)", lineHeight: 1.6, color: ed.inkFaint, margin: "12px 0 0" }}>
          Illustrative, not a benchmark. The point is the shape: a handful of habits, stacked, is the whole game.
        </p>
      </div>
    </div>
  );
}

// ── Small hover-open disclosure (skills anatomy + FAQ share the idea) ──
function FaqItem({ q, children }: { q: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" className="ctrla-cc-faq-q" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(17px,2.1vw,24px)", letterSpacing: "-0.02em", color: ed.ink }}>{q}</span>
        <span aria-hidden style={{ color: PLUM, fontSize: 22, transition: "transform 0.28s ease", transform: open ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
      </button>
      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.32s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ overflow: "hidden" }}>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 clamp(16px,2vw,22px)", maxWidth: 760 }}>{children}</p>
        </div>
      </div>
    </div>
  );
}

const mono: CSSProperties = {
  fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace",
  fontSize: "0.92em",
  background: "rgba(78,61,115,0.1)",
  color: PLUM,
  padding: "1px 6px",
  borderRadius: 5,
};

const dlBtn: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "'Neue Montreal','Helvetica Neue',Arial,sans-serif",
  fontWeight: 500,
  fontSize: "clamp(13px,1.5vw,15px)",
  letterSpacing: "-0.01em",
  color: "#160C28",
  background: "transparent",
  border: "1px solid rgba(22,12,40,0.28)",
  borderRadius: 999,
  padding: "12px 20px",
  textDecoration: "none",
};

const INDEX = [
  ["00", "Mental model", "ch-00"],
  ["01", "Models", "ch-01"],
  ["02", "Skills", "ch-02"],
  ["03", "Commands", "ch-03"],
  ["04", "Systems", "ch-04"],
  ["05", "MCP tools", "ch-05"],
  ["06", "Token craft", "ch-06"],
  ["07", "Context", "ch-07"],
  ["08", "FAQ", "ch-08"],
];

const FANOUT = [
  { t: "Subagents", d: "Hand a whole task to a focused agent. It works in its own context and returns just the result, so your main thread stays clean. Run several at once." },
  { t: "Workflows", d: "For work at scale, a script orchestrates many agents in the background: a big migration, a repo wide audit, research cross checked from every angle." },
  { t: "Hooks", d: "Deterministic rules that fire on their own, like formatting after every edit or blocking changes to a protected file. They run whether or not the model thinks to." },
];

export default function ClaudeCourseContent() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = ed.ground;
    document.body.style.overflowX = "hidden";
    document.body.style.height = "auto";
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.overflowX = "";
      document.body.style.height = "";
    };
  }, []);

  return (
    <div style={{ background: ed.ground, minHeight: "100vh", width: "100%", overflowX: "hidden", color: ed.ink }}>

      {/* Signature accent bar */}
      <div aria-hidden style={{ height: 3, background: PLUM }} />

      {/* Back-nav masthead */}
      <div style={{ background: "transparent", position: "relative", zIndex: 5 }}>
        <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla" className="ctrla-back" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ color: PLUM }}>←</span>
              <Label color={ed.ink}>CTRL-A · {currentVolume.issueMeta.volume}</Label>
            </a>
            <Label color={PLUM}>The Living Course</Label>
          </div>
        </Bleed>
        <Rule color={ed.hair} />
      </div>

      {/* ── Hero ── */}
      <section style={{ padding: "clamp(44px,7vw,96px) 0 0" }}>
        <Bleed>
          <Reveal>
            <Kicker color={PLUM}>The living course · Claude Code</Kicker>
            <h1 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(42px,8.5vw,116px)", lineHeight: 0.9, letterSpacing: "-0.04em", color: ed.ink, margin: "16px 0 0", maxWidth: 1100 }}>
              The Claude Code<br />course<span style={{ color: PLUM }}>.</span>
            </h1>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(17px,2.2vw,26px)", lineHeight: 1.5, color: ed.inkSoft, margin: "clamp(20px,3vw,32px) 0 0", maxWidth: 720 }}>
              Claude Code is the tool we actually build in. This is the real course, the moves from our own sessions, not the version posted for engagement. It is visual, you can touch it, and it updates as the tools shift.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <nav className="ctrla-cc-index" style={{ marginTop: "clamp(28px,4vw,44px)" }} aria-label="Chapters">
              {INDEX.map(([n, label, id]) => (
                <a key={id} href={`#${id}`} style={{ color: ed.ink }}>
                  <span style={{ color: ROSE, marginRight: 7 }}>{n}</span>{label}
                </a>
              ))}
            </nav>
          </Reveal>
        </Bleed>
      </section>

      <Bleed>
        {/* 00 · Mental model */}
        <Chapter
          n="00"
          id="ch-00"
          kicker="Start here"
          title="It is a collaborator you direct, not a chatbot you quiz"
          lede="The shift that changes everything: you are not asking questions and copying answers. You are directing a capable builder, setting the context, the constraints, and the taste, then catching it when it is wrong. Everything below is how you direct it well."
        >
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(20px,3vw,40px)", marginTop: 8 }}>
              <PullStat figure="1" label="Person can now do what used to take a team, if they direct the tools well." />
              <PullStat figure="Taste" label="The part that stays yours. The model supplies speed, you supply judgment." accent={ROSE} />
              <PullStat figure="Every month" label="More lands. This page is living, so it moves as the tools do." />
            </div>
          </Reveal>
        </Chapter>

        {/* 01 · Models */}
        <Chapter
          n="01"
          id="ch-01"
          kicker="Models · reach for the right one"
          title="Different models, different jobs"
          lede="You are not stuck with one brain. Three models cover almost everything, and knowing which to reach for is the cheapest upgrade to your output. Tap a task and watch the right one light up."
        >
          <Reveal>
            <ModelPicker />
          </Reveal>
        </Chapter>

        {/* 02 · Skills */}
        <Chapter
          n="02"
          id="ch-02"
          kicker="Skills · reusable context"
          title="Teach it once, and it just knows"
          lede="A skill is a small file of instructions and context you hand it one time, so it works the way you work before you ask for anything. It loads only when it is relevant, so it costs you nothing until it is needed."
        >
          <Reveal>
            <div style={{ background: "rgba(22,12,40,0.02)", border: `1px solid ${ed.hair}`, borderRadius: 14, padding: "clamp(18px,2.4vw,28px)" }}>
              <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 14 }}>Anatomy of a skill file · .claude/skills/brand-voice/SKILL.md</Label>
              <pre style={{ margin: 0, overflowX: "auto", fontFamily: mono.fontFamily, fontSize: "clamp(12px,1.35vw,14px)", lineHeight: 1.7, color: ed.inkSoft }}>
{`---
name: brand-voice
description: Our house voice. Use for anything client facing.
---

Write grounded, warm, and refined. Substance over noise.
Never use em dashes. Recast with commas, colons, or periods.
Read it aloud: if it sounds like a LinkedIn post, rewrite.`}
              </pre>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,17px)", lineHeight: 1.6, color: ed.inkSoft, margin: "16px 0 0" }}>
                The <code style={mono}>description</code> is the whole trick. Claude reads it at the start of a session and pulls the skill in on its own the moment a task fits, without you having to remember it is there.
              </p>
            </div>
          </Reveal>
        </Chapter>

        {/* 03 · Commands */}
        <Chapter
          n="03"
          id="ch-03"
          kicker="Slash commands · one keystroke"
          title="Your repeatable moves, saved as one word"
          lede="A paragraph of setup you type over and over becomes a single command. Some ship with Claude Code, and the real power is writing your own. Type in the palette to filter, and open any one to see what it does."
        >
          <Reveal>
            <CommandPalette />
          </Reveal>
        </Chapter>

        {/* 04 · Systems */}
        <Chapter
          n="04"
          id="ch-04"
          kicker="Systems · hand off the work"
          title="Stop doing it all in one thread"
          lede="The leap from fast to unfair is delegation. Instead of one long conversation carrying everything, you spin off focused workers, script the repeatable jobs, and wire in rules that run on their own."
        >
          <Reveal>
            <div className="ctrla-cc-fanout">
              {FANOUT.map((f) => (
                <div key={f.t} className="ctrla-cc-node">
                  <div style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(18px,2vw,23px)", letterSpacing: "-0.02em", color: ed.ink, marginBottom: 10 }}>{f.t}</div>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.55, color: ed.inkSoft, margin: 0 }}>{f.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Chapter>

        {/* 05 · MCP */}
        <Chapter
          n="05"
          id="ch-05"
          kicker="MCP tools · wire it in"
          title="Let it act, not just talk"
          lede="MCP connects Claude to the apps you already use, so it can read and act on them directly instead of you copying data into the chat. GitHub, your database, Figma, Notion, the whole shelf."
        >
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "clamp(14px,2vw,24px)" }}>
              {["Read a live database and act on it", "Open and comment on issues in GitHub", "Pull a design straight from Figma", "Draft into the docs you already keep"].map((x) => (
                <div key={x} style={{ borderTop: `2px solid ${PLUM}`, paddingTop: 14 }}>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,17px)", lineHeight: 1.5, color: ed.inkSoft, margin: 0 }}>{x}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,17px)", lineHeight: 1.6, color: ed.inkFaint, margin: "clamp(18px,2.4vw,26px) 0 0", maxWidth: 660 }}>
              Tool details load only when Claude actually reaches for them, so a shelf full of connections does not weigh down every message.
            </p>
          </Reveal>
        </Chapter>

        {/* 06 · Token craft */}
        <Chapter
          n="06"
          id="ch-06"
          kicker="Token craft · the real skill"
          title="The line between a tool and a money pit"
          lede="Tokens cost money and time costs more. Everything you have seen so far pays off here. Flip the habits on and watch the spend fall. This is the difference between people who love the tool and people who quietly give up on it."
        >
          <Reveal>
            <TokenOptimizer />
          </Reveal>
        </Chapter>

        {/* 07 · Context */}
        <Chapter
          n="07"
          id="ch-07"
          kicker="Context · what it remembers"
          title="Memory, and knowing when to clear it"
          lede="Context is the working memory of a session. Two files and two commands are most of the game."
        >
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "clamp(16px,2.4vw,28px)" }}>
              {[
                ["CLAUDE.md", "Standing instructions loaded every session and kept through a compact: your conventions, your stack, how you like things done. Keep it tight."],
                ["Memory", "Notes Claude keeps for itself across sessions on a project, so hard won context is not lost when a conversation ends."],
                ["/compact", "At the seam between tasks, trade the history for a summary and keep the room to think. Add a focus to steer what stays."],
                ["/clear", "When the next task shares nothing with the last, wipe it clean so nothing stale bleeds into fresh work."],
              ].map(([t, d]) => (
                <div key={t} style={{ borderTop: `2px solid ${ROSE}`, paddingTop: 16 }}>
                  <div style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(17px,1.9vw,22px)", letterSpacing: "-0.02em", color: ed.ink, marginBottom: 10 }}>{t}</div>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.55, color: ed.inkSoft, margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Chapter>

        {/* 08 · FAQ */}
        <Chapter
          n="08"
          id="ch-08"
          kicker="Questions"
          title="The things people ask us"
        >
          <Reveal>
            <div style={{ marginTop: 8 }}>
              <FaqItem q="Do I need to be a developer to use this?">
                No. The gap between an idea and a working thing has never been lower. If you can say clearly what you want, with the right context and constraints, you can direct real work. The taste is yours, the model supplies the speed.
              </FaqItem>
              <FaqItem q="Which model should I actually use?">
                Default to Sonnet 5. Drop to Haiku 4.5 for fast, high volume, mechanical work. Step up to Opus 4.8 for hard architecture, subtle debugging, and planning that has to hold a lot at once. Switch any time with <code style={mono}>/model</code>.
              </FaqItem>
              <FaqItem q="What is the single biggest way to save money?">
                Be specific up front. Most wasted tokens are corrections, and corrections come from a vague first ask. After that: send search to subagents, plan before you build, and compact at the seams between tasks.
              </FaqItem>
              <FaqItem q="When should I compact versus clear?">
                Compact when the next task builds on the last and you want the thread to keep the gist. Clear when the next task is unrelated and you want a clean slate with nothing carried over.
              </FaqItem>
              <FaqItem q="Is this course finished?">
                No, and that is the point. It is a living course. It updates as the tools shift, and more lands every month. Bookmark it.
              </FaqItem>
            </div>
          </Reveal>
        </Chapter>

        {/* Take it with you — email-gated companion download */}
        <section style={{ marginTop: "clamp(56px,8vw,112px)" }}>
          <Reveal>
            <Kicker color={PLUM}>Take it with you</Kicker>
            <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,4vw,48px)", letterSpacing: "-0.03em", lineHeight: 0.98, color: ed.ink, margin: "12px 0 clamp(20px,2.6vw,30px)", maxWidth: 720 }}>
              The whole course on one page
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <ToolGate
              gateId="cc-cheatsheet"
              source="claude-code-course"
              guideSlug={GUIDE_SLUG}
              toolkit="web-dev"
              theme="light"
              accent={PLUM}
              title="The Claude Code cheatsheet"
              blurb="Every move on this page, condensed to one printable sheet, plus the skill file and prompt pack we build with. Drop your email and it opens right here."
              bullets={["The models, commands, and token moves at a glance", "Our SKILL.md starter and full prompt pack", "New chapters and drops every month"]}
              cta="Unlock the pack"
              note="No spam. The files we actually use."
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href="/ctrla/vault/claude-code-cheatsheet.md" download style={dlBtn}>↓ Claude Code cheatsheet</a>
                <a href="/ctrla/vault/ctrl-a-starter-skill.md" download style={dlBtn}>↓ Starter skill file</a>
                <a href="/ctrla/vault/ctrl-a-prompt-pack.md" download style={dlBtn}>↓ Prompt pack</a>
              </div>
            </ToolGate>
          </Reveal>

          {/* Finished it? Claim the completion credits. */}
          <Reveal delay={0.1}>
            <div style={{ marginTop: "clamp(20px,3vw,30px)" }}>
              <GuideComplete
                guideSlug={GUIDE_SLUG}
                theme="light"
                accent={PLUM}
                title="Made it to the end?"
                blurb="Mark the course complete and claim your credits for finishing."
              />
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section style={{ marginTop: "clamp(64px,9vw,120px)" }}>
          <Reveal>
            <div style={{ background: ed.panel, borderRadius: 18, padding: "clamp(28px,5vw,64px)", textAlign: "center" }}>
              <Kicker color={PLUM} style={{ justifyContent: "center", display: "inline-flex" }}>The window is open</Kicker>
              <p style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,4.4vw,52px)", lineHeight: 1.02, letterSpacing: "-0.03em", color: ed.ink, margin: "18px auto 0", maxWidth: 820 }}>
                The creative who learns to build right now has an <span style={{ color: PLUM }}>unfair advantage</span> for years.
              </p>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,1.9vw,21px)", lineHeight: 1.5, color: ed.inkSoft, margin: "clamp(16px,2vw,22px) auto 0", maxWidth: 600 }}>
                This is a living course. Leave your email and every new chapter, plus the prompts and skill files we actually use, lands in your inbox.
              </p>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(22px,3vw,30px)" }}>
                <CtrlASignup
                  theme="light"
                  accent={PLUM}
                  source="claude-code-course"
                  cta="Get the drops"
                  note="No spam. New chapters and the files we build with."
                  successTitle="You are on the list."
                  successBody="New chapters and the files we use are on the way."
                  style={{ textAlign: "left", width: "min(100%, 460px)" }}
                />
              </div>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: "clamp(24px,3vw,34px)" }}>
                <a href="/contact" style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(14px,1.6vw,17px)", letterSpacing: "-0.01em", color: ed.ground, background: ed.ink, padding: "14px 26px", borderRadius: 999, textDecoration: "none" }}>Work with us</a>
                <a href="/ctrla/toolkit/web-dev" style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(14px,1.6vw,17px)", letterSpacing: "-0.01em", color: ed.ink, background: "transparent", border: `1px solid ${ed.ink}`, padding: "14px 26px", borderRadius: 999, textDecoration: "none" }}>Back to the toolkit</a>
              </div>
            </div>
          </Reveal>
        </section>
      </Bleed>

      <div style={{ marginTop: "clamp(56px,8vw,104px)" }}>
        <EditorialFooter />
      </div>
    </div>
  );
}
