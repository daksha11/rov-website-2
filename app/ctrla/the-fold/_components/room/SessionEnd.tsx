"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — session end
// A landing, not a celebration. "Session done. What did you make?"
// Shows back whatever was quick-captured. Then: again, or leave.
// ═══════════════════════════════════════════════════════

import { ed } from "../../../_components/editorial";

export default function SessionEnd({
  oneThing,
  captures,
  onAgain,
  onExit,
}: {
  oneThing: string;
  captures: string[];
  onAgain: () => void;
  onExit: () => void;
}) {
  return (
    <div className="fold-end fold-fade-in">
      <span
        style={{
          fontFamily: ed.mono,
          fontSize: "clamp(10px,1.2vw,12px)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: ed.gold,
        }}
      >
        Session done
      </span>

      <h1
        style={{
          fontFamily: ed.serif,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(40px,8vw,96px)",
          lineHeight: 0.94,
          letterSpacing: "-0.01em",
          color: ed.paper,
          margin: "clamp(14px,2vw,22px) 0 0",
        }}
      >
        What did you make?
      </h1>

      {oneThing && (
        <p
          style={{
            fontFamily: ed.body,
            fontSize: "clamp(15px,1.8vw,20px)",
            color: ed.inkSoft,
            margin: "clamp(18px,2.4vw,26px) 0 0",
          }}
        >
          You came in for: <span style={{ color: ed.paper }}>{oneThing}</span>
        </p>
      )}

      {captures.length > 0 && (
        <div style={{ margin: "clamp(24px,3vw,34px) 0 0", display: "flex", flexDirection: "column", gap: 10, maxWidth: 560 }}>
          <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}>
            What you caught
          </span>
          {captures.map((c, i) => (
            <p key={i} style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,18px)", color: ed.inkSoft, margin: 0, paddingLeft: 14, borderLeft: `1px solid ${ed.hair}` }}>
              {c}
            </p>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "clamp(20px,4vw,40px)", marginTop: "clamp(36px,5vw,56px)", flexWrap: "wrap" }}>
        <button type="button" onClick={onAgain} className="fold-enter-cta" style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(18px,2.4vw,26px)", color: ed.paper }}>
            Again
          </span>
          <span aria-hidden className="fold-enter-arrow" style={{ color: ed.gold, transition: "transform .3s ease" }}>→</span>
        </button>
        <button type="button" onClick={onExit} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: ed.inkFaint }}>←</span>
          <span style={{ fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.22em", textTransform: "uppercase", color: ed.inkFaint }}>
            Back to the magazine
          </span>
        </button>
      </div>
    </div>
  );
}
