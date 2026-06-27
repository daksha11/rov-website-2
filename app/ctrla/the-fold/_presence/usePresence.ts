"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — presence
// The patrons in the room you are standing in. A simulated driver
// so the cafe feels inhabited with no backend, behind the same
// shape a real Supabase Realtime layer would expose. Each place
// has its own crowd; moving rooms changes who is around you.
// Belonging never collapses to "you are alone" — there is a floor.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import type { Place } from "../_state/types";
import { placeDef } from "../_state/foldConfig";

export interface Dot {
  id: string;
  x: number;
  y: number;
  delay: number;
  dur: number;
  isSelf?: boolean;
}

export interface Whisper {
  id: number;
  text: string;
  lane: number;
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
  "tea's gone cold",
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeDot(isSelf = false): Dot {
  return {
    id: Math.random().toString(36).slice(2),
    x: rand(0.06, 0.94),
    y: rand(0.16, 0.9),
    delay: rand(0, 5),
    dur: rand(3.6, 6),
    isSelf,
  };
}

export function usePresence(place: Place, enabled: boolean) {
  const [dots, setDots] = useState<Dot[]>([]);
  const [whisper, setWhisper] = useState<Whisper | null>(null);
  const whisperId = useRef(0);

  // A fresh crowd whenever you change places.
  useEffect(() => {
    if (!enabled) return;
    const pop = placeDef(place).popularity;
    const n = Math.max(3, Math.round(rand(pop * 0.7, pop * 1.2)));
    const crowd: Dot[] = [makeDot(true)];
    for (let i = 0; i < n; i++) crowd.push(makeDot());
    setDots(crowd);

    const floor = Math.max(3, Math.round(pop * 0.4));
    const flux = window.setInterval(() => {
      setDots((cur) => {
        const join = Math.random() > 0.5;
        if (join) return [...cur, makeDot()];
        const others = cur.filter((d) => !d.isSelf);
        if (others.length <= floor) return cur;
        const v = others[Math.floor(Math.random() * others.length)];
        return cur.filter((d) => d.id !== v.id);
      });
    }, 7000);

    const whisperTick = window.setInterval(() => {
      if (Math.random() > 0.62) {
        whisperId.current += 1;
        setWhisper({
          id: whisperId.current,
          text: WHISPER_POOL[Math.floor(Math.random() * WHISPER_POOL.length)],
          lane: rand(0.2, 0.74),
        });
      }
    }, 9500);

    return () => {
      clearInterval(flux);
      clearInterval(whisperTick);
    };
  }, [place, enabled]);

  const here = useMemo(() => dots.length, [dots]);

  return { dots, here, whisper };
}
