"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — DEFEND EVERY DECISION
// The design analog to the music page's mix globe. A real gig
// poster, composed in our own type and palette (no stock art),
// where every part is clickable. Tap the headline, the date,
// the empty space, the color, and the legend defends that
// decision in plain senior-designer language. Dramatizes the
// essay's close: nothing here is an accident.
//
// The poster is its own dark artifact sitting on the cream page.
// Type scales to the poster width via container query units, so
// it holds its composition at any size.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { edLight as ed } from "./editorial";

type Decision = {
  id: string;
  badge: string;
  title: string;
  why: string;
  // hotspot region as % of the poster
  box: { top?: string; left?: string; right?: string; bottom?: string; width?: string; height?: string };
  round?: boolean;
};

const DECISIONS: Decision[] = [
  {
    id: "space",
    badge: "1",
    title: "the space up top",
    why: "the silence is on purpose. it lets the poster breathe and reads like a venue, not a flyer stapled to a pole. crowded would feel cheap. confidence is what you leave out.",
    box: { top: "3%", left: "5%", width: "90%", height: "17%" },
  },
  {
    id: "headline",
    badge: "2",
    title: "the headline, oversized",
    why: "the night's name is the loudest thing on the page because the brief is simple, draw a crowd. it leads, everything else supports it. the size gap is the hierarchy, you read it in order without thinking.",
    box: { top: "23%", left: "5%", width: "78%", height: "27%" },
  },
  {
    id: "type",
    badge: "3",
    title: "two typefaces, two jobs",
    why: "an expressive serif for the feeling, a plain mono for the facts. the contrast is deliberate. the big type sets the mood, the small type answers the practical questions without getting in the way.",
    box: { top: "52%", left: "5%", width: "70%", height: "9%" },
  },
  {
    id: "date",
    badge: "4",
    title: "the date, tucked low",
    why: "anyone who already wants to come will hunt for the when and where. it does not need to shout, so it does not. small and low keeps the mood up top intact.",
    box: { top: "70%", left: "5%", width: "58%", height: "17%" },
  },
  {
    id: "color",
    badge: "5",
    title: "warm, dark, intimate",
    why: "jazz is warm, late, and close, so the palette matches the room it is selling. a cool corporate blue would be perfectly readable and completely wrong. color carries the brief before a word is read.",
    box: { top: "58%", right: "8%", width: "13%", height: "11%" },
    round: true,
  },
];

const CREAM = "#F0E6E0";
const GOLD = "#E3C24A";
const ROSE = "#C98C7E";

export default function DefendDecision({ accent = ed.plum }: { accent?: string }) {
  const [active, setActive] = useState(0);
  const touched = useRef(false);

  // Auto-cycle to invite interaction, until the reader takes over.
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => {
      if (touched.current) return;
      setActive((a) => (a + 1) % DECISIONS.length);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  const pick = (i: number) => {
    touched.current = true;
    setActive(i);
  };

  const sel = DECISIONS[active];

  return (
    <div className="ctrla-defend">
      {/* ── The poster ── */}
      <div className="ctrla-poster-wrap">
        <div className="ctrla-poster" role="group" aria-label="A jazz gig poster you can interrogate">
          {/* composed content */}
          <span className="ctrla-poster-kicker" style={{ color: GOLD }}>saturday · the cellar room</span>

          <h4 className="ctrla-poster-head" style={{ color: CREAM }}>
            after<br />hours
          </h4>

          <span className="ctrla-poster-sub" style={{ color: ROSE }}>the maya reed quartet</span>

          <span aria-hidden className="ctrla-poster-rule" style={{ background: `linear-gradient(to right, ${GOLD}, transparent)` }} />

          <div className="ctrla-poster-details" style={{ color: "rgba(240,230,224,0.74)" }}>
            <span>nov 16</span>
            <span>doors 9 · first set 10</span>
            <span>$15 at the door</span>
          </div>

          <div className="ctrla-poster-foot">
            <span style={{ color: "rgba(240,230,224,0.6)" }}>62 mercer st · atlanta</span>
            <span style={{ color: GOLD }}>CTRL-A presents</span>
          </div>

          {/* clickable hotspots */}
          {DECISIONS.map((d, i) => {
            const on = i === active;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => pick(i)}
                aria-label={d.title}
                data-active={on}
                className={`ctrla-poster-hotspot${d.round ? " is-round" : ""}`}
                style={{ ...d.box, borderColor: on ? accent : "transparent", background: on ? `${accent}1F` : "transparent" }}
              >
                <span
                  className="ctrla-hot-badge"
                  style={{
                    background: on ? accent : "rgba(14,7,20,0.55)",
                    color: on ? CREAM : "rgba(240,230,224,0.7)",
                    borderColor: on ? accent : "rgba(240,230,224,0.35)",
                  }}
                >
                  {d.badge}
                </span>
              </button>
            );
          })}
        </div>
        <span className="ctrla-poster-hint" style={{ fontFamily: ed.mono, color: ed.inkFaint }}>
          tap any part of the poster
        </span>
      </div>

      {/* ── The legend ── */}
      <div className="ctrla-defend-legend">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <span aria-hidden style={{ width: 18, height: 2, background: accent }} />
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: accent }}>
            The poster, defended
          </span>
        </span>

        <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3vw,34px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px", textTransform: "lowercase" }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: accent, color: "#F0E6E0", fontSize: 13, marginRight: 10, verticalAlign: "middle" }}>{sel.badge}</span>
          {sel.title}
        </h4>
        <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 24px" }}>
          {sel.why}
        </p>

        {/* navigate every decision */}
        <div className="ctrla-defend-list">
          {DECISIONS.map((d, i) => {
            const on = i === active;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => pick(i)}
                className="ctrla-defend-chip"
                style={{
                  color: on ? "#0F0820" : ed.inkSoft,
                  background: on ? accent : "transparent",
                  borderColor: on ? accent : ed.hair,
                }}
              >
                <span style={{ opacity: 0.7 }}>{d.badge}</span>
                {d.title}
              </button>
            );
          })}
        </div>

        <p style={{ fontFamily: ed.body, fontStyle: "italic", fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.5, color: ed.inkFaint, margin: "22px 0 0", paddingTop: 18, borderTop: `1px solid ${ed.hair}` }}>
          a junior makes it look nice. a senior can tell you why every piece is there.
        </p>
      </div>
    </div>
  );
}
