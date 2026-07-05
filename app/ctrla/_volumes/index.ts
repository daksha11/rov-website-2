// ═══════════════════════════════════════════════════════
// CTRL-A — VOLUME REGISTRY
// The single place that knows which volumes exist and which
// one is live. Everything that needs "the current issue"
// imports `currentVolume` from here.
//
// Publishing a new volume:
//   1. Add `app/ctrla/_volumes/vol-NN.ts` (satisfies Volume).
//   2. Register it in `volumes` below.
//   3. Point `currentVolume` at it.
//   4. Drop its media into /public/ctrla/VOLn.
// ═══════════════════════════════════════════════════════

import type { Volume } from "./types";
import { vol01 } from "./vol-01";

/** Every published volume, keyed by its numeric volume. */
export const volumes: Record<number, Volume> = {
  1: vol01,
};

/** The live volume rendered at /ctrla. Flip this to publish a new issue. */
export const currentVolume: Volume = vol01;

/** Known volume numbers, ascending — drives the archive route + sitemap. */
export const volumeNumbers: number[] = Object.keys(volumes)
  .map(Number)
  .sort((a, b) => a - b);

/** Look up a volume by number, or undefined if it does not exist. */
export function getVolume(n: number): Volume | undefined {
  return volumes[n];
}

export type { Volume } from "./types";
