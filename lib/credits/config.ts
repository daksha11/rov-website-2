// ─────────────────────────────────────────────────────────────
// CTRL-A Credits — reward + cost table.
// One place to tune the economy. Point values are intentionally
// easy to change.
//
// `once`  marks a one-time reward (deduped server-side, key user:action).
// `cap`   marks a capped-but-repeatable reward (e.g. weekly), the earn
//         route builds a period-scoped dedupe key so it lands once per period.
// `claim` marks a reward a signed-in user may claim from the browser via
//         /api/credits/earn. Server-attributed rewards (referral, the
//         contribution awards granted on review) are deliberately not claimable.
// ─────────────────────────────────────────────────────────────

export type EarnAction =
  | "follow-instagram"
  | "referral"
  | "social-engagement"
  | "guide-complete"
  | "contribution-approved"
  | "contribution-featured";

export interface Reward {
  points: number;
  once: boolean;
  label: string;
  /** Repeatable-but-capped cadence. The earn route scopes the dedupe key to the period. */
  cap?: "weekly";
  /** Browser-claimable via /api/credits/earn. Server-attributed rewards omit this. */
  claim?: boolean;
  /** One-time per some meta key (e.g. per guide slug) rather than once ever. */
  perMeta?: "guide";
}

export const REWARDS: Record<EarnAction, Reward> = {
  // Honor-system: opens Instagram, then the user claims. One-time.
  "follow-instagram": { points: 100, once: true, claim: true, label: "Follow us on Instagram" },
  // Awarded to the referrer each time a new person signs up with their link.
  referral: { points: 250, once: false, label: "Refer a friend" },
  // Honor-system share/tag/story featuring CTRL-A. Repeatable, weekly-capped.
  "social-engagement": { points: 50, once: false, cap: "weekly", claim: true, label: "Share CTRL-A" },
  // Finishing a gated guide. One-time PER guide (dedupe includes the slug).
  "guide-complete": { points: 75, once: true, perMeta: "guide", claim: true, label: "Complete a guide" },
  // Granted server-side on review. Not claimable.
  "contribution-approved": { points: 100, once: false, label: "Contribution approved" },
  "contribution-featured": { points: 250, once: false, label: "Contribution featured" },
} as const;

// What credits buy. Keep brand-kit export at its existing cost.
// Keys double as the spend `reason` (the ledger records `spend:<key>`).
export const COSTS = {
  "brand-kit-export": 50,
  "premium-download": 75,
  "premium-course": 100,
  "art-feature": 150,
  "story-feature": 250,
} as const;

export type CostItem = keyof typeof COSTS;

// Actions a signed-in user may claim directly from the browser (via the
// earn route). Derived from `claim` so the two never drift.
export const CLAIMABLE: EarnAction[] = (Object.keys(REWARDS) as EarnAction[]).filter(
  (a) => REWARDS[a].claim,
);

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
