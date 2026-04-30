import type { BrandKitData } from "@/lib/brand-kit/types";

export function formatTailwindConfig(data: BrandKitData): string {
  const { brandInfo, colors, typography, gradients } = data;

  const colorEntries = colors.swatches
    .map((s) => {
      const key = (s.role || s.name || s.id)
        .toLowerCase()
        .replace(/\s+/g, "-");
      return `      '${key}': '${s.hex.toUpperCase()}',`;
    })
    .join("\n");

  const gradientEntries = gradients
    .map((g, i) => {
      const key = (g.name || `gradient-${i + 1}`)
        .toLowerCase()
        .replace(/\s+/g, "-");
      return `      '${key}': ${JSON.stringify(g.css)},`;
    })
    .join("\n");

  const displayFamily = [
    typography.displayFont.name,
    typography.displayFont.fallback,
  ]
    .filter(Boolean)
    .map((s) => s.split(",").map((p) => p.trim()))
    .flat();
  const bodyFamily = [typography.bodyFont.name, typography.bodyFont.fallback]
    .filter(Boolean)
    .map((s) => s.split(",").map((p) => p.trim()))
    .flat();

  const safeBrandName = (brandInfo.name || "Brand").replace(/[^\w\s-]/g, "");
  const generatedAt = new Date().toISOString().slice(0, 10);

  return `/**
 * ${safeBrandName} — Tailwind CSS preset
 * Generated ${generatedAt} by Brand Kit Generator.
 *
 * Usage:
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('./brand.preset.cjs')],
 *     content: ['./src/**/*.{js,ts,jsx,tsx}'],
 *   };
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
${colorEntries || "        // no colors defined"}
      },
      backgroundImage: {
${gradientEntries || "        // no gradients defined"}
      },
      fontFamily: {
        display: ${JSON.stringify(displayFamily)},
        body: ${JSON.stringify(bodyFamily)},
      },
    },
  },
};
`;
}
