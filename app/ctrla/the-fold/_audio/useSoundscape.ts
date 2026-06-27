"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — soundscape engine
// Owns the AudioContext, a master bus, and the active voice.
// Created on enter (a user gesture, so autoplay-legal), with a
// pointer fallback to resume if the browser still blocks it.
// Switching soundscapes crossfades, never cuts. All teardown is
// guaranteed on unmount.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import type { Soundscape } from "../_state/types";
import { buildVoice, makeNoiseBuffer, TARGET_GAIN, type Voice } from "./soundscapes";

const FADE_IN = 1.6; // seconds
const FADE_OUT = 1.1;

export function useSoundscape(active: Soundscape, enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const voiceRef = useRef<Voice | null>(null);

  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(false);

  // ── Init the context + master bus once, on enter ──
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

    ctxRef.current = ctx;
    masterRef.current = master;
    noiseRef.current = makeNoiseBuffer(ctx);

    let cancelled = false;
    const markReady = () => {
      if (!cancelled) setReady(ctx.state === "running");
    };
    ctx.resume().then(markReady).catch(() => {});

    // Fallback: if autoplay was blocked, the first pointer resumes it.
    const onPointer = () => ctx.resume().then(markReady).catch(() => {});
    window.addEventListener("pointerdown", onPointer, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onPointer);
      try {
        voiceRef.current?.stop();
      } catch {
        // ignore
      }
      voiceRef.current = null;
      ctx.close().catch(() => {});
      ctxRef.current = null;
      masterRef.current = null;
    };
  }, [enabled]);

  // ── Crossfade to the active soundscape ──
  useEffect(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    const noise = noiseRef.current;
    if (!ctx || !master || !noise) return;

    const now = ctx.currentTime;
    const next = buildVoice(ctx, active, noise);
    next.output.connect(master);
    next.start();
    next.output.gain.cancelScheduledValues(now);
    next.output.gain.setValueAtTime(0.0001, now);
    next.output.gain.setTargetAtTime(TARGET_GAIN[active], now, FADE_IN / 3);

    const prev = voiceRef.current;
    voiceRef.current = next;

    if (prev) {
      prev.output.gain.cancelScheduledValues(now);
      prev.output.gain.setTargetAtTime(0.0001, now, FADE_OUT / 3);
      const t = window.setTimeout(() => {
        try {
          prev.stop();
          prev.output.disconnect();
        } catch {
          // already gone
        }
      }, (FADE_OUT + 1) * 1000);
      return () => clearTimeout(t);
    }
    return undefined;
    // ready gates the very first build so the context is running first
  }, [active, ready]);

  // ── Mute rides the master bus, no rebuild ──
  useEffect(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    master.gain.setTargetAtTime(muted ? 0.0001 : 1, ctx.currentTime, 0.2);
  }, [muted]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return { ready, muted, toggleMute };
}
