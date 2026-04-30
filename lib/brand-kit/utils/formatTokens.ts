import type { BrandKitData } from "@/lib/brand-kit/types";

export function formatTokens(data: BrandKitData): string {
  const { brandInfo, colors, typography, gradients } = data;

  const colorMap: Record<string, string> = {};
  colors.swatches.forEach((s) => {
    const key = (s.role || s.name || s.id).toLowerCase().replace(/\s+/g, "-");
    colorMap[key] = s.hex.toUpperCase();
  });

  const gradientMap: Record<string, string> = {};
  gradients.forEach((g, i) => {
    const key = (g.name || `gradient-${i + 1}`).toLowerCase().replace(/\s+/g, "-");
    gradientMap[key] = g.css;
  });

  const typeScale: Record<
    string,
    {
      fontFamily: "display" | "body";
      fontSize: string;
      fontWeight: number;
      lineHeight: string;
      letterSpacing: string;
      textTransform: string;
    }
  > = {};
  typography.scale.forEach((t) => {
    const key = t.label.toLowerCase().replace(/\s+/g, "-");
    typeScale[key] = {
      fontFamily: t.fontFamily,
      fontSize: t.fontSize,
      fontWeight: t.fontWeight,
      lineHeight: t.lineHeight,
      letterSpacing: t.letterSpacing,
      textTransform: t.textTransform,
    };
  });

  const tokens = {
    $metadata: {
      brand: brandInfo.name,
      version: brandInfo.version,
      year: brandInfo.year,
      generated: new Date().toISOString(),
      generator: "Brand Kit Generator",
    },
    color: colorMap,
    gradient: gradientMap,
    font: {
      display: {
        family: typography.displayFont.name,
        fallback: typography.displayFont.fallback,
        weights: typography.displayFont.weights,
        cssVariable: typography.displayFont.cssVariable,
        source: typography.displayFont.customFontData
          ? "custom"
          : typography.displayFont.googleFontsUrl,
      },
      body: {
        family: typography.bodyFont.name,
        fallback: typography.bodyFont.fallback,
        weights: typography.bodyFont.weights,
        cssVariable: typography.bodyFont.cssVariable,
        source: typography.bodyFont.customFontData
          ? "custom"
          : typography.bodyFont.googleFontsUrl,
      },
    },
    typography: typeScale,
  };

  return JSON.stringify(tokens, null, 2);
}
