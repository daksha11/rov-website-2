import type { BrandKitData, TemplateId } from "@/lib/brand-kit/types";

function escapeCSS(str: string): string {
  return str.replace(/</g, "\\3c ").replace(/>/g, "\\3e ");
}

// Helper: convert hex (#RRGGBB) to "R, G, B" string
function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return "240,230,224";
  return `${r}, ${g}, ${b}`;
}

// Helper: darken a hex color by a simple factor (0–1 = fraction to darken)
function darkenHex(hex: string, factor: number): string {
  const clean = hex.replace("#", "");
  const r = Math.round(parseInt(clean.slice(0, 2), 16) * (1 - factor));
  const g = Math.round(parseInt(clean.slice(2, 4), 16) * (1 - factor));
  const b = Math.round(parseInt(clean.slice(4, 6), 16) * (1 - factor));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Helper: lighten a hex color by mixing with white
function lightenHex(hex: string, factor: number): string {
  const clean = hex.replace("#", "");
  const r = Math.round(parseInt(clean.slice(0, 2), 16) + (255 - parseInt(clean.slice(0, 2), 16)) * factor);
  const g = Math.round(parseInt(clean.slice(2, 4), 16) + (255 - parseInt(clean.slice(2, 4), 16)) * factor);
  const b = Math.round(parseInt(clean.slice(4, 6), 16) + (255 - parseInt(clean.slice(4, 6), 16)) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function getTemplateCSS(template: TemplateId, data: BrandKitData): string {
  if (template === "warm-earth") {
    const displayFont = `'${escapeCSS(data.typography.displayFont.name)}', ${data.typography.displayFont.fallback}`;
    const bodyFont = `'${escapeCSS(data.typography.bodyFont.name)}', ${data.typography.bodyFont.fallback}`;
    // ── Color mapping ──────────────────────────────────────────────────────
    const ink      = data.colors.swatches[0]?.hex || "#24123A";
    const paper    = data.colors.swatches[data.colors.swatches.length - 1]?.hex || "#F0E6E0";
    const ember    = data.colors.swatches[1]?.hex || "#A56A67";
    const warm     = data.colors.swatches[2]?.hex || "#E3C24A";
    const clay     = data.colors.swatches[3]?.hex || "#A56A67";

    // Derived ink shades
    const ink2 = darkenHex(ink, 0.28);  // ~--ink-2: shadow/elevated
    const ink3 = lightenHex(ink, 0.35); // ~--ink-3: surface card brown

    // RGB breakouts
    const paperRgb = hexToRgb(paper);
    const emberRgb = hexToRgb(ember);
    const warmRgb  = hexToRgb(warm);
    const clayRgb  = hexToRgb(clay);

    // Gradients — use data.gradients if provided, else fall back to rovbrandkit defaults
    const gradBrown  = data.gradients.find(g => g.name?.toLowerCase().includes("brown"))?.css
      || `linear-gradient(132deg, ${warm} 4.77%, ${clay} 27.26%, ${ember} 50.09%, ${ink} 76.74%)`;
    const gradEmbers = data.gradients.find(g => g.name?.toLowerCase().includes("ember"))?.css
      || `linear-gradient(135deg, ${paper} 0%, ${warm} 45%, ${ember} 100%)`;
    const gradDusk   = data.gradients.find(g => g.name?.toLowerCase().includes("dusk"))?.css
      || `linear-gradient(135deg, ${ink} 0%, ${ink3} 50%, ${ember} 100%)`;
    const gradClay   = data.gradients.find(g => g.name?.toLowerCase().includes("clay"))?.css
      || `linear-gradient(180deg, ${paper} 0%, #A56A67 55%, #4E3D73 100%)`;
    const gradSignal = data.gradients.find(g => g.name?.toLowerCase().includes("signal"))?.css
      || `linear-gradient(90deg, ${ember} 0%, ${warm} 100%)`;
    const gradHearth = data.gradients.find(g => g.name?.toLowerCase().includes("hearth"))?.css
      || `radial-gradient(circle at 30% 30%, rgba(${warmRgb},0.35) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(${emberRgb},0.30) 0%, transparent 50%), ${ink}`;

    return `
:root {
  /* ROV palette · warm clay, brown, rust */
  --ink:        ${ink};
  --ink-2:      ${ink2};
  --ink-3:      ${ink3};
  --paper:      ${paper};
  --paper-rgb:  ${paperRgb};
  --paper-2:    rgba(${paperRgb}, 0.68);
  --paper-3:    rgba(${paperRgb}, 0.44);
  --paper-4:    rgba(${paperRgb}, 0.22);
  --ember:      ${ember};
  --ember-rgb:  ${emberRgb};
  --ember-soft: rgba(${emberRgb}, 0.18);
  --warm:       ${warm};
  --warm-rgb:   ${warmRgb};
  --clay:       ${clay};
  --clay-rgb:   ${clayRgb};
  --border:     rgba(${paperRgb}, 0.08);
  --border-strong: rgba(${paperRgb}, 0.20);

  --f-display: ${displayFont};
  --f-body:    ${bodyFont};
  --f-mono:    'JetBrains Mono', 'SF Mono', monospace;

  /* Gradients · Brown is the signature; others extend the system */
  --grad-brown:  ${gradBrown};
  --grad-embers: ${gradEmbers};
  --grad-dusk:   ${gradDusk};
  --grad-clay:   ${gradClay};
  --grad-signal: ${gradSignal};
  --grad-hearth: ${gradHearth};
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--f-body);
  background: var(--ink);
  color: var(--paper);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 300;
}

/* grain atmosphere */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  mix-blend-mode: overlay;
}

.display-font { font-family: var(--f-display); }
.mono { font-family: var(--f-mono); font-weight: 400; }

/* ── COVER ── */
.cover {
  background: var(--ink);
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(240,230,224,0.025) 80px),
    repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(240,230,224,0.025) 80px);
  pointer-events: none;
}
.cover::after {
  content: '';
  position: absolute;
  bottom: -200px;
  right: -200px;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(165,106,103,0.18) 0%, transparent 70%);
  pointer-events: none;
}
.cover-left {
  padding: 72px 64px 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  border-right: 1px solid var(--border);
  z-index: 2;
}
.cover-wordmark {
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--ember);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
}
.cover-wordmark::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--ember);
  border-radius: 50%;
  box-shadow: 0 0 14px var(--ember);
  animation: pulse 2.2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}
.cover-title {
  font-family: var(--f-display);
  font-size: clamp(56px, 8vw, 120px);
  font-weight: 700;
  font-style: italic;
  line-height: 0.92;
  letter-spacing: -0.03em;
  color: var(--paper);
  text-transform: uppercase;
}
.cover-title em {
  font-style: italic;
  font-weight: 700;
  color: var(--ember);
}
.cover-title strong {
  font-weight: 700;
  display: block;
}
.cover-sub {
  font-size: 15px;
  line-height: 1.65;
  color: var(--paper-2);
  max-width: 46ch;
  margin-top: 28px;
  font-weight: 300;
}
.cover-meta {
  display: flex;
  gap: 28px;
  font-family: var(--f-mono);
  font-size: 10px;
  color: var(--paper-3);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  flex-wrap: wrap;
}
.cover-meta span { display: flex; align-items: center; gap: 8px; }
.cover-meta span::before { content: '◈'; color: var(--ember); font-size: 9px; }
.cover-right {
  padding: 72px 64px 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}
.cover-logo-mark {
  width: 180px;
  height: auto;
  display: block;
  position: relative;
  filter: drop-shadow(0 8px 32px rgba(165,106,103,0.25));
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.cover-logo-mark:hover { transform: scale(1.04) rotate(-2deg); }
@keyframes spin { to { transform: rotate(360deg); } }

.cover-toc {
  list-style: none;
  margin-top: auto;
}
.cover-toc li {
  display: flex;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--paper-3);
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.25s;
  padding: 0;
}
.cover-toc a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 18px 0;
  width: 100%;
  transition: padding-left 0.25s, color 0.25s;
  font-family: var(--f-body);
  font-weight: 400;
}
.cover-toc a:hover { color: var(--paper); padding-left: 10px; }
.cover-toc a:hover .num { color: var(--ember); }
.cover-toc .num {
  font-family: var(--f-mono);
  font-size: 11px;
  color: var(--paper-4);
  min-width: 24px;
  transition: color 0.25s;
}
.cover-toc .arrow {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.25s, transform 0.25s;
  color: var(--ember);
}
.cover-toc a:hover .arrow { opacity: 1; transform: translateX(4px); }

/* ── SECTIONS ── */
.section {
  padding: 100px 72px;
  position: relative;
  border-bottom: 1px solid var(--border);
}
.section.paper {
  background: var(--paper);
  color: var(--ink);
}
.section.mid {
  background: var(--ink-2);
  color: var(--paper);
}
.section-label {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--ember);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: 500;
}
.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.2;
}
.section-heading {
  font-family: var(--f-display);
  font-size: clamp(40px, 5.2vw, 80px);
  font-weight: 700;
  font-style: italic;
  letter-spacing: -0.02em;
  line-height: 1.0;
  margin-bottom: 32px;
  text-transform: uppercase;
}
.section-heading em {
  font-style: italic;
  font-weight: 700;
  color: var(--ember);
}
.section.paper .section-heading em { color: var(--ember); }
.section-heading strong { font-weight: 700; font-style: normal; }
.section-lede {
  font-size: 16px;
  line-height: 1.7;
  color: var(--paper-2);
  max-width: 58ch;
  margin-bottom: 64px;
  font-weight: 300;
}
.section.paper .section-lede { color: rgba(36,18,58,0.65); }

/* ── STORY ── */
.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
  margin-top: 40px;
}
.story-body p {
  font-size: 15px;
  line-height: 1.75;
  color: var(--paper-2);
  margin-bottom: 18px;
  max-width: 58ch;
}
.story-body p strong {
  color: var(--paper);
  font-weight: 500;
}
.story-body p em {
  font-family: var(--f-display);
  font-style: italic;
  color: var(--ember);
  font-weight: 400;
}
.story-marks {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  border: 1px solid var(--border);
}
.mark-cell {
  padding: 32px 28px;
  background: var(--ink-2);
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 140px;
  justify-content: space-between;
  transition: background 0.3s;
}
.mark-cell:hover { background: var(--ink-3); }
.mark-num {
  font-family: var(--f-mono);
  font-size: 10px;
  color: var(--ember);
  letter-spacing: 0.2em;
}
.mark-val {
  font-family: var(--f-display);
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  color: var(--paper);
  letter-spacing: -0.01em;
  text-transform: uppercase;
}
.mark-label {
  font-size: 11px;
  color: var(--paper-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── LOGO ── */
.logo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin-top: 40px;
  border: 1px solid var(--border);
}
.logo-cell {
  padding: 64px 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  background: var(--paper);
  position: relative;
  min-height: 320px;
  transition: background 0.35s;
  overflow: hidden;
}
.logo-cell.dark-cell { background: var(--ink); }
.logo-cell.ember-cell { background: var(--ember); }
.logo-cell.moss-cell  { background: var(--moss); }
.logo-cell-label {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(36,18,58,0.45);
  margin-top: auto;
}
.logo-cell.dark-cell .logo-cell-label { color: var(--paper-3); }
.logo-cell.ember-cell .logo-cell-label,
.logo-cell.moss-cell .logo-cell-label { color: rgba(36,18,58,0.55); }

.logo-mark-img {
  width: 100%;
  max-width: 340px;
  height: auto;
  display: block;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.logo-mark-svg {
  width: 100%;
  max-width: 340px;
  height: auto;
  display: block;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.logo-cell:hover .logo-mark-img,
.logo-cell:hover .logo-mark-svg { transform: scale(1.02); }

/* ROV mark variants · fill the panels, stroke the eye */
.logo-mark-svg .rov-panel { stroke: #24123A; stroke-width: 6; stroke-linejoin: round; stroke-linecap: round; }
.logo-mark-svg .rov-eye   { stroke: #24123A; }
.logo-mark-svg .rov-pupil { fill: #24123A; stroke: none; }

.logo-mark-svg[data-variant="ember"]   .rov-panel { fill: url(#rovEmber); }
.logo-mark-svg[data-variant="dark"]    .rov-panel { fill: #24123A; stroke: #24123A; }
.logo-mark-svg[data-variant="dark"]    .rov-eye   { stroke: #24123A; }
.logo-mark-svg[data-variant="dark"]    .rov-pupil { fill: #24123A; }
.logo-mark-svg[data-variant="white"]   .rov-panel { fill: #F0E6E0; stroke: #F0E6E0; }
.logo-mark-svg[data-variant="white"]   .rov-eye   { stroke: #24123A; }
.logo-mark-svg[data-variant="paisley"] .rov-panel { fill: url(#rovPaisley); }

/* Small mini marks (thumbnails, footer) */
.mark-mini-svg { height: 32px; width: auto; display: block; }

/* Fallback for wordmark text version (footer / thumbs) */
.wordmark-text {
  font-family: var(--f-display);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-style: italic;
  line-height: 1;
}
.ember-dot { color: var(--ember); }

.logo-mono {
  width: 140px;
  height: 140px;
  border: 1.5px solid var(--ink);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display);
  font-weight: 500;
  font-size: 40px;
  letter-spacing: 0.04em;
  color: var(--ink);
  position: relative;
}
.logo-cell.dark-cell .logo-mono { border-color: var(--paper); color: var(--paper); }
.logo-cell.ember-cell .logo-mono,
.logo-cell.moss-cell .logo-mono { border-color: var(--ink); color: var(--ink); }
.logo-mono::before {
  content: '';
  position: absolute;
  inset: 10px;
  border: 1px solid currentColor;
  border-radius: 50%;
  opacity: 0.25;
}
.logo-mono .dot {
  position: absolute;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--ember);
  top: 10px; right: 20px;
}

.logo-horizontal {
  display: flex;
  align-items: center;
  gap: 22px;
}
.logo-horizontal .bar {
  width: 50px;
  height: 1.5px;
  background: currentColor;
  opacity: 0.35;
}
.logo-horizontal .tag {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  opacity: 0.6;
}
.logo-horizontal .wm {
  font-family: var(--f-display);
  font-size: 44px;
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1;
}

.logo-bg-toggle {
  position: absolute;
  top: 18px;
  right: 18px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.25s;
  z-index: 4;
}
.logo-cell:hover .logo-bg-toggle,
.logo-cell:hover .logo-actions { opacity: 1; }
.logo-bg-toggle button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(36,18,58,0.3);
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s;
}
.logo-bg-toggle button:hover { transform: scale(1.15); }
.logo-cell.dark-cell .logo-bg-toggle button { border-color: rgba(240,230,224,0.3); }
.logo-bg-toggle button[data-bg="paper"] { background: #F0E6E0; }
.logo-bg-toggle button[data-bg="ink"]   { background: #24123A; }
.logo-bg-toggle button[data-bg="ember"] { background: #A56A67; }
.logo-bg-toggle button[data-bg="moss"]  { background: #E3C24A; }

.logo-actions {
  position: absolute;
  bottom: 18px;
  right: 18px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.25s;
  z-index: 4;
}
.logo-actions button {
  background: var(--ink);
  color: var(--paper);
  border: none;
  padding: 9px 14px;
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 3px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, transform 0.15s;
}
.logo-actions button:hover { background: var(--ember); color: var(--ink); transform: translateY(-1px); }
.logo-cell.dark-cell .logo-actions button { background: var(--paper); color: var(--ink); }
.logo-cell.dark-cell .logo-actions button:hover { background: var(--ember); color: var(--ink); }
.logo-cell.ember-cell .logo-actions button { background: var(--ink); color: var(--paper); }

/* Clear space & construction */
.logo-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin-top: 2px;
  border: 1px solid var(--border);
}
.logo-meta-cell {
  background: var(--ink-2);
  padding: 40px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.meta-title {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ember);
}
.meta-desc {
  font-size: 13px;
  line-height: 1.7;
  color: var(--paper-2);
  max-width: 44ch;
}
.clear-space-box {
  background: var(--paper);
  padding: 36px;
  border: 1px dashed rgba(36,18,58,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  color: var(--ink);
}
.clear-space-box .wm {
  font-family: var(--f-display);
  font-size: 48px;
  font-weight: 400;
  letter-spacing: -0.03em;
  color: var(--ink);
}
.clear-space-box::before,
.clear-space-box::after {
  content: '';
  position: absolute;
  background: var(--ember);
}
.clear-space-box::before {
  top: 16px; bottom: 16px; left: 16px; width: 1px;
}
.clear-space-box::after {
  left: 16px; right: 16px; top: 16px; height: 1px;
}
.clear-arrow {
  position: absolute;
  bottom: 14px; right: 16px;
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--ember);
  text-transform: uppercase;
}

/* ── TYPOGRAPHY ── */
.type-specimen {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin-top: 40px;
  border: 1px solid var(--border);
}
.type-cell {
  background: var(--ink-2);
  padding: 56px 48px;
  position: relative;
}
.type-cell.paper-cell {
  background: var(--paper);
  color: var(--ink);
}
.type-name {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--ember);
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.type-name::after {
  content: '';
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.22;
}
.type-display {
  font-family: var(--f-display);
  font-size: clamp(54px, 6.2vw, 92px);
  font-weight: 700;
  font-style: italic;
  letter-spacing: -0.02em;
  line-height: 0.98;
  color: var(--paper);
  text-transform: uppercase;
  outline: none;
}
.type-cell.paper-cell .type-display { color: var(--ink); }
.type-display em { font-style: italic; color: var(--ember); font-weight: 700; }
.type-body {
  font-size: 18px;
  font-weight: 300;
  line-height: 1.7;
  color: var(--paper-2);
  max-width: 42ch;
  margin-top: 24px;
  outline: none;
}
.type-cell.paper-cell .type-body { color: rgba(36,18,58,0.7); }
.type-meta {
  margin-top: 28px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-family: var(--f-mono);
  font-size: 10px;
  color: var(--paper-3);
  letter-spacing: 0.1em;
}
.type-cell.paper-cell .type-meta { color: rgba(36,18,58,0.45); }
.type-meta span {
  padding: 5px 10px;
  border: 1px solid var(--border-strong);
  border-radius: 2px;
  text-transform: uppercase;
}
.type-cell.paper-cell .type-meta span { border-color: rgba(36,18,58,0.15); }

/* Editable wrap */
.editable-wrap {
  position: relative;
  cursor: text;
  padding: 10px;
  margin: -10px;
  border-radius: 6px;
  transition: background 0.25s;
}
.editable-wrap:hover { background: rgba(165,106,103,0.05); }
.editable-wrap:focus-within { background: rgba(165,106,103,0.08); }
.editable-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px solid transparent;
  border-radius: 6px;
  pointer-events: none;
  transition: border-color 0.25s;
}
.editable-wrap:hover::before { border-color: rgba(165,106,103,0.2); }
.editable-wrap:focus-within::before { border-color: var(--ember); }
.edit-chip {
  position: absolute;
  top: 8px; right: 8px;
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ember);
  background: rgba(165,106,103,0.12);
  border: 1px solid rgba(165,106,103,0.35);
  padding: 4px 9px;
  border-radius: 20px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}
.editable-wrap:hover .edit-chip { opacity: 1; }
.editable-wrap:focus-within .edit-chip { opacity: 0; }

.type-actions {
  margin-top: 28px;
  display: flex;
  gap: 10px;
}
.type-btn {
  background: transparent;
  border: 1px solid var(--border-strong);
  color: var(--paper-2);
  padding: 8px 14px;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 3px;
  font-weight: 500;
  transition: all 0.2s;
}
.type-cell.paper-cell .type-btn { border-color: rgba(36,18,58,0.2); color: rgba(36,18,58,0.7); }
.type-btn:hover { background: var(--ember); color: var(--ink); border-color: var(--ember); }

/* Aliases for html-generator output classes */
.font-download-btn,
.type-reset-btn {
  background: transparent;
  border: 1px solid var(--border-strong);
  color: var(--paper-2);
  padding: 8px 14px;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 3px;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.font-download-btn:hover,
.type-reset-btn:hover { background: var(--ember); color: var(--ink); border-color: var(--ember); }
.bg-light .font-download-btn,
.bg-light .type-reset-btn { border-color: rgba(36,18,58,0.2); color: rgba(36,18,58,0.7); }

/* Font info block (html-generator output) */
.font-info-block {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 40px;
  padding: 28px 32px;
  background: rgba(240,230,224,0.025);
  border: 1px solid var(--border);
  border-radius: 4px;
}
.font-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.font-info-left {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  min-width: 0;
}
.font-info-role {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ember);
  min-width: 56px;
}
.font-info-name {
  font-size: 22px;
  font-weight: 500;
  color: var(--paper);
}
.font-info-meta {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--paper-3);
  font-family: var(--f-mono);
}

/* Type scale */
.type-scale {
  background: var(--ink-2);
  padding: 56px 48px;
  border: 1px solid var(--border);
  margin-top: 2px;
}
.scale-row {
  display: flex;
  align-items: baseline;
  gap: 32px;
  padding: 22px 0;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.scale-row:last-child { border-bottom: none; }
.scale-label {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ember);
  min-width: 90px;
}
.scale-text {
  color: var(--paper);
  outline: none;
  font-family: var(--f-display);
}
.scale-spec {
  margin-left: auto;
  font-family: var(--f-mono);
  font-size: 10px;
  color: var(--paper-3);
  letter-spacing: 0.08em;
}

/* ── COLORS ── */
.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  margin-top: 40px;
  border: 1px solid var(--border);
}
.color-swatch {
  aspect-ratio: 3/4.2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px 22px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
}
.color-swatch:hover { transform: scale(0.98); }
.color-swatch::before {
  content: attr(data-index);
  position: absolute;
  top: 18px;
  left: 22px;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.15em;
  opacity: 0.5;
}
.swatch-name {
  font-family: var(--f-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.swatch-hex {
  font-family: var(--f-mono);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s, letter-spacing 0.2s;
  user-select: all;
}
.swatch-hex:hover { opacity: 0.7; letter-spacing: 0.05em; }
.swatch-desc {
  font-size: 11px;
  margin-top: 10px;
  opacity: 0.55;
  line-height: 1.5;
  max-width: 18ch;
}
.swatch-unit {
  margin-top: 14px;
  display: flex;
  gap: 4px;
}
.swatch-unit button {
  background: rgba(36,18,58,0.12);
  border: 1px solid rgba(36,18,58,0.2);
  color: inherit;
  padding: 4px 8px;
  font-family: var(--f-mono);
  font-size: 9px;
  cursor: pointer;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
  transition: all 0.2s;
}
.color-swatch[data-dark="true"] .swatch-unit button {
  background: rgba(240,230,224,0.1);
  border-color: rgba(240,230,224,0.2);
}
.swatch-unit button.active {
  background: rgba(36,18,58,0.25);
  border-color: rgba(36,18,58,0.4);
}
.color-swatch[data-dark="true"] .swatch-unit button.active {
  background: rgba(240,230,224,0.25);
  border-color: rgba(240,230,224,0.4);
}

.color-rule {
  margin-top: 2px;
  background: var(--ink-3);
  padding: 28px 36px;
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid var(--border);
}
.color-rule-label {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ember);
  flex-shrink: 0;
}
.color-rule p {
  font-size: 13px;
  color: var(--paper-2);
  line-height: 1.6;
  margin: 0;
}
.color-rule strong { color: var(--paper); font-weight: 500; }

/* ── GRADIENTS ── */
.gradient-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  margin-top: 40px;
  border: 1px solid var(--border);
}
.gradient-card {
  aspect-ratio: 4/5;
  cursor: pointer;
  transition: opacity 0.2s;
  position: relative;
  overflow: hidden;
}
.gradient-card::after {
  content: 'Click to copy CSS';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--paper);
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  background: rgba(36,18,58,0.55);
  opacity: 0;
  transition: opacity 0.25s;
  backdrop-filter: blur(2px);
}
.gradient-card:hover::after { opacity: 1; }
.gradient-card-meta {
  position: absolute;
  bottom: 20px; left: 20px; right: 20px;
  z-index: 2;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--paper);
  mix-blend-mode: difference;
}
.gradient-card-meta .name {
  font-family: var(--f-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
  text-transform: uppercase;
}
.gradient-meta-row {
  margin-top: 2px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  border: 1px solid var(--border);
}
.gradient-label {
  background: var(--ink-2);
  padding: 22px 26px;
  cursor: pointer;
  transition: background 0.2s;
}
.gradient-label:hover { background: var(--ink-3); }
.gradient-label p {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--paper-3);
  margin-bottom: 8px;
}
.gradient-label code {
  font-family: var(--f-mono);
  font-size: 11px;
  color: var(--ember);
  word-break: break-all;
}

/* ── CAPABILITIES ── */
.cap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  margin-top: 40px;
  border: 1px solid var(--border);
}
.cap-card {
  background: var(--ink-2);
  padding: 40px 32px;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;
  cursor: default;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
}
.cap-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(165,106,103,0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.cap-card:hover { background: var(--ink-3); }
.cap-card:hover::before { opacity: 1; }
.cap-num {
  font-family: var(--f-mono);
  font-size: 10px;
  color: var(--ember);
  letter-spacing: 0.22em;
  display: flex;
  align-items: center;
  gap: 10px;
}
.cap-num::after {
  content: '';
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.2;
}
.cap-icon {
  width: 56px;
  height: 56px;
  color: var(--paper);
  transition: color 0.3s;
}
.cap-card:hover .cap-icon { color: var(--ember); }
.cap-title {
  font-family: var(--f-display);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.1;
  color: var(--paper);
  text-transform: uppercase;
}
.cap-title em { font-style: italic; color: var(--ember); font-weight: 700; }
.cap-desc {
  font-size: 13px;
  line-height: 1.65;
  color: var(--paper-2);
}
.cap-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.cap-tag {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--paper-3);
  padding: 4px 9px;
  border: 1px solid var(--border-strong);
  border-radius: 2px;
}

/* ── THUMBNAILS ── */
.thumb-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin-top: 40px;
  border: 1px solid var(--border);
}
.thumb-mock {
  aspect-ratio: 16/9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
  position: relative;
  overflow: hidden;
}
.thumb-1 { background: linear-gradient(135deg, #24123A 0%, #24123A 55%, #A56A67 100%); }
.thumb-2 { background: var(--paper); color: var(--ink); }
.thumb-3 { background: var(--ember); color: var(--ink); }
.thumb-4 { background: var(--ink-2); position: relative; }
.thumb-4::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 80% 20%, rgba(165,106,103,0.3) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(227,194,74,0.2) 0%, transparent 50%);
}
.thumb-tag {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0.65;
  position: relative;
  z-index: 1;
}
.thumb-title {
  font-family: var(--f-display);
  font-size: clamp(22px, 2.7vw, 34px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  max-width: 72%;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
}
.thumb-title em { font-style: italic; color: var(--ember); font-weight: 700; }
.thumb-2 .thumb-title em { color: var(--ember); }
.thumb-3 .thumb-title em { color: var(--paper); }
.thumb-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}
.thumb-logo-mini {
  height: 32px;
  width: auto;
  display: block;
}
.thumb-mini-meta {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.5;
}

/* ── VOICE ── */
.voice-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  margin-top: 40px;
  border: 1px solid var(--border);
}
.voice-card {
  background: var(--ink-2);
  padding: 48px 40px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: background 0.3s;
}
.voice-card:hover { background: var(--ink-3); }
.voice-card.accent { background: var(--ember); color: var(--ink); }
.voice-card.accent:hover { background: #A56A67; }
.voice-context {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ember);
}
.voice-card.accent .voice-context { color: var(--ink); font-weight: 500; }
.voice-line {
  font-family: var(--f-display);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--paper);
  letter-spacing: -0.01em;
  text-transform: uppercase;
}
.voice-card.accent .voice-line { color: var(--ink); }
.voice-line em { font-style: italic; color: var(--ember); }
.voice-card.accent .voice-line em { color: var(--paper); }
.voice-tag {
  margin-top: auto;
  font-size: 12px;
  color: var(--paper-3);
  font-style: italic;
}
.voice-card.accent .voice-tag { color: rgba(36,18,58,0.6); }

/* Do / Don't */
.dodont-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin-top: 2px;
  border: 1px solid var(--border);
}
.dodont {
  background: var(--ink-2);
  padding: 40px;
}
.dodont-head {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.dodont.yes .dodont-head { color: var(--moss); }
.dodont.no .dodont-head { color: #E8684E; }
.dodont-head::before {
  content: '';
  width: 8px; height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.dodont ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.dodont li {
  font-size: 14px;
  line-height: 1.6;
  color: var(--paper-2);
  padding-left: 18px;
  position: relative;
}
.dodont li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--ember);
}

/* ── MOTION / PRINCIPLES ── */
.principle-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  margin-top: 40px;
  border: 1px solid var(--border);
}
.principle {
  background: var(--ink-2);
  padding: 36px 28px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}
.principle-num {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  color: var(--ember);
}
.principle-title {
  font-family: var(--f-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--paper);
  line-height: 1.15;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}
.principle-title em { font-style: italic; color: var(--ember); font-weight: 700; }
.principle-body {
  font-size: 12px;
  line-height: 1.65;
  color: var(--paper-2);
}

/* ── FOOTER ── */
.footer {
  background: #0F0820;
  padding: 72px 72px 40px;
  border-top: 1px solid var(--border);
  position: relative;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 56px;
}
/* footer brand is now an <img> · CSS retained as utility if needed */
.footer-brand {
  font-family: var(--f-display);
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--paper);
  margin-bottom: 20px;
  text-transform: uppercase;
}
.footer-brand em { font-style: italic; color: var(--ember); }
.footer-tag {
  font-size: 13px;
  line-height: 1.6;
  color: var(--paper-3);
  max-width: 40ch;
}
.footer-col h5 {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ember);
  margin-bottom: 18px;
  font-weight: 500;
}
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.footer-col li, .footer-col a {
  font-size: 12px;
  color: var(--paper-2);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}
.footer-col a:hover { color: var(--ember); }
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 28px;
  border-top: 1px solid var(--border);
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--paper-4);
  flex-wrap: wrap;
  gap: 16px;
}

/* ── STICKY NAV ── */
.side-nav {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 900;
  display: flex;
  gap: 14px;
  padding: 14px 20px;
  background: rgba(36,18,58,0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.side-nav.visible { opacity: 1; pointer-events: auto; }
.side-nav a {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(240,230,224,0.22);
  display: block;
  position: relative;
  transition: background 0.2s, transform 0.2s;
}
.side-nav a:hover { background: var(--paper-2); transform: scale(1.25); }
.side-nav a.active { background: var(--ember); transform: scale(1.35); }
.side-nav a::after {
  content: attr(data-label);
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--ember);
  color: var(--ink);
  padding: 6px 12px;
  border-radius: 3px;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
.side-nav a:hover::after { opacity: 1; }

.top-actions {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 900;
  display: flex;
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s;
}
.top-actions.visible { opacity: 1; pointer-events: auto; }
.top-actions button {
  background: rgba(36,18,58,0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-strong);
  color: var(--paper);
  padding: 10px 18px;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
}
.top-actions button:hover {
  background: var(--ember);
  border-color: var(--ember);
  color: var(--ink);
  transform: translateY(-1px);
}

/* ── TOAST ── */
.toast {
  position: fixed;
  bottom: 92px;
  left: 50%;
  transform: translateX(-50%) translateY(16px);
  background: var(--ember);
  color: var(--ink);
  padding: 12px 22px;
  border-radius: 999px;
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.25s, transform 0.25s;
  pointer-events: none;
  z-index: 10000;
  box-shadow: 0 12px 40px rgba(165,106,103,0.4);
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Reveal */
.reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.visible { opacity: 1; transform: none; }

/* Responsive */
@media (max-width: 980px) {
  .cover, .logo-grid, .type-specimen, .gradient-grid,
  .gradient-meta-row, .thumb-grid, .voice-grid, .cap-grid,
  .story-grid, .logo-meta-grid, .dodont-grid {
    grid-template-columns: 1fr;
  }
  .color-grid { grid-template-columns: repeat(2, 1fr); }
  .principle-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .section { padding: 60px 28px; }
  .cover-left, .cover-right { padding: 48px 28px; }
  .footer { padding: 48px 28px 32px; }
  .top-actions { right: 14px; top: 14px; }
  .top-actions button { padding: 8px 12px; font-size: 9px; }
  .cover-title { font-size: 56px; }
}

/* Print */
@media print {
  html { scroll-behavior: auto; }
  body { background: white; color: black; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .side-nav, .top-actions, .logo-bg-toggle, .logo-actions, .swatch-unit, .type-actions { display: none !important; }
  .cover, .section { page-break-after: always; min-height: auto; }
  .gradient-card::after { display: none !important; }
  [contenteditable] { border: none !important; }
  body::after { display: none !important; }
}

/* ── html-generator compatibility aliases ─────────────────────────────── */

/* Type cell header (label + reset button row) */
.type-cell-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
}
.type-cell-header .type-label { margin-bottom: 0; }

/* Contenteditable sample wrapper */
.type-sample-wrap { position: relative; }
[contenteditable="true"] {
  outline: none;
  cursor: text;
  border-radius: 4px;
  padding: 6px 8px;
  margin: -6px -8px;
  transition: background 0.2s;
}
[contenteditable="true"]:hover { background: rgba(240,230,224,0.04); }
[contenteditable="true"]:focus { background: rgba(240,230,224,0.06); }

/* Logo download button */
.logo-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(15,8,32,0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(240,230,224,0.18);
  color: var(--paper);
  padding: 7px 13px;
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 3px;
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.logo-download-btn:hover {
  background: var(--ember);
  border-color: var(--ember);
  color: var(--ink);
  transform: translateY(-1px);
}

/* Logo background switcher */
.logo-bg-switcher {
  display: flex;
  gap: 8px;
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 4;
}
.logo-cell:hover .logo-bg-switcher { opacity: 1; }
.logo-bg-switcher button {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid rgba(240,230,224,0.3);
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s, border-color 0.15s;
}
.logo-bg-switcher button:hover { transform: scale(1.2); border-color: var(--ember); }

/* Color swatch footer + CSS copy button */
.swatch-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
}
.swatch-footer .swatch-unit { margin-top: 0; }
.swatch-copy-css {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(240,230,224,0.08);
  border: 1px solid rgba(240,230,224,0.18);
  color: inherit;
  padding: 4px 9px;
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s;
}
.swatch-copy-css:hover { background: rgba(240,230,224,0.18); border-color: rgba(240,230,224,0.35); }

/* Gradient block wrapper */
.gradient-block { display: flex; flex-direction: column; gap: 0; }
.gradient-name {
  font-size: 13px;
  font-weight: 500;
  margin-top: 14px;
  color: var(--paper);
}
.gradient-css {
  font-family: var(--f-mono);
  font-size: 10px;
  color: var(--paper-3);
  margin-top: 5px;
  cursor: pointer;
  word-break: break-all;
  transition: color 0.2s;
}
.gradient-css:hover { color: var(--paper-2); }

/* Brand voice pillars */
.voice-pillars {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2px;
  margin-bottom: 48px;
}
.voice-pillar {
  padding: 36px 32px;
  background: var(--ink-2);
  border: 1px solid var(--border);
}
.voice-pillar-num {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ember);
  margin-bottom: 20px;
}
.voice-pillar-word {
  font-family: var(--f-display);
  font-size: 32px;
  font-weight: 700;
  font-style: italic;
  color: var(--paper);
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}
.voice-pillar-desc {
  font-size: 14px;
  line-height: 1.65;
  color: var(--paper-2);
}

/* Voice do/don't examples */
.voice-examples {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.voice-col h3 {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ember);
  margin-bottom: 20px;
}
.voice-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.voice-col li {
  font-size: 14px;
  line-height: 1.55;
  padding: 12px 16px;
  background: rgba(240,230,224,0.025);
  border: 1px solid var(--border);
  color: var(--paper-2);
}

/* Floating action buttons */
.float-actions {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9000;
  display: flex;
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s;
}
.float-actions.show { opacity: 1; pointer-events: auto; }
.float-btn {
  padding: 9px 18px;
  background: rgba(15,8,32,0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(240,230,224,0.14);
  color: var(--paper);
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.float-btn:hover { background: var(--ember); border-color: var(--ember); color: var(--ink); transform: translateY(-1px); }
`;
  }

  // ── corporate-blue template (unchanged) ────────────────────────────────────
  const displayFont = `'${data.typography.displayFont.name}', ${data.typography.displayFont.fallback}`;
  const bodyFont = `'${data.typography.bodyFont.name}', ${data.typography.bodyFont.fallback}`;

  const colorVars = data.colors.swatches
    .map((s) => `  ${s.cssVariable}: ${s.hex};`)
    .join("\n");

  const primaryGrad = data.gradients.find((g) => g.isPrimary);
  const gradVar = primaryGrad ? `  --grad: ${primaryGrad.css};` : "";

  const bgColor = data.colors.swatches[0]?.hex || "#03256C";
  const fgColor =
    data.colors.swatches[data.colors.swatches.length - 1]?.hex || "#F8F8F8";
  const accentColor = data.colors.swatches.length > 2
    ? data.colors.swatches[Math.floor(data.colors.swatches.length / 2)]?.hex
    : "#1768AC";

  return `
:root {
  --font-display: ${escapeCSS(displayFont)};
  --font-body: ${escapeCSS(bodyFont)};
  --bg: ${bgColor};
  --fg: ${fgColor};
  --accent: ${accentColor};
${colorVars}
${gradVar}
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--fg);
  min-height: 100vh;
  overflow-x: hidden;
}

.cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg, transparent, transparent 79px, rgba(255,255,255,0.03) 80px
  ),
  repeating-linear-gradient(
    0deg, transparent, transparent 79px, rgba(255,255,255,0.03) 80px
  );
}

/* ── COVER ── */
.cover {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}
.cover-left {
  padding: 80px 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  border-right: 1px solid rgba(255,255,255,0.08);
}
.cover-eyebrow {
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 500;
}
.cover-logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 0;
}
.cover-logo-wrap img {
  width: 60%;
  max-width: 260px;
}
.cover-title {
  font-family: var(--font-display);
  font-size: clamp(40px, 4.5vw, 64px);
  font-weight: 300;
  line-height: 1.08;
  color: var(--fg);
  letter-spacing: -0.02em;
}
.cover-title strong {
  font-weight: 500;
  display: block;
}
.cover-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.cover-meta span {
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.1em;
  font-weight: 300;
}
.cover-right {
  padding: 80px 64px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
}
.cover-toc { list-style: none; }
.cover-toc li a {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.2s, padding-left 0.25s;
}
.cover-toc li a:hover { color: var(--fg); padding-left: 10px; }
.cover-toc li a .num { font-size: 10px; color: var(--accent); min-width: 22px; }

/* ── FLOATING ACTIONS ── */
.float-actions {
  position: fixed;
  top: 24px; right: 24px;
  z-index: 9000;
  display: flex;
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s;
}
.float-actions.show { opacity: 1; pointer-events: auto; }
.float-btn {
  padding: 9px 18px;
  background: rgba(15,8,32,0.82);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 999px;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.float-btn:hover { background: var(--accent); border-color: var(--accent); transform: translateY(-1px); }

.side-nav {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9000;
  display: flex;
  flex-direction: column;
  gap: 14px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s;
}
.side-nav.visible { opacity: 1; pointer-events: auto; }
.side-nav a {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: block;
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;
}
.side-nav a:hover { background: rgba(255,255,255,0.6); transform: scale(1.3); }
.side-nav a.active { background: ${accentColor}; transform: scale(1.4); }

/* ── SECTIONS ── */
.section {
  padding: 100px 80px;
  position: relative;
}
.section-label {
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 52px;
  display: flex;
  align-items: center;
  gap: 18px;
  font-weight: 500;
}
.section-label::after {
  content: '';
  flex: 1; height: 1px;
  background: currentColor;
  opacity: 0.2;
}
.section-heading {
  font-family: var(--font-display);
  font-size: clamp(32px, 3.5vw, 52px);
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 60px;
}
.section-heading strong { font-weight: 700; }

.bg-dark { background: var(--bg); color: var(--fg); }
.bg-light { background: #f4f6fa; color: ${bgColor}; }
.bg-darker { background: #0a1628; color: var(--fg); }

/* ── LOGO SECTION ── */
.logo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
}
.logo-cell {
  padding: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  position: relative;
  min-height: 260px;
  transition: background 0.4s ease;
}
.logo-cell img {
  width: 55%;
  max-width: 200px;
  object-fit: contain;
  transition: transform 0.3s;
}
.logo-cell:hover img { transform: scale(1.04); }
.logo-cell-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.35;
}

/* ── TYPOGRAPHY SECTION ── */
.type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
}
.type-cell {
  padding: 48px;
  position: relative;
}
.type-label {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
  margin-bottom: 16px;
}
.type-meta {
  font-size: 10px;
  opacity: 0.3;
  margin-top: 12px;
  font-family: var(--font-body);
}
.type-display {
  font-family: var(--font-display);
}
.type-body-display {
  font-family: var(--font-body);
}

/* ── COLOR PALETTE ── */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 3px;
}
.color-swatch {
  padding: 40px 28px 28px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
  transition: opacity 0.2s;
  position: relative;
}
.color-swatch:hover { opacity: 0.92; }
.swatch-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}
.swatch-hex {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  opacity: 0.7;
  cursor: pointer;
}

/* ── GRADIENTS ── */
.gradient-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.gradient-card {
  height: 200px;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
}
.gradient-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }

/* ── TOAST ── */
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 10px 24px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.06em;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s, transform 0.25s;
  z-index: 10000;
  backdrop-filter: blur(12px);
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ── REVEAL ANIMATION ── */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .cover { grid-template-columns: 1fr; }
  .cover-right { display: none; }
  .cover-left { padding: 60px 32px; }
  .section { padding: 60px 32px; }
  .logo-grid { grid-template-columns: 1fr; }
  .type-grid { grid-template-columns: 1fr; }
  .footer { flex-direction: column; gap: 12px; padding: 32px; }
}

/* ── PRINT ── */
@media print {
  body::after { display: none; }
  .pill-nav, .side-nav, .float-actions, .toast { display: none !important; }
  .section { break-inside: avoid; padding: 40px; }
  .cover { min-height: auto; break-after: page; }
}
`;
}

export function generateCSS(data: BrandKitData): string {
  return getTemplateCSS(data.template, data);
}
