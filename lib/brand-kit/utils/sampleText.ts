import type { BrandInfo, TypeScaleEntry } from "@/lib/brand-kit/types";

const DEFAULT_SAMPLES: Record<string, true> = {
  "Brand Display": true,
  "Heading One": true,
  "Heading Two": true,
  "Body text for paragraphs and general content across all brand materials.": true,
  "LABEL TEXT": true,
  "Caption or footnote text": true,
};

function pick(entry: TypeScaleEntry, brand: BrandInfo): string {
  const name = brand.name.trim();
  const tagline = brand.tagline.trim();
  if (!name) return entry.sampleText;

  switch (entry.label) {
    case "Display":
      return name;
    case "H1":
      return tagline || name;
    case "H2":
      return tagline ? `${name} — ${tagline}` : `Welcome to ${name}`;
    case "Body":
      return tagline
        ? `${tagline}. This is how ${name} speaks at paragraph level — calm, considered, on-brand across every touchpoint.`
        : `${name} body copy lives here — the long-form voice of the brand across every touchpoint and surface.`;
    case "Label":
      return name.toUpperCase();
    case "Caption":
      return tagline || `${name} — caption copy`;
    default:
      return entry.sampleText;
  }
}

export function resolveSampleText(
  entry: TypeScaleEntry,
  brand: BrandInfo
): string {
  if (!DEFAULT_SAMPLES[entry.sampleText]) return entry.sampleText;
  return pick(entry, brand);
}
