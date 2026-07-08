// ═══════════════════════════════════════════════════════
// CTRL-A — VOLUME MODEL (types)
// A Volume is one monthly issue of CTRL-A. Everything that
// changes issue-to-issue lives on this shape; the toolkit
// subsystem (music / web / design) is evergreen and stays
// in ../data.ts for now.
//
// Publishing a new volume = add one `vol-NN.ts` that
// satisfies `Volume`, register it in ./index.ts, and drop
// its media into /public/ctrla/VOLn.
// ═══════════════════════════════════════════════════════

// ── Masthead / stats ───────────────────────────────────

export interface IssueStat {
  value: string;
  label: string;
}

export interface IssueMeta {
  /** Display volume label, e.g. "Vol. 01". */
  volume: string;
  /** Display edition, e.g. "June 2026". */
  edition: string;
  /** Publishing cadence, e.g. "Monthly". */
  cadence: string;
  tagline: string;
  /** The thesis: what CTRL-A is, and why these sections belong together. */
  thesis: string;
  coverEyebrow: string;
  coverHeadline: string;
  coverDeck: string;
  /** Concrete value, so a cold visitor gets the function, not just the feeling. */
  coverValue: string;
  /** The volume's deep feature headline, kept separate from the cover thesis. */
  featureHeadline: string;
  featureDeck: string;
  stats: IssueStat[];
}

// ── Taste / featured art ───────────────────────────────

export interface OpenCall {
  title: string;
  body: string;
  cta: string;
  email: string;
}

export interface Taste {
  eyebrow: string;
  headline: string;
  lede: string;
  note: string;
  openCall: OpenCall;
}

// ── On repeat ──────────────────────────────────────────

export interface RepeatTrack {
  title: string;
  artist: string;
  image: string;
  url: string;
}

export interface OnRepeat {
  eyebrow: string;
  headline: string;
  note: string;
  tracks: RepeatTrack[];
  /** Spotify playlist promo shown in the soundtrack strip. */
  playlist?: {
    label: string;
    cta: string;
    url: string;
  };
}

// ── Form of the volume (craft) ─────────────────────────

export interface ArtForm {
  eyebrow: string;
  form: string;
  origin: string;
  headline: string;
  blurb: string;
  note: string;
  pullquote: string;
  image?: string;
}

// ── The cookbook / galley ──────────────────────────────

export type GalleyCategory = "meal" | "snack" | "drink";

/**
 * A single recipe. One unified model backs both the galley fridge
 * (interactive, needs `category` + numeric time/cost/serves) and the
 * cookbook teaser (needs the richer `steps` / `by` / `image`). Numeric
 * fields drive the fridge gauges; display copy is derived where needed.
 */
export interface GalleyRecipe {
  id: string;
  category: GalleyCategory;
  name: string;
  /** Culture / origin the dish comes from, e.g. "Korean". */
  cuisine: string;
  blurb: string;
  timeMins: number;
  costUsd: number;
  serves: number;
  ingredients: string[];
  /** Optional method — present on cookbook dishes, wired through the fridge. */
  steps?: string[];
  /** The collaborator / culture it comes by way of, e.g. "by way of DreamAsia". */
  by?: string;
  /** Optional hero food photo. */
  image?: string;
  /** The volume's sneak-peek dish, the most appetising one. */
  featured?: boolean;
}

/**
 * The volume's rotating chef — one slot, refreshed each issue. Surfaces as a
 * photo magnet on the fridge door and a credit line on the standalone page.
 * No accounts or voting: it is just data the team edits per volume.
 */
export interface Chef {
  name: string;
  city: string;
  /** One-line bio, ROV voice. */
  bio: string;
  /** Optional photo path in /public. Falls back to a monogram when absent. */
  photo?: string;
}

export interface Cookbook {
  eyebrow: string;
  headline: string;
  lede: string;
  note: string;
  /** The volume's recipes — the same unified list the galley fridge draws from. */
  recipes: GalleyRecipe[];
  /** The volume's chef of the moment. Optional so older volumes stay valid. */
  chef?: Chef;
  /**
   * Where "Leave something in the fridge" points. Defaults to /contact in the
   * components, so a real submission form URL can be swapped in later.
   */
  submitUrl?: string;
}

// ── Artist showcase ────────────────────────────────────

export interface Artist {
  name: string;
  discipline: string;
  blurb: string;
  quote: string;
  feature?: boolean;
  image?: string;
}

// ── ROV spotlight ──────────────────────────────────────

export interface Spotlight {
  eyebrow: string;
  headline: string;
  body: string;
  tools: string[];
  image?: string;
}

// ── Events ─────────────────────────────────────────────

export interface IssueEvent {
  date: string;
  /** ISO date for schema.org structured data. */
  isoDate: string;
  name: string;
  location: string;
  /** Full venue address for structured data. */
  venue: string;
  badge: "Free" | "Ticketed";
  /** Authoritative outbound link (official source), backlink for SEO/GEO. */
  url: string;
}

export interface EventsCover {
  src: string;
  alt: string;
  label: string;
}

export interface EventSource {
  label: string;
  url: string;
}

// ── Vue closing note ───────────────────────────────────

export interface VueClose {
  eyebrow: string;
  body: string;
  signoff: string;
  signature: string;
}

// ═══════════════════════════════════════════════════════
// THE DEEP FEATURE — a composable beat / module system
// ───────────────────────────────────────────────────────
// Every CTRL-A feature is built from FOUR FIXED BEATS that
// always render, in this order, plus OPTIONAL MODULES a
// volume can include or omit. Fixed beats keep authoring
// cheap (fill the same blanks every issue); optional modules
// stop every story looking identical.
//
//   FIXED  1 · The Open      → `issueOpen`          hero + 1-2 paragraphs + one Vue pull-quote
//   FIXED  2 · The Work      → `bts`                mosaic of 4-8 real media tiles
//   FIXED  3 · The Turn      → `turn`               the one decision that nearly broke the show
//   FIXED  4 · The Toolkit   → `productionToolkit`  how it was made, so you can too
//   OPTION   · The Scale     → `twoCities`          multi-location / multi-show beat
//   OPTION   · The Interview → `interview`          three Q&A
//   OPTION   · The Sound     → `sound`              one embedded track
//
// The DATA field names above are kept stable (issueOpen / bts /
// productionToolkit / twoCities) because `data.ts` and the
// archive route re-export them; the beat NAMES are the authoring
// vocabulary the renderer and the FEATURE-TEMPLATE.md speak in.
// ═══════════════════════════════════════════════════════

export interface MediaPanel {
  src: string;
  label: string;
  ratio: string;
}

export interface CoverShot {
  src: string;
  alt: string;
  label: string;
}

// ── Beat 1 · The Open ──────────────────────────────────
export interface IssueOpen {
  eyebrow: string;
  headline: string;
  /** 1-2 lead paragraphs. */
  body: string[];
  /** The single Vue pull-quote that opens the story. */
  vueNote: string;
  stage: MediaPanel;
}

// ── Beat 2 · The Work ──────────────────────────────────
export interface BtsTile {
  label: string;
  ratio: string;
  /** column span on the 12-col mosaic (desktop). */
  span: number;
  /** full-bleed row on mobile. */
  wide?: boolean;
  img?: string;
  video?: string;
}

export interface Bts {
  eyebrow: string;
  headline: string;
  note: string;
  /** 4-8 real media tiles. Never a placeholder — an honest smaller mosaic beats an aspirational empty one. */
  tiles: BtsTile[];
}

// ── Beat 3 · The Turn ──────────────────────────────────
// The narrative turn: the one obstacle or decision that nearly
// broke the show, and what the team chose. This is what stops the
// feature reading as a gallery with captions.
export interface FeatureTurn {
  eyebrow: string;
  headline: string;
  /** ~150-200 words as 2-3 paragraphs. Finished prose, ROV voice, no hype. */
  body: string[];
  /** One emphasis line pulled from the beat, set large. */
  pullquote: string;
}

// ── Beat 4 · The Toolkit ───────────────────────────────
export interface ProdTool {
  name: string;
  role: string;
  line: string;
}

export interface ProductionToolkit {
  eyebrow: string;
  headline: string;
  note: string;
  tools: ProdTool[];
}

// ── Module · The Scale (multi-location) ────────────────
export interface TwoCities {
  eyebrow: string;
  headline: string;
  body: string;
  panel: MediaPanel;
}

// ── Module · The Interview (three Q&A) ─────────────────
export interface FeatureQA {
  question: string;
  answer: string;
}

export interface FeatureInterview {
  eyebrow: string;
  headline: string;
  /** Who is answering, e.g. "Sam Suen". */
  subject: string;
  /** Exactly three question/answer pairs. */
  qa: FeatureQA[];
}

// ── Module · The Sound (one embedded track) ────────────
export interface FeatureTrack {
  title: string;
  artist: string;
  image: string;
  /** Streaming link the card opens. */
  url: string;
}

export interface FeatureSound {
  eyebrow: string;
  headline: string;
  note?: string;
  track: FeatureTrack;
}

// ── The feature shape ──────────────────────────────────
export interface Feature {
  /** Where the full feature lives, e.g. "/ctrla/dreamasia". */
  href: string;
  /** Shared hero frame — used by both The Open beat and the front-page teaser. */
  coverShot: CoverShot;

  // Four fixed beats (always render, in this order).
  /** Beat 1 · The Open. */
  issueOpen: IssueOpen;
  /** Beat 2 · The Work. */
  bts: Bts;
  /** Beat 3 · The Turn. */
  turn: FeatureTurn;
  /** Beat 4 · The Toolkit. */
  productionToolkit: ProductionToolkit;

  // Optional modules (include or omit per volume).
  /** Module · The Scale. Renders after The Turn when present. */
  twoCities?: TwoCities;
  /** Module · The Interview. */
  interview?: FeatureInterview;
  /** Module · The Sound. */
  sound?: FeatureSound;
}

// ── The volume ─────────────────────────────────────────

export interface Volume {
  /** Numeric volume, e.g. 1. Drives the archive route and display labels. */
  number: number;
  issueMeta: IssueMeta;
  taste: Taste;
  onRepeat: OnRepeat;
  artForm: ArtForm;
  /** The unified recipe list — backs both the fridge and the cookbook teaser. */
  galley: GalleyRecipe[];
  cookbook: Cookbook;
  artists: Artist[];
  spotlight: Spotlight;
  events: IssueEvent[];
  eventSources: EventSource[];
  eventsCover: EventsCover;
  vueClose: VueClose;
  feature: Feature;
}
