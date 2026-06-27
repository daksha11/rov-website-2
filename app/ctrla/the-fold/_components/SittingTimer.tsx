"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — a sitting (optional)
// You can set a sitting, or not. No alarm. When it lands, the room
// says so softly and you stay as long as you like. Compact ring so
// it sits quietly in the room.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { ed } from "../../_components/editorial";
import { SITTINGS } from "../_state/foldConfig";

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function SittingTimer() {
  const [total, setTotal] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [landed, setLanded] = useState(false);
  const landedRef = useRef(false);

  useEffect(() => {
    if (startedAt === null || total === null) return;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (t - last > 240) {
        last = t;
        const e = Date.now() - startedAt;
        setElapsed(e);
        if (!landedRef.current && e >= total) {
          landedRef.current = true;
          setLanded(true);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startedAt, total]);

  const start = (ms: number) => {
    setTotal(ms);
    setStartedAt(Date.now());
    setElapsed(0);
    setLanded(false);
    landedRef.current = false;
  };
  const clear = () => {
    setTotal(null);
    setStartedAt(null);
    setElapsed(0);
    setLanded(false);
    landedRef.current = false;
  };

  if (total === null || startedAt === null) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}>
          Set a sitting
        </span>
        <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
          {SITTINGS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => s.ms && start(s.ms)}
              className="fold-sit-opt"
              style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: ed.grotesque, fontWeight: 600, fontSize: "clamp(15px,1.7vw,19px)", color: ed.paper }}
            >
              {s.label}
            </button>
          ))}
          <span style={{ fontFamily: ed.body, fontSize: "clamp(12px,1.4vw,14px)", color: ed.inkFaint }}>min, or no clock</span>
        </div>
      </div>
    );
  }

  const fraction = Math.min(elapsed / total, 1);
  const remaining = Math.max(total - elapsed, 0);
  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg width={64} height={64} viewBox="0 0 64 64" aria-hidden>
          <circle cx={32} cy={32} r={R} fill="none" stroke={ed.hair} strokeWidth={1.5} />
          <circle cx={32} cy={32} r={R} fill="none" stroke={ed.gold} strokeWidth={1.5} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - fraction)} transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset .3s linear" }} />
        </svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ed.grotesque, fontWeight: 500, fontSize: 12, color: ed.paper, fontVariantNumeric: "tabular-nums" }}>
          {fmt(remaining)}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: "clamp(13px,1.5vw,16px)", color: landed ? ed.gold : ed.inkSoft }}>
          {landed ? "The sitting's done. Stay as long as you like." : "Settled in."}
        </span>
        <button type="button" onClick={clear} style={{ alignSelf: "flex-start", background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}>
          {landed ? "Clear" : "End early"}
        </button>
      </div>
    </div>
  );
}
