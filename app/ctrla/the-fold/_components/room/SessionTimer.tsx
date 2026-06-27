"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — session timer
// A slow ring, not an alarm. Fires a single "you're in it" beat
// at the halfway mark and a soft landing at the end. For an Open
// session there is no ring and no end, just elapsed time.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { ed } from "../../../_components/editorial";
import { HALFWAY_FRACTION } from "../../_state/foldConfig";

function fmt(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function SessionTimer({
  startedAt,
  durationMs,
  onHalf,
  onEnd,
}: {
  startedAt: number;
  durationMs: number | null;
  onHalf: () => void;
  onEnd: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const halfFired = useRef(false);
  const endFired = useRef(false);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      // throttle to ~4fps; the ring moves over minutes
      if (t - last > 240) {
        last = t;
        const e = Date.now() - startedAt;
        setElapsed(e);
        if (durationMs) {
          const f = e / durationMs;
          if (!halfFired.current && f >= HALFWAY_FRACTION) {
            halfFired.current = true;
            onHalf();
          }
          if (!endFired.current && f >= 1) {
            endFired.current = true;
            onEnd();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startedAt, durationMs, onHalf, onEnd]);

  const fraction = durationMs ? Math.min(elapsed / durationMs, 1) : 0;
  const remaining = durationMs ? Math.max(durationMs - elapsed, 0) : elapsed;

  const SIZE = 220;
  const R = 96;
  const C = 2 * Math.PI * R;

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={ed.hair} strokeWidth={1.5} />
        {durationMs && (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={ed.gold}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - fraction)}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{ transition: "stroke-dashoffset 0.3s linear" }}
          />
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: ed.grotesque,
            fontWeight: 500,
            fontSize: "clamp(28px,4vw,40px)",
            letterSpacing: "-0.01em",
            color: ed.paper,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fmt(remaining)}
        </span>
        <span
          style={{
            fontFamily: ed.mono,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: ed.inkFaint,
          }}
        >
          {durationMs ? "remaining" : "elapsed"}
        </span>
      </div>
    </div>
  );
}
