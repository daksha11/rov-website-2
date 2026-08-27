// Vue — the CTRL-A narrator.
//
// The art is a set of full-body poses in two colorways, exported by
// scripts/optimize-vue-poses.mjs into public/ctrla/vue/. This file is the
// single registry every Vue placement reads from: add a pose here and it
// becomes available everywhere, with no other file to touch.
//
// Colorway rule: `purple` is the magazine (the dark `ed` theme, ground
// #0F0820); `clay` is the toolkits (the cream `edLight` theme). The two
// colorways of a pose are pixel-registered — same trimmed crop, same figure
// height — so they can cross-fade in place when the theme flips.

export type VuePose = "pointing" | "showing" | "leaning";
export type VueColorway = "purple" | "clay";

// The exported files still carry the artist's original colorway names.
const FILE_COLORWAY: Record<VueColorway, string> = { purple: "purple", clay: "pink" };

export interface VuePoseSpec {
  /** What this pose is for — keeps placement honest as the set grows. */
  role: string;
  /** Intrinsic size of the optimized webp (identical across colorways). */
  width: number;
  height: number;
  /**
   * Where the sigil sat, as a fraction of the image box. The optimizer erases
   * the painted sigil, and VueEye is positioned onto this rect — so the drawn
   * eye lands on exactly the footprint the artist gave it, and owns the visor
   * outright. Measured from the gold strokes before the erase, which is why
   * both colorways of a pose share one rect: they are pixel-registered.
   */
  eye: { x: number; y: number; w: number; h: number };
  /**
   * Which way the pose reads. Placement should follow it: a `right`-facing
   * Vue belongs on the left of what it is presenting, never the other side.
   */
  facing: "viewer" | "left" | "right";
  /**
   * The gesturing hand, as a fraction of the image box — where a drawn thread
   * should leave from so it looks like Vue is holding the other end.
   */
  hand: { x: number; y: number };
  /**
   * How the pose meets the edge of the page, if it has to. `leaning` is drawn
   * with no arm on its right side because that side is meant to sit behind an
   * edge; rendered free-standing it reads as a missing limb. `amount` is the
   * fraction of the art's width that belongs past the edge — pass `bleed` to
   * <Vue> and it clips there, so the absent arm is simply out of frame.
   */
  edge?: { side: "left" | "right"; amount: number };
}

export const VUE_POSES: Record<VuePose, VuePoseSpec> = {
  // Index finger up, square to the reader. The interruption pose — use it
  // where Vue is making a point, not showing something.
  pointing: {
    role: "Makes a point. Margin notes, callouts, the one caveat that matters.",
    width: 800,
    height: 1400,
    eye: { x: 0.335, y: 0.1014, w: 0.1888, h: 0.0843 },
    facing: "viewer",
    hand: { x: 0.1, y: 0.235 },
  },
  // Turned three-quarters away, open palm out to the reader's right. The
  // usher pose — Vue is looking at the thing, so the reader does too.
  showing: {
    role: "Presents. Section openers and hand-offs; put it left of its subject.",
    width: 647,
    height: 1400,
    eye: { x: 0.4544, y: 0.0943, w: 0.2334, h: 0.0886 },
    facing: "right",
    hand: { x: 0.88, y: 0.51 },
  },
  // Braced on one arm, knee up, the other arm nowhere: the art assumes the
  // right side is hidden by an edge. Never render this pose free-standing —
  // always with `bleed`, flush to the edge of the page.
  leaning: {
    role: "Leans in from the page edge. Always `bleed` — see `edge` below.",
    width: 1062,
    height: 1400,
    eye: { x: 0.4397, y: 0.1036, w: 0.1516, h: 0.0907 },
    facing: "left",
    hand: { x: 0.06, y: 0.27 },
    // 0.18 is the cut that reads: the trailing drape and the far boot both
    // still cross the edge, so the body clearly continues behind it. Less and
    // the robe ends in mid-air; more and it takes the near boot with it.
    edge: { side: "right", amount: 0.18 },
  },
};

export function vueSrc(pose: VuePose, colorway: VueColorway): string {
  return `/ctrla/vue/vue-${pose}-${FILE_COLORWAY[colorway]}.webp`;
}
