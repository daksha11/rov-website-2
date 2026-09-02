"use client";

// ═══════════════════════════════════════════════════════
// SPACE — VUE, THE GUIDE
//
// A small always-present bubble, bottom-left: Vue's bust and one line at a
// time, with tappable replies under some of them. She speaks on beats
// (spawn, waypoint, approach, dock, drift, idle, edge, first boost, route
// done), never on a clock. With no profile she runs the four-question quiz
// right here and draws the line from the answers.
//
// Scripted, not an LLM. When the real chat lands it drops into this same
// bubble. Nothing here imports from _scene.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import { readProfile, writeProfile, type CraftSlug, type Intent, type Level } from "@/lib/ctrla/profile";
import { bodyById } from "./_map/map";
import { routeFor } from "./_map/routes";
import { GREET, LINES, WHY, QUIZ } from "./_map/guide";
import { frame, useSpace } from "./_state/useSpace";
import { track } from "./_state/track";
import Vue from "../_components/vue/Vue";

interface Reply {
  label: string;
  run: () => void;
}
interface Bubble {
  text: string;
  replies?: Reply[];
  /** ms before it fades on its own; 0 keeps it until replaced. */
  ttl?: number;
  pose?: "showing" | "pointing";
}

const routeText = (ids: string[]) => ids.map((id) => bodyById(id)?.label ?? id).join(" · ");

export default function Guide() {
  const introSeen = useSpace((s) => s.introSeen);
  const hidden = useSpace((s) => s.guideHidden);
  const docked = useSpace((s) => s.dockedId);
  const route = useSpace((s) => s.route);
  const step = useSpace((s) => s.step);
  const photo = useSpace((s) => s.photo);

  const [bubble, setBubble] = useState<Bubble | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const said = useRef(new Set<string>());
  const quiz = useRef<{ i: number; answers: Partial<Record<string, unknown>> } | null>(null);

  const say = useCallback((b: Bubble) => {
    if (timer.current) clearTimeout(timer.current);
    setBubble(b);
    const ttl = b.ttl ?? 7000;
    if (ttl > 0) timer.current = setTimeout(() => setBubble(null), ttl);
  }, []);

  const once = useCallback(
    (key: string, b: Bubble) => {
      if (said.current.has(key)) return;
      said.current.add(key);
      say(b);
    },
    [say]
  );

  const waypoint = route[step] ? bodyById(route[step]) : null;
  const flyTo = useCallback((id: string) => useSpace.getState().setAutopilot(id), []);

  // ── the offer for the current waypoint ──
  const offer = useCallback(
    (text: string, pose: Bubble["pose"] = "pointing") => {
      const s = useSpace.getState();
      const id = s.route[s.step];
      const b = id ? bodyById(id) : null;
      if (!b) return;
      say({
        text: text.replace("{label}", b.label),
        pose,
        ttl: 0,
        replies: [
          { label: "Take me there", run: () => { flyTo(b.id); say({ text: "On it.", pose: "showing", ttl: 2500 }); } },
          { label: "Why this stop?", run: () => say({ text: WHY[b.id] ?? b.stop.blurb, pose: "pointing", ttl: 9000 }) },
          { label: "Let me fly", run: () => setBubble(null) },
        ],
      });
    },
    [say, flyTo]
  );

  // ── the quiz, in the bubble ──
  const askQuiz = useCallback(
    (i: number) => {
      const q = QUIZ[i];
      if (!q) return;
      say({
        text: q.question,
        pose: "pointing",
        ttl: 0,
        replies: q.options.map((o) => ({
          label: o.label,
          run: () => {
            const st = quiz.current ?? { i: 0, answers: {} };
            st.answers[q.key] = o.value;
            st.i = i + 1;
            quiz.current = st;
            if (st.i < QUIZ.length) {
              askQuiz(st.i);
              return;
            }
            const a = st.answers;
            writeProfile({
              crafts: [a.craft as CraftSlug],
              level: a.level as Level,
              intent: a.intent as Intent,
              hasBrand: !!a.hasBrand,
            });
            track("space_quiz_complete", { craft: String(a.craft) });
            const profile = readProfile();
            useSpace.getState().setRoute(routeFor(profile));
            quiz.current = null;
            say({ text: LINES.quizDone, pose: "showing", ttl: 1800 });
            setTimeout(() => {
              const p = readProfile();
              const r = useSpace.getState().route;
              if (p) offer(GREET[p.crafts[0]].replace("{route}", routeText(r)));
            }, 1900);
          },
        })),
      });
    },
    [say, offer]
  );

  // ── beat: spawn ──
  useEffect(() => {
    if (!introSeen || hidden) return;
    if (said.current.has("spawn")) return;
    said.current.add("spawn");
    const p = readProfile();
    if (!p) {
      say({ text: LINES.greetNoProfile, pose: "showing", ttl: 0, replies: [{ label: "Go on", run: () => askQuiz(0) }, { label: "Later", run: () => setBubble(null) }] });
      return;
    }
    offer(GREET[p.crafts[0]].replace("{route}", routeText(useSpace.getState().route)), "showing");
  }, [introSeen, hidden, say, offer, askQuiz]);

  // ── beats: dock and undock ──
  const lastDocked = useRef<string | null>(null);
  useEffect(() => {
    if (!introSeen) return;
    if (docked) {
      lastDocked.current = docked;
      setBubble(null); // the panel has her line
      return;
    }
    const was = lastDocked.current;
    if (!was) return;
    lastDocked.current = null;
    const s = useSpace.getState();
    const done = s.route.length > 0 && s.step >= s.route.length;
    if (done) {
      once("complete", {
        text: LINES.complete,
        pose: "showing",
        ttl: 0,
        replies: [{ label: "Show me the map", run: () => { s.toggleMap(true); setBubble(null); } }, { label: "Nice", run: () => setBubble(null) }],
      });
      track("space_route_complete");
      return;
    }
    const onLine = s.route.includes(was);
    if (!onLine && s.route.length) {
      say({ text: LINES.offRoute, pose: "showing", ttl: 3000 });
      setTimeout(() => offer(LINES.next), 3200);
    } else if (s.route[s.step]) {
      offer(LINES.next);
    }
  }, [docked, introSeen, offer, once, say]);

  // ── beats polled from frame state, 4Hz ──
  useEffect(() => {
    if (!introSeen) return;
    let idle = 0;
    let lastApproach: string | null = null;
    const id = setInterval(() => {
      const s = useSpace.getState();
      if (s.dockedId || s.mapOpen || s.photo || s.guideHidden || quiz.current) return;
      // Never talk over a bubble that is waiting on a reply (the quiz, an offer).
      if (bubbleRef.current?.replies) return;

      if (frame.tookOver) {
        frame.tookOver = false;
        say({ text: LINES.takeOver, pose: "showing", ttl: 3500 });
      }
      if (frame.boosted) once("boost", { text: LINES.firstBoost, pose: "showing", ttl: 2500 });
      if (frame.edged) once("edge", { text: LINES.edge, pose: "pointing", ttl: 5000 });

      const ap = frame.approachId;
      if (ap && ap !== lastApproach && !s.autopilotId) {
        lastApproach = ap;
        const onLine = s.route[s.step] === ap;
        once(`approach:${ap}`, { text: onLine ? LINES.approach : LINES.approachOff, pose: "pointing", ttl: 4500 });
      }
      if (!ap) lastApproach = null;

      idle = frame.shipSpeed < 1 && !s.autopilotId ? idle + 0.25 : 0;
      if (idle >= 15) {
        idle = -45; // once a minute at most
        if (!bubbleRef.current) say({ text: LINES.idle, pose: "pointing", ttl: 6000 });
      }
    }, 250);
    return () => clearInterval(id);
  }, [introSeen, once, say]);

  const bubbleRef = useRef<Bubble | null>(null);
  bubbleRef.current = bubble;

  // ── H: hide / show ──
  useEffect(() => {
    if (hidden) {
      setBubble(null);
      return;
    }
  }, [hidden]);

  if (!introSeen || hidden || photo) return null;

  // With nothing to say she peeks: helmet above the bottom edge, the rest
  // below it. A click brings her up with the current offer.
  const peek = !bubble;
  return (
    <div className="ctrla-space-guide" data-peek={peek} role="status" aria-live="polite">
      <button
        type="button"
        className="ctrla-space-vue"
        aria-label={peek ? "Ask Vue" : "Vue"}
        onClick={() => {
          if (peek) offer(LINES.next, "showing");
        }}
      >
        <Vue pose={bubble?.pose ?? "showing"} colorway="purple" height={250} mood={bubble?.replies ? "alert" : peek ? "calm" : "focused"} priority />
      </button>
      {bubble && (
        <div className="ctrla-space-bubble" key={bubble.text}>
          <p>{bubble.text}</p>
          {bubble.replies && (
            <div className="ctrla-space-replies">
              {bubble.replies.map((r) => (
                <button key={r.label} type="button" onClick={r.run}>
                  {r.label}
                </button>
              ))}
            </div>
          )}
          {waypoint && !bubble.replies && <span className="ctrla-space-kicker" style={{ opacity: 0.6 }}>Next · {waypoint.label}</span>}
        </div>
      )}
    </div>
  );
}
