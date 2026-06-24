// ═══════════════════════════════════════════════════════
// CTRL-A — COSMIC BACKDROP
// One ambient lighting layer the whole magazine floats over.
// Cartoony, illustrated space: a warm gold "sun" up top, plum
// and rose nebula pools bleeding out of the void, a soft edge
// vignette for depth. CSS-only and fixed, so it costs almost
// nothing and never janks the scroll. Stays in the locked
// palette. Editorial blocks sit on top as solid surfaces.
// ═══════════════════════════════════════════════════════

export default function CosmicBackdrop() {
  return <div aria-hidden className="ctrla-cosmic-backdrop" />;
}
