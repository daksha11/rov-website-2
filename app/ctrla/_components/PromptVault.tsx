"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE PROMPT VAULT
// The dev toolkit centerpiece. A vault that teaches as it gives.
// A featured prompt sits in a dark editor, broken into its parts;
// click any part to see why it works (the prompt-engineering
// lesson). Below it, grab-and-go prompts you copy in one tap and
// a starter skill file you download, free. The full library is
// behind an optional email.
//
// The panel is a dark, gold-accented "editor" surface so the dev
// toolkit reads differently from the cream design page. Gold is
// the web-dev brand color, legible here on dark.
//
// NOTE: the email capture matches the site's existing subscribe
// form (front-end only). Wire it to an email provider to send the
// library. See TODO below.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { edLight as ed } from "./editorial";

const GOLD = "#E3C24A";
const CREAM = "#F0E6E0";
const DIM = "rgba(240,230,224,0.6)";

type Seg = { id: string; label: string; text: string; why: string };

const PROMPT: Seg[] = [
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

export default function PromptVault() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const copy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
  };

  const sel = PROMPT[active];

  return (
    <div className="ctrla-vault">
      {/* ── Teach: the featured prompt, dissected ── */}
      <div className="ctrla-vault-top">
        <div className="ctrla-vault-editor">
          <div className="ctrla-vault-editor-bar">
            <span style={{ display: "flex", gap: 6 }}>
              <i style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(240,230,224,0.25)" }} />
              <i style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(240,230,224,0.25)" }} />
              <i style={{ width: 9, height: 9, borderRadius: "50%", background: GOLD, opacity: 0.8 }} />
            </span>
            <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
              a prompt, taken apart
            </span>
          </div>
          {PROMPT.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(i)}
                data-active={on}
                className="ctrla-vault-row"
                style={{ borderLeftColor: on ? GOLD : "transparent", background: on ? "rgba(227,194,74,0.10)" : "transparent" }}
              >
                <span className="ctrla-vault-tag" style={{ color: on ? GOLD : DIM, borderColor: on ? GOLD : "rgba(240,230,224,0.2)" }}>{s.label}</span>
                <span className="ctrla-vault-text" style={{ color: on ? CREAM : "rgba(240,230,224,0.7)" }}>{s.text}</span>
              </button>
            );
          })}
        </div>

        <div className="ctrla-vault-why">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <span aria-hidden style={{ width: 18, height: 2, background: GOLD }} />
            <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>why it works</span>
          </span>
          <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-0.02em", color: CREAM, margin: "0 0 12px", textTransform: "lowercase" }}>
            the {sel.label}
          </h4>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.6, color: "rgba(240,230,224,0.82)", margin: 0 }}>
            {sel.why}
          </p>
          <p style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: 14, lineHeight: 1.5, color: DIM, margin: "20px 0 0", paddingTop: 16, borderTop: "1px solid rgba(240,230,224,0.14)" }}>
            five parts: role, context, task, constraints, format. miss one and the model fills the gap with a guess.
          </p>
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
