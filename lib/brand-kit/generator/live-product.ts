import type { BrandKitData } from "@/lib/brand-kit/types";
import { generateFontLink, generateCustomFontFaces } from "./font-linker";
import { isLightColor } from "@/lib/brand-kit/utils/color-utils";

// ═══════════════════════════════════════════════════════
// THE REVEAL — live product reskin
// Renders a small, realistic fake product (landing hero,
// dashboard card, mobile app screen) styled entirely from the
// brand's own tokens: the color ROLES, the two font families,
// and the primary gradient. Nothing here is hardcoded to a
// palette; change a swatch or a font in the wizard and this
// UI restyles on the next debounced render.
//
// Color roles mirror the guidelines generator so "the reveal"
// and the spec sheet always agree:
//   swatches[0]      → ink   (deep background / text on light)
//   swatches[last]   → paper (light surface / text on dark)
//   swatches[1]      → brand (primary accent)
//   swatches[2]      → warm  (secondary accent)
//   swatches[3]      → clay  (tertiary accent)
// ═══════════════════════════════════════════════════════

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface Tokens {
  ink: string;
  paper: string;
  brand: string;
  warm: string;
  clay: string;
  onBrand: string;
  gradient: string;
  onGradient: string;
  displayFont: string;
  bodyFont: string;
}

function resolveTokens(data: BrandKitData): Tokens {
  const swatches = data.colors.swatches;
  const ink = swatches[0]?.hex || "#24123A";
  const paper = swatches[swatches.length - 1]?.hex || "#F0E6E0";
  const brand = swatches[1]?.hex || "#A56A67";
  const warm = swatches[2]?.hex || "#E3C24A";
  const clay = swatches[3]?.hex || brand;

  const gradient =
    data.gradients.find((g) => g.isPrimary)?.css ||
    data.gradients[0]?.css ||
    `linear-gradient(135deg, ${brand} 0%, ${warm} 100%)`;

  // Readable text on filled accents: the whole point of showing a real UI is
  // that contrast either works or it doesn't.
  const onBrand = isLightColor(brand) ? ink : paper;
  // The gradient blends the accents; its first stop is the safest contrast bet.
  const onGradient = isLightColor(brand) ? ink : paper;

  const displayFont = `'${data.typography.displayFont.name}', ${data.typography.displayFont.fallback}`;
  const bodyFont = `'${data.typography.bodyFont.name}', ${data.typography.bodyFont.fallback}`;

  return {
    ink,
    paper,
    brand,
    warm,
    clay,
    onBrand,
    gradient,
    onGradient,
    displayFont,
    bodyFont,
  };
}

function landingHero(name: string, tagline: string): string {
  const headline = tagline || "Everything your team ships, in one place.";
  return `
  <section class="lp-hero">
    <header class="lp-nav">
      <span class="lp-brand">${name}</span>
      <nav class="lp-nav-links">
        <a>Product</a><a>Pricing</a><a>Docs</a>
        <button class="lp-btn lp-btn-ghost">Sign in</button>
        <button class="lp-btn lp-btn-solid">Get started</button>
      </nav>
    </header>
    <div class="lp-hero-body">
      <span class="lp-eyebrow">New · ${name} 2.0</span>
      <h1 class="lp-h1">${escapeHtml(headline)}</h1>
      <p class="lp-lede">Launch faster with a workspace that adapts to how your
        team already works. No setup tax, no lock-in.</p>
      <div class="lp-hero-actions">
        <button class="lp-btn lp-btn-solid lp-btn-lg">Start free trial</button>
        <button class="lp-btn lp-btn-line lp-btn-lg">Book a demo</button>
      </div>
      <div class="lp-logos">Trusted by teams at
        <span>Northwind</span><span>Aperture</span><span>Monolith</span>
      </div>
    </div>
  </section>`;
}

function dashboardCard(): string {
  const bars = [42, 68, 55, 81, 63, 92, 74];
  const barEls = bars
    .map(
      (h, i) =>
        `<span class="lp-bar" style="height:${h}%;${
          i === 5 ? "background:var(--lp-brand);" : ""
        }"></span>`,
    )
    .join("");
  return `
  <section class="lp-dash">
    <div class="lp-card">
      <div class="lp-card-head">
        <div>
          <p class="lp-card-label">Monthly revenue</p>
          <p class="lp-card-value">$48,290</p>
        </div>
        <span class="lp-pill">+12.4%</span>
      </div>
      <div class="lp-chart">${barEls}</div>
      <div class="lp-card-rows">
        <div class="lp-row"><span class="lp-dot"></span>Active projects<b>128</b></div>
        <div class="lp-row"><span class="lp-dot lp-dot-2"></span>In review<b>34</b></div>
        <div class="lp-row"><span class="lp-dot lp-dot-3"></span>Shipped<b>216</b></div>
      </div>
    </div>
  </section>`;
}

function mobileScreen(name: string): string {
  return `
  <section class="lp-mobile">
    <div class="lp-phone">
      <div class="lp-phone-notch"></div>
      <div class="lp-app-head">
        <span class="lp-app-brand">${name}</span>
        <span class="lp-app-av"></span>
      </div>
      <div class="lp-app-hero">
        <p class="lp-app-eyebrow">Today</p>
        <p class="lp-app-title">Good work is a habit.</p>
        <button class="lp-btn lp-btn-solid lp-btn-block">New entry</button>
      </div>
      <div class="lp-app-list">
        <div class="lp-app-item"><span class="lp-app-ic"></span><span>Morning standup</span><b>9:00</b></div>
        <div class="lp-app-item"><span class="lp-app-ic lp-ic-2"></span><span>Design review</span><b>11:30</b></div>
        <div class="lp-app-item"><span class="lp-app-ic lp-ic-3"></span><span>Ship v2.0</span><b>4:00</b></div>
      </div>
    </div>
  </section>`;
}

function styles(t: Tokens): string {
  return `
:root {
  --lp-ink: ${t.ink};
  --lp-paper: ${t.paper};
  --lp-brand: ${t.brand};
  --lp-warm: ${t.warm};
  --lp-clay: ${t.clay};
  --lp-on-brand: ${t.onBrand};
  --lp-grad: ${t.gradient};
  --lp-on-grad: ${t.onGradient};
  --lp-display: ${t.displayFont};
  --lp-body: ${t.bodyFont};
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--lp-body);
  background: var(--lp-ink);
  color: var(--lp-paper);
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
}
.lp-shell { display: flex; flex-direction: column; gap: 28px; padding: 28px; }

/* HERO */
.lp-hero {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 85% 0%, color-mix(in srgb, var(--lp-brand) 26%, transparent) 0%, transparent 60%),
    var(--lp-ink);
  border: 1px solid color-mix(in srgb, var(--lp-paper) 12%, transparent);
  padding: 22px 30px 56px;
}
.lp-nav { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.lp-brand { font-family: var(--lp-display); font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
.lp-nav-links { display: flex; align-items: center; gap: 20px; }
.lp-nav-links a { font-size: 13px; color: color-mix(in srgb, var(--lp-paper) 70%, transparent); cursor: pointer; }
.lp-hero-body { max-width: 620px; margin-top: 52px; }
.lp-eyebrow {
  display: inline-block; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
  padding: 6px 12px; border-radius: 999px; margin-bottom: 22px;
  background: color-mix(in srgb, var(--lp-brand) 18%, transparent);
  color: var(--lp-brand);
  border: 1px solid color-mix(in srgb, var(--lp-brand) 35%, transparent);
}
.lp-h1 {
  font-family: var(--lp-display); font-size: clamp(34px, 5vw, 56px); font-weight: 700;
  line-height: 1.04; letter-spacing: -0.025em; margin-bottom: 20px;
}
.lp-lede { font-size: 17px; max-width: 46ch; color: color-mix(in srgb, var(--lp-paper) 74%, transparent); }
.lp-hero-actions { display: flex; gap: 12px; margin-top: 30px; flex-wrap: wrap; }
.lp-logos {
  margin-top: 44px; font-size: 12px; letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--lp-paper) 48%, transparent);
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
}
.lp-logos span { font-family: var(--lp-display); font-weight: 700; font-size: 15px; color: color-mix(in srgb, var(--lp-paper) 66%, transparent); }

/* BUTTONS */
.lp-btn {
  font-family: var(--lp-body); font-size: 14px; font-weight: 600; cursor: pointer;
  padding: 10px 18px; border-radius: 10px; border: 1px solid transparent; transition: transform 0.15s, filter 0.15s;
}
.lp-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
.lp-btn-lg { padding: 14px 26px; font-size: 15px; }
.lp-btn-block { width: 100%; }
.lp-btn-solid { background: var(--lp-grad); color: var(--lp-on-grad); box-shadow: 0 8px 24px color-mix(in srgb, var(--lp-brand) 30%, transparent); }
.lp-btn-line { background: transparent; color: var(--lp-paper); border-color: color-mix(in srgb, var(--lp-paper) 28%, transparent); }
.lp-btn-ghost { background: transparent; color: color-mix(in srgb, var(--lp-paper) 82%, transparent); }

/* DASHBOARD */
.lp-dash { display: flex; justify-content: center; }
.lp-card {
  width: 100%; max-width: 520px; background: var(--lp-paper); color: var(--lp-ink);
  border-radius: 18px; padding: 26px 28px; box-shadow: 0 24px 60px rgba(0,0,0,0.35);
}
.lp-card-head { display: flex; align-items: flex-start; justify-content: space-between; }
.lp-card-label { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.6; }
.lp-card-value { font-family: var(--lp-display); font-size: 34px; font-weight: 700; letter-spacing: -0.02em; margin-top: 4px; }
.lp-pill {
  font-size: 12px; font-weight: 700; padding: 5px 11px; border-radius: 999px;
  background: color-mix(in srgb, var(--lp-brand) 16%, transparent); color: var(--lp-brand);
}
.lp-chart { display: flex; align-items: flex-end; gap: 8px; height: 96px; margin: 26px 0 8px; }
.lp-bar { flex: 1; border-radius: 5px 5px 0 0; background: color-mix(in srgb, var(--lp-ink) 16%, transparent); }
.lp-card-rows { margin-top: 18px; border-top: 1px solid color-mix(in srgb, var(--lp-ink) 12%, transparent); }
.lp-row { display: flex; align-items: center; gap: 10px; padding: 12px 0; font-size: 14px; border-bottom: 1px solid color-mix(in srgb, var(--lp-ink) 8%, transparent); }
.lp-row b { margin-left: auto; font-family: var(--lp-display); }
.lp-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--lp-brand); }
.lp-dot-2 { background: var(--lp-warm); }
.lp-dot-3 { background: var(--lp-clay); }

/* MOBILE */
.lp-mobile { display: flex; justify-content: center; padding: 8px 0 4px; }
.lp-phone {
  width: 300px; border-radius: 34px; padding: 18px 16px; position: relative;
  background: var(--lp-grad); color: var(--lp-on-grad);
  border: 1px solid color-mix(in srgb, var(--lp-paper) 20%, transparent);
  box-shadow: 0 30px 70px rgba(0,0,0,0.45);
}
.lp-phone-notch { width: 96px; height: 6px; border-radius: 999px; background: color-mix(in srgb, var(--lp-on-grad) 40%, transparent); margin: 2px auto 18px; }
.lp-app-head { display: flex; align-items: center; justify-content: space-between; padding: 0 6px; }
.lp-app-brand { font-family: var(--lp-display); font-weight: 700; font-size: 17px; }
.lp-app-av { width: 30px; height: 30px; border-radius: 50%; background: color-mix(in srgb, var(--lp-on-grad) 30%, transparent); }
.lp-app-hero { padding: 22px 6px 8px; }
.lp-app-eyebrow { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.75; }
.lp-app-title { font-family: var(--lp-display); font-size: 24px; font-weight: 700; line-height: 1.1; margin: 6px 0 18px; letter-spacing: -0.01em; }
.lp-app-list { background: var(--lp-paper); color: var(--lp-ink); border-radius: 20px; padding: 8px 14px; margin-top: 18px; }
.lp-app-item { display: flex; align-items: center; gap: 12px; padding: 14px 4px; font-size: 14px; font-weight: 500; border-bottom: 1px solid color-mix(in srgb, var(--lp-ink) 8%, transparent); }
.lp-app-item:last-child { border-bottom: none; }
.lp-app-item b { margin-left: auto; opacity: 0.55; font-weight: 600; }
.lp-app-ic { width: 30px; height: 30px; border-radius: 9px; background: color-mix(in srgb, var(--lp-brand) 22%, transparent); }
.lp-ic-2 { background: color-mix(in srgb, var(--lp-warm) 26%, transparent); }
.lp-ic-3 { background: color-mix(in srgb, var(--lp-clay) 26%, transparent); }

@media (max-width: 620px) {
  .lp-nav-links a, .lp-btn-ghost { display: none; }
  .lp-shell { padding: 16px; }
}`;
}

export function generateLiveProduct(data: BrandKitData): string {
  const t = resolveTokens(data);
  const name = escapeHtml(data.brandInfo.name || "Your Brand");
  const fontLink = generateFontLink(data.typography);
  const customFontFaces = generateCustomFontFaces(data.typography);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name} — Live Product</title>
${fontLink}
<style>
${customFontFaces}
${styles(t)}
</style>
</head>
<body>
<div class="lp-shell">
${landingHero(name, data.brandInfo.tagline)}
${dashboardCard()}
${mobileScreen(name)}
</div>
</body>
</html>`;
}
