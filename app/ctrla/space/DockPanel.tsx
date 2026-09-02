"use client";

// The panel that opens when you dock. Editorial, not a card: a kicker, a
// headline, a blurb, Vue's line, and the two verbs. Used by both the 3D HUD
// and the 2D star map, which is the whole point of keeping it separate.

import Link from "next/link";
import { VueBust } from "../_components/vue/Vue";
import { ed } from "../_components/editorial";
import type { CelestialBody } from "./_map/map";
import { NARRATION } from "./_map/narration";
import { track } from "./_state/track";

const KIND_LABEL: Record<CelestialBody["kind"], string> = {
  sun: "The core",
  planet: "Planet",
  moon: "Moon",
  asteroid: "Asteroid",
  comet: "Comet",
  station: "Station",
};

export default function DockPanel({
  body,
  onClose,
  onEnter,
  closeLabel = "Keep flying",
}: {
  body: CelestialBody;
  onClose: () => void;
  /** Ship mode: intercept Enter for the landing dive. The map just links. */
  onEnter?: (body: CelestialBody) => void;
  closeLabel?: string;
}) {
  const script = NARRATION[body.stop.narrationKey];
  return (
    <div className="ctrla-space-dock" role="dialog" aria-label={body.stop.headline}>
      <div className="ctrla-space-dock-inner">
        <span className="ctrla-space-kicker">
          {KIND_LABEL[body.kind]} · {body.label}
        </span>
        <h2
          style={{
            fontFamily: ed.grotesque,
            fontWeight: 800,
            fontSize: "clamp(30px,4.2vw,58px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.94,
            color: ed.ink,
            margin: "14px 0 14px",
          }}
        >
          {body.stop.headline}
        </h2>
        <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 26px", maxWidth: 520 }}>
          {body.stop.blurb}
        </p>

        {script && (
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", maxWidth: 520, marginBottom: 30 }}>
            <VueBust pose="pointing" size={44} mood="alert" style={{ border: `1px solid ${ed.amber}`, marginTop: 2 }} />
            <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(16px,1.7vw,21px)", lineHeight: 1.4, color: ed.ink, margin: 0 }}>
              {script.arrive}
            </p>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          <Link
            href={body.stop.href}
            className="ctrla-space-enter"
            onClick={(e) => {
              if (onEnter) {
                e.preventDefault();
                onEnter(body);
              } else {
                track("space_enter", { body: body.id, via: "map" });
              }
            }}
          >
            Enter <span aria-hidden>→</span>
          </Link>
          <button type="button" onClick={onClose} className="ctrla-space-ghost">
            {closeLabel}
          </button>
          {script && (
            <span className="ctrla-space-kicker" style={{ opacity: 0.8 }}>
              {script.nudge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
