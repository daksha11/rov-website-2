import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  Industry,
  IndustryVisual,
  IndustryProof,
  IndustrySpotlight,
  IndustryShowcaseItem,
  IndustryBodyAside,
  IndustryHeroMedia,
  IndustryCalculator,
  IndustryCalculatorInput,
  IndustryCalculatorStep,
  IndustryCalculatorOption,
  HeroGradient,
} from "@/lib/types";

const INDUSTRIES_DIR = path.join(process.cwd(), "content/industries");

function ensureDir(): boolean {
  return fs.existsSync(INDUSTRIES_DIR);
}

const GRADIENTS: HeroGradient[] = ["ember", "emberDark", "earth"];

function normalizeVisual(raw: unknown): IndustryVisual {
  const v = (raw ?? {}) as Record<string, unknown>;
  const type = v.type as IndustryVisual["type"];

  switch (type) {
    case "process-flow":
      return {
        type: "process-flow",
        title: (v.title as string) ?? "",
        steps: (v.steps as { n: number; title: string; body: string }[]) ?? [],
      };
    case "diagram":
      return {
        type: "diagram",
        title: (v.title as string) ?? "",
        centerLabel: (v.centerLabel as string) ?? "",
        items: (v.items as { title: string; body: string }[]) ?? [],
      };
    case "annotated-mockup":
      return {
        type: "annotated-mockup",
        title: (v.title as string) ?? "",
        image: (v.image as string) ?? "",
        alt: (v.alt as string) ?? "",
        annotations:
          (v.annotations as { x: number; y: number; label: string }[]) ?? [],
      };
    case "before-after":
    default:
      return {
        type: "before-after",
        title: (v.title as string) ?? "",
        before:
          (v.before as { label: string; points: string[] }) ?? {
            label: "",
            points: [],
          },
        after:
          (v.after as { label: string; points: string[] }) ?? {
            label: "",
            points: [],
          },
      };
  }
}

function normalizeProof(raw: unknown): IndustryProof {
  const p = (raw ?? {}) as Record<string, unknown>;
  const type = (p.type as IndustryProof["type"]) ?? "credentials";
  return {
    type,
    heading: (p.heading as string) ?? "",
    body: (p.body as string) ?? "",
    stat: p.stat as IndustryProof["stat"],
    link: (p.link as string) ?? undefined,
    logos: p.logos as IndustryProof["logos"],
    image: (p.image as string) ?? undefined,
    imageAlt: (p.imageAlt as string) ?? undefined,
    points: Array.isArray(p.points)
      ? (p.points as unknown[])
          .map((entry) => {
            const e = (entry ?? {}) as Record<string, unknown>;
            const label = (e.label as string) ?? "";
            const text = (e.text as string) ?? "";
            return label && text ? { label, text } : null;
          })
          .filter((x): x is { label: string; text: string } => x !== null)
      : undefined,
  };
}

/** Spotlight needs a quote and a name to be worth a band; otherwise skip it. */
function normalizeSpotlight(raw: unknown): IndustrySpotlight | undefined {
  const s = (raw ?? {}) as Record<string, unknown>;
  const quote = (s.quote as string) ?? "";
  const name = (s.name as string) ?? "";
  if (!quote || !name) return undefined;
  return {
    quote,
    name,
    role: (s.role as string) ?? "",
    place: (s.place as string) ?? undefined,
    stat: (s.stat as string) ?? undefined,
    image: (s.image as string) ?? undefined,
    imageAlt: (s.imageAlt as string) ?? undefined,
    link: (s.link as string) ?? undefined,
    linkLabel: (s.linkLabel as string) ?? undefined,
  };
}

function normalizeShowcase(raw: unknown): IndustryShowcaseItem[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const items = raw
    .map((entry) => {
      const e = (entry ?? {}) as Record<string, unknown>;
      const src = (e.src as string) ?? "";
      const kind = e.kind === "image" ? "image" : "video";
      if (!src) return null;
      return {
        src,
        kind,
        label: (e.label as string) ?? "",
        ratio: (e.ratio as string) ?? undefined,
        alt: (e.alt as string) ?? undefined,
        result: (e.result as string) ?? undefined,
      } as IndustryShowcaseItem;
    })
    .filter((x): x is IndustryShowcaseItem => x !== null);
  return items.length > 0 ? items : undefined;
}

function normalizeBodyAsides(raw: unknown): IndustryBodyAside[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const str = (v: unknown): string | undefined => {
    if (typeof v !== "string") return undefined;
    const t = v.trim();
    return t === "" ? undefined : t;
  };
  const asides = raw
    .map((entry): IndustryBodyAside | null => {
      const e = (entry ?? {}) as Record<string, unknown>;
      const afterH2 = str(e.afterH2);
      if (!afterH2) return null;

      const rawType = str(e.type);
      const type: IndustryBodyAside["type"] =
        rawType === "media" || rawType === "number" || rawType === "keywords"
          ? rawType
          : "pull";

      const kicker = str(e.kicker);
      const base: IndustryBodyAside = { afterH2, type, kicker };

      if (type === "media") {
        const src = str(e.src);
        if (!src) return null; // media without an asset is meaningless
        const rawKind = str(e.mediaKind);
        const mediaKind: "image" | "video" =
          rawKind === "image" || rawKind === "video"
            ? rawKind
            : /\.mp4($|\?)/i.test(src)
            ? "video"
            : "image";
        return { ...base, src, mediaKind, label: str(e.label) };
      }

      if (type === "number") {
        const value = str(e.value);
        if (!value) return null;
        return { ...base, value, caption: str(e.caption) };
      }

      if (type === "keywords") {
        const items = Array.isArray(e.items)
          ? e.items.map((i) => str(i)).filter((i): i is string => !!i)
          : [];
        if (items.length === 0) return null;
        return { ...base, items };
      }

      // default: pull
      const text = str(e.text);
      if (!text) return null;
      return { ...base, type: "pull", text };
    })
    .filter((x): x is IndustryBodyAside => x !== null);
  return asides.length > 0 ? asides : undefined;
}

function normalizeHeroMedia(raw: unknown): IndustryHeroMedia | undefined {
  const m = (raw ?? {}) as Record<string, unknown>;
  const src = typeof m.src === "string" ? m.src.trim() : "";
  if (!src) return undefined;
  return {
    src,
    poster:
      typeof m.poster === "string" && m.poster.trim() !== ""
        ? m.poster.trim()
        : undefined,
  };
}

/** Format a numeric option boundary with the input's prefix/suffix. */
function fmtOptionValue(v: number, prefix?: string, suffix?: string): string {
  const body = prefix === "$" ? v.toLocaleString("en-US") : String(v);
  return `${prefix ?? ""}${body}${suffix ?? ""}`;
}

/** Auto-generate 4 sensible range chips from min/max/step so a content file
 *  without explicit `options` still renders as a questionnaire. */
function autoOptions(
  min: number,
  max: number,
  step: number | undefined,
  prefix?: string,
  suffix?: string
): IndustryCalculatorOption[] {
  const s = step && step > 0 ? step : 1;
  const snap = (v: number) => {
    const snapped = min + Math.round((v - min) / s) * s;
    // Avoid float noise on fractional steps (e.g. 0.5).
    const fixed = Number(snapped.toFixed(4));
    return Math.min(max, Math.max(min, fixed));
  };
  const span = max - min;
  const t1 = snap(min + span * 0.25);
  const t2 = snap(min + span * 0.5);
  const t3 = snap(min + span * 0.75);
  const mid = (a: number, b: number) => snap((a + b) / 2);
  return [
    { label: `Under ${fmtOptionValue(t1, prefix, suffix)}`, value: mid(min, t1) },
    {
      label: `${fmtOptionValue(t1, prefix, suffix)}-${fmtOptionValue(t2, prefix, suffix)}`,
      value: mid(t1, t2),
    },
    {
      label: `${fmtOptionValue(t2, prefix, suffix)}-${fmtOptionValue(t3, prefix, suffix)}`,
      value: mid(t2, t3),
    },
    { label: `${fmtOptionValue(t3, prefix, suffix)}+`, value: mid(t3, max) },
  ];
}

function normalizeOptions(raw: unknown): IndustryCalculatorOption[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const opts = raw
    .map((entry): IndustryCalculatorOption | null => {
      const o = (entry ?? {}) as Record<string, unknown>;
      const label = typeof o.label === "string" ? o.label.trim() : "";
      const value = Number(o.value);
      if (!label || !Number.isFinite(value)) return null;
      return { label, value };
    })
    .filter((x): x is IndustryCalculatorOption => x !== null);
  return opts.length >= 2 ? opts : undefined;
}

function normalizeCalculator(raw: unknown): IndustryCalculator | undefined {
  const c = (raw ?? {}) as Record<string, unknown>;
  const heading = typeof c.heading === "string" ? c.heading.trim() : "";
  const formula = typeof c.formula === "string" ? c.formula.trim() : "";
  const resultLabel =
    typeof c.resultLabel === "string" ? c.resultLabel.trim() : "";
  if (!heading || !formula || !Array.isArray(c.inputs)) return undefined;

  const inputs = (c.inputs as unknown[])
    .map((entry) => {
      const e = (entry ?? {}) as Record<string, unknown>;
      const key = typeof e.key === "string" ? e.key.trim() : "";
      const label = typeof e.label === "string" ? e.label.trim() : "";
      if (!key || !label) return null;
      const min = Number(e.min ?? 0);
      const max = Number(e.max ?? 100);
      const step = e.step != null ? Number(e.step) : undefined;
      const prefix =
        typeof e.prefix === "string" && e.prefix !== "" ? e.prefix : undefined;
      const suffix =
        typeof e.suffix === "string" && e.suffix !== "" ? e.suffix : undefined;
      return {
        key,
        label,
        question:
          typeof e.question === "string" && e.question.trim() !== ""
            ? e.question.trim()
            : undefined,
        min,
        max,
        step,
        default: Number(e.default ?? e.min ?? 0),
        prefix,
        suffix,
        options:
          normalizeOptions(e.options) ??
          autoOptions(min, max, step, prefix, suffix),
      } as IndustryCalculatorInput;
    })
    .filter((x): x is IndustryCalculatorInput => x !== null);

  if (inputs.length === 0) return undefined;

  const frame = c.frame === "opportunity" ? "opportunity" : "loss";

  return {
    heading,
    eyebrow:
      typeof c.eyebrow === "string" && c.eyebrow.trim() !== ""
        ? c.eyebrow.trim()
        : undefined,
    inputs,
    formula,
    resultLabel,
    note: typeof c.note === "string" ? c.note.trim() : "",
    frame,
    chain: Array.isArray(c.chain)
      ? (c.chain as unknown[])
          .map((entry) => {
            const s = (entry ?? {}) as Record<string, unknown>;
            const stepFormula =
              typeof s.formula === "string" ? s.formula.trim() : "";
            const label = typeof s.label === "string" ? s.label.trim() : "";
            if (!stepFormula || !label) return null;
            const str = (v: unknown) =>
              typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
            return {
              formula: stepFormula,
              label,
              sub: str(s.sub),
              op: str(s.op),
              opValue: str(s.opValue),
              opKey: str(s.opKey),
              opFormula: str(s.opFormula),
              opSuffix: str(s.opSuffix),
              opNote: str(s.opNote),
              widthFormula: str(s.widthFormula),
              currency: s.currency === true,
              end: s.end === true,
            } as IndustryCalculatorStep;
          })
          .filter((x): x is IndustryCalculatorStep => x !== null)
      : undefined,
  };
}

function parseFrontmatter(slug: string, fileContent: string): Industry {
  const { data, content } = matter(fileContent);

  const heroGradient: HeroGradient = GRADIENTS.includes(
    data.heroGradient as HeroGradient
  )
    ? (data.heroGradient as HeroGradient)
    : "ember";

  return {
    slug,
    industry: data.industry ?? "",
    geo: data.geo ?? "Atlanta",
    pitchLine: data.pitchLine ?? "",

    title: data.title ?? "",
    seoTitle: data.seoTitle ?? undefined,
    description: data.description ?? "",
    coverImage: data.coverImage ?? undefined,
    cardImage: data.cardImage ?? undefined,
    cardAlt: data.cardAlt ?? undefined,

    published: data.published ?? false,
    indexed: data.indexed ?? false,
    date: data.date ?? "",
    dateModified: data.dateModified ?? data.date ?? "",

    headline: data.headline ?? "",
    headlineAccent: data.headlineAccent ?? undefined,
    eyebrow: data.eyebrow ?? undefined,
    subhead: data.subhead ?? "",
    heroGradient,
    answerLine: data.answerLine ?? "",
    heroMedia: normalizeHeroMedia(data.heroMedia),

    stats: data.stats ?? [],
    pains: data.pains ?? [],
    services: data.services ?? [],
    visual: normalizeVisual(data.visual),
    showcase: normalizeShowcase(data.showcase),
    showcaseHeading: data.showcaseHeading ?? undefined,
    proof: normalizeProof(data.proof),
    spotlight: normalizeSpotlight(data.spotlight),
    faqs: data.faqs ?? [],
    cta: data.cta ?? { heading: "", body: "", phone: "+1-XXX-XXX-XXXX" },
    calculator: normalizeCalculator(data.calculator),

    marquee: Array.isArray(data.marquee)
      ? (data.marquee as unknown[])
          .filter((x): x is string => typeof x === "string" && x.trim() !== "")
      : undefined,
    pullQuote:
      data.pullQuote && typeof (data.pullQuote as { text?: unknown }).text === "string"
        ? {
            text: String((data.pullQuote as { text: string }).text),
            accent:
              typeof (data.pullQuote as { accent?: unknown }).accent === "string"
                ? String((data.pullQuote as { accent: string }).accent)
                : undefined,
          }
        : undefined,
    bodyAsides: normalizeBodyAsides(data.bodyAsides),

    content,
  };
}

function readAll(): Industry[] {
  if (!ensureDir()) return [];

  // Skip files starting with "_" (e.g. _TEMPLATE.md) and non-markdown.
  const files = fs
    .readdirSync(INDUSTRIES_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(INDUSTRIES_DIR, filename), "utf-8");
    return parseFrontmatter(slug, raw);
  });
}

/** All published ICP pages (drafts included), newest first. */
export function getAllIndustries(): Industry[] {
  return readAll()
    .filter((page) => page.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Only pages cleared for indexing — sitemap + future /industries index. */
export function getIndexedIndustries(): Industry[] {
  return getAllIndustries().filter((page) => page.indexed);
}

export async function getIndustryBySlug(
  slug: string
): Promise<Industry | null> {
  if (!ensureDir()) return null;

  const filePath = path.join(INDUSTRIES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const page = parseFrontmatter(slug, raw);
  if (!page.published) return null;

  // Render the markdown body through the same sanitized pipeline as the blog.
  const { unified } = await import("unified");
  const remarkParse = (await import("remark-parse")).default;
  const remarkRehype = (await import("remark-rehype")).default;
  const rehypeSanitize = (await import("rehype-sanitize")).default;
  const rehypeStringify = (await import("rehype-stringify")).default;

  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(page.content.trim());

  page.htmlContent = result.toString();

  return page;
}
