// Single source of truth for the Artist Readiness Audit on rovmusic.com.
//
// The audit asks ten yes/no questions about what an artist already has, then
// names what's missing and what it costs. Copy for the consequences comes from
// the internal "Artist Backend" strategy doc, deliberately verbatim: it's the
// sharpest writing we have on why any of this matters.
//
// Two numbers in here need Andi's sign-off before this is truly live:
//   1. `piecemeal` on each item — what that deliverable costs bought alone.
//   2. FOUNDATION_PRICE — must land meaningfully under the piecemeal total or
//      the whole comparison falls apart.

export type PillarKey = "own-work" | "own-audience" | "look-real";

export interface Pillar {
  key: PillarKey;
  /** Shown as the step title during the quiz. */
  title: string;
  /** One line under the title, sets up why this group matters. */
  blurb: string;
}

export const PILLARS: Pillar[] = [
  {
    key: "own-work",
    title: "Own your work",
    blurb: "The paperwork that decides who gets paid when a song starts working.",
  },
  {
    key: "own-audience",
    title: "Own your audience",
    blurb: "Followers are rented. This is the part you actually keep.",
  },
  {
    key: "look-real",
    title: "Look like a real act",
    blurb: "What a booker, a curator, or a brand sees before they decide.",
  },
];

export interface ReadinessItem {
  key: string;
  pillar: PillarKey;
  /** The checklist line. Phrased so "yes" is unambiguous. */
  label: string;
  /** Optional clarifier under the label, for items people over-claim. */
  hint?: string;
  /** Shown in the result when they DON'T have it. From the strategy doc. */
  consequence: string;
  /** What we'd hand them. Shown in the emailed plan and the gap list. */
  deliverable: string;
  /**
   * What this costs bought on its own, in USD. `null` means there's no honest
   * market price (paperwork we template, or a photographer's day rate that
   * varies too much to quote). Null items are counted in the gap but excluded
   * from the money math, which is why the result says "at least".
   */
  piecemeal: number | null;
}

export const READINESS_ITEMS: ReadinessItem[] = [
  // ── Own your work ──────────────────────────────────────────────
  {
    key: "splits",
    pillar: "own-work",
    label: "Signed split sheets for every song",
    hint: "Who owns what percentage, in writing, signed.",
    consequence:
      "Two years later a song gets 200k streams, the producer says he was promised 50 percent, you remember 20 percent, and there is no paper. That relationship ends, and often the song gets pulled.",
    deliverable: "A signed PDF per song, plus one running sheet of your whole catalog.",
    piecemeal: null,
  },
  {
    key: "metadata",
    pillar: "own-work",
    label: "Your ISRC and UPC codes tracked in one place",
    hint: "Plus the exact spelling of your name and how features are formatted.",
    consequence:
      "Spotify identifies you by a code, not a name. One wrong upload and your song lands on a brand new artist page. Split followers, split streams, and merging them back takes weeks of support tickets.",
    deliverable: "One sheet: every release, every code, every exact spelling. You copy from it every time.",
    piecemeal: null,
  },
  {
    key: "stems",
    pillar: "own-work",
    label: "Stems and session files backed up somewhere you control",
    hint: "Not on a friend's laptop.",
    consequence:
      "When a song needs a remix, a sync license, a live version, or a re-master three years later, the stems are the only way to do it. No stems, no options.",
    deliverable: "An organized, named, backed-up vault of every session. We hold it, you request it any time.",
    piecemeal: null,
  },

  // ── Own your audience ──────────────────────────────────────────
  {
    key: "domain",
    pillar: "own-audience",
    label: "Your own domain, not just a Linktree",
    hint: "yourname.com, pointing somewhere you built.",
    consequence:
      "Every link you post sends fans to a platform that owns the relationship. You're renting attention from a landlord that keeps raising the rent.",
    deliverable: "A release hub at your own address that holds the presave before and the links after.",
    piecemeal: 350,
  },
  {
    key: "email",
    pillar: "own-audience",
    label: "An email list you can reach on release day",
    hint: "A list you own, not a follower count.",
    consequence:
      "Ten thousand followers is a rental. Two thousand emails is an asset, because on release day you can reach all two thousand for free, and first day numbers are what triggers the algorithm.",
    deliverable: "Capture on every release, plus three automated emails: welcome, release day, show announcement.",
    piecemeal: 250,
  },
  {
    key: "presave",
    pillar: "own-audience",
    label: "Presaves that capture something, not just link out",
    consequence:
      "A presave that only pushes to Spotify hands the fan to Spotify. You get the stream and lose the person.",
    deliverable: "Presave flow wired to your list, so every release grows an audience you keep.",
    piecemeal: 75,
  },

  // ── Look like a real act ───────────────────────────────────────
  {
    key: "covers",
    pillar: "look-real",
    label: "Cover art that reads as one catalog",
    hint: "Look at your Spotify page. Do the singles belong together?",
    consequence:
      "Six singles that look like six unrelated images reads as somebody posting songs. Six that clearly belong together reads as somebody building a catalog. Same music, different perception, and perception is most of what gets a curator to take a second look.",
    deliverable: "A one page art spec plus a template file. Cover one is a design job, covers two through ten are an hour.",
    piecemeal: 75,
  },
  {
    key: "epk",
    pillar: "look-real",
    label: "An EPK you can send as one link",
    hint: "Bio, photos, music, video, past shows, numbers, contact.",
    consequence:
      "When a venue or a blog asks for your info, you send a pile of Dropbox links and Instagram screenshots. That pile is what decides whether you get taken seriously.",
    deliverable: "A live page at your domain plus a downloadable PDF, both generated from the same source.",
    piecemeal: 300,
  },
  {
    key: "photos",
    pillar: "look-real",
    label: "Press photos from this year",
    consequence:
      "Every booker and every writer needs an image. If the newest one is two years old, that's the version of you that goes out.",
    deliverable: "A shoot and a delivered set, sized and named for press, socials, and DSP profiles.",
    piecemeal: null,
  },
  {
    key: "rider",
    pillar: "look-real",
    label: "A tech rider and input list for shows",
    hint: "What you need from the venue, what plugs in, and where everyone stands.",
    consequence:
      "Venue engineers have thirty minutes and four bands. Explain your setup verbally and you get a rushed, bad mix. Email a clean input list a week ahead and you get treated like a professional act.",
    deliverable: "Three pages in one PDF: rider, input list, stage plot.",
    piecemeal: 95,
  },
];

export const TOTAL_ITEMS = READINESS_ITEMS.length;

// ── Result tiers ─────────────────────────────────────────────────
// Three tiers, not five. Three stays honest and avoids the flattery band.
export interface Tier {
  /** Inclusive lower bound on the "have" count. */
  min: number;
  headline: string;
  body: string;
}

export const TIERS: Tier[] = [
  {
    min: 8,
    headline: "You're running a real operation.",
    body: "Most of the backend is in place. The gaps left are the ones that matter at scale, and they're worth closing before the next release cycle rather than after.",
  },
  {
    min: 4,
    headline: "You're half-built.",
    body: "You've done the visible half. What's missing is the half that decides whether the work compounds or resets every release.",
  },
  {
    min: 0,
    headline: "You have songs, not a catalog.",
    body: "The music is the hard part and you've done it. Everything below is the part that turns a run of singles into something with value attached to it.",
  },
];

export function tierFor(haveCount: number): Tier {
  return TIERS.find((t) => haveCount >= t.min) ?? TIERS[TIERS.length - 1];
}

// ── Money math ───────────────────────────────────────────────────
// Priced piece by piece vs. one Foundation build. Only items with a real
// `piecemeal` number are summed, hence "at least" in the copy.
//
// NEEDS ANDI: confirm before this goes live.
export const FOUNDATION_PRICE = 950;

export function piecemealTotal(missingKeys: string[]): number {
  return READINESS_ITEMS.filter((i) => missingKeys.includes(i.key)).reduce(
    (sum, i) => sum + (i.piecemeal ?? 0),
    0
  );
}

/** True when at least one missing item had no quotable price, so we say "at least". */
export function hasUnpricedGaps(missingKeys: string[]): boolean {
  return READINESS_ITEMS.some((i) => missingKeys.includes(i.key) && i.piecemeal === null);
}
