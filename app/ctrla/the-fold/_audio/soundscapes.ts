// ═══════════════════════════════════════════════════════
// THE FOLD — soundscape synthesis
// The living stream, built entirely in the Web Audio API so the
// demo needs no audio files. Each soundscape is a small graph:
// a filtered noise bed (the room) plus hums or a soft chord (the
// life). Recorded loops can replace these later behind the same
// Voice interface.
// ═══════════════════════════════════════════════════════

import type { Soundscape } from "../_state/types";

export interface Voice {
  output: GainNode; // connect to the master bus; gain starts at 0
  start: () => void;
  stop: () => void;
}

// Per-soundscape ceiling. Named by mental state, levels by feel,
// not calibrated dB (kept gentle on purpose).
export const TARGET_GAIN: Record<Soundscape, number> = {
  "wide-open": 0.1,
  "in-it": 0.16,
  "last-light": 0.12,
  static: 0.2,
  "golden-hour": 0.2,
};

// One reusable noise buffer (2s of white noise, looped).
export function makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function noiseSource(ctx: AudioContext, buf: AudioBuffer): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  return src;
}

function osc(ctx: AudioContext, freq: number, type: OscillatorType = "sine"): OscillatorNode {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  return o;
}

// Build the graph for a soundscape. `output` (gain 0) is the handle
// the engine ramps up; everything inside connects into it.
export function buildVoice(
  ctx: AudioContext,
  id: Soundscape,
  noiseBuf: AudioBuffer
): Voice {
  const output = ctx.createGain();
  output.gain.value = 0;

  const sources: AudioScheduledSourceNode[] = [];

  // The noise bed, shaped per soundscape.
  const noise = noiseSource(ctx, noiseBuf);
  const filter = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(output);
  sources.push(noise);

  switch (id) {
    case "wide-open": {
      // airy and sparse: high-passed hiss, very little body
      filter.type = "highpass";
      filter.frequency.value = 620;
      noiseGain.gain.value = 0.5;
      const air = osc(ctx, 528, "sine");
      const airGain = ctx.createGain();
      airGain.gain.value = 0.015;
      air.connect(airGain);
      airGain.connect(output);
      sources.push(air);
      break;
    }
    case "in-it": {
      // dense room tone + low hum (the machine in the next room)
      filter.type = "lowpass";
      filter.frequency.value = 480;
      noiseGain.gain.value = 0.85;
      const hum = osc(ctx, 70, "sine");
      const humGain = ctx.createGain();
      humGain.gain.value = 0.5;
      hum.connect(humGain);
      humGain.connect(output);
      const hum2 = osc(ctx, 104, "sine");
      const hum2Gain = ctx.createGain();
      hum2Gain.gain.value = 0.18;
      hum2.connect(hum2Gain);
      hum2Gain.connect(output);
      sources.push(hum, hum2);
      break;
    }
    case "last-light": {
      // warm evening: soft low chord under a gentle bed
      filter.type = "lowpass";
      filter.frequency.value = 900;
      noiseGain.gain.value = 0.45;
      const chord = [196, 261.63, 329.63];
      chord.forEach((f, i) => {
        const c = osc(ctx, f, "sine");
        c.detune.value = i === 1 ? 4 : 0;
        const g = ctx.createGain();
        g.gain.value = 0.05;
        c.connect(g);
        g.connect(output);
        sources.push(c);
      });
      break;
    }
    case "static": {
      // textured, present, slightly grainy band of noise
      filter.type = "bandpass";
      filter.frequency.value = 1500;
      filter.Q.value = 0.6;
      noiseGain.gain.value = 1.0;
      break;
    }
    case "golden-hour": {
      // rare and electric: brighter bed + shimmering chord on a slow LFO
      filter.type = "lowpass";
      filter.frequency.value = 1200;
      noiseGain.gain.value = 0.55;
      const chord = [220, 277.18, 329.63, 440];
      const shimmer = ctx.createGain();
      shimmer.gain.value = 0.05;
      shimmer.connect(output);
      const lfo = osc(ctx, 0.16, "sine");
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(shimmer.gain);
      sources.push(lfo);
      chord.forEach((f, i) => {
        const c = osc(ctx, f, "sine");
        c.detune.value = (i - 1.5) * 3;
        c.connect(shimmer);
        sources.push(c);
      });
      break;
    }
  }

  return {
    output,
    start: () => sources.forEach((s) => s.start()),
    stop: () =>
      sources.forEach((s) => {
        try {
          s.stop();
        } catch {
          // already stopped
        }
      }),
  };
}
