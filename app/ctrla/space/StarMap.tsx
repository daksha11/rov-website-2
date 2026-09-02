"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE STAR MAP
//
// A flat, top-down SVG of the same registry the 3D scene renders. One
// component, four jobs: the phone experience, the no-WebGL fallback, the
// reduced-motion fallback, and the M-key overlay inside the game. No three
// anywhere near it.
// ═══════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { BODIES, type CelestialBody } from "./_map/map";
import { useSpace } from "./_state/useSpace";
import { ed } from "../_components/editorial";
import DockPanel from "./DockPanel";
import { VueBust } from "../_components/vue/Vue";

const R = 250; // half the viewBox, world units

/** Static positions at t=0, so the map is a stable picture, not a clock. */
function layout() {
  const pos = new Map<string, { x: number; y: number }>();
  const rank = { sun: 0, planet: 1, comet: 2, asteroid: 3, moon: 4 } as const;
  for (const b of [...BODIES].sort((a, c) => rank[a.kind] - rank[c.kind])) {
    const p = b.parent ? pos.get(b.parent) ?? { x: 0, y: 0 } : { x: 0, y: 0 };
    pos.set(b.id, { x: p.x + Math.cos(b.orbit.phase) * b.orbit.radius, y: p.y + Math.sin(b.orbit.phase) * b.orbit.radius });
  }
  return pos;
}

export default function StarMap({
  mode,
  onSelect,
}: {
  /** `page`: the standalone view (phones, fallbacks). `overlay`: inside the game. */
  mode: "page" | "overlay";
  /** Overlay only: fly there. */
  onSelect?: (body: CelestialBody) => void;
}) {
  const pos = useMemo(layout, []);
  const visited = useSpace((s) => s.visited);
  const route = useSpace((s) => s.route);
  const step = useSpace((s) => s.step);
  const [open, setOpen] = useState<CelestialBody | null>(null);

  const pick = (b: CelestialBody) => {
    if (mode === "overlay") onSelect?.(b);
    else setOpen(b);
  };

  return (
    <div className={`ctrla-space-map ctrla-space-map--${mode}`}>
      {mode === "page" && (
        <div className="ctrla-space-map-head">
          <span className="ctrla-space-kicker">CTRL·A · Space · the map</span>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", maxWidth: 560, marginTop: 14 }}>
            <VueBust pose="showing" size={42} mood="focused" style={{ border: `1px solid ${ed.amber}` }} />
            <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(17px,2.2vw,24px)", lineHeight: 1.35, color: ed.ink, margin: 0 }}>
              The ship needs a bigger cockpit. Here is the map. Tap a planet, or open this on a computer and fly it.
            </p>
          </div>
        </div>
      )}

      <svg viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`} className="ctrla-space-map-svg" role="img" aria-label="Map of the CTRL·A system">
        {/* Orbit rings for the big stops */}
        {BODIES.filter((b) => b.kind === "planet" || b.kind === "comet").map((b) => (
          <circle key={`o-${b.id}`} cx={0} cy={0} r={b.orbit.radius} fill="none" stroke="rgba(240,230,224,0.1)" strokeWidth={0.6} strokeDasharray={b.kind === "comet" ? "3 4" : undefined} />
        ))}
        {/* The line: a dotted gold path through the route, numbered */}
        {route.length > 1 && (
          <polyline
            points={route.map((id) => pos.get(id)).filter(Boolean).map((p) => `${p!.x},${p!.y}`).join(" ")}
            fill="none"
            stroke={ed.gold}
            strokeWidth={0.7}
            strokeDasharray="2 3"
            opacity={0.55}
          />
        )}
        {route.map((id, i) => {
          const p = pos.get(id);
          if (!p) return null;
          const b = BODIES.find((x) => x.id === id)!;
          const r = b.kind === "sun" ? 9 : b.size * 0.95;
          return (
            <text key={`n-${id}`} x={p.x + r + 3} y={p.y + 2} fill={i < step ? ed.gold : "rgba(240,230,224,0.7)"} fontSize={5} fontWeight={700} style={{ fontFamily: ed.mono }}>
              {String(i + 1).padStart(2, "0")}
            </text>
          );
        })}
        {BODIES.map((b) => {
          const p = pos.get(b.id)!;
          const r = b.kind === "sun" ? 9 : b.size * 0.95;
          const seen = visited.includes(b.id);
          const small = b.kind === "moon" || b.kind === "asteroid";
          return (
            <g key={b.id} transform={`translate(${p.x} ${p.y})`} className="ctrla-space-pin" onClick={() => pick(b)} style={{ cursor: "pointer" }}>
              {b.kind === "sun" && <circle r={r * 2.1} fill="rgba(227,194,74,0.14)" />}
              <circle r={r} fill={b.kind === "sun" ? ed.gold : b.look.palette[1]} stroke={seen ? ed.gold : "rgba(240,230,224,0.35)"} strokeWidth={seen ? 1.4 : 0.7} />
              {route[step] === b.id && <circle r={r + 3} fill="none" stroke={ed.gold} strokeWidth={0.8} strokeDasharray="1.5 1.5" />}
              <text y={small ? r + 8 : -r - 4} textAnchor="middle" fill={ed.gold} fontSize={small ? 5.2 : 6.6} fontWeight={700} letterSpacing={0.9} style={{ fontFamily: ed.mono, textTransform: "uppercase" }}>
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>

      {mode === "page" && open && <DockPanel body={open} onClose={() => setOpen(null)} closeLabel="Back to the map" />}
    </div>
  );
}
