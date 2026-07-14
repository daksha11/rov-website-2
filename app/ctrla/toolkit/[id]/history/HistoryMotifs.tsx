"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — HISTORY MOTIFS
// Bold, stroke-based inline-SVG glyphs, one per history moment, so the
// page reads visually instead of as a wall of copy. No image assets.
// Plus Drum808: a real, tappable 16-step sequencer synthesised live with
// Web Audio (kick / clap / hat), the "fun" centerpiece of the 1980 moment.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { HistoryMotif } from "../../../data";
import { useInViewOnce } from "../../../_components/editorial";
import { renderDevMotif, DevHero, CodeEditor, BranchGraph } from "./DevGraphics";
import { renderDesignMotif, DesignHero, TypeSpecimen } from "./DesignGraphics";
import { renderVideoMotif, VideoHero, ApertureSim, FpsScrub } from "./VideoGraphics";

// ── Motif — one signature glyph per moment ──────────────
export function Motif({ kind, accent }: { kind: HistoryMotif; accent: string }) {
  const [ref, seen] = useInViewOnce<HTMLSpanElement>();
  const s = {
    fill: "none",
    stroke: accent,
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const faint = { ...s, stroke: accent, opacity: 0.4 };

  const glyph = () => {
    switch (kind) {
      case "wave": // an improvised solo line + note dots
        return (
          <>
            <path {...s} d="M8 90 C 34 30, 52 150, 82 88 S 132 26, 158 104 S 206 52, 232 92" />
            <circle cx={82} cy={88} r={5} fill={accent} stroke="none" />
            <circle cx={158} cy={104} r={5} fill={accent} stroke="none" />
          </>
        );
      case "vinyl": // a spinning record
        return (
          <g className="ctrla-motif-spin" style={{ transformOrigin: "120px 90px" }}>
            <circle {...s} cx={120} cy={90} r={78} />
            <circle {...faint} cx={120} cy={90} r={54} />
            <circle {...faint} cx={120} cy={90} r={34} />
            <circle cx={120} cy={90} r={7} fill={accent} stroke="none" />
            <line {...faint} x1={120} y1={12} x2={120} y2={30} />
          </g>
        );
      case "tracks": // stacked multitrack lanes
        return (
          <>
            {[36, 66, 96, 126].map((y, r) => (
              <g key={y}>
                <line {...faint} x1={10} y1={y} x2={230} y2={y} />
                <path
                  {...s}
                  d={[36, 96].includes(y)
                    ? `M14 ${y} l 12 -14 l 12 20 l 14 -22 l 16 26 l 14 -12 l 18 14 l 20 -18 l 16 12 l 18 -8 l 20 10 l 22 -6 l 20 6`
                    : `M14 ${y} l 16 -10 l 14 16 l 18 -20 l 16 22 l 18 -10 l 20 12 l 18 -16 l 22 10 l 18 -6 l 22 8`}
                  transform={`translate(0, 0)`}
                  opacity={0.85 - r * 0.12}
                />
              </g>
            ))}
          </>
        );
      case "assembly": // a conveyor of hits
        return (
          <>
            <line {...faint} x1={10} y1={70} x2={222} y2={70} />
            <line {...faint} x1={10} y1={112} x2={222} y2={112} />
            {[34, 84, 134, 184].map((x, i) => (
              <rect key={x} {...s} x={x - 16} y={75} width={32} height={32} rx={4} opacity={0.5 + i * 0.16} />
            ))}
            <path {...s} d="M198 91 l 22 0 m -10 -10 l 10 10 l -10 10" />
          </>
        );
      case "leslie": // a spinning speaker / reversed tape
        return (
          <>
            <circle {...s} cx={120} cy={90} r={70} />
            <g className="ctrla-motif-spin" style={{ transformOrigin: "120px 90px" }}>
              <path {...s} d="M120 30 A 60 60 0 0 1 172 60" />
              <path {...s} d="M120 150 A 60 60 0 0 1 68 120" />
            </g>
            <circle cx={120} cy={90} r={10} fill={accent} stroke="none" />
            <path {...faint} d="M188 60 q 16 30 0 60 M206 44 q 26 46 0 92" />
          </>
        );
      case "synth": // knobs + patch cables
        return (
          <>
            {[54, 120, 186].map((x) => (
              <g key={x}>
                <circle {...s} cx={x} cy={56} r={20} />
                <line {...s} x1={x} y1={56} x2={x} y2={40} />
              </g>
            ))}
            <path {...s} d="M54 86 C 54 130, 120 120, 120 86" />
            <path {...faint} d="M120 86 C 120 140, 186 128, 186 86" />
            <rect {...faint} x={30} y={132} width={180} height={22} rx={3} />
            {[54, 78, 102, 138, 162, 186].map((x) => (
              <line key={x} {...faint} x1={x} y1={132} x2={x} y2={154} />
            ))}
          </>
        );
      case "drum808": // the step-sequencer grid (static preview)
        return (
          <>
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3, 4, 5, 6, 7].map((c) => {
                const on = (r === 0 && c % 4 === 0) || (r === 1 && c === 2) || (r === 2 && c % 2 === 0);
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={18 + c * 26}
                    y={40 + r * 34}
                    width={20}
                    height={24}
                    rx={3}
                    fill={on ? accent : "none"}
                    stroke={accent}
                    strokeWidth={2}
                    opacity={on ? 1 : 0.4}
                  />
                );
              })
            )}
          </>
        );
      case "chop": // a sampled waveform, cut
        return (
          <>
            <path
              {...s}
              d="M10 90 l 10 -30 l 8 54 l 10 -66 l 8 78 l 10 -50 l 8 40 l 12 -60 l 8 72 l 10 -44 l 8 34 l 10 -54 l 8 64 l 10 -30 l 8 24 l 10 -40 l 8 48 l 10 -20"
            />
            {[62, 118, 176].map((x) => (
              <line key={x} x1={x} y1={20} x2={x} y2={160} stroke={accent} strokeWidth={2.5} strokeDasharray="5 6" />
            ))}
          </>
        );
      case "pitch": // the auto-tune staircase over a smooth glide
        return (
          <>
            <path {...faint} d="M12 140 C 70 140, 90 40, 150 40 S 220 40, 228 40" />
            <path
              {...s}
              d="M12 140 h 36 v -25 h 36 v -25 h 36 v -25 h 36 v -20 h 36 v -20 h 20"
            />
          </>
        );
      case "phone": // a song on a screen
        return (
          <>
            <rect {...s} x={82} y={20} width={76} height={140} rx={16} />
            <line {...faint} x1={104} y1={32} x2={136} y2={32} />
            <path {...s} d="M94 100 l 8 -20 l 8 34 l 8 -46 l 8 54 l 8 -30 l 8 22 l 8 -14" />
          </>
        );
      default:
        // Development / Design / Video motifs live in their own modules.
        return (
          renderDevMotif(kind, accent) ??
          renderDesignMotif(kind, accent) ??
          renderVideoMotif(kind, accent)
        );
    }
  };

  return (
    <span ref={ref} className={`ctrla-motif${seen ? " is-in" : ""}`} style={{ display: "block", width: "100%" }}>
      <svg
        viewBox="0 0 240 180"
        role="img"
        aria-hidden
        style={{ width: "100%", height: "auto", maxWidth: 360, display: "block", overflow: "visible", margin: "0 auto" }}
      >
        {glyph()}
      </svg>
    </span>
  );
}

// ── Drum808 — a live, tappable 16-step sequencer ────────
const STEPS = 16;
type RowKey = "kick" | "clap" | "hat";
const ROWS: { key: RowKey; label: string }[] = [
  { key: "kick", label: "808" },
  { key: "clap", label: "Clap" },
  { key: "hat", label: "Hat" },
];
const INIT: Record<RowKey, boolean[]> = {
  kick: [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false],
  clap: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
  hat: Array.from({ length: STEPS }, (_, i) => i % 2 === 0),
};
const BPM = 120;
const STEP_DUR = 60 / BPM / 4; // sixteenth notes

export function Drum808({ accent }: { accent: string }) {
  const [pattern, setPattern] = useState<Record<RowKey, boolean[]>>(() => ({
    kick: [...INIT.kick],
    clap: [...INIT.clap],
    hat: [...INIT.hat],
  }));
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);

  const ctxRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextTimeRef = useRef(0);
  const stepRef = useRef(0);
  const patternRef = useRef(pattern);
  const playingRef = useRef(false);
  patternRef.current = pattern;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      playingRef.current = false;
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  function ensureAudio(): AudioContext | null {
    if (ctxRef.current) return ctxRef.current;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.3), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    ctxRef.current = ctx;
    masterRef.current = master;
    noiseRef.current = buf;
    return ctx;
  }

  function kick(ctx: AudioContext, dest: AudioNode, t: number) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(170, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.14);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(1, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + 0.6);
  }

  function clap(ctx: AudioContext, dest: AudioNode, t: number) {
    if (!noiseRef.current) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseRef.current;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1100;
    bp.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    src.connect(bp).connect(g).connect(dest);
    src.start(t);
    src.stop(t + 0.2);
  }

  function hat(ctx: AudioContext, dest: AudioNode, t: number) {
    if (!noiseRef.current) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseRef.current;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(hp).connect(g).connect(dest);
    src.start(t);
    src.stop(t + 0.06);
  }

  function scheduleStep(s: number, t: number) {
    const ctx = ctxRef.current;
    const dest = masterRef.current;
    if (!ctx || !dest) return;
    const p = patternRef.current;
    if (p.kick[s]) kick(ctx, dest, t);
    if (p.clap[s]) clap(ctx, dest, t);
    if (p.hat[s]) hat(ctx, dest, t);
    const delay = Math.max(0, (t - ctx.currentTime) * 1000);
    window.setTimeout(() => {
      if (playingRef.current) setStep(s);
    }, delay);
  }

  function tick() {
    const ctx = ctxRef.current;
    if (!ctx) return;
    while (nextTimeRef.current < ctx.currentTime + 0.12) {
      scheduleStep(stepRef.current, nextTimeRef.current);
      nextTimeRef.current += STEP_DUR;
      stepRef.current = (stepRef.current + 1) % STEPS;
    }
  }

  function play() {
    const ctx = ensureAudio();
    if (!ctx) return;
    ctx.resume().catch(() => {});
    stepRef.current = 0;
    nextTimeRef.current = ctx.currentTime + 0.06;
    playingRef.current = true;
    setPlaying(true);
    timerRef.current = setInterval(tick, 25);
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    playingRef.current = false;
    setPlaying(false);
    setStep(-1);
  }

  function toggle(row: RowKey, i: number) {
    setPattern((prev) => {
      const next = { ...prev, [row]: prev[row].map((v, idx) => (idx === i ? !v : v)) };
      patternRef.current = next;
      return next;
    });
  }

  function clear() {
    const empty = {
      kick: Array(STEPS).fill(false),
      clap: Array(STEPS).fill(false),
      hat: Array(STEPS).fill(false),
    };
    patternRef.current = empty;
    setPattern(empty);
  }

  return (
    <div className="ctrla-808" style={{ ["--acc" as string]: accent } as CSSProperties}>
      <div className="ctrla-808-head">
        <button type="button" className="ctrla-808-btn" data-play={playing ? "true" : "false"} onClick={playing ? stop : play}>
          <span aria-hidden>{playing ? "■" : "▶"}</span>
          {playing ? "Stop" : "Play"}
        </button>
        <button type="button" className="ctrla-808-btn ctrla-808-btn-ghost" onClick={clear}>
          Clear
        </button>
        <span className="ctrla-808-hint">Tap the grid to build a beat · TR-808</span>
      </div>

      <div className="ctrla-808-grid">
        {ROWS.map((r) => (
          <div key={r.key} className="ctrla-808-row">
            <span className="ctrla-808-label">{r.label}</span>
            <div className="ctrla-808-steps">
              {pattern[r.key].map((on, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${r.label} step ${i + 1}`}
                  aria-pressed={on}
                  className="ctrla-808-pad"
                  data-on={on ? "true" : "false"}
                  data-cur={step === i ? "true" : "false"}
                  data-beat={i % 4 === 0 ? "true" : "false"}
                  onClick={() => toggle(r.key, i)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared Web Audio helper ─────────────────────────────
function makeContext(): AudioContext | null {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return AC ? new AC() : null;
}

// ── HeroWave — a full-width waveform that breathes ──────
export function HeroWave({ accent }: { accent: string }) {
  const ref = useRef<SVGPathElement | null>(null);
  useEffect(() => {
    const path = ref.current;
    if (!path) return;
    const W = 1200;
    const mid = 60;
    const N = 130;
    const build = (phase: number) => {
      let d = `M0 ${mid}`;
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * W;
        const env = Math.sin((i / N) * Math.PI); // taper at the edges
        const y =
          mid +
          env *
            (Math.sin(i * 0.19 + phase) * 22 +
              Math.sin(i * 0.07 - phase * 1.3) * 12 +
              Math.sin(i * 0.4 + phase * 0.6) * 5);
        d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      return d;
    };
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      path.setAttribute("d", build(0));
      return;
    }
    let raf = 0;
    let phase = 0;
    const loop = () => {
      phase += 0.02;
      path.setAttribute("d", build(phase));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden style={{ width: "100%", height: "clamp(64px,11vw,120px)", display: "block", overflow: "visible" }}>
      <path ref={ref} fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── VinylPlayer — click the record, hear the crackle ────
export function VinylPlayer({ accent }: { accent: string }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const [spinning, setSpinning] = useState(false);
  const stopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (stopRef.current) clearTimeout(stopRef.current);
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  function play() {
    if (!ctxRef.current) {
      const ctx = makeContext();
      if (!ctx) return;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.5), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      ctxRef.current = ctx;
      noiseRef.current = buf;
    }
    const ctx = ctxRef.current;
    const buf = noiseRef.current;
    if (!ctx || !buf) return;
    ctx.resume().catch(() => {});
    const t = ctx.currentTime;
    const dur = 2.6;

    // Steady surface hiss
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 3200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.06, t);
    g.gain.setValueAtTime(0.06, t + dur - 0.3);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    src.connect(hp).connect(g).connect(ctx.destination);
    src.start(t);
    src.stop(t + dur);

    // Random pops and clicks
    for (let i = 0; i < 26; i++) {
      const pt = t + Math.random() * dur;
      const po = ctx.createBufferSource();
      po.buffer = buf;
      const pf = ctx.createBiquadFilter();
      pf.type = "bandpass";
      pf.frequency.value = 1500 + Math.random() * 2500;
      const pg = ctx.createGain();
      const amp = 0.05 + Math.random() * 0.12;
      pg.gain.setValueAtTime(amp, pt);
      pg.gain.exponentialRampToValueAtTime(0.0001, pt + 0.03);
      po.connect(pf).connect(pg).connect(ctx.destination);
      po.start(pt);
      po.stop(pt + 0.05);
    }

    setSpinning(true);
    if (stopRef.current) clearTimeout(stopRef.current);
    stopRef.current = setTimeout(() => setSpinning(false), dur * 1000);
  }

  const s = { fill: "none", stroke: accent, strokeWidth: 3, strokeLinecap: "round" as const };
  const faint = { ...s, opacity: 0.4 };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <button type="button" onClick={play} className="ctrla-vinyl-btn" aria-label="Play the record">
        <svg viewBox="0 0 200 200" style={{ width: "100%", height: "auto", maxWidth: 260, display: "block", overflow: "visible" }}>
          <g className={spinning ? "ctrla-vinyl-fast" : "ctrla-vinyl-idle"} style={{ transformOrigin: "100px 100px" }}>
            <circle {...s} cx={100} cy={100} r={88} />
            <circle {...faint} cx={100} cy={100} r={62} />
            <circle {...faint} cx={100} cy={100} r={40} />
            <circle cx={100} cy={100} r={9} fill={accent} stroke="none" />
            <line {...faint} x1={100} y1={12} x2={100} y2={34} />
          </g>
        </svg>
      </button>
      <span className="ctrla-play-hint" style={{ color: accent }}>
        {spinning ? "Playing 78 rpm…" : "Click to play the record"}
      </span>
    </div>
  );
}

// ── SynthDemo — a tiny Moog: keys + a live filter sweep ─
const SYNTH_KEYS = [
  { n: "C", f: 261.63 },
  { n: "D", f: 293.66 },
  { n: "E", f: 329.63 },
  { n: "G", f: 392.0 },
  { n: "A", f: 440.0 },
  { n: "C", f: 523.25 },
];
export function SynthDemo({ accent }: { accent: string }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const [wave, setWave] = useState<OscillatorType>("sawtooth");
  const [cutoff, setCutoff] = useState(1400);
  const [res, setRes] = useState(8);
  const [held, setHeld] = useState<number | null>(null);
  const cutoffRef = useRef(cutoff);
  const resRef = useRef(res);
  const waveRef = useRef(wave);
  cutoffRef.current = cutoff;
  resRef.current = res;
  waveRef.current = wave;

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  function ensure(): AudioContext | null {
    if (ctxRef.current) return ctxRef.current;
    const ctx = makeContext();
    if (!ctx) return null;
    const master = ctx.createGain();
    master.gain.value = 0.4;
    master.connect(ctx.destination);
    ctxRef.current = ctx;
    masterRef.current = master;
    return ctx;
  }

  function note(freq: number, idx: number) {
    const ctx = ensure();
    const master = masterRef.current;
    if (!ctx || !master) return;
    ctx.resume().catch(() => {});
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = waveRef.current;
    sub.type = "sine";
    o.frequency.value = freq;
    sub.frequency.value = freq / 2;
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(Math.max(200, cutoffRef.current), t);
    lp.Q.value = resRef.current;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(1, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.28, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    o.connect(lp);
    sub.connect(lp);
    lp.connect(g).connect(master);
    o.start(t);
    sub.start(t);
    o.stop(t + 1.2);
    sub.stop(t + 1.2);
    setHeld(idx);
    window.setTimeout(() => setHeld((h) => (h === idx ? null : h)), 220);
  }

  return (
    <div className="ctrla-synth" style={{ ["--acc" as string]: accent } as CSSProperties}>
      <div className="ctrla-synth-controls">
        <div className="ctrla-synth-waves">
          {(["sawtooth", "square", "sine"] as OscillatorType[]).map((w) => (
            <button key={w} type="button" className="ctrla-synth-wave" data-on={wave === w ? "true" : "false"} onClick={() => setWave(w)}>
              {w === "sawtooth" ? "Saw" : w === "square" ? "Square" : "Sine"}
            </button>
          ))}
        </div>
        <label className="ctrla-synth-slider">
          <span>Cutoff</span>
          <input type="range" min={200} max={6000} step={10} value={cutoff} onChange={(e) => setCutoff(Number(e.target.value))} />
        </label>
        <label className="ctrla-synth-slider">
          <span>Resonance</span>
          <input type="range" min={0.5} max={20} step={0.5} value={res} onChange={(e) => setRes(Number(e.target.value))} />
        </label>
      </div>
      <div className="ctrla-synth-keys">
        {SYNTH_KEYS.map((k, i) => (
          <button key={i} type="button" className="ctrla-synth-key" data-on={held === i ? "true" : "false"} onClick={() => note(k.f, i)} aria-label={`Play ${k.n}`}>
            <span>{k.n}</span>
          </button>
        ))}
      </div>
      <span className="ctrla-play-hint" style={{ color: accent }}>Play the keys, drag the cutoff, hear it move · Moog</span>
    </div>
  );
}

// ── AutotuneDemo — hear a wobbly take snap to the grid ──
const AT_PHRASE = [0, 3, 5, 7, 5, 8, 7, 3]; // semitone offsets over the phrase
const AT_BASE = 220; // A3
const AT_NOTE_DUR = 0.34;
const semi = (n: number) => AT_BASE * Math.pow(2, n / 12);
export function AutotuneDemo({ accent }: { accent: string }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const [on, setOn] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [plays, setPlays] = useState(0);
  const onRef = useRef(on);
  onRef.current = on;
  const stopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (stopRef.current) clearTimeout(stopRef.current);
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  function play() {
    if (!ctxRef.current) {
      const ctx = makeContext();
      if (!ctx) return;
      ctxRef.current = ctx;
    }
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.resume().catch(() => {});
    const auto = onRef.current;
    const t0 = ctx.currentTime + 0.05;
    const total = AT_PHRASE.length * AT_NOTE_DUR;

    const o = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = "sawtooth";
    lp.type = "lowpass";
    lp.frequency.value = 2400;
    lp.Q.value = 6;
    g.gain.value = 0.0001;
    o.connect(lp).connect(g).connect(ctx.destination);

    // Vibrato LFO (deeper when the tuner is off = more human wobble)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 5.5;
    lfoGain.gain.value = auto ? 4 : 14; // cents of detune
    lfo.connect(lfoGain).connect(o.detune);

    o.frequency.setValueAtTime(semi(AT_PHRASE[0]), t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.03);

    AT_PHRASE.forEach((n, i) => {
      const t = t0 + i * AT_NOTE_DUR;
      const target = semi(n);
      if (auto) {
        // Locked: instant jump to the exact semitone, no glide.
        o.frequency.setValueAtTime(target, t);
      } else {
        // Human: glide in, and land a little flat or sharp.
        const off = target * Math.pow(2, (Math.sin(i * 3.3) * 22) / 1200);
        o.frequency.setTargetAtTime(off, t, 0.08);
      }
    });
    g.gain.setValueAtTime(0.5, t0 + total - 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + total);

    lfo.start(t0);
    o.start(t0);
    lfo.stop(t0 + total + 0.05);
    o.stop(t0 + total + 0.05);

    setPlaying(true);
    setPlays((p) => p + 1);
    if (stopRef.current) clearTimeout(stopRef.current);
    stopRef.current = setTimeout(() => setPlaying(false), (total + 0.1) * 1000);
  }

  // Build the two pitch contours for the little graph.
  const W = 320;
  const H = 120;
  const lo = Math.min(...AT_PHRASE) - 1;
  const hi = Math.max(...AT_PHRASE) + 1;
  const xOf = (i: number) => (i / (AT_PHRASE.length - 1)) * W;
  const yOf = (n: number) => H - ((n - lo) / (hi - lo)) * H;
  const stairs = AT_PHRASE.map((n, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)} ${yOf(n).toFixed(1)}`).join(" ");
  const humanPts: string[] = [];
  AT_PHRASE.forEach((n, i) => {
    const drift = Math.sin(i * 3.3) * 0.5;
    if (i === 0) humanPts.push(`M${xOf(i).toFixed(1)} ${yOf(n + drift).toFixed(1)}`);
    else {
      const pn = AT_PHRASE[i - 1] + Math.sin((i - 1) * 3.3) * 0.5;
      const mid = (xOf(i - 1) + xOf(i)) / 2;
      humanPts.push(`Q${mid.toFixed(1)} ${yOf((pn + n) / 2 + 0.6).toFixed(1)} ${xOf(i).toFixed(1)} ${yOf(n + drift).toFixed(1)}`);
    }
  });
  const human = humanPts.join(" ");

  return (
    <div className="ctrla-at" style={{ ["--acc" as string]: accent } as CSSProperties}>
      <div className="ctrla-at-graph">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden style={{ width: "100%", height: "clamp(96px,16vw,150px)", display: "block" }}>
          {AT_PHRASE.map((_, i) => (
            <line key={i} x1={xOf(i)} y1={0} x2={xOf(i)} y2={H} stroke={accent} strokeWidth={1} opacity={0.12} />
          ))}
          <path d={on ? stairs : human} fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          {on && AT_PHRASE.map((n, i) => <circle key={i} cx={xOf(i)} cy={yOf(n)} r={4} fill={accent} />)}
          {playing && <line key={plays} className="ctrla-at-head" x1={0} y1={0} x2={0} y2={H} stroke={accent} strokeWidth={2} style={{ animationDuration: `${AT_PHRASE.length * AT_NOTE_DUR}s` }} />}
        </svg>
      </div>
      <div className="ctrla-at-controls">
        <button type="button" className="ctrla-808-btn" onClick={play}>
          <span aria-hidden>▶</span> Play
        </button>
        <button type="button" className="ctrla-at-toggle" data-on={on ? "true" : "false"} role="switch" aria-checked={on} onClick={() => setOn((v) => !v)}>
          <span className="ctrla-at-toggle-track"><span className="ctrla-at-toggle-thumb" /></span>
          Auto-Tune {on ? "ON" : "OFF"}
        </button>
        <span className="ctrla-play-hint" style={{ color: accent }}>{on ? "Locked to the grid" : "Loose and human"}</span>
      </div>
    </div>
  );
}

// ── Interactive — dispatch by kind ──────────────────────
type InteractiveKind =
  | "808" | "synth" | "autotune" | "vinyl"
  | "codepen" | "branchgraph"
  | "typespecimen"
  | "aperture" | "fpsscrub";
export function Interactive({ kind, accent }: { kind: InteractiveKind; accent: string }) {
  switch (kind) {
    case "808":
      return <Drum808 accent={accent} />;
    case "synth":
      return <SynthDemo accent={accent} />;
    case "autotune":
      return <AutotuneDemo accent={accent} />;
    case "vinyl":
      return <VinylPlayer accent={accent} />;
    case "codepen":
      return <CodeEditor accent={accent} />;
    case "branchgraph":
      return <BranchGraph accent={accent} />;
    case "typespecimen":
      return <TypeSpecimen accent={accent} />;
    case "aperture":
      return <ApertureSim accent={accent} />;
    case "fpsscrub":
      return <FpsScrub accent={accent} />;
    default:
      return null;
  }
}

// ── Hero — the bespoke opening animation per toolkit ────
export function Hero({ topic, accent }: { topic: string; accent: string }) {
  switch (topic) {
    case "web-dev":
      return <DevHero accent={accent} />;
    case "design":
      return <DesignHero accent={accent} />;
    case "video":
      return <VideoHero accent={accent} />;
    default:
      return <HeroWave accent={accent} />;
  }
}
