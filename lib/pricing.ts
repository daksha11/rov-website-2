// lib/pricing.ts
// ─────────────────────────────────────────────────────────────
// The one place ROV pricing is written down.
//
// Before this existed, numbers lived inside each service page's tier component
// AND separately inside /web/brief's scopeRead(), so the floor read $1,500 on
// the homepage, $2,000 on /web, and $2,500 on /web/brief. A visitor moving
// deeper watched the price climb. Everything that shows or reasons about a
// price now reads from here.
//
// Commercials, locked with Andi (2026-07-30, capped 2026-08-05):
//   · $2,500 hard floor. No discount ladder below it.
//   · $10,000 ceiling for now. Bigger jobs get phased into multiple Builds
//     rather than quoted as one, which keeps the cap and keeps the lead.
//   · Projects are the entry, retainers are the goal, and the retainer
//     conversation happens during scoping, not at handoff.
//   · Media day-rates are the one deliberate exception to the floor: a day
//     rate is a different product from a project.
//
// Structure follows the Full View (Found, Captured, Answered, Nurtured, Kept),
// not the four practice areas. Practice areas answer "how"; the tier answers
// "what changes for me". Which tier someone needs follows from how many of the
// five moments are leaking, which is exactly what the intake quiz diagnoses.
// ─────────────────────────────────────────────────────────────

/** The five moments in a customer's life with a business. */
export const MOMENTS = [
  { key: "found", label: "Found", blurb: "They can actually find you, and what they find looks like you." },
  { key: "captured", label: "Captured", blurb: "The interested ones leave a name instead of leaving." },
  { key: "answered", label: "Answered", blurb: "Someone replies fast enough to still matter." },
  { key: "nurtured", label: "Nurtured", blurb: "The ones who are not ready yet do not go cold." },
  { key: "kept", label: "Kept", blurb: "After they buy, it still feels like the same company." },
] as const;

export type MomentKey = (typeof MOMENTS)[number]["key"];

export const FLOOR = 2500;
export const CEILING = 10000;

export type Tier = {
  id: string;
  name: string;
  /** Sub-label under the name, e.g. "One moment, done properly". */
  kicker: string;
  priceFrom: number;
  priceTo: number;
  /** Shown under the number. */
  priceSub: string;
  tagline: string;
  bestFor: string;
  support: string;
  recommended?: boolean;
  includesPrefix?: string;
  features: string[];
  /**
   * How many leaking moments point at this tier. The intake quiz counts the
   * moments a visitor reports as broken and lands them here.
   */
  momentsFrom: number;
  momentsTo: number;
};

export const TIERS: Tier[] = [
  {
    id: "fix",
    name: "The Fix",
    kicker: "One moment, done properly",
    priceFrom: 2500,
    priceTo: 4500,
    priceSub: "One-time project fee",
    tagline: "One thing is clearly broken. We fix that thing, properly, and leave.",
    bestFor:
      "Businesses where the rest works and one moment is visibly costing them, usually Found or Captured",
    support: "30 days of post-handoff support",
    momentsFrom: 1,
    momentsTo: 1,
    features: [
      "Audit of the moment that is leaking",
      "Designed and built, not patched",
      "Built on your existing brand, or a light tune-up of it",
      "Measurement so you can see it working",
      "Handoff walkthrough, recorded",
    ],
  },
  {
    id: "build",
    name: "The Full View Build",
    kicker: "The whole path, wired end to end",
    priceFrom: 5000,
    priceTo: 10000,
    priceSub: "One-time project fee, scales with scope",
    tagline:
      "The automated email that goes out at 11pm looks like it came from the same company as the website.",
    bestFor:
      "Businesses that want the whole customer journey to sound like one company instead of five vendors",
    support: "60 days of post-handoff support",
    recommended: true,
    includesPrefix: "Everything in The Fix",
    momentsFrom: 2,
    momentsTo: 5,
    features: [
      "Every leaking moment rebuilt, not just the loudest one",
      "Brand system applied across each surface",
      "Lead capture, routing, and reply automation",
      "Email and lifecycle sequences built and shipped",
      "Confirmations, receipts, and thank-you templates",
      "Tested end to end in your own platform",
    ],
  },
];

export type Retainer = {
  id: string;
  name: string;
  kicker: string;
  priceFrom: number;
  priceTo: number;
  priceSub: string;
  tagline: string;
  features: string[];
};

export const RETAINER: Retainer = {
  id: "retainer",
  name: "The Full View Retainer",
  kicker: "Keeping it working, and making it better",
  priceFrom: 1000,
  priceTo: 3000,
  priceSub: "Per month, no long lock-in",
  tagline: "A build sets the standard. A retainer is how it survives contact with a real year.",
  features: [
    "Ongoing design and build against the same standard",
    "Campaign and lifecycle work as the year needs it",
    "Automation kept running, watched, and adjusted",
    "Reporting on what the moments are actually doing",
    "Priority turnaround on anything urgent",
  ],
};

export type MediaRate = {
  id: string;
  name: string;
  priceFrom: number;
  priceSub: string;
  blurb: string;
};

/**
 * The deliberate exception to the floor. A shoot day is a different product
 * from a project, so it is priced and presented as one rather than being
 * dressed up to clear $2,500.
 */
export const MEDIA: MediaRate[] = [
  {
    id: "property",
    name: "Property and listing",
    priceFrom: 500,
    priceSub: "Per property, from",
    blurb: "Drone, walkthrough, and social-ready cuts. Turned around fast enough to matter to a listing.",
  },
  {
    id: "day",
    name: "Shoot day",
    priceFrom: 500,
    priceSub: "Per day, from",
    blurb: "Events, brand days, content batches. Priced to the day, with the edit scoped to what you need.",
  },
];

/** Currency, no cents, e.g. $2,500. */
export function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

/** "$2,500 to $4,500" */
export function range(from: number, to: number): string {
  return `${fmt(from)} to ${fmt(to)}`;
}

/**
 * The quiz's job: count the moments a visitor says are leaking, get the tier.
 * Zero is treated as one, because someone who filled in an intake form has a
 * problem even if they did not tick a box for it.
 */
export function tierForMoments(count: number): Tier {
  const n = Math.max(1, count);
  return TIERS.find((t) => n >= t.momentsFrom && n <= t.momentsTo) ?? TIERS[TIERS.length - 1];
}

/**
 * What we tell someone whose answers point past the ceiling. Never a no: the
 * work gets phased, which keeps the cap and turns phase two into the retainer
 * conversation we want to be having anyway.
 */
export const OVER_CEILING_NOTE =
  "Bigger than this? We phase it. Two or three Builds in sequence beats one quote nobody can sanity-check, and you see value before the whole thing is finished.";
