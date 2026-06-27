"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — the window wall
// The cafe looks out on a slow cosmic sunset. The gradient (a
// layered Japanese bokashi) is set per place in CSS. Window
// mullions frame it so it reads as a room, not a wallpaper.
// Kept deliberately bare: just light, no illustrations.
// ═══════════════════════════════════════════════════════

export default function CafeWindow() {
  return (
    <div aria-hidden className="fold-window">
      {/* the view */}
      <div className="fold-window-glass" />
      {/* the frame */}
      <div className="fold-mullion fold-mullion-v" style={{ left: "33.33%" }} />
      <div className="fold-mullion fold-mullion-v" style={{ left: "66.66%" }} />
      <div className="fold-mullion fold-mullion-h" style={{ top: "58%" }} />
      {/* warm light spilling onto the sill */}
      <div className="fold-sill" />
    </div>
  );
}
