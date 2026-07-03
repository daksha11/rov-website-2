// Shared content contract for interactive "playbook" pages under /resources/playbooks/[slug].
// Unlike the linear toolkit articles, a playbook is a small tabbed application: a
// calculator, an SVG ecosystem diagram, a filterable quote list, a glossary, and an
// accordion teardown all live on one page. This file defines the typed data shape so
// _content/*.ts stays pure data and _components/* stays pure rendering.

export interface PlaybookStat {
  value: string;
  label: string;
}

export interface PlaybookTab {
  id: string;
  label: string;
}

export interface OverviewCard {
  tag: string;
  title: string;
  body: string;
}

export interface OverviewSection {
  sectionLabel: string;
  heading: string;
  lead: string;
  cards: OverviewCard[];
  calloutLabel: string;
  calloutText: string;
}

export interface MoneyFlowSection {
  sectionLabel: string;
  heading: string;
  lead: string;
  calloutLabel: string;
  calloutText: string;
  sourceNote: string;
}

export interface PlayerRole {
  title: string;
  description: string;
  moneyNote: string;
}

/** A single labeled box in the SVG ecosystem/money-flow diagram. */
export interface FlowNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  /** Visual treatment: "hub" = emphasized center node, "warn" = cost/leak node, default = plain. */
  variant?: "hub" | "warn" | "default";
}

/** A directional connector between two flow nodes. */
export interface FlowLink {
  from: string;
  to: string;
  label?: string;
  /** "in" = money/leads flowing toward the agent (rust), "pay" = money the agent pays out (muted red). */
  kind: "in" | "pay";
}

export interface FlowLegendItem {
  color: string;
  label: string;
}

export interface FlowMode {
  key: string;
  label: string;
  viewBox: [number, number, number, number];
  note: string;
  legend: FlowLegendItem[];
  nodes: FlowNode[];
  links: FlowLink[];
}

export interface PlayersSection {
  sectionLabel: string;
  heading: string;
  lead: string;
  flowModes: FlowMode[];
  roles: PlayerRole[];
  calloutLabel: string;
  calloutText: string;
}

export interface PainQuote {
  quote: string;
  who: string;
  tags: string[];
  /** True = a real agent speaking verbatim. False = article/editorial voice. */
  real: boolean;
}

export interface PainFilter {
  id: string;
  label: string;
}

export interface PainSection {
  sectionLabel: string;
  heading: string;
  lead: string;
  filters: PainFilter[];
  quotes: PainQuote[];
}

export interface VocabPair {
  say: string;
  dont: string;
}

export interface VocabSection {
  sectionLabel: string;
  heading: string;
  lead: string;
  pairs: VocabPair[];
  calloutLabel: string;
  calloutText: string;
}

export interface TeardownEntry {
  name: string;
  subtitle: string;
  strengths: string[];
  growthAreas: string[];
}

export interface CompetitionPatternPanel {
  heading: string;
  tableStakesLabel: string;
  tableStakesItems: string[];
  growthLabel: string;
  growthItems: string[];
}

export interface CompetitionSection {
  sectionLabel: string;
  heading: string;
  lead: string;
  entries: TeardownEntry[];
  patternPanel: CompetitionPatternPanel;
}

export interface PlaybookFaq {
  question: string;
  answer: string;
}

export interface PlaybookCta {
  heading: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

export interface PlaybookSeo {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface PlaybookContent {
  /** Matches the [slug] route segment, e.g. "real-estate-agents". */
  slug: string;
  seo: PlaybookSeo;
  breadcrumb: string;
  kicker: string;
  h1: string;
  heroSubtitle: string;
  dateISO: string;
  dateDisplay: string;
  authorName: string;
  authorRole: string;
  stats: PlaybookStat[];
  tabs: PlaybookTab[];
  overview: OverviewSection;
  moneyFlow: MoneyFlowSection;
  players: PlayersSection;
  pain: PainSection;
  vocab: VocabSection;
  competition: CompetitionSection;
  faqs: PlaybookFaq[];
  cta: PlaybookCta;
}
