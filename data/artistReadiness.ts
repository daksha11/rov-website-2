// The Artist Readiness Audit.
//
// Six questions, not ten. The feeling we want ("I'm missing out on things I
// didn't know I needed") comes from WHEN the loss lands, not from how many
// questions we ask. So every item is chosen because a "no" is genuinely
// alarming, and each "no" fires its `sting` immediately, in the quiz, rather
// than being saved for a summary. Six questions, four or five small alarms,
// about twenty seconds.
//
// Items that were cut for being true but not urgent: presave capture (folds
// into the owned-audience item), press photos, tech rider. They're still in
// Foundation, they're just not what creates the moment.
//
// Copy comes from the internal "Artist Backend" strategy doc, deliberately
// close to verbatim: it's the sharpest writing we have on why any of it matters.

export type PillarKey = "own-work" | "own-audience" | "look-real";

export interface ReadinessItem {
  key: string;
  pillar: PillarKey;
  /** The checklist line. Phrased so "yes" is unambiguous. */
  label: string;
  /** Optional clarifier under the label, for items people over-claim. */
  hint?: string;
  /**
   * Fires the instant they say they don't have it, inside the quiz. Short and
   * concrete: a specific bad outcome, not a category of risk. This is the line
   * doing the emotional work, so it earns the most editing.
   */
  sting: string;
  /** The fuller version, shown in the result. */
  consequence: string;
  /** What we'd hand them. Shown under each gap so it answers itself. */
  deliverable: string;
  /**
   * What this costs bought on its own, in USD. `null` means there's no honest
   * market price (paperwork we template). Null items still count as gaps but
   * are excluded from the money math, which is why the result says "at least".
   */
  piecemeal: number | null;
  /** Included in the shorter manager version of the audit. */
  manager: boolean;
}

export const READINESS_ITEMS: ReadinessItem[] = [
  {
    key: "splits",
    pillar: "own-work",
    label: "Signed split sheets for every song",
    hint: "Who owns what percentage, in writing, signed.",
    sting: "Then the day a song finally works is the day it becomes a dispute.",
    consequence:
      "Two years later a song gets 200k streams, the producer says he was promised 50 percent, you remember 20 percent, and there is no paper. That relationship ends, and often the song gets pulled.",
    deliverable: "A signed PDF per song, plus one running sheet of your whole catalog.",
    piecemeal: null,
    manager: true,
  },
  {
    key: "metadata",
    pillar: "own-work",
    label: "Your ISRC and UPC codes tracked in one place",
    hint: "Plus the exact spelling of your name and how features are formatted.",
    sting: "One wrong upload and your next song lands on a stranger's artist page.",
    consequence:
      "Spotify identifies you by a code, not a name. A single mismatched upload splits your followers and streams across two profiles, and merging them back takes weeks of support tickets. Playlist history usually doesn't transfer.",
    deliverable: "One sheet: every release, every code, every exact spelling. You copy from it every time.",
    piecemeal: null,
    manager: true,
  },
  {
    key: "stems",
    pillar: "own-work",
    label: "Stems and session files backed up somewhere you control",
    hint: "Not on a friend's laptop.",
    sting: "So the remix, the sync placement, and the re-master are all already impossible.",
    consequence:
      "When a song needs a remix, a sync license, a live version, or a re-master three years later, the stems are the only way to do it. No stems, no options, and the opportunity doesn't wait.",
    deliverable: "An organized, named, backed-up vault of every session. We hold it, you request it any time.",
    piecemeal: null,
    manager: true,
  },
  {
    key: "audience",
    pillar: "own-audience",
    label: "A way to reach your fans without paying a platform",
    hint: "Your own domain and an email list, not just a Linktree and a follower count.",
    sting: "Then every release starts from zero, and the rent on attention keeps going up.",
    consequence:
      "Ten thousand followers is a rental. Two thousand emails is an asset, because on release day you can reach all two thousand for free, and first-day numbers are what triggers the algorithm. Without it you're renting your own audience back from Instagram every single time.",
    deliverable: "A release hub on your domain with email capture, plus three automated emails: welcome, release day, show announcement.",
    piecemeal: 600,
    manager: true,
  },
  {
    key: "epk",
    pillar: "look-real",
    label: "An EPK you can send as one link",
    hint: "Bio, photos, music, video, past shows, numbers, contact.",
    sting: "So the pile of Dropbox links you send instead is what decides it.",
    consequence:
      "When a venue, a blog, or a brand asks for your info, you send a scattered pile of links and screenshots. That pile is what decides whether you get taken seriously, and you never find out it was the reason.",
    deliverable: "A live page at your domain plus a downloadable PDF, both generated from the same source.",
    piecemeal: 300,
    manager: true,
  },
  {
    key: "covers",
    pillar: "look-real",
    label: "Cover art that reads as one catalog",
    hint: "Look at your Spotify page. Do the singles belong together?",
    sting: "Six unrelated images reads as someone posting songs, not building a catalog.",
    consequence:
      "Same music, different perception, and perception is most of what gets a curator to take a second look. Six singles that clearly belong together read as an artist with a body of work. Six that don't read as uploads.",
    deliverable: "An art system: type, position, color, photo treatment. Cover one is a design job, every cover after is an hour.",
    piecemeal: 150,
    manager: false,
  },
];

export const MANAGER_ITEMS = READINESS_ITEMS.filter((i) => i.manager);

// ── Roster questions, managers only ──────────────────────────────
// Two, deliberately. A manager is assessing us, not diagnosing themselves.
export const ROSTER_SIZES = [
  { key: "1", label: "Just one", multiplier: 1 },
  { key: "2-4", label: "2 to 4", multiplier: 3 },
  { key: "5-9", label: "5 to 9", multiplier: 7 },
  { key: "10+", label: "10 or more", multiplier: 12 },
] as const;

export const ROSTER_STAGES = [
  { key: "unreleased", label: "Mostly unreleased", sub: "Building toward a first real rollout" },
  { key: "releasing", label: "Releasing regularly", sub: "Music out, growing an audience" },
  { key: "touring", label: "Touring or charting", sub: "Real numbers, real shows" },
] as const;

// ── Result tiers ─────────────────────────────────────────────────
// Three, not five. Three stays honest and avoids the flattery band.
export interface Tier {
  /** Inclusive lower bound on the "have" count, as a fraction of total. */
  minRatio: number;
  headline: string;
  body: string;
}

export const TIERS: Tier[] = [
  {
    minRatio: 0.84,
    headline: "You're running a real operation.",
    body: "Most of the backend is in place. What's left is worth closing before the next release rather than after it.",
  },
  {
    minRatio: 0.4,
    headline: "You're half-built.",
    body: "You've done the visible half. What's missing is the half that decides whether the work compounds or resets every release.",
  },
  {
    minRatio: 0,
    headline: "You have songs, not a catalog.",
    body: "The music is the hard part and you've done it. Everything below is what turns a run of singles into something with value attached to it.",
  },
];

export function tierFor(have: number, total: number): Tier {
  const ratio = total > 0 ? have / total : 0;
  return TIERS.find((t) => ratio >= t.minRatio) ?? TIERS[TIERS.length - 1];
}

// ── Money math ───────────────────────────────────────────────────
// Priced piece by piece vs. one Foundation build. Only items with a real
// `piecemeal` number are summed, hence "at least" in the copy.
//
// Set to $500 per Andi, Aug 2026. Deliberately an aggressive land-grab price:
// at ~30 songs/month capacity, mixing tops out near $1,350/mo, so three
// Foundation sales equal the entire mixing business for a fraction of the
// hours. Worth revisiting upward once the first handful sell.
export const FOUNDATION_PRICE = 500;

export function piecemealTotal(missingKeys: string[]): number {
  return READINESS_ITEMS.filter((i) => missingKeys.includes(i.key)).reduce(
    (sum, i) => sum + (i.piecemeal ?? 0),
    0
  );
}

/** True when a missing item had no quotable price, so we say "at least". */
export function hasUnpricedGaps(missingKeys: string[]): boolean {
  return READINESS_ITEMS.some((i) => missingKeys.includes(i.key) && i.piecemeal === null);
}

export function itemsFor(role: "artist" | "manager" | "other"): ReadinessItem[] {
  return role === "manager" ? MANAGER_ITEMS : READINESS_ITEMS;
}
