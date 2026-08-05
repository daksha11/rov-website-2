// lib/intake.ts
// ─────────────────────────────────────────────────────────────
// Config for the intake quiz, one entry per service.
//
// The quiz is the Full View. Five moments, five plain questions, one screen.
// Every "no" is a leak, the leak count picks the tier (lib/pricing.ts
// tierForMoments), and the reveal shows both before we ask for an email.
//
// Why this shape:
//   · Short. Five taps is short enough that finishing feels free, which is
//     what earns the contact details at the end.
//   · Specific. Web and brand run the visitor's real homepage through
//     /api/web/site-check first, so the quiz opens already knowing something
//     about them. A diagnosis in progress beats a blank form.
//   · Loss-framed. "Three of your five moments are leaking" is the same fact
//     as "we can help with three things" and lands considerably harder.
//
// Adding a service is one entry in SERVICES. No new components, no new route
// handler, no new analytics wiring.
// ─────────────────────────────────────────────────────────────

import type { MomentKey } from "./pricing";

export type MomentQuestion = {
  key: MomentKey;
  /** Asked as a plain yes/no. "No" means the moment leaks. */
  question: string;
  /** Shown under the question, one line, concrete. */
  hint: string;
  /** What we say on the reveal when this one is leaking. */
  leak: string;
};

export type IntakeService = {
  slug: string;
  /** Service page this brief belongs to, for the back link and breadcrumb. */
  parentHref: string;
  parentLabel: string;
  /** Source tag on the lead, e.g. "web:brief". */
  source: string;
  eyebrow: string;
  title: string;
  intro: string;
  /**
   * Run the homepage crawl first. Only meaningful where the visitor's own
   * website is the subject; a video enquiry does not need us reading their
   * meta tags at them.
   */
  crawl: boolean;
  /** First screen's field label when crawl is on. */
  urlLabel?: string;
  urlHint?: string;
  /** Fallback opening question when crawl is off. */
  openingLabel?: string;
  openingHint?: string;
  openingPlaceholder?: string;
  questions: MomentQuestion[];
  /** Placeholder on the free-text box at the gate. */
  notesPlaceholder: string;
};

// The five questions, in Full View order. Shared defaults; a service overrides
// only what genuinely differs, so the vocabulary stays consistent between pages.
const BASE: MomentQuestion[] = [
  {
    key: "found",
    question: "Can people find you without already knowing your name?",
    hint: "Search, maps, or an AI assistant recommending you.",
    leak: "People who are ready to buy what you sell are not finding you.",
  },
  {
    key: "captured",
    question: "Does what they land on turn them into an enquiry?",
    hint: "A clear next step, and a form or number that actually works.",
    leak: "You are paying for attention and letting it leave without a name.",
  },
  {
    key: "answered",
    question: "Does every enquiry get a reply within the hour?",
    hint: "Including evenings and weekends, when most of them come in.",
    leak: "The ones you do catch are going cold before you get back to them.",
  },
  {
    key: "nurtured",
    question: "Do the ones who are not ready yet hear from you again?",
    hint: "Anything deliberate, not just remembering to follow up.",
    leak: "Most of them were going to buy eventually, from whoever stayed in touch.",
  },
  {
    key: "kept",
    question: "After someone buys, does anything reach them?",
    hint: "Receipts, check-ins, a reason to come back.",
    leak: "You are buying every customer twice because the first one never comes back.",
  },
];

function withOverrides(over: Partial<Record<MomentKey, Partial<MomentQuestion>>>): MomentQuestion[] {
  return BASE.map((q) => ({ ...q, ...(over[q.key] || {}) }));
}

export const SERVICES: Record<string, IntakeService> = {
  web: {
    slug: "web",
    parentHref: "/web",
    parentLabel: "Web development",
    source: "web:brief",
    eyebrow: "Project brief",
    title: "Find out what's actually leaking",
    intro:
      "Paste your link and answer five questions. We read your site on the spot, show you which moments are losing people, and tell you what fixing them costs. About a minute, and you keep the answer either way.",
    crawl: true,
    urlLabel: "Your current website",
    urlHint: "paste it even if you hate it, that's useful too",
    questions: withOverrides({}),
    notesPlaceholder:
      "We're rebranding in the spring, and whatever we build has to survive that.",
  },

  brand: {
    slug: "brand",
    parentHref: "/brand",
    parentLabel: "Brand",
    source: "brand:brief",
    eyebrow: "Brand brief",
    title: "See where your brand stops",
    intro:
      "Most identities cover the logo and the website, then stop. Paste your link and answer five questions, and we'll show you which surfaces your brand never reached, and what it takes to finish the job.",
    crawl: true,
    urlLabel: "Your website",
    urlHint: "the surface your brand definitely does reach",
    questions: withOverrides({
      found: {
        question: "Does what people find look like the real thing?",
        hint: "The first impression, before they read a word.",
        leak: "You are being judged on presentation before anyone hears the pitch.",
      },
      kept: {
        question: "Do your receipts and confirmations look like your website?",
        hint: "The automated ones nobody has looked at in two years.",
        leak: "Your brand ends at checkout, and that is the moment people remember.",
      },
    }),
    notesPlaceholder:
      "Our logo is fine, but everything we send out looks like it came from a different company.",
  },

  "ai-automation": {
    slug: "ai-automation",
    parentHref: "/ai-automation",
    parentLabel: "AI automation",
    source: "ai:brief",
    eyebrow: "Automation brief",
    title: "Find out what the manual work is costing you",
    intro:
      "Five questions about what happens after someone reaches out. We'll show you which parts are running on somebody remembering, and what it takes to make them run on their own.",
    crawl: false,
    openingLabel: "What's the business?",
    openingHint: "name or website, whichever is quicker",
    openingPlaceholder: "Webb Heating & Air",
    questions: withOverrides({
      answered: {
        question: "Does every enquiry get a reply within the hour, without you doing it?",
        hint: "Automatically, at 2pm and at 2am.",
        leak: "Speed is the whole game, and right now it depends on somebody being free.",
      },
      nurtured: {
        question: "Does follow-up happen without anyone remembering to?",
        hint: "A real sequence, not a note to call them back.",
        leak: "Your pipeline is leaking through the gap between busy weeks.",
      },
    }),
    notesPlaceholder:
      "Everything goes through one inbox and my ops manager is the only one who knows how it works.",
  },

  "video-production": {
    slug: "video-production",
    parentHref: "/video-production",
    parentLabel: "Video production",
    source: "video:brief",
    eyebrow: "Production brief",
    title: "Tell us what you need shot",
    intro:
      "Five questions about how people meet your business, so the footage does a job instead of sitting in a folder. We come back with a scope and what it costs.",
    crawl: false,
    openingLabel: "What's the business?",
    openingHint: "name or website, whichever is quicker",
    openingPlaceholder: "Bando ATL",
    questions: withOverrides({
      found: {
        question: "When people find you, is there anything to watch?",
        hint: "Something that shows the place, the work, or the people.",
        leak: "You are asking people to imagine what you are like instead of showing them.",
      },
      captured: {
        question: "Does that footage lead anywhere?",
        hint: "A next step attached, not just a nice video.",
        leak: "The views are not turning into anything you can count.",
      },
    }),
    notesPlaceholder: "We need something for the new location opening in the spring.",
  },
};

export const SERVICE_SLUGS = Object.keys(SERVICES);

export function getIntakeService(slug: string): IntakeService | null {
  return SERVICES[slug] ?? null;
}

/** Reveal headline. Loss-framed on purpose; see the note at the top. */
export function leakHeadline(leaking: number, total: number): string {
  if (leaking === 0) return "All five moments are covered. That's rare.";
  if (leaking === 1) return `One of your five moments is leaking.`;
  if (leaking === total) return "All five moments are leaking.";
  return `${leaking} of your five moments are leaking.`;
}
