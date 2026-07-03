// Shared content contract for toolkit articles under /resources/toolkits/[id].
// Both web-dev.ts and design.ts implement this so page.tsx and ToolkitArticleBody
// can render either one without branching on id.

import type { Tool } from "@/app/ctrla/data";

export interface ToolkitStat {
  value: string;
  label: string;
}

export interface ToolkitTocItem {
  id: string;
  label: string;
}

export interface ToolkitMyth {
  myth: string;
  reality: string;
}

export interface ToolkitGuideStep {
  number: number;
  title: string;
  body: string;
  tip?: string;
}

export interface ToolkitFaq {
  question: string;
  answer: string;
}

export interface ToolkitImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ToolkitArticleContent {
  /** Matches the [id] route segment, e.g. "web-dev". */
  id: string;

  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };

  /** Breadcrumb trail label shown under the logo in the hero, e.g. "Resources · Web Dev Toolkit". */
  breadcrumb: string;

  h1: string;
  heroSubtitle: string;
  /** One or two sentence direct answer shown immediately under the hero, before the narrative intro — written so an AI answer engine can lift it verbatim. */
  quickAnswer: string;

  authorName: string;
  authorRole: string;
  authorImage: string;
  /** Display date, e.g. "July 2026". */
  dateDisplay: string;
  /** ISO date for JSON-LD, e.g. "2026-07-03". */
  dateISO: string;
  readingTime: string;

  stats: ToolkitStat[];
  toc: ToolkitTocItem[];

  /** Opening problem-framing section: named person/place, why the stack matters. */
  intro: {
    heading: string;
    paragraphs: string[];
    calloutLabel?: string;
    calloutText?: string;
  };

  toolsSection: {
    heading: string;
    intro: string;
    tools: Tool[];
    image?: ToolkitImage;
  };

  myths: {
    heading: string;
    intro: string;
    items: ToolkitMyth[];
  };

  quickStart: {
    heading: string;
    intro: string;
    steps: ToolkitGuideStep[];
    image?: ToolkitImage;
  };

  whatThisMeans: {
    heading: string;
    paragraphs: string[];
    calloutLabel?: string;
    calloutText?: string;
  };

  faqs: ToolkitFaq[];

  cta: {
    heading: string;
    subtitle: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref: string;
    secondaryLabel: string;
  };
}
