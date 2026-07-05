"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE PROMPT MIXER
// The dev toolkit centerpiece. Not an exhibit you read, an
// instrument you play. Five prompt parts (role, context, task,
// constraints, format) are editable, toggleable, reorderable
// blocks the user assembles. A live quality meter scores the
// result against the rubric and speaks it in words. The whole
// assembled prompt serializes to a shareable URL, restored on
// load, mirroring the music globe's ?mix= pattern.
//
// The panel is a dark, gold-accented "editor" surface so the dev
// toolkit reads differently from the cream design page. Gold is
// the web-dev brand color, legible here on dark.
//
// NOTE: the email capture matches the site's existing subscribe
// form (front-end only). Wire it to an email provider to send the
// library. See TODO below. The mixer does not touch it.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";
import { edLight as ed } from "./editorial";

const GOLD = "#E3C24A";
const ROSE = "#A56A67";
const CREAM = "#F0E6E0";
const DIM = "rgba(240,230,224,0.6)";
const FAINT = "rgba(240,230,224,0.42)";

// ── The five parts, seeded with the featured example. `why` is the
// prompt-engineering lesson each part teaches; the quality meter scores
// against exactly these five dimensions. ──
type Part = { id: string; label: string; text: string; why: string };

const PROMPT: Part[] = [
  {
    id: "role",
    label: "role",
    text: "you are a senior product engineer who ships.",
    why: "tells the model who to be. a senior who ships pulls for working, pragmatic output, not a tutorial or a hedge.",
  },
  {
    id: "context",
    label: "context",
    text: "i am a solo creative, not a coder, building {a small web tool} for {my audience}. i care that it works and looks intentional, not that it is clever.",
    why: "the model cannot read your mind. who you are and what you are building changes every decision it makes. say it plainly, in one breath.",
  },
  {
    id: "task",
    label: "task",
    text: "build me {the thing}, end to end, in one file i can run.",
    why: "one clear ask. end to end, in one file removes half the back and forth before it even starts.",
  },
  {
    id: "constraints",
    label: "constraints",
    text: "no dependencies i have to install. explain nothing unless i ask. if a choice is ambiguous, pick the simplest option that works and tell me in one line what you picked.",
    why: "where most people stop too early. constraints keep it from running off to build something fancier and wrong. pick the simplest option is you saving yourself from cleverness you never asked for.",
  },
  {
    id: "format",
    label: "format",
    text: "full code first, then a three line how to run it at the bottom. no preamble.",
    why: "tell it how to hand the work back. code first, no preamble means you can use the output instead of scrolling past an essay.",
  },
];

const GRAB = [
  { id: "ideate", title: "the thinking partner", blurb: "before anything gets built", text: "act as a sharp creative director. i have a rough idea: {your idea}. do not build anything yet. ask me the three questions that most change the direction, then give me three distinct ways to take it, each one sentence. no hedging, have an opinion." },
  { id: "draft", title: "ruthless first draft", blurb: "get to working, fast", text: "you are a senior {role}. give me the simplest version of {the thing} that actually works, end to end, in one file i can run. pick sensible defaults for anything i did not specify and list them in three lines at the end. code first, no preamble." },
  { id: "review", title: "the reviewer", blurb: "before you ship", text: "review the work above as a skeptical senior {role}. list only the real problems, ranked by how badly they bite, each with a one line fix. ignore style and nitpicks. if something would break in front of a user, say so first." },
  { id: "explain", title: "explain it to me", blurb: "understand what you got", text: "explain what this does, group by group, to someone who is creative but not a developer. no jargon without a plain words gloss. end with the one part i should be most careful changing." },
];

// ── Block model: an ordered, toggleable, editable copy of the parts. ──
type Block = { id: string; label: string; text: string; on: boolean };
const SEED: Block[] = PROMPT.map((p) => ({ id: p.id, label: p.label, text: p.text, on: true }));
const WHY = new Map(PROMPT.map((p) => [p.id, p.why]));

// ── Rubric: the five dimensions the "why it works" lessons teach. A
// dimension counts only when its block is on and its text clears a
// minimal specificity bar (short blank stubs do not earn the point). ──
const RUBRIC: { id: string; label: string; short: string; min: number }[] = [
  { id: "role", label: "a clear role", short: "a role", min: 10 },
  { id: "context", label: "concrete context", short: "context", min: 24 },
  { id: "task", label: "a specific task", short: "a task", min: 8 },
  { id: "constraints", label: "real constraints", short: "constraints", min: 12 },
  { id: "format", label: "an output format", short: "a format", min: 8 },
];

const WORDS = ["empty", "barely there", "vague", "getting there", "almost sharp", "sharp"];

function scorePrompt(blocks: Block[]) {
  const byId = new Map(blocks.map((b) => [b.id, b]));
  const crit = RUBRIC.map((r) => {
    const b = byId.get(r.id);
    const met = !!b && b.on && b.text.trim().length >= r.min;
    return { id: r.id, label: r.label, short: r.short, met };
  });
  const metCount = crit.filter((c) => c.met).length;
  const pct = Math.round((metCount / RUBRIC.length) * 100);
  const missing = crit.filter((c) => !c.met);
  const word = WORDS[metCount];
  const readout =
    metCount === RUBRIC.length
      ? "sharp"
      : metCount === 0
        ? "empty, start with a task"
        : `${word}, add ${missing[0].short}`;
  const tier = metCount >= 4 ? GOLD : metCount === 3 ? "#C9A94A" : ROSE;
  return { crit, metCount, pct, readout, tier };
}

// ── URL token — mirrors MixGlobe.encodeMix/decodeMix. Blocks are joined
// by "~"; each is "id.on.text", where text is url-safe base64 (so it can
// carry braces, punctuation, newlines). Restored on load from ?prompt=. ──
function b64urlEncode(s: string): string {
  try {
    const b = btoa(unescape(encodeURIComponent(s)));
    return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}
function b64urlDecode(s: string): string {
  try {
    const b = s.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(escape(atob(b)));
  } catch {
    return "";
  }
}
function encodePrompt(blocks: Block[]): string {
  return blocks.map((b) => `${b.id}.${b.on ? 1 : 0}.${b64urlEncode(b.text)}`).join("~");
}
function decodePrompt(s: string): Block[] | null {
  if (!s) return null;
  const byId = new Map(SEED.map((b) => [b.id, b]));
  const out: Block[] = [];
  const seen = new Set<string>();
  s.split("~").forEach((part) => {
    const d1 = part.indexOf(".");
    if (d1 < 0) return;
    const id = part.slice(0, d1);
    const rest = part.slice(d1 + 1);
    const d2 = rest.indexOf(".");
    if (d2 < 0) return;
    const onRaw = rest.slice(0, d2);
    const b64 = rest.slice(d2 + 1);
    const seed = byId.get(id);
    if (!seed || seen.has(id)) return;
    seen.add(id);
    out.push({ id, label: seed.label, text: b64urlDecode(b64), on: onRaw === "1" });
  });
  if (!out.length) return null;
  // Any known part missing from the token comes back at its seed default.
  SEED.forEach((b) => {
    if (!seen.has(b.id)) out.push({ ...b });
  });
  return out;
}

function assemble(blocks: Block[]): string {
  return blocks
    .filter((b) => b.on && b.text.trim())
    .map((b) => b.text.trim())
    .join("\n\n");
}

export default function PromptVault() {
  const [blocks, setBlocks] = useState<Block[]>(SEED);
  const [openWhy, setOpenWhy] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  // Restore a shared prompt from the URL on first load (mirrors MixGlobe).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("prompt");
    if (p) {
      const decoded = decodePrompt(p);
      if (decoded) setBlocks(decoded);
    }
  }, []);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(id);
  }, [flash]);

  const score = useMemo(() => scorePrompt(blocks), [blocks]);
  const composed = useMemo(() => assemble(blocks), [blocks]);
  const activeCount = blocks.filter((b) => b.on && b.text.trim()).length;

  // ── Block ops ──
  const setText = (id: string, text: string) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, text } : b)));
  const toggle = (id: string) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, on: !b.on } : b)));
  const move = (i: number, dir: -1 | 1) =>
    setBlocks((bs) => {
      const j = i + dir;
      if (j < 0 || j >= bs.length) return bs;
      const next = bs.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const resetBlocks = () => {
    setBlocks(SEED.map((b) => ({ ...b })));
    setFlash("reset to the example");
  };

  const copy = (id: string, text: string, note?: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    if (note) setFlash(note);
    else {
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
    }
  };
  const copyAssembled = () => {
    if (!composed) {
      setFlash("turn a block on first");
      return;
    }
    copy("__assembled", composed, "assembled prompt copied");
  };
  const share = () => {
    const token = encodePrompt(blocks);
    const url = `${window.location.origin}${window.location.pathname}?prompt=${token}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => setFlash("share link copied"))
        .catch(() => window.prompt("Copy this link:", url));
    } else {
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <div className="ctrla-vault">
      {/* ── Play: assemble the prompt, score it live ── */}
      <div className="ctrla-vault-top">
        {/* Left: the block editor */}
        <div className="ctrla-vault-editor">
          <div className="ctrla-vault-editor-bar">
            <span style={{ display: "flex", gap: 6 }}>
              <i style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(240,230,224,0.25)" }} />
              <i style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(240,230,224,0.25)" }} />
              <i style={{ width: 9, height: 9, borderRadius: "50%", background: GOLD, opacity: 0.8 }} />
            </span>
            <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
              assemble your prompt
            </span>
          </div>

          <div style={{ padding: "12px", display: "grid", gap: 10 }}>
            {blocks.map((b, i) => {
              const whyOpen = openWhy === b.id;
              const empty = b.text.trim().length === 0;
              return (
                <div
                  key={b.id}
                  style={{
                    border: `1px solid ${b.on ? "rgba(227,194,74,0.28)" : "rgba(240,230,224,0.1)"}`,
                    borderLeft: `2px solid ${b.on ? GOLD : "rgba(240,230,224,0.18)"}`,
                    borderRadius: 9,
                    background: b.on ? "rgba(227,194,74,0.05)" : "rgba(8,4,14,0.35)",
                    padding: "11px 12px 12px",
                    opacity: b.on ? 1 : 0.62,
                  }}
                >
                  {/* block header: label · order · toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontFamily: ed.mono,
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: b.on ? GOLD : DIM,
                        border: `1px solid ${b.on ? GOLD : "rgba(240,230,224,0.2)"}`,
                        borderRadius: 3,
                        padding: "3px 7px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.label}
                    </span>

                    <span style={{ display: "inline-flex", gap: 3, marginLeft: 2 }}>
                      <MicroBtn
                        label={`move ${b.label} up`}
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                      >
                        ↑
                      </MicroBtn>
                      <MicroBtn
                        label={`move ${b.label} down`}
                        disabled={i === blocks.length - 1}
                        onClick={() => move(i, 1)}
                      >
                        ↓
                      </MicroBtn>
                    </span>

                    <span style={{ marginLeft: "auto", display: "inline-flex", gap: 8, alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => setOpenWhy((w) => (w === b.id ? null : b.id))}
                        aria-expanded={whyOpen}
                        style={{
                          fontFamily: ed.mono,
                          fontSize: 10,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: whyOpen ? GOLD : FAINT,
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px 2px",
                        }}
                      >
                        why
                      </button>
                      <button
                        type="button"
                        onClick={() => toggle(b.id)}
                        role="switch"
                        aria-checked={b.on}
                        aria-label={`${b.on ? "turn off" : "turn on"} the ${b.label} block`}
                        style={{
                          width: 34,
                          height: 18,
                          borderRadius: 999,
                          border: `1px solid ${b.on ? GOLD : "rgba(240,230,224,0.28)"}`,
                          background: b.on ? "rgba(227,194,74,0.22)" : "transparent",
                          position: "relative",
                          cursor: "pointer",
                          padding: 0,
                          flexShrink: 0,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: b.on ? 17 : 2,
                            transform: "translateY(-50%)",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: b.on ? GOLD : "rgba(240,230,224,0.5)",
                            transition: "left 0.18s ease, background 0.18s ease",
                          }}
                        />
                      </button>
                    </span>
                  </div>

                  {whyOpen && (
                    <p
                      style={{
                        fontFamily: ed.body,
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "rgba(240,230,224,0.78)",
                        margin: "0 0 10px",
                        paddingLeft: 10,
                        borderLeft: `1px solid rgba(227,194,74,0.35)`,
                      }}
                    >
                      {WHY.get(b.id)}
                    </p>
                  )}

                  <textarea
                    value={b.text}
                    onChange={(e) => setText(b.id, e.target.value)}
                    disabled={!b.on}
                    rows={Math.max(2, Math.ceil(b.text.length / 52))}
                    aria-label={`${b.label} text`}
                    placeholder={`write the ${b.label}...`}
                    style={{
                      width: "100%",
                      resize: "vertical",
                      background: "rgba(8,4,14,0.5)",
                      border: `1px solid ${empty && b.on ? "rgba(165,106,103,0.5)" : "rgba(240,230,224,0.12)"}`,
                      borderRadius: 7,
                      color: b.on ? CREAM : DIM,
                      fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace",
                      fontSize: 13,
                      lineHeight: 1.55,
                      padding: "9px 11px",
                      outline: "none",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: the live quality meter */}
        <div className="ctrla-vault-why">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <span aria-hidden style={{ width: 18, height: 2, background: GOLD }} />
            <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>
              the prompt mixer
            </span>
          </span>

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
            <span
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(38px,6vw,54px)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: score.tier,
              }}
            >
              {score.pct}
            </span>
            <span style={{ fontFamily: ed.mono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: DIM }}>
              / 100
            </span>
          </div>

          <p
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(19px,2.4vw,26px)",
              letterSpacing: "-0.02em",
              color: score.tier,
              margin: "0 0 14px",
              textTransform: "lowercase",
            }}
          >
            {score.readout}
          </p>

          {/* meter bar */}
          <div style={{ height: 8, borderRadius: 999, background: "rgba(240,230,224,0.1)", overflow: "hidden", marginBottom: 18 }}>
            <div
              style={{
                height: "100%",
                width: `${score.pct}%`,
                background: score.tier,
                borderRadius: 999,
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          </div>

          {/* the five checks, in words */}
          <ul style={{ listStyle: "none", margin: "0 0 20px", padding: 0, display: "grid", gap: 9 }}>
            {score.crit.map((c) => (
              <li key={c.id} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c.met ? GOLD : "transparent",
                    border: `1px solid ${c.met ? GOLD : "rgba(240,230,224,0.35)"}`,
                    flexShrink: 0,
                    transform: "translateY(1px)",
                  }}
                />
                <span style={{ fontFamily: ed.body, fontSize: 15, lineHeight: 1.4, color: c.met ? CREAM : "rgba(240,230,224,0.55)", flex: 1 }}>
                  {c.label}
                </span>
                <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: c.met ? GOLD : ROSE }}>
                  {c.met ? "in" : "missing"}
                </span>
              </li>
            ))}
          </ul>

          <p style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: 13.5, lineHeight: 1.5, color: DIM, margin: 0, paddingTop: 14, borderTop: "1px solid rgba(240,230,224,0.14)" }}>
            edit, reorder, or switch off any block. the score moves live. miss a part and the model fills the gap with a guess.
          </p>
        </div>
      </div>

      {/* ── The assembled prompt: preview + take it ── */}
      <div
        style={{
          marginTop: "clamp(22px,3vw,32px)",
          border: "1px solid rgba(240,230,224,0.12)",
          borderRadius: 12,
          background: "rgba(8,4,14,0.4)",
          padding: "clamp(16px,2.4vw,22px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>
            your assembled prompt
          </span>
          <span style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: 14, color: DIM }}>
            {activeCount} of {blocks.length} parts on
          </span>
        </div>

        <pre
          aria-label="assembled prompt preview"
          style={{
            margin: "0 0 16px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace",
            fontSize: 13,
            lineHeight: 1.6,
            color: composed ? CREAM : DIM,
            background: "rgba(8,4,14,0.5)",
            border: "1px solid rgba(240,230,224,0.1)",
            borderRadius: 8,
            padding: "14px 16px",
            maxHeight: 260,
            overflow: "auto",
          }}
        >
          {composed || "every block is off. turn one on to build your prompt."}
        </pre>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <button
            type="button"
            onClick={copyAssembled}
            style={{
              fontFamily: ed.mono,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "10px 18px",
              borderRadius: 999,
              cursor: "pointer",
              border: `1px solid ${GOLD}`,
              background: copied === "__assembled" ? GOLD : GOLD,
              color: "#0F0820",
              fontWeight: 500,
            }}
          >
            {copied === "__assembled" ? "copied" : "copy assembled prompt"}
          </button>
          <button
            type="button"
            onClick={share}
            style={{
              fontFamily: ed.mono,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "10px 18px",
              borderRadius: 999,
              cursor: "pointer",
              border: `1px solid ${GOLD}`,
              background: "transparent",
              color: GOLD,
            }}
          >
            share this prompt
          </button>
          <button
            type="button"
            onClick={resetBlocks}
            style={{
              fontFamily: ed.mono,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "10px 18px",
              borderRadius: 999,
              cursor: "pointer",
              border: "1px solid rgba(240,230,224,0.25)",
              background: "transparent",
              color: CREAM,
            }}
          >
            reset to example
          </button>
          {flash && (
            <span aria-live="polite" style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.1em", color: GOLD }}>
              {flash}
            </span>
          )}
        </div>
      </div>

      {/* ── Give: grab-and-go prompts ── */}
      <div className="ctrla-vault-give">
        <div className="ctrla-vault-give-head">
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>Grab and go · free</span>
          <span style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: 14, color: DIM }}>swap the braces, take what you need</span>
        </div>
        <div className="ctrla-vault-grab">
          {GRAB.map((p) => (
            <div key={p.id} className="ctrla-vault-card">
              <div>
                <h5 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(16px,1.8vw,19px)", letterSpacing: "-0.01em", color: CREAM, margin: "0 0 4px", textTransform: "lowercase" }}>{p.title}</h5>
                <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: DIM }}>{p.blurb}</span>
              </div>
              <button type="button" onClick={() => copy(p.id, p.text)} className="ctrla-vault-copy" style={{ color: copied === p.id ? "#0F0820" : GOLD, background: copied === p.id ? GOLD : "transparent", borderColor: GOLD }}>
                {copied === p.id ? "copied" : "copy"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Give: the starter skill file + the full library ── */}
      <div className="ctrla-vault-foot">
        <div className="ctrla-vault-dl">
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: 12 }}>Take the files</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <a href="/ctrla/vault/ctrl-a-starter-skill.md" download className="ctrla-vault-dl-btn" style={{ borderColor: "rgba(240,230,224,0.25)", color: CREAM }}>
              ↓ starter skill file
            </a>
            <a href="/ctrla/vault/ctrl-a-prompt-pack.md" download className="ctrla-vault-dl-btn" style={{ borderColor: "rgba(240,230,224,0.25)", color: CREAM }}>
              ↓ prompt pack
            </a>
          </div>
        </div>

        {/* TODO: wire to an email provider to actually send the library.
            Matches the site's existing subscribe form (front-end only). */}
        <div className="ctrla-vault-email">
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: 12 }}>Want the full library?</span>
          {sent ? (
            <p style={{ fontFamily: ed.body, fontSize: 16, lineHeight: 1.5, color: CREAM, margin: 0 }}>
              you are on the list. the full vault is on its way, plus every new drop.
            </p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSent(true); }} style={{ display: "flex", alignItems: "center", gap: 0, borderBottom: `1px solid rgba(240,230,224,0.4)`, maxWidth: 420 }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: CREAM, fontFamily: ed.mono, fontSize: 14, padding: "12px 4px" }}
              />
              <button type="submit" style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, background: "transparent", border: "none", cursor: "pointer", padding: "12px 4px", whiteSpace: "nowrap" }}>
                send it →
              </button>
            </form>
          )}
          <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.1em", color: DIM, display: "block", marginTop: 12 }}>
            no spam. the prompts and skill files we actually use.
          </span>
        </div>
      </div>
    </div>
  );
}

// Small square control for reorder arrows.
function MicroBtn({ children, label, disabled, onClick }: { children: React.ReactNode; label: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        width: 22,
        height: 22,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        border: "1px solid rgba(240,230,224,0.2)",
        background: "transparent",
        color: disabled ? "rgba(240,230,224,0.22)" : "rgba(240,230,224,0.8)",
        cursor: disabled ? "default" : "pointer",
        fontSize: 12,
        lineHeight: 1,
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}
