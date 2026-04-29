import type { BrandKitData } from "@/lib/brand-kit/types";
import { generateFontLink, generateCustomFontFaces } from "./font-linker";
import { generateCSS } from "./css-generator";
import { generateHTML } from "./html-generator";
import { generateJS } from "./js-generator";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function generateBrandKit(data: BrandKitData): string {
  const fontLink = generateFontLink(data.typography);
  const customFontFaces = generateCustomFontFaces(data.typography);
  const css = generateCSS(data);
  const body = generateHTML(data);
  const js = generateJS(data);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(data.brandInfo.name || "Brand")} — Brand Guidelines</title>
${fontLink}
<style>
${customFontFaces}
${css}
</style>
</head>
<body>
${body}
<script>
${js}
</script>
</body>
</html>`;
}
