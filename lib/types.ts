export interface ChatbotMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatbotResponse {
  success: boolean;
  response: string;
  error?: string;
  details?: string;
}

export interface ChatbotRequest {
  message: string;
  timestamp?: string;
  source?: string;
}

// ─── ICP Industry landing pages (content/industries/*.md) ───────────────
// Content-driven sales pages at /industries/[slug]. Frontmatter drives the
// structured sections; the markdown body is the long-form Main Content.

export interface IndustryStat {
  value: string;
  label: string;
}

export interface IndustryPain {
  title: string;
  body: string;
}

export interface IndustryService {
  name: string;
  blurb: string;
}

export interface IndustryFaq {
  q: string;
  a: string;
}

/** Discriminated union on `type` — exactly one visual per page. */
export type IndustryVisual =
  | {
      type: "before-after";
      title: string;
      before: { label: string; points: string[] };
      after: { label: string; points: string[] };
    }
  | {
      type: "process-flow";
      title: string;
      steps: { n: number; title: string; body: string }[];
    }
  | {
      type: "diagram";
      title: string;
      centerLabel: string;
      items: { title: string; body: string }[];
    }
  | {
      type: "annotated-mockup";
      title: string;
      image: string;
      alt: string;
      annotations: { x: number; y: number; label: string }[];
    };

export interface IndustryProof {
  type: "case-study" | "logos" | "credentials";
  heading: string;
  body: string;
  stat?: { value: string; label: string };
  link?: string;
  /** logos type only — array of { src, alt } for the logo row. */
  logos?: { src: string; alt: string }[];
  /** Optional image (webp) shown inside the proof panel as visual proof. */
  image?: string;
  /** Alt text for `image`. */
  imageAlt?: string;
  /**
   * credentials type only. Supply four short points and the panel renders the
   * body as a lede plus a 2x2 card grid instead of one long paragraph. Omit to
   * keep the original single-paragraph layout.
   */
  points?: { label: string; text: string }[];
}

/**
 * A single client quote given a full band of its own. Used where one real,
 * on-corridor client says the thing better than a row of small cards can.
 * `place` is the client's location (a landmark, not an endorsement by it).
 */
export interface IndustrySpotlight {
  quote: string;
  name: string;
  role: string;
  /** Where the client's business sits, e.g. "Citizen Supply, Ponce City Market". */
  place?: string;
  /** Short result badge, e.g. "+30% sales". */
  stat?: string;
  image?: string;
  imageAlt?: string;
  /** Internal href to the full case study. */
  link?: string;
  linkLabel?: string;
}

/** One media card in the IndustryShowcase band. Videos are lazy-mounted below
 *  the fold (IntersectionObserver + gradient placeholder pre-mount); images go
 *  through next/image. All paths must already exist in public/. */
export interface IndustryShowcaseItem {
  src: string;
  kind: "video" | "image";
  label: string;
  /** CSS aspect-ratio, e.g. "16 / 9" (default) or "9 / 16" for vertical clips. */
  ratio?: string;
  /** Optional alt text for images (falls back to `label`). */
  alt?: string;
  /** One-line result caption shown under the title on the featured-work card. */
  result?: string;
}

/** Full-bleed media layer behind the hero text (SoundHero-style). The CSS
 *  splash still paints first for LCP; this video fades in client-side only,
 *  after mount + in-view, and never appears in SSR HTML. Omit for pages with
 *  no assigned footage (they stay pure CSS splash). */
export interface IndustryHeroMedia {
  /** Path to an existing muted/loopable mp4 in public/. */
  src: string;
  /** Optional poster still (existing webp). Never required. */
  poster?: string;
}

/** One answer chip in a questionnaire step. `value` feeds the formula. */
export interface IndustryCalculatorOption {
  label: string;
  value: number;
}

/** One questionnaire step for the per-page IndustryCalculator. Rendered as a
 *  conversational question with 3-5 large answer chips (ranges, not sliders).
 *  `question` is the reader-facing phrasing; falls back to `label`. `options`
 *  are the chips; when omitted, 4 range choices are auto-generated from
 *  min/max/step so a template block still works. */
export interface IndustryCalculatorInput {
  key: string;
  label: string;
  /** Conversational phrasing shown as the step question, e.g.
   *  "How many calls do you miss in a week?" */
  question?: string;
  min: number;
  max: number;
  step?: number;
  default: number;
  /** e.g. "$" rendered before the value. */
  prefix?: string;
  /** e.g. "%" or "/wk" rendered after the value. */
  suffix?: string;
  /** 3-5 answer chips. Auto-generated from min/max/step when absent. */
  options?: IndustryCalculatorOption[];
}

/** Honest, input-driven arithmetic widget (one per page). `formula` is a safe
 *  declarative expression over the input keys, evaluated by a tiny parser that
 *  supports only the four arithmetic operators and parentheses (never eval).
 *  Results are labeled as estimates, never ROV claims. */
/**
 * One rung of the estimator's narrowing chain, matching the funnel device in
 * the outreach visibility report: the operation that got here, then the number
 * it produced. Every field is declarative so the arithmetic stays in content.
 *
 *  - `formula`   expression over input keys, run through the same safe parser
 *                as `IndustryCalculator.formula`. This rung's value.
 *  - `opKey`     names an input whose chosen answer is the operand, so the
 *                operand shown is always the reader's own answer.
 *  - `widthFormula` sets the bar width as a percentage (clamped 2-100). Omit
 *                for a full-width bar.
 */
export interface IndustryCalculatorStep {
  formula: string;
  label: string;
  /** Small caps qualifier beside the number, e.g. "a year". */
  sub?: string;
  op?: string;
  /** Literal operand, e.g. "52". Ignored when `opKey` or `opFormula` is set. */
  opValue?: string;
  opKey?: string;
  /** Operand computed from inputs, for an operand that is not one answer
   *  (e.g. the gap between two rates). Takes precedence over `opKey`. */
  opFormula?: string;
  /** Appended to an `opFormula` result, e.g. "%". */
  opSuffix?: string;
  opNote?: string;
  widthFormula?: string;
  /** Render the value as currency rather than a plain count. */
  currency?: boolean;
  /** The final rung: ember treatment and a dashed border. */
  end?: boolean;
}

export interface IndustryCalculator {
  heading: string;
  /** Small ember eyebrow above the heading. */
  eyebrow?: string;
  inputs: IndustryCalculatorInput[];
  /** Declarative expression over input keys, e.g. "calls * 52 * rate / 100 * job". */
  formula: string;
  /** Label under the big result number. */
  resultLabel: string;
  /** Honest footnote clarifying this is an estimate from the reader's inputs. */
  note: string;
  /** "loss" (money leaking, default) or "opportunity" (money on the table). */
  frame?: "loss" | "opportunity";
  /** Optional narrowing chain shown on the result screen. Falls back to a
   *  compact answer strip when absent. */
  chain?: IndustryCalculatorStep[];
}

export interface IndustryCta {
  heading: string;
  body: string;
  phone: string;
}
/** Optional editorial pull-quote band. `accent` is a substring of `text`
 *  rendered in the ember gradient (must appear verbatim in `text`). */
export interface IndustryPullQuote {
  text: string;
  accent?: string;
}

/** The four visual-companion treatments a body chapter can carry. */
export type IndustryBodyAsideType = "pull" | "media" | "number" | "keywords";

/** One visual companion promoted beside a body chapter, into the freed grid
 *  column of the IndustryBody section. `afterH2` matches the H2 heading text
 *  (punctuation-insensitive) the companion sits beside. Every companion is
 *  aria-hidden supplementary emphasis of content already present in the prose
 *  flow (never a new claim), so the canonical copy still reads once for GEO/AEO.
 *
 *  `type` selects the treatment (default "pull") and picks which fields apply:
 *   - "pull":     `text` (a strong line lifted verbatim / near-verbatim) + `kicker?`.
 *   - "media":    `src` (an existing public asset) + `mediaKind?` ("video" for
 *                 .mp4, else "image", auto-detected from the extension when
 *                 omitted) + `label?` (short caption) + `kicker?`.
 *   - "number":   `value` (an oversized numeral/stat pulled from the prose) +
 *                 `caption?` + `kicker?`.
 *   - "keywords": `items` (3-4 short phrases from the prose) + `kicker?`.
 *  `kicker` is an optional small ember label shared across every type. */
export interface IndustryBodyAside {
  afterH2: string;
  type?: IndustryBodyAsideType;
  kicker?: string;
  // pull
  text?: string;
  // media
  src?: string;
  mediaKind?: "image" | "video";
  label?: string;
  // number
  value?: string;
  caption?: string;
  // keywords
  items?: string[];
}

export type HeroGradient = "ember" | "emberDark" | "earth";

export interface Industry {
  // Identity
  slug: string;
  industry: string;
  geo: string;
  pitchLine: string;

  // SEO
  title: string;
  seoTitle?: string;
  description: string;
  coverImage?: string;
  /** Still used on the /industries index card. Must be a real file in public/. */
  cardImage?: string;
  cardAlt?: string;

  // Lifecycle
  published: boolean;
  indexed: boolean;
  date: string;
  dateModified: string;

  // Hero
  headline: string;
  /** Gradient italic accent line rendered under the solid-white headline
   *  (live service-page hero pattern). Optional; hero degrades to headline-only. */
  headlineAccent?: string;
  /** Uppercase pill-badge eyebrow above the headline, e.g. "FOR ATLANTA RESTAURANTS".
   *  Falls back to `${industry} · ${geo}` when absent. */
  eyebrow?: string;
  subhead: string;
  heroGradient: HeroGradient;
  answerLine: string;
  /** Optional full-bleed hero media (client-only fade-in). */
  heroMedia?: IndustryHeroMedia;

  // Structured sections
  stats: IndustryStat[];
  pains: IndustryPain[];
  services: IndustryService[];
  visual: IndustryVisual;
  /** Optional media band (existing repo assets) between Services and Body. */
  showcase?: IndustryShowcaseItem[];
  /** Optional heading for the showcase band (Norwige). */
  showcaseHeading?: string;
  proof: IndustryProof;
  /** Optional full-width client spotlight band (one quote, shown large). */
  spotlight?: IndustrySpotlight;
  faqs: IndustryFaq[];
  cta: IndustryCta;
  /** Optional per-page interactive estimate widget. */
  calculator?: IndustryCalculator;

  // Optional presentation fields (composition / rhythm layer)
  /** Thin scrolling ticker phrases (no separators; the UI adds ·). */
  marquee?: string[];
  /** One editorial pull-quote band per page. */
  pullQuote?: IndustryPullQuote;
  /** Pull-asides promoted into the IndustryBody grid, keyed by the H2 they
   *  follow. Purely presentational; never changes GEO/AEO copy order. */
  bodyAsides?: IndustryBodyAside[];

  // Body (rendered markdown)
  content: string;
  htmlContent?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  /** Optional shorter title for the <title> tag / OG (keeps SERP titles from
   *  truncating while the long, keyword-rich title stays as the on-page H1). */
  seoTitle?: string;
  description: string;
  author: string;
  /** Author's job title — emitted as Person.jobTitle in BlogPosting schema. */
  authorRole?: string;
  /** Link to the author's bio (e.g. /about) — strengthens E-E-A-T. */
  authorUrl?: string;
  date: string;
  dateModified: string;
  category: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  atlantaAngle: string;
  published: boolean;
  /** When set, this post is a listing stub for a page that lives elsewhere
   *  (e.g. a /web GEO landing page). The blog card links here and /blog/[slug]
   *  redirects here, so the card surfaces the page without duplicating it. */
  externalUrl?: string;
  coverImage?: string;
  content: string;
  htmlContent?: string;
  faqs?: { question: string; answer: string }[];
}