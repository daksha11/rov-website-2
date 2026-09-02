"use client";

// ═══════════════════════════════════════════════════════
// ASK VUE
//
// A guide, not a chat app. The shape follows what someone actually does here:
// arrive not knowing what to ask, ask once, then keep moving.
//
//   before the first question   the hero does its job, openers do the asking
//   after it                    the hero collapses to a line and gets out of
//                               the way, her answer takes the fold, and the
//                               doors and the next questions sit right under it
//   always                      the field is reachable, pinned to the bottom
//                               once the page can scroll away from it
//
// The doors and the follow-ups both come from passage frontmatter by way of
// /api/vue. The model writes the sentence and nothing else: it never invents a
// link and never invents a next question.
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Vue from "../_components/vue/Vue";
import { type VueMood } from "../_components/vue/VueEye";
import { ed } from "../_components/editorial";

interface VueLink {
  label: string;
  href: string;
}

interface Exchange {
  question: string;
  answer: string;
  knows: boolean;
  sources: { slug: string; title: string }[];
  /** Real routes, declared in passage frontmatter. She never writes these. */
  links: VueLink[];
  /** What she offers to answer next, also from frontmatter. */
  followups: string[];
}

// The cold open. Phrased the way someone starting out actually asks, and each
// one is checked against the live retrieval: an opener that returns "I do not
// have that one" is worse than no opener at all.
const OPENERS = [
  "Where do I start with design?",
  "What should I learn first for music?",
  "What is CTRL-A?",
  "What does the studio do?",
];

export default function AskVue() {
  const [draft, setDraft] = useState("");
  const [history, setHistory] = useState<Exchange[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Fresh answers arrive `alert` and settle to `calm`, so the page has a pulse
  // without anything moving that the reader has to watch.
  const [mood, setMood] = useState<VueMood>("calm");
  const inputRef = useRef<HTMLInputElement>(null);

  const latest = history[0] ?? null;
  const started = history.length > 0 || pending;

  useEffect(() => {
    if (mood !== "alert") return;
    const t = setTimeout(() => setMood("calm"), 2200);
    return () => clearTimeout(t);
  }, [mood]);

  async function submit(question: string) {
    const q = question.trim();
    if (!q || pending) return;

    setPending(true);
    setError(null);
    setMood("focused");
    setDraft("");

    try {
      const res = await fetch("/api/vue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong reaching Vue.");
        setMood("calm");
        return;
      }

      setHistory((h) => [
        {
          question: q,
          answer: data.answer,
          knows: !!data.knows,
          sources: data.sources ?? [],
          links: data.links ?? [],
          followups: data.followups ?? [],
        },
        ...h,
      ]);
      setMood("alert");
    } catch {
      setError("Could not reach Vue. Is the dev server still up?");
      setMood("calm");
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <main
      style={{
        background: ed.ground,
        color: ed.ink,
        minHeight: "100vh",
        fontFamily: ed.body,
        // Room for the pinned field, so the last line of the transcript is
        // never sitting underneath it.
        paddingBottom: started ? "clamp(96px,12vw,132px)" : 0,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "clamp(24px,3.4vw,52px) clamp(18px,4vw,48px) clamp(48px,6vw,88px)",
        }}
      >
        {/* ── The hero, which knows when to leave ────────────
            Full size until the first question. After that it is a single
            gold line, because a reader who has asked something wants the
            answer at eye level, not a headline they have already read. */}
        {started ? (
          <Label>Ask Vue</Label>
        ) : (
          <header style={{ maxWidth: "22ch" }}>
            <Label>Ask Vue</Label>
            {/* Her register, straight out of narration.ts: the one who has
                watched a lot of people start. */}
            <h1
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(38px,6.4vw,88px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.92,
                margin: "clamp(10px,1.4vw,16px) 0 0",
              }}
            >
              She has watched a lot of people start.
            </h1>
          </header>
        )}

        {/* ── Stage: Vue, and whatever she is saying ─────── */}
        <div
          className="vue-ask-stage"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,220px) minmax(0,1fr)",
            gap: "clamp(14px,2.6vw,36px)",
            alignItems: "end",
            marginTop: started ? "clamp(16px,2vw,28px)" : "clamp(24px,3.2vw,44px)",
          }}
        >
          <div style={{ justifySelf: "start" }}>
            <Vue
              pose="showing"
              colorway="purple"
              height={started ? "clamp(150px,18vw,240px)" : "clamp(190px,24vw,320px)"}
              mood={mood}
              wakeOnScroll={false}
            />
          </div>

          <Bubble pending={pending} error={error} exchange={latest} started={started} />
        </div>

        {/* ── Where she is pointing ──────────────────────────
            Directly under her answer and above everything else, because on a
            navigation tool the link is the payload and the sentence is the
            reason to trust it. */}
        {latest && !pending && !error && <Doors links={latest.links} />}

        {/* ── What to ask next ───────────────────────────────
            Openers before the first question, her follow-ups after. The list
            never empties, so nobody hits a dead end with a blank field. */}
        <Suggestions
          items={started ? latest?.followups ?? [] : OPENERS}
          onPick={submit}
          disabled={pending}
          heading={started ? "Ask her next" : "Try one of these"}
        />

        {/* ── The field, in flow until the page can scroll ── */}
        {!started && (
          <Field
            draft={draft}
            setDraft={setDraft}
            submit={submit}
            pending={pending}
            inputRef={inputRef}
          />
        )}

        {/* ── Earlier ────────────────────────────────────── */}
        {history.length > 1 && (
          <section style={{ marginTop: "clamp(36px,5vw,68px)" }}>
            <Label>Earlier</Label>
            {history.slice(1).map((x, i) => (
              <article key={i} style={{ borderTop: `1px solid ${ed.hair}`, padding: "20px 0" }}>
                <p
                  style={{
                    fontFamily: ed.mono,
                    fontSize: "clamp(11px,1.2vw,13px)",
                    letterSpacing: "0.06em",
                    color: ed.gold,
                    margin: 0,
                  }}
                >
                  {x.question}
                </p>
                <p
                  style={{
                    fontFamily: ed.body,
                    fontSize: "clamp(15px,1.6vw,18px)",
                    lineHeight: 1.5,
                    color: ed.inkSoft,
                    margin: "10px 0 0",
                    maxWidth: "66ch",
                  }}
                >
                  {x.answer}
                </p>
                <Doors links={x.links} small />
              </article>
            ))}
          </section>
        )}
      </div>

      {/* Pinned once there is a conversation to scroll through, so asking the
          next thing never means scrolling back up to find the box. */}
      {started && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 30,
            background: ed.ground,
            borderTop: `1px solid ${ed.hair}`,
            boxShadow: "0 -18px 40px rgba(15,8,32,0.85)",
          }}
        >
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(18px,4vw,48px)" }}>
            <Field
              draft={draft}
              setDraft={setDraft}
              submit={submit}
              pending={pending}
              inputRef={inputRef}
              pinned
            />
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .vue-door { transition: transform 0.2s ease; }
            .vue-door:hover { transform: translateX(5px); }
            .vue-next { transition: color 0.2s ease, border-color 0.2s ease; }
            .vue-next:hover { color: ${ed.ink}; border-color: ${ed.gold}; }
            @media (max-width: 720px) {
              .vue-ask-stage { grid-template-columns: 1fr !important; align-items: start !important; }
            }
          `,
        }}
      />
    </main>
  );
}

// ── The field ──────────────────────────────────────────
function Field({
  draft,
  setDraft,
  submit,
  pending,
  inputRef,
  pinned,
}: {
  draft: string;
  setDraft: (v: string) => void;
  submit: (q: string) => void;
  pending: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  pinned?: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(draft);
      }}
      style={{
        marginTop: pinned ? 0 : "clamp(20px,2.6vw,34px)",
        borderTop: pinned ? "none" : `1px solid ${ed.hair}`,
        paddingTop: pinned ? 0 : 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask her something"
          aria-label="Ask Vue a question"
          maxLength={500}
          autoFocus={!pinned}
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            color: ed.ink,
            fontFamily: ed.grotesque,
            fontWeight: 500,
            fontSize: pinned ? "clamp(16px,1.9vw,22px)" : "clamp(18px,2.4vw,30px)",
            letterSpacing: "-0.02em",
            padding: pinned ? "18px 0" : "6px 0",
          }}
        />
        <button
          type="submit"
          disabled={pending || !draft.trim()}
          style={{
            background: "transparent",
            border: `1px solid ${ed.gold}`,
            color: ed.gold,
            fontFamily: ed.mono,
            fontSize: "clamp(10px,1.1vw,12px)",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "10px 20px",
            cursor: pending || !draft.trim() ? "default" : "pointer",
            opacity: pending || !draft.trim() ? 0.4 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {pending ? "Thinking" : "Ask"}
        </button>
      </div>
    </form>
  );
}

// ── The bubble ─────────────────────────────────────────
// Her latest line, or the invitation before anyone has asked. One bubble, not
// a thread: the older exchanges live under Earlier.
function Bubble({
  pending,
  error,
  exchange,
  started,
}: {
  pending: boolean;
  error: string | null;
  exchange: Exchange | null;
  started: boolean;
}) {
  const body = error
    ? error
    : pending
    ? "Reading."
    : exchange
    ? exchange.answer
    : "Start anywhere. Tell me what you make, or what you are stuck on, and I will point you at the part of CTRL-A that helps.";

  return (
    <div style={{ position: "relative", paddingBottom: 8 }}>
      <div
        style={{
          position: "relative",
          background: ed.panel,
          border: `1px solid ${error ? ed.amber : ed.hair}`,
          borderRadius: "22px 22px 22px 4px",
          padding: "clamp(16px,2.2vw,26px) clamp(18px,2.6vw,30px)",
        }}
      >
        {exchange && !pending && !error && (
          <p
            style={{
              fontFamily: ed.mono,
              fontSize: "clamp(10px,1.1vw,12px)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: ed.gold,
              margin: "0 0 10px",
            }}
          >
            {exchange.question}
          </p>
        )}
        {/* Body face, not the magazine's serif italic. That register is built
            for a single narration line; an answer runs six and the italic stops
            being readable somewhere around line two. */}
        <p
          // Announced to screen readers when it swaps, since nothing else on
          // the page tells you the answer arrived.
          aria-live="polite"
          style={{
            fontFamily: ed.body,
            fontSize: started ? "clamp(16px,1.8vw,21px)" : "clamp(17px,1.9vw,23px)",
            lineHeight: 1.5,
            letterSpacing: "-0.005em",
            color: error ? ed.amber : ed.ink,
            margin: 0,
            maxWidth: "56ch",
            opacity: pending ? 0.55 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          {body}
        </p>
        {exchange && !pending && !error && <Sources sources={exchange.sources} />}
      </div>
      {/* The tail, pointing back at the hand presenting the line. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -1,
          bottom: -1,
          width: 18,
          height: 18,
          background: ed.panel,
          borderLeft: `1px solid ${ed.hair}`,
          borderBottom: `1px solid ${ed.hair}`,
          transform: "skewX(-22deg)",
        }}
      />
    </div>
  );
}

// ── The doors ──────────────────────────────────────────
// Where she is pointing. These come from passage frontmatter, never from the
// model, so every one of them is a route that exists.
function Doors({ links, small }: { links: VueLink[]; small?: boolean }) {
  if (!links?.length) return null;
  return (
    <nav
      aria-label="Where to go next"
      style={{
        display: "grid",
        gridTemplateColumns: small ? "1fr" : "repeat(auto-fit, minmax(240px, 1fr))",
        gap: small ? 0 : "0 clamp(16px,2.4vw,32px)",
        margin: small ? "12px 0 0" : "clamp(18px,2.4vw,28px) 0 0",
      }}
    >
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="vue-door"
          style={{
            fontFamily: ed.grotesque,
            fontWeight: 600,
            fontSize: small ? "clamp(13px,1.4vw,15px)" : "clamp(15px,1.7vw,19px)",
            letterSpacing: "-0.01em",
            color: ed.gold,
            textDecoration: "none",
            padding: small ? "7px 0" : "12px 0",
            borderBottom: `1px solid ${ed.hair}`,
          }}
        >
          {l.label} <span aria-hidden>→</span>
        </Link>
      ))}
    </nav>
  );
}

// ── What to ask next ───────────────────────────────────
function Suggestions({
  items,
  onPick,
  disabled,
  heading,
}: {
  items: string[];
  onPick: (q: string) => void;
  disabled: boolean;
  heading: string;
}) {
  if (!items?.length) return null;
  return (
    <div style={{ marginTop: "clamp(20px,2.6vw,32px)" }}>
      <Label>{heading}</Label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 12px", marginTop: 10 }}>
        {items.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            disabled={disabled}
            className="vue-next"
            style={{
              background: "transparent",
              border: `1px solid ${ed.hair}`,
              borderRadius: 999,
              color: ed.gold,
              fontFamily: ed.mono,
              fontSize: "clamp(11px,1.2vw,13px)",
              letterSpacing: "0.04em",
              padding: "9px 16px",
              cursor: disabled ? "default" : "pointer",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function Sources({ sources }: { sources: { slug: string; title: string }[] }) {
  if (!sources?.length) return null;
  return (
    <p
      style={{
        fontFamily: ed.mono,
        fontSize: "clamp(10px,1.1vw,11px)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: ed.gold,
        opacity: 0.7,
        margin: "14px 0 0",
      }}
    >
      From {sources.map((s) => s.title).join(" · ")}
    </p>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: ed.mono,
        fontSize: "clamp(10px,1.1vw,12px)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: ed.gold,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}
