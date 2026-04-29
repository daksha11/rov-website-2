import type { BrandKitData, FontDefinition } from "@/lib/brand-kit/types";

const hr = "\n---\n";

function fontBlock(label: string, font: FontDefinition): string {
  const weights = font.weights?.length ? font.weights.join(", ") : "—";
  const source = font.customFontData
    ? `Custom upload (${font.customFontFormat ?? "font file"})`
    : font.googleFontsUrl || "System / fallback";
  return [
    `### ${label}`,
    ``,
    `- **Family:** \`${font.name}\``,
    `- **Fallback:** \`${font.fallback}\``,
    `- **CSS variable:** \`${font.cssVariable}\``,
    `- **Weights:** ${weights}`,
    `- **Source:** ${source}`,
  ].join("\n");
}

export function formatBrandSpec(data: BrandKitData): string {
  const { brandInfo, colors, typography, gradients, voice, logos, sections } =
    data;

  const lines: string[] = [];

  lines.push(`# ${brandInfo.name || "Brand"} — Dev Spec`);
  if (brandInfo.tagline) lines.push(`> ${brandInfo.tagline}`);
  lines.push("");
  lines.push(
    `**Version:** ${brandInfo.version || "—"}  |  **Year:** ${
      brandInfo.year || "—"
    }  |  **Template:** \`${data.template}\``
  );
  if (brandInfo.website) lines.push(`**Website:** ${brandInfo.website}`);
  if (brandInfo.confidentialityNote)
    lines.push(`**Confidentiality:** ${brandInfo.confidentialityNote}`);

  lines.push(hr, "## Colors", "");
  if (colors.swatches.length === 0) {
    lines.push("_No colors defined._");
  } else {
    lines.push("| Role | Name | Hex | CSS Variable |");
    lines.push("| --- | --- | --- | --- |");
    colors.swatches.forEach((s) => {
      lines.push(
        `| ${s.role} | ${s.name} | \`${s.hex.toUpperCase()}\` | \`${s.cssVariable}\` |`
      );
    });
    lines.push("", "```css", ":root {");
    colors.swatches.forEach((s) => {
      lines.push(`  ${s.cssVariable}: ${s.hex.toUpperCase()};`);
    });
    lines.push("}", "```");
  }

  lines.push(hr, "## Typography", "");
  lines.push(fontBlock("Display Font", typography.displayFont));
  lines.push("");
  lines.push(fontBlock("Body Font", typography.bodyFont));

  if (typography.scale?.length) {
    lines.push("", "### Type Scale", "");
    lines.push("| Label | Family | Size | Weight | Line Height | Tracking |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    typography.scale.forEach((t) => {
      lines.push(
        `| ${t.label} | ${t.fontFamily} | ${t.fontSize} | ${t.fontWeight} | ${t.lineHeight} | ${t.letterSpacing} |`
      );
    });
  }

  lines.push(hr, "## Gradients", "");
  if (gradients.length === 0) {
    lines.push("_No gradients defined._");
  } else {
    gradients.forEach((g) => {
      lines.push(
        `### ${g.name}${g.isPrimary ? " _(primary)_" : ""}`,
        "",
        "```css",
        `background: ${g.css};`,
        "```",
        ""
      );
    });
  }

  lines.push(hr, "## Logos", "");
  if (logos.variants.length === 0) {
    lines.push("_No logo variants uploaded._");
  } else {
    logos.variants.forEach((v) => {
      lines.push(
        `- **${v.label}** — format: \`${v.format}\`, blend: \`${v.blendMode}\``
      );
    });
  }

  lines.push(hr, "## Brand Voice", "");
  if (voice.pillars.length) {
    lines.push("### Pillars", "");
    voice.pillars.forEach((p) => {
      lines.push(`- **${p.word}** — ${p.label}: ${p.description}`);
    });
  }
  if (voice.weAre.length) {
    lines.push("", "### We Are", "");
    voice.weAre.forEach((w) => lines.push(`- ${w}`));
  }
  if (voice.weAreNot.length) {
    lines.push("", "### We Are Not", "");
    voice.weAreNot.forEach((w) => lines.push(`- ${w}`));
  }
  if (voice.doExamples.length) {
    lines.push("", "### Do", "");
    voice.doExamples.forEach((d) => lines.push(`- ${d}`));
  }
  if (voice.dontExamples.length) {
    lines.push("", "### Don't", "");
    voice.dontExamples.forEach((d) => lines.push(`- ${d}`));
  }

  lines.push(hr, "## Sections (Included in HTML Export)", "");
  const enabled = sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  if (enabled.length === 0) {
    lines.push("_No sections enabled._");
  } else {
    enabled.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.label} (\`${s.id}\`)`);
    });
  }

  lines.push(
    hr,
    `_Generated ${new Date().toISOString().slice(0, 10)} by Brand Kit Generator._`
  );

  return lines.join("\n");
}
