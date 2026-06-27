"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — the mix
// Blend the cafe's ambient layers like imissmycafe: murmur,
// music, rain, hum. A room sets the default blend; you taste it
// to your liking. Collapsible so it never competes with the room.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { ed } from "../../_components/editorial";
import { LAYERS } from "../_state/foldConfig";
import type { LayerId, LayerLevels } from "../_state/types";

export default function AmbientMixer({
  levels,
  muted,
  soundReady,
  onSet,
  onToggleMute,
}: {
  levels: LayerLevels;
  muted: boolean;
  soundReady: boolean;
  onSet: (id: LayerId, v: number) => void;
  onToggleMute: () => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="fold-mixer" data-open={open ? "true" : "false"}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: open ? 14 : 0 }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <span aria-hidden style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 11 }}>
            {[5, 9, 6].map((h, i) => (
              <span key={i} style={{ width: 2, height: muted || !soundReady ? 2 : h, background: muted ? ed.inkFaint : ed.gold, transition: "height .3s ease, background .3s ease" }} />
            ))}
          </span>
          <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.gold }}>
            The mix
          </span>
          <span aria-hidden style={{ color: ed.inkFaint, transform: open ? "rotate(180deg)" : "none", transition: "transform .3s ease" }}>⌄</span>
        </button>
        <button
          type="button"
          onClick={onToggleMute}
          style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
      </div>

      {open && (
        <div className="fold-faders">
          {LAYERS.map((l) => (
            <label key={l.id} className="fold-fader">
              <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: ed.inkSoft, minWidth: 52 }}>
                {l.label}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round((levels[l.id] ?? 0) * 100)}
                onChange={(e) => onSet(l.id, Number(e.target.value) / 100)}
                aria-label={`${l.label} level`}
                className="fold-range"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
