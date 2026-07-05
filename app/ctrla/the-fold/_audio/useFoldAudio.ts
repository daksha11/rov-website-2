"use client";

// ═══════════════════════════════════════════════════════
// VANTAGE — audio engine (adapted from the dormant cafe engine)
// Reuses the synthesized layers (murmur / music / rain / hum) from
// layers.ts — no audio files. Holds one AudioContext, a master bus,
// and the four persistent layer voices. Each layer has its own gain
// (0..1) so pads can blend them and worlds can ramp a preset.
//
// GESTURE-GATED: the context is only created once `enabled` flips true
// (the belt flips it on the first real user gesture — entering the
// voyage or tapping a pad). It NEVER autoplays on load. The last mix
// is restored from localStorage as the *intended* state and only made
// audible on that first gesture.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import type { LayerId, LayerLevels } from "../_state/types";
import { LAYERS } from "../_state/foldConfig";
import { buildLayer, makeNoiseBuffer, type LayerVoice } from "./layers";

const SILENT: LayerLevels = { murmur: 0, music: 0, rain: 0, hum: 0 };
const RAMP = 0.9; // setTargetAtTime time constant base (preset crossfades)
const STORAGE_KEY = "fold.audio";

// A pad toggled on lands at a gentle level — audio never blasts on the
// first interaction, even if the master was un-muted.
export const LAYER_ON = 0.42;
const AUDIBLE = 0.02; // a layer at/below this reads as "off"

type Stored = { levels: LayerLevels; muted: boolean };

function loadStored(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { levels: { ...SILENT }, muted: false };
    const p = JSON.parse(raw) as Partial<Stored>;
    const levels: LayerLevels = { ...SILENT };
    (Object.keys(SILENT) as LayerId[]).forEach((id) => {
      const v = p?.levels?.[id];
      if (typeof v === "number" && v >= 0 && v <= 1) levels[id] = v;
    });
    return { levels, muted: !!p?.muted };
  } catch {
    return { levels: { ...SILENT }, muted: false };
  }
}

export function useFoldAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const voicesRef = useRef<Partial<Record<LayerId, LayerVoice>>>({});

  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [levels, setLevels] = useState<LayerLevels>(SILENT);
  const [restored, setRestored] = useState(false);

  // Latest values for the enable effect + gesture-driven callbacks, so they
  // never close over stale state (the effect re-runs only on `enabled`).
  const levelsRef = useRef(levels);
  levelsRef.current = levels;
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  // Restore the intended mix once on mount. This sets state only — it does
  // NOT create a context, so nothing plays until a gesture flips `enabled`.
  useEffect(() => {
    const s = loadStored();
    setLevels(s.levels);
    setMuted(s.muted);
    setRestored(true);
  }, []);

  // Persist the mix whenever it changes (after the initial restore).
  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ levels, muted } as Stored));
    } catch {}
  }, [levels, muted, restored]);

  // Create the context + all four layers once, on first enable.
  useEffect(() => {
    if (!enabled) return;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = mutedRef.current ? 0.0001 : 1;
    master.connect(ctx.destination);
    const buf = makeNoiseBuffer(ctx);

    const voices: Partial<Record<LayerId, LayerVoice>> = {};
    for (const { id } of LAYERS) {
      const v = buildLayer(ctx, id, buf);
      v.output.connect(master);
      v.start();
      voices[id] = v;
    }

    ctxRef.current = ctx;
    masterRef.current = master;
    voicesRef.current = voices;

    // Ramp to whatever the current intended mix is (restored or world preset).
    const now = ctx.currentTime;
    const init = levelsRef.current;
    (Object.keys(init) as LayerId[]).forEach((id) => {
      voices[id]?.output.gain.setTargetAtTime(init[id], now, RAMP / 3);
    });

    let cancelled = false;
    const mark = () => !cancelled && setReady(ctx.state === "running");
    ctx.resume().then(mark).catch(() => {});
    // Autoplay-policy fallback: resume on the next pointerdown if the enable
    // gesture itself did not count (e.g. a keyboard-driven enable).
    const onPointer = () => ctx.resume().then(mark).catch(() => {});
    window.addEventListener("pointerdown", onPointer, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onPointer);
      ctx.close().catch(() => {});
      ctxRef.current = null;
      masterRef.current = null;
      voicesRef.current = {};
      setReady(false);
    };
  }, [enabled]);

  // Toggle a single layer's bed on/off. Tapping any layer pad also un-mutes
  // the master (requirement: un-mute on tapping any layer pad).
  const toggleLayer = useCallback((id: LayerId) => {
    const ctx = ctxRef.current;
    const now = ctx ? ctx.currentTime : 0;

    if (mutedRef.current) {
      // Un-mute the whole mix, and make sure the tapped layer is on.
      if (ctx && masterRef.current) masterRef.current.gain.setTargetAtTime(1, now, 0.2);
      setMuted(false);
      const cur = levelsRef.current[id];
      const value = cur > AUDIBLE ? cur : LAYER_ON;
      if (ctx) voicesRef.current[id]?.output.gain.setTargetAtTime(value, now, 0.12);
      if (cur <= AUDIBLE) setLevels((l) => ({ ...l, [id]: value }));
      return;
    }

    const on = levelsRef.current[id] > AUDIBLE;
    const value = on ? 0 : LAYER_ON;
    if (ctx) voicesRef.current[id]?.output.gain.setTargetAtTime(value, now, 0.12);
    setLevels((l) => ({ ...l, [id]: value }));
  }, []);

  // Master mute / un-mute (all layers stay where they are underneath).
  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) master.gain.setTargetAtTime(next ? 0.0001 : 1, ctx.currentTime, 0.2);
    setMuted(next);
  }, []);

  // Crossfade the whole bed toward a world's preset (used on landing).
  const applyPreset = useCallback((preset: LayerLevels) => {
    const ctx = ctxRef.current;
    if (ctx) {
      const now = ctx.currentTime;
      (Object.keys(preset) as LayerId[]).forEach((id) => {
        voicesRef.current[id]?.output.gain.setTargetAtTime(preset[id], now, RAMP / 3);
      });
    }
    setLevels({ ...preset });
  }, []);

  // A soft, short phase-change chime, played through the live context/master
  // bus. Silent if audio was never started (no context) or the master is muted,
  // so it never becomes an autoplay or an override of the visitor's silence.
  // `variant`: "up" (break → focus) rises; "down" (focus → break) settles.
  const chime = useCallback((variant: "up" | "down" = "up") => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master || mutedRef.current) return;
    const now = ctx.currentTime;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    g.connect(master);
    const base = variant === "up" ? 528 : 396; // a gentle fifth apart
    [base, base * 1.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? "sine" : "triangle";
      o.frequency.setValueAtTime(f, now);
      o.connect(g);
      o.start(now);
      o.stop(now + 0.95);
    });
  }, []);

  // True when a layer is actually audible (on AND not muted).
  const isAudible = useCallback(
    (id: LayerId) => !muted && levels[id] > AUDIBLE,
    [muted, levels]
  );

  return { ready, muted, levels, toggleLayer, toggleMute, applyPreset, chime, isAudible };
}
