// ─────────────────────────────────────────────────────────────
// CTRL-A Credits — reward + cost table.
// One place to tune the economy. Point values are intentionally
// easy to change. `once` marks a one-time reward (deduped server-side).
// ─────────────────────────────────────────────────────────────

export type EarnAction = "follow-instagram" | "referral";

export const REWARDS: Record<EarnAction, { points: number; once: boolean; label: string }> = {
  // Honor-system: opens Instagram, then the user claims. One-time.
  "follow-instagram": { points: 100, once: true, label: "Follow us on Instagram" },
  // Awarded to the referrer each time a new person signs up with their link.
  referral: { points: 250, once: false, label: "Refer a friend" },
};

// What credits buy. Keep brand-kit export at its existing cost.
export const COSTS = {
  "brand-kit-export": 50,
  "premium-download": 75,
  "premium-course": 100,
} as const;

// Actions a signed-in user may claim directly from the browser (via the
// earn route). Referral is server-attributed on a friend's signup, never
// self-claimed, so it is deliberately excluded here.
export const CLAIMABLE: EarnAction[] = ["follow-instagram"];

export const INSTAGRAM_URL = "https://www.instagram.com/rangeofviewstudios/";

// The Daily (taste test). Every play pays base + a random spike
// (0..spikeMax, rolled server-side; variable reward). Milestone streak
// days pay extra on top. Keys of streakBonuses are streak lengths.
export const DAILY = {
  basePoints: 10,
  spikeMax: 25,
  streakBonuses: { 3: 5, 7: 15, 14: 25, 30: 50 } as Record<number, number>,
} as const;

// Signals predictions: stake bounds (also enforced in SQL).
export const PREDICTION_STAKE = { min: 10, max: 200 } as const;
