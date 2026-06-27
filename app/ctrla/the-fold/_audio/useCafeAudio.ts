"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — cafe audio engine
// Holds the AudioContext, a master bus, and the four persistent
// layers. A room preset ramps all layers; the mixer ramps one.
// Created on arrival (a user gesture, autoplay-legal), with a
// pointer fallback. Teardown guaranteed on unmount.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import type { LayerId, LayerLevels } from "../_state/types";
import { LAYERS } from "../_state/foldConfig";
import { buildLayer, makeNoiseBuffer, type LayerVoice } from "./layers";

const SILENT: LayerLevels = { murmur: 0, music: 0, rain: 0, hum: 0 };
const RAMP = 0.9; // seconds-ish (setTargetAtTime time constant base)

export function useCafeAudio(enabled: boolean, initial: LayerLevels) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const voicesRef = useRef<Partial<Record<LayerId, LayerVoice>>>({});
  const initialRef = useRef(initial);

  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [levels, setLevels] = useState<LayerLevels>(SILENT);

  // Init context + all layers once.
  useEffect(() => {
    if (!enabled) return;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 1;
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

    // ramp to the initial preset
    const now = ctx.currentTime;
    const init = initialRef.current;
    (Object.keys(init) as LayerId[]).forEach((id) => {
      voices[id]?.output.gain.setTargetAtTime(init[id], now, RAMP / 3);
    });
    setLevels(init);

    let cancelled = false;
    const mark = () => !cancelled && setReady(ctx.state === "running");
    ctx.resume().then(mark).catch(() => {});
    const onPointer = () => ctx.resume().then(mark).catch(() => {});
    window.addEventListener("pointerdown", onPointer, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onPointer);
      ctx.close().catch(() => {});
      ctxRef.current = null;
      masterRef.current = null;
      voicesRef.current = {};
    };
  }, [enabled]);

  const setLevel = useCallback((id: LayerId, value: number) => {
    const ctx = ctxRef.current;
    const v = voicesRef.current[id];
    if (ctx && v) v.output.gain.setTargetAtTime(value, ctx.currentTime, 0.12);
    setLevels((l) => ({ ...l, [id]: value }));
  }, []);

  const applyPreset = useCallback((preset: LayerLevels) => {
    const ctx = ctxRef.current;
    if (ctx) {
      const now = ctx.currentTime;
      (Object.keys(preset) as LayerId[]).forEach((id) => {
        voicesRef.current[id]?.output.gain.setTargetAtTime(preset[id], now, RAMP / 3);
      });
    }
    setLevels(preset);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (ctx && master) master.gain.setTargetAtTime(next ? 0.0001 : 1, ctx.currentTime, 0.2);
      return next;
    });
  }, []);

  return { ready, muted, levels, setLevel, applyPreset, toggleMute };
}
