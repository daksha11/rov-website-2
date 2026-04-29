import type { BrandKitData, SectionConfig } from "@/lib/brand-kit/types";
import { isLightColor } from "@/lib/brand-kit/utils/color-utils";
import { resolveSampleText } from "@/lib/brand-kit/utils/sampleText";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateCover(data: BrandKitData): string {
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const logo = data.logos.variants[0];
  const logoImg = logo
    ? `<div class="cover-logo-wrap"><img src="${logo.file}" alt="${esc(data.brandInfo.name)} logo"></div>`
    : "";

  const tocItems = enabledSections
    .map(
      (s, i) =>
        `<li><a href="#${s.id}"><span class="num">${String(i + 1).padStart(2, "0")}</span>${s.label}</a></li>`
    )
    .join("\n        ");

  return `
  <div class="cover">
    <div class="cover-left">
      <span class="cover-eyebrow">${esc(data.brandInfo.name)}</span>
      ${logoImg}
      <div class="cover-title">
        Brand<br><strong>Guidelines</strong>
      </div>
      <div class="cover-meta">
        <span>${esc(data.brandInfo.version)} — ${esc(data.brandInfo.year)}</span>
        <span>${esc(data.brandInfo.confidentialityNote)}</span>
      </div>
    </div>
    <div class="cover-right">
      <ul class="cover-toc">
        ${tocItems}
      </ul>
    </div>
  </div>`;
}

function generateLogoSection(data: BrandKitData, sectionNum: number): string {
  if (data.logos.variants.length === 0) {
    return `
  <section class="section bg-dark reveal" id="logo">
    <div class="section-label">${String(sectionNum).padStart(2, "0")} — Logo & Mark</div>
    <div class="section-heading">Logo <strong>& Mark</strong></div>
    <p style="opacity:0.4;font-size:14px;">No logo variants uploaded yet.</p>
  </section>`;
  }

  const cells = data.logos.variants
    .map((logo) => {
      const bgColor = logo.defaultBackground || "#1a1a1a";
      const textColor = isLightColor(bgColor) ? "#1a1a1a" : "#f5f5f5";

      const presetButtons = logo.backgroundPresets
        .map(
          (p) =>
            `<button style="background:${p.color}" data-color="${p.color}" title="${esc(p.label)}"></button>`
        )
        .join("");

      const safeLabel = esc(logo.label).replace(/\s+/g, "-").toLowerCase();

      return `
      <div class="logo-cell" style="background:${bgColor};color:${textColor}">
        <div class="logo-bg-switcher">${presetButtons}</div>
        <div class="logo-actions">
          <button class="logo-download-btn"
            data-file="${logo.file}"
            data-filename="${safeLabel}.${logo.format}"
            title="Download ${esc(logo.label)}">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M8 2v9M4 7l4 4 4-4M3 14h10"/>
            </svg>
            Download
          </button>
        </div>
        <img src="${logo.file}" alt="${esc(logo.label)}">
        <span class="logo-cell-label">${esc(logo.label)}</span>
      </div>`;
    })
    .join("");

  return `
  <section class="section bg-dark reveal" id="logo">
    <div class="section-label">${String(sectionNum).padStart(2, "0")} — Logo & Mark</div>
    <div class="section-heading">Logo <strong>& Mark</strong></div>
    <div class="logo-grid">
      ${cells}
    </div>
  </section>`;
}

function generateTypographySection(
  data: BrandKitData,
  sectionNum: number
): string {
  const { displayFont, bodyFont } = data.typography;

  const fontInfoRows = [
    {
      role: "Display",
      font: displayFont,
      family: `'${displayFont.name}', ${displayFont.fallback}`,
    },
    {
      role: "Body",
      font: bodyFont,
      family: `'${bodyFont.name}', ${bodyFont.fallback}`,
    },
  ]
    .map(({ role, font, family }) => {
      const isCustom = !!font.customFontData;
      const downloadAttr = isCustom
        ? `data-custom-font="${font.customFontData}" data-filename="${esc(font.name).replace(/\s+/g, "-").toLowerCase()}.${font.customFontFormat || "woff2"}"`
        : `data-google-font="${esc(font.name)}"`;

      return `
      <div class="font-info-row">
        <div class="font-info-left">
          <span class="font-info-role">${role}</span>
          <span class="font-info-name" style="font-family:${family};">${esc(font.name)}</span>
          <span class="font-info-meta">${isCustom ? `Custom · ${(font.customFontFormat || "woff2").toUpperCase()}` : "Google Fonts"}</span>
        </div>
        <button class="font-download-btn" ${downloadAttr}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 2v9M4 7l4 4 4-4M3 14h10"/>
          </svg>
          ${isCustom ? "Download" : "Get on Google Fonts"}
        </button>
      </div>`;
    })
    .join("");

  const cells = data.typography.scale
    .map((entry, i) => {
      const fontClass =
        entry.fontFamily === "display" ? "type-display" : "type-body-display";
      const style = `font-size:${entry.fontSize};font-weight:${entry.fontWeight};letter-spacing:${entry.letterSpacing};line-height:${entry.lineHeight};${entry.textTransform !== "none" ? `text-transform:${entry.textTransform};` : ""}`;
      const sample = resolveSampleText(entry, data.brandInfo);

      return `
      <div class="type-cell" data-cell-id="${i}">
        <div class="type-cell-header">
          <div class="type-label">${esc(entry.label)}</div>
          <button class="type-reset-btn" title="Reset text">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M2 3v4h4M14 13v-4h-4M3.5 7A5 5 0 0113 8M12.5 9A5 5 0 013 8"/>
            </svg>
            Reset
          </button>
        </div>
        <div class="type-sample-wrap">
          <div class="${fontClass}" style="${style}" contenteditable="true" spellcheck="false" data-default="${esc(sample)}" title="Click to edit">${esc(sample)}</div>
        </div>
        <div class="type-meta">${entry.fontSize} / ${entry.fontWeight} / ${entry.lineHeight}</div>
      </div>`;
    })
    .join("");

  const isLight = data.template === "corporate-blue";
  const bgClass = isLight ? "bg-light" : "bg-darker";

  return `
  <section class="section ${bgClass} reveal" id="typography">
    <div class="section-label">${String(sectionNum).padStart(2, "0")} — Typography</div>
    <div class="section-heading">Type <strong>System</strong></div>
    <div class="font-info-block">
      ${fontInfoRows}
    </div>
    <div class="type-grid">
      ${cells}
    </div>
  </section>`;
}

function generateColorsSection(
  data: BrandKitData,
  sectionNum: number
): string {
  if (data.colors.swatches.length === 0) {
    return `
  <section class="section bg-dark reveal" id="colors">
    <div class="section-label">${String(sectionNum).padStart(2, "0")} — Color Palette</div>
    <div class="section-heading">Color <strong>Palette</strong></div>
    <p style="opacity:0.4;font-size:14px;">No colors defined yet.</p>
  </section>`;
  }

  const swatches = data.colors.swatches
    .map((swatch) => {
      const textColor = isLightColor(swatch.hex) ? "#1a1a1a" : "#f5f5f5";
      return `
      <div class="color-swatch" style="background:${swatch.hex};color:${textColor}" data-hex="${swatch.hex}" data-var="${esc(swatch.cssVariable)}" data-name="${esc(swatch.name)}">
        <div class="swatch-name">${esc(swatch.name)}</div>
        <div class="swatch-role">${esc(swatch.role)}</div>
        <div class="swatch-hex">${swatch.hex}</div>
        <div class="swatch-footer">
          <div class="swatch-unit">
            <button class="active" data-unit="hex">HEX</button>
            <button data-unit="rgb">RGB</button>
            <button data-unit="hsl">HSL</button>
          </div>
          <button class="swatch-copy-css" title="Copy as CSS variable">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="8" height="8" rx="1"/>
              <rect x="5" y="5" width="8" height="8" rx="1"/>
            </svg>
            CSS
          </button>
        </div>
      </div>`;
    })
    .join("");

  return `
  <section class="section bg-darker reveal" id="colors">
    <div class="section-label">${String(sectionNum).padStart(2, "0")} — Color Palette</div>
    <div class="section-heading">Color <strong>Palette</strong></div>
    <div class="color-grid">
      ${swatches}
    </div>
  </section>`;
}

function generateGradientsSection(
  data: BrandKitData,
  sectionNum: number
): string {
  if (data.gradients.length === 0) return "";

  const cards = data.gradients
    .map(
      (g, i) => `
      <div class="gradient-block">
        <div class="gradient-card" style="background:${g.css}" data-css="${esc(g.css)}">
          <button class="gradient-copy-btn" data-css="${esc(g.css)}" data-index="${i}" title="Copy CSS">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="8" height="8" rx="1"/>
              <rect x="5" y="5" width="8" height="8" rx="1"/>
            </svg>
            Copy CSS
          </button>
        </div>
        <div class="gradient-name">${esc(g.name)}</div>
        <div class="gradient-css" data-css="${esc(g.css)}">${esc(g.css)}</div>
      </div>`
    )
    .join("");

  return `
  <section class="section bg-dark reveal" id="gradients">
    <div class="section-label">${String(sectionNum).padStart(2, "0")} — Gradients</div>
    <div class="section-heading">Gradient <strong>System</strong></div>
    <div class="gradient-grid">
      ${cards}
    </div>
  </section>`;
}

function generateVoiceSection(
  data: BrandKitData,
  sectionNum: number
): string {
  const pillars = data.voice.pillars
    .map(
      (p, i) => `
      <div class="voice-pillar">
        <div class="voice-pillar-num">Pillar ${String(i + 1).padStart(2, "0")}</div>
        <div class="voice-pillar-word">${esc(p.word)}</div>
        <div class="voice-pillar-desc">${esc(p.description)}</div>
      </div>`
    )
    .join("");

  const doItems = data.voice.doExamples
    .filter(Boolean)
    .map((e) => `<li>${esc(e)}</li>`)
    .join("");
  const dontItems = data.voice.dontExamples
    .filter(Boolean)
    .map((e) => `<li>${esc(e)}</li>`)
    .join("");

  const examplesHTML =
    doItems || dontItems
      ? `
    <div class="voice-examples">
      <div class="voice-col">
        <h3>Do</h3>
        <ul>${doItems}</ul>
      </div>
      <div class="voice-col">
        <h3>Don't</h3>
        <ul>${dontItems}</ul>
      </div>
    </div>`
      : "";

  return `
  <section class="section bg-dark reveal" id="voice">
    <div class="section-label">${String(sectionNum).padStart(2, "0")} — Brand Voice</div>
    <div class="section-heading">Brand <strong>Voice</strong></div>
    ${pillars ? `<div class="voice-pillars">${pillars}</div>` : ""}
    ${examplesHTML}
  </section>`;
}

function generateNavigation(data: BrandKitData): string {
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  if (data.template === "warm-earth") {
    const dots = enabledSections
      .map(
        (s) => `<a href="#${s.id}" data-label="${esc(s.label)}"></a>`
      )
      .join("");
    return `<nav class="pill-nav">${dots}</nav>`;
  } else {
    const dots = enabledSections
      .map((s) => `<a href="#${s.id}"></a>`)
      .join("");
    return `<nav class="side-nav">${dots}</nav>`;
  }
}

function generateFooter(data: BrandKitData): string {
  return `
  <div class="footer">
    <div>${esc(data.brandInfo.name)} — Brand Guidelines ${esc(data.brandInfo.version)}</div>
    <div style="text-align:right">
      ${esc(data.brandInfo.confidentialityNote)}
      <div style="margin-top:4px;opacity:0.6">Curated with intention by <a href="https://www.rovstudios.com/" target="_blank" rel="noopener"><strong>Range of View Studios</strong></a></div>
    </div>
  </div>`;
}

function generateFloatingActions(): string {
  return `
  <div class="float-actions">
    <button class="float-btn" id="copyTokensBtn">Copy Tokens</button>
    <button class="float-btn" id="printBtn">Print / PDF</button>
  </div>`;
}

const SECTION_GENERATORS: Record<
  string,
  (data: BrandKitData, num: number) => string
> = {
  logo: generateLogoSection,
  typography: generateTypographySection,
  colors: generateColorsSection,
  gradients: generateGradientsSection,
  voice: generateVoiceSection,
};

export function generateHTML(data: BrandKitData): string {
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const cover = generateCover(data);
  const nav = generateNavigation(data);
  const actions = generateFloatingActions();

  let sectionNum = 1;
  const sectionHTML = enabledSections
    .map((section: SectionConfig) => {
      const gen = SECTION_GENERATORS[section.id];
      if (!gen) return "";
      return gen(data, sectionNum++);
    })
    .join("");

  const footer = generateFooter(data);

  return `${cover}
${nav}
${actions}
${sectionHTML}
${footer}
<div class="toast" id="toast">Copied</div>`;
}
