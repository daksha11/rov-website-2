"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — TOOLKIT ATMOSPHERE
// The light, airy reveal from the loader's second screen, made
// into a page backdrop for the toolkit pages: a cream ground
// with soft warm nebula, the cosmic set pieces drifting in from
// the edges, and dark-tinted shooting stars dashing across. The
// toolkit content (dark text) floats over it. Fixed + CSS-cheap.
// ═══════════════════════════════════════════════════════

import ShootingStars from "@/components/ui/shooting-stars";

export default function ToolkitAtmosphere() {
  return (
    <div aria-hidden className="ctrla-toolkit-atmos">
      {/* Dark-tinted shooting stars + twinkle field, legible on cream */}
      {/* Calm cadence on the toolkit: one shooting star every 10–12s, no pairs. */}
      <ShootingStars colors={["#4E3D73", "#A56A67", "#0F0820"]} starColor="rgba(22,12,40,0.5)" gap={[10, 12]} pairChance={0} />
    </div>
  );
}
