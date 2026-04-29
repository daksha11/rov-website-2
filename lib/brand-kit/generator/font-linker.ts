import type { TypographyConfig } from "@/lib/brand-kit/types";

export function generateFontLink(typography: TypographyConfig): string {
  const urls = new Set<string>();
  if (
    !typography.displayFont.customFontData &&
    typography.displayFont.googleFontsUrl
  ) {
    urls.add(typography.displayFont.googleFontsUrl);
  }
  if (
    !typography.bodyFont.customFontData &&
    typography.bodyFont.googleFontsUrl &&
    typography.bodyFont.googleFontsUrl !== typography.displayFont.googleFontsUrl
  ) {
    urls.add(typography.bodyFont.googleFontsUrl);
  }

  return Array.from(urls)
    .map((url) => `<link href="${url}" rel="stylesheet">`)
    .join("\n");
}

export function generateCustomFontFaces(
  typography: TypographyConfig
): string {
  const faces: string[] = [];
  const seen = new Set<string>();

  for (const font of [typography.displayFont, typography.bodyFont]) {
    if (font.customFontData && !seen.has(font.name)) {
      seen.add(font.name);
      const format = font.customFontFormat || "woff2";
      faces.push(`@font-face {
  font-family: '${font.name}';
  src: url('${font.customFontData}') format('${format}');
  font-display: swap;
}`);
    }
  }

  return faces.join("\n");
}
