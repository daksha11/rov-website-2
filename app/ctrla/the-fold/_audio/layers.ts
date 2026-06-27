// ═══════════════════════════════════════════════════════
// THE FOLD — ambient layers
// The living stream as a small mixer: four synthesized layers
// (murmur, music, rain, hum), each on its own gain so a room
// preset or the visitor can blend them. No audio files. Recorded
// loops can replace each layer behind the same LayerVoice shape.
// ═══════════════════════════════════════════════════════

import type { LayerId } from "../_state/types";

export interface LayerVoice {
  output: GainNode; // gain 0..1 == the layer's level; starts at 0
  start: () => void;
}

export function makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function noise(ctx: AudioContext, buf: AudioBuffer) {
  const s = ctx.createBufferSource();
  s.buffer = buf;
  s.loop = true;
  return s;
}

function osc(ctx: AudioContext, f: number, type: OscillatorType = "sine") {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = f;
  return o;
}

// Each layer is built quiet internally so output gain (0..1) reads
// directly as the mixer level without anything ever being harsh.
export function buildLayer(
  ctx: AudioContext,
  id: LayerId,
  buf: AudioBuffer
): LayerVoice {
  const output = ctx.createGain();
  output.gain.value = 0;
  const starters: AudioScheduledSourceNode[] = [];

  if (id === "murmur") {
    // distant chatter: low noise, slowly ebbing in amplitude
    const n = noise(ctx, buf);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 380;
    const g = ctx.createGain();
    g.gain.value = 0.16;
    const lfo = osc(ctx, 0.22, "sine");
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.06;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);
    n.connect(lp);
    lp.connect(g);
    g.connect(output);
    starters.push(n, lfo);
  } else if (id === "rain") {
    // steady rain on the dome
    const n = noise(ctx, buf);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1400;
    bp.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.value = 0.22;
    n.connect(bp);
    bp.connect(g);
    g.connect(output);
    starters.push(n);
  } else if (id === "music") {
    // a warm, slow pad, just shy of a melody
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1000;
    const shimmer = ctx.createGain();
    shimmer.gain.value = 0.05;
    const lfo = osc(ctx, 0.14, "sine");
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(shimmer.gain);
    lp.connect(shimmer);
    shimmer.connect(output);
    [196, 261.63, 329.63, 392].forEach((f, i) => {
      const c = osc(ctx, f, "sine");
      c.detune.value = (i - 1.5) * 3;
      c.connect(lp);
      starters.push(c);
    });
    starters.push(lfo);
  } else {
    // hum: the engine in the next room
    const g = ctx.createGain();
    g.gain.value = 0.14;
    g.connect(output);
    const a = osc(ctx, 66, "sine");
    const b = osc(ctx, 99, "sine");
    const bg = ctx.createGain();
    bg.gain.value = 0.4;
    a.connect(g);
    b.connect(bg);
    bg.connect(g);
    starters.push(a, b);
  }

  return {
    output,
    start: () => starters.forEach((s) => s.start()),
  };
}
