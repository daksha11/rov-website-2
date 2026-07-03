"use client";

import { useState } from "react";
import type { VocabPair } from "../_content/types";

const ESPRESSO = "#3B2114";
const RUST = "#90422C";
const NEGATIVE = "#A6402C";
const LINE = "rgba(59,33,20,0.14)";

export function VocabTable({ pairs }: { pairs: VocabPair[] }) {
  const [studyMode, setStudyMode] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function toggleStudyMode(next: boolean) {
    setStudyMode(next);
    setRevealed(new Set());
  }

  function toggleReveal(i: number) {
    if (!studyMode) return;
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <span
            onClick={() => toggleStudyMode(!studyMode)}
            role="switch"
            aria-checked={studyMode}
            style={{
              position: "relative",
              width: 44,
              height: 24,
              background: studyMode ? RUST : "#D9D2C4",
              borderRadius: 20,
              transition: ".2s",
              display: "inline-block",
              flex: "0 0 auto",
            }}
          >
            <span
              style={{
                position: "absolute",
                height: 18,
                width: 18,
                left: studyMode ? 23 : 3,
                top: 3,
                background: "#fff",
                borderRadius: "50%",
                transition: ".2s",
              }}
            />
          </span>
          <span style={{ fontSize: 14, color: ESPRESSO, fontWeight: 600 }}>
            Study mode (click a blurred cell to reveal)
          </span>
        </label>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            border: `1px solid ${LINE}`,
            minWidth: 560,
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>✅ Say this (their language)</th>
              <th style={thStyle}>🚫 Never say (outsider jargon)</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair, i) => {
              const isRevealed = revealed.has(i);
              const blurred = studyMode && !isRevealed;
              return (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: RUST }}>{pair.say}</td>
                  <td
                    onClick={() => toggleReveal(i)}
                    style={{
                      ...tdStyle,
                      color: NEGATIVE,
                      filter: blurred ? "blur(5px)" : "none",
                      cursor: studyMode ? "pointer" : "default",
                      userSelect: studyMode ? "none" : "auto",
                      transition: "filter .15s",
                    }}
                  >
                    {pair.dont}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  background: "#EFE9DD",
  textAlign: "left",
  padding: "12px 14px",
  fontSize: 12.5,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#6F685C",
  fontFamily: "'Neue Montreal', sans-serif",
};

const tdStyle: React.CSSProperties = {
  padding: "11px 14px",
  borderTop: `1px solid ${LINE}`,
  fontSize: 14.5,
  verticalAlign: "top",
  width: "50%",
};
