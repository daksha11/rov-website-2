// ═══════════════════════════════════════════════════════
// VUE'S BRAIN
//
// Everything Vue is allowed to know, loaded from content/vue-brain and
// scored against a question. One markdown file is one passage; teaching her
// something new is adding a file and nothing else.
//
// Retrieval is deliberately dumb: tags, title, and body terms, no embeddings
// and no vector store. At this size it is as accurate as anything fancier and
// it stays debuggable, which matters more. `retrieve` hands back the score it
// gave every passage, so a bad answer is always traceable to a bad match.
//
// Server only. This reads the filesystem and must never be imported from a
// client component.
// ═══════════════════════════════════════════════════════

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BRAIN_DIR = path.join(process.cwd(), "content/vue-brain");

export interface VueLink {
  label: string;
  href: string;
}

export interface Passage {
  /** Filename without extension. Stable id for logging a match. */
  slug: string;
  title: string;
  tags: string[];
  body: string;
  /**
   * Where this passage sends someone. Declared in frontmatter and rendered by
   * the page verbatim: the model is never asked to write a URL, because a
   * plausible invented path is the one failure a reader cannot spot. Every
   * href here must be a route that actually exists.
   */
  links: VueLink[];
  /**
   * What she offers to answer next. A guide that answers once and goes quiet
   * is a search box; these are the reason someone keeps moving. Every one
   * should land on a passage that exists.
   */
  followups: string[];
  /** Distinct scoreable terms in the body, precomputed once at load. */
  terms: Set<string>;
}

export interface Match {
  passage: Passage;
  score: number;
}

/**
 * Below this, Vue says she does not know rather than answering. The score is
 * normalized by question length (see `score`), so this threshold means the
 * same thing for a three-word question and a twenty-word one. Tune it against
 * real questions, not invented ones.
 */
export const CONFIDENCE_FLOOR = 0.9;

/** How many passages a single answer is allowed to draw on. */
export const MAX_PASSAGES = 3;

// Words that would otherwise match everything and drown the real signal.
const STOP = new Set([
  "the", "and", "for", "are", "but", "not", "you", "your", "with", "that", "this",
  "have", "has", "was", "were", "from", "what", "when", "where", "which", "who",
  "how", "why", "can", "could", "would", "should", "does", "did", "about", "into",
  "our", "their", "they", "them", "its", "it's", "there", "here", "any", "all",
  "get", "got", "tell", "know", "like", "just", "some", "more", "than", "then",
]);

function terms(input: string): string[] {
  const found = input.toLowerCase().match(/[a-z0-9'-]+/g) ?? [];
  return found
    // "what's" has to reduce to "what" or the stop list never catches it, and
    // a contraction sails through as a scoring term.
    .map((t) => t.replace(/'(s|re|ve|ll|d)$/, ""))
    .filter((t) => t.length > 2 && !STOP.has(t));
}

// ── Load ───────────────────────────────────────────────
// Read once per process in production: the files ship with the build, so a new
// passage arrives with a deploy and never changes under a running server.
//
// In development the cache is skipped entirely. Markdown is not a module
// dependency, so Next has no reason to reload this file when a passage is
// edited, and a cached brain means every edit appears to do nothing until the
// server is restarted. Writing a passage and refreshing has to just work, or
// nobody will write passages.
let cache: Passage[] | null = null;
const CACHE_ENABLED = process.env.NODE_ENV === "production";

export function loadBrain(): Passage[] {
  if (cache && CACHE_ENABLED) return cache;
  if (!fs.existsSync(BRAIN_DIR)) {
    cache = [];
    return cache;
  }

  cache = fs
    .readdirSync(BRAIN_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BRAIN_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const body = content.trim();
      const tags: string[] = Array.isArray(data.tags)
        ? data.tags.map((t: unknown) => String(t).toLowerCase())
        : [];
      // Anything missing a label or an href is dropped rather than rendered
      // half-built, so a typo in frontmatter cannot ship a dead link.
      const links: VueLink[] = Array.isArray(data.links)
        ? data.links
            .filter((l: unknown): l is VueLink =>
              !!l && typeof l === "object" &&
              typeof (l as VueLink).label === "string" &&
              typeof (l as VueLink).href === "string"
            )
            .map((l) => ({ label: l.label, href: l.href }))
        : [];
      const followups: string[] = Array.isArray(data.followups)
        ? data.followups.map((f: unknown) => String(f)).filter(Boolean)
        : [];
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title ?? file.replace(/\.md$/, "")),
        tags,
        body,
        links,
        followups,
        terms: new Set(terms(body)),
      };
    });

  return cache;
}

// ── Score ──────────────────────────────────────────────
// A tag hit is the strongest signal, because tags are hand-written to be the
// words a person would actually type. Title next. Body presence last, counted
// once per distinct term so a long passage cannot win on length alone.
const TAG_WEIGHT = 6;
const TITLE_WEIGHT = 3;
const BODY_WEIGHT = 1;

function score(passage: Passage, queryTerms: string[]): number {
  if (queryTerms.length === 0) return 0;

  const titleTerms = new Set(terms(passage.title));
  let total = 0;

  for (const term of queryTerms) {
    // Tags match on a shared prefix, so "price" hits the "pricing" tag and
    // "cheap" hits "cheapest": questions rarely use the exact word a tag was
    // filed under. Prefix, not substring, and never on a stub shorter than
    // four characters, or "framework" answers a question about "work".
    const tagHit = passage.tags.some(
      (tag) =>
        tag === term ||
        (term.length >= 4 && tag.startsWith(term)) ||
        (tag.length >= 4 && term.startsWith(tag))
    );
    if (tagHit) total += TAG_WEIGHT;
    if (titleTerms.has(term)) total += TITLE_WEIGHT;
    if (passage.terms.has(term)) total += BODY_WEIGHT;
  }

  // Normalized by question length so CONFIDENCE_FLOOR is a fixed meaning and
  // not an accident of how verbose the asker was.
  return total / queryTerms.length;
}

/**
 * Everything scored, best first. Returns every passage rather than only the
 * winners, so a route can log the near-misses when an answer looks wrong.
 */
export function scoreAll(question: string): Match[] {
  const queryTerms = terms(question);
  return loadBrain()
    .map((passage) => ({ passage, score: score(passage, queryTerms) }))
    .sort((a, b) => b.score - a.score);
}

/**
 * The passages an answer is allowed to use, or an empty array when nothing
 * clears the floor. An empty result is the signal to say "I don't know that
 * one" without ever calling the model.
 */
export function retrieve(question: string, limit = MAX_PASSAGES): Match[] {
  return scoreAll(question)
    .filter((m) => m.score >= CONFIDENCE_FLOOR)
    .slice(0, limit);
}
