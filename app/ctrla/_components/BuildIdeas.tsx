"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — BUILD IDEAS
// The "what you can actually build" showcase for the dev toolkit.
// Each card carries a small, real CSS-rendered artifact on a dark
// screen (a chart, a calendar, a demo, a blank canvas) so the
// range reads as built things, not promises. Each pairs with the
// kind of prompt that gets you there, tying back to the vault.
// ═══════════════════════════════════════════════════════

import type { ReactNode } from "react";
import { edLight as ed } from "./editorial";

const GOLD = "#E3C24A";
const ROSE = "#C98C7E";
const CREAM = "#F0E6E0";

// ── the little artifacts ──

function VizBars() {
  const bars = [
    { h: 38, c: ROSE },
    { h: 66, c: GOLD },
    { h: 50, c: "#6A5694" },
    { h: 84, c: GOLD },
    { h: 58, c: ROSE },
    { h: 72, c: "#8A6F8F" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "7%", height: "100%", padding: "14% 12% 16%" }}>
      {bars.map((b, i) => (
        <span key={i} style={{ flex: 1, height: `${b.h}%`, background: b.c, borderRadius: "3px 3px 0 0", opacity: 0.92 }} />
      ))}
    </div>
  );
}

function VizCalendar() {
  // 7 x 4 mini month, a few days "booked"
  const filled: Record<number, string> = { 2: ROSE, 5: GOLD, 9: "#6A5694", 13: GOLD, 16: ROSE, 20: "#6A5694", 24: GOLD };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6%", height: "100%", padding: "12% 11%" }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} style={{ borderRadius: 2, background: filled[i] ?? "rgba(240,230,224,0.10)", boxShadow: filled[i] ? `0 0 6px ${filled[i]}66` : "none" }} />
      ))}
    </div>
  );
}

function VizDemo() {
  return (
    <div style={{ height: "100%", padding: "11% 12%", display: "flex", flexDirection: "column", gap: "8%" }}>
      <div style={{ display: "flex", gap: 5 }}>
        <i style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(240,230,224,0.3)" }} />
        <i style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(240,230,224,0.3)" }} />
        <i style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
      </div>
      <span style={{ width: "62%", height: 9, borderRadius: 3, background: CREAM, opacity: 0.85 }} />
      <span style={{ width: "84%", height: 6, borderRadius: 3, background: "rgba(240,230,224,0.34)" }} />
      <span style={{ width: "74%", height: 6, borderRadius: 3, background: "rgba(240,230,224,0.34)" }} />
      <span style={{ marginTop: "auto", width: "42%", height: 16, borderRadius: 999, background: GOLD }} />
    </div>
  );
}

function VizSpark() {
  return (
    <div style={{ height: "100%", padding: "12%", display: "flex" }}>
      <div style={{ flex: 1, border: "1.5px dashed rgba(240,230,224,0.3)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: 30, lineHeight: 1, color: GOLD }}>+</span>
      </div>
    </div>
  );
}

type Idea = { title: string; line: string; ask: string; viz: ReactNode };

const IDEAS: Idea[] = [
  {
    title: "data visualization",
    line: "turn a messy spreadsheet into a chart people actually read.",
    ask: "chart this csv as clean bars, one accent color, label the axes.",
    viz: <VizBars />,
  },
  {
    title: "content calendars",
    line: "a month of posts, planned and laid out, in a single pass.",
    ask: "build a month grid and drop these post ideas onto the right days.",
    viz: <VizCalendar />,
  },
  {
    title: "interactive demos",
    line: "a clickable prototype of the thing in your head, no team.",
    ask: "make a one page demo of {idea}, in one file i can open.",
    viz: <VizDemo />,
  },
  {
    title: "your idea, whatever it is",
    line: "a small tool for your one specific annoying problem.",
    ask: "i need a tool that {does the annoying thing}. simplest version first.",
    viz: <VizSpark />,
  },
];

export default function BuildIdeas({ accent = ed.plum }: { accent?: string }) {
  return (
    <div className="ctrla-build-grid">
      {IDEAS.map((it) => (
        <div key={it.title} className="ctrla-build-card">
          <div className="ctrla-build-screen">{it.viz}</div>
          <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(19px,2.2vw,24px)", letterSpacing: "-0.02em", color: ed.ink, margin: "16px 0 8px", textTransform: "lowercase" }}>
            {it.title}
          </h4>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.55, color: ed.inkSoft, margin: "0 0 14px" }}>
            {it.line}
          </p>
          <p className="ctrla-build-ask">
            <span style={{ color: accent }}>ask:</span> {it.ask}
          </p>
        </div>
      ))}
    </div>
  );
}
