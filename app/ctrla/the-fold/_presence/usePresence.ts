"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — presence
// A simulated presence driver so the room feels inhabited with
// no backend. It exposes the same shape a real Supabase Realtime
// Presence driver would (dots, counts, join/leave, whispers), so
// the live driver can swap in later without touching the UI.
//
// Belonging must never collapse into "you are alone", so there is
// always a soft floor of ambient presence.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import type { Mode } from "../_state/types";
import { MODES, modeVerb } from "../_state/foldConfig";

export interface Dot {
  id: string;
  x: number; // 0..1
  y: number; // 0..1
  mode: Mode;
  delay: number; // s, async pulse
  dur: number; // s
  isSelf?: boolean;
}

export interface Whisper {
  id: number;
  text: string;
  lane: number; // 0..1 vertical lane
}

const WHISPER_POOL = [
  "shipped it",
  "three hours in",
  "finally cracked it",
  "one more pass",
  "back at it",
  "deep in it now",
  "first draft done",
  "took a breath, returned",
  "found the thread",
  "almost there",
];

const OTHER_MODES: Mode[] = ["design", "write", "build", "just-be"];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeDot(isSelf = false, mode?: Mode): Dot {
  return {
    id: Math.random().toString(36).slice(2),
    x: rand(0.04, 0.96),
    y: rand(0.08, 0.92),
    mode: mode ?? OTHER_MODES[Math.floor(Math.random() * OTHER_MODES.length)],
    delay: rand(0, 4.5),
    dur: rand(3.4, 5.6),
    isSelf,
  };
}

export function usePresence(userMode: Mode, enabled: boolean) {
  const [dots, setDots] = useState<Dot[]>([]);
  const [whisper, setWhisper] = useState<Whisper | null>(null);
  const [event, setEvent] = useState<{ type: "join" | "leave"; at: number } | null>(null);
  const whisperId = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    // Seed an inhabited room: your dot plus a soft crowd.
    const seed: Dot[] = [makeDot(true, userMode)];
    const n = Math.floor(rand(16, 26));
    for (let i = 0; i < n; i++) seed.push(makeDot());
    setDots(seed);

    // People arrive and leave, organically.
    const flux = window.setInterval(() => {
      setDots((cur) => {
        const join = Math.random() > 0.45;
        if (join || cur.length < 10) {
          setEvent({ type: "join", at: Date.now() });
          return [...cur, makeDot()];
        }
        // never let the room empty out
        const others = cur.filter((d) => !d.isSelf);
        if (others.length <= 8) return cur;
        const victim = others[Math.floor(Math.random() * others.length)];
        setEvent({ type: "leave", at: Date.now() });
        return cur.filter((d) => d.id !== victim.id);
      });
    }, 6500);

    // Opt-in whispers drift through, as texture.
    const whisperTick = window.setInterval(() => {
      if (Math.random() > 0.6) {
        whisperId.current += 1;
        setWhisper({
          id: whisperId.current,
          text: WHISPER_POOL[Math.floor(Math.random() * WHISPER_POOL.length)],
          lane: rand(0.15, 0.7),
        });
      }
    }, 9000);

    return () => {
      clearInterval(flux);
      clearInterval(whisperTick);
    };
  }, [enabled, userMode]);

  // Truthful counts by verb, derived from the live population.
  const counts = useMemo(() => {
    const byMode: Record<string, number> = {};
    for (const d of dots) byMode[d.mode] = (byMode[d.mode] ?? 0) + 1;
    return MODES.map((m) => ({ verb: m.verb, n: byMode[m.id] ?? 0 })).filter(
      (c) => c.n > 0
    );
  }, [dots]);

  const total = dots.length;

  return { dots, counts, total, whisper, event, modeVerbOf: modeVerb };
}
