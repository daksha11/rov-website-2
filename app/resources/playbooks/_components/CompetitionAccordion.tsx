"use client";

import { useState } from "react";
import type { CompetitionPatternPanel, TeardownEntry } from "../_content/types";

const ESPRESSO = "#3B2114";
const RUST = "#90422C";
const ORANGE = "#EA9A61";
const LINE = "rgba(59,33,20,0.14)";

export function CompetitionAccordion({
  entries,
  patternPanel,
}: {
  entries: TeardownEntry[];
  patternPanel: CompetitionPatternPanel;
}) {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set([0]));

  function toggle(i: number) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div>
      {entries.map((entry, i) => {
        const open = openIds.has(i);
        return (
          <div
            key={entry.name}
            style={{
              background: "#fff",
              border: `1px solid ${LINE}`,
              borderRadius: 12,
              marginBottom: 12,
              overflow: "hidden",
              boxShadow: "0 1px 2px rgba(59,33,20,.05), 0 8px 24px rgba(59,33,20,.06)",
            }}
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={open}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                padding: "16px 18px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontFamily: "Norwige, sans-serif", fontWeight: 400, color: ESPRESSO }}>
                  {entry.name}
                </h3>
                <div style={{ fontSize: 13, color: "rgba(59,33,20,0.6)", marginTop: 2 }}>{entry.subtitle}</div>
              </div>
              <div
                style={{
                  color: RUST,
                  fontSize: 20,
                  transition: ".2s",
                  transform: open ? "rotate(90deg)" : "none",
                  flex: "0 0 auto",
                }}
              >
                ›
              </div>
            </button>
            {open && (
              <div style={{ padding: "0 18px 18px" }}>
                <WorkRow label="✅ What they do well" color={RUST} items={entry.strengths} />
                <WorkRow label="⚑ Where there's room to grow" color={ORANGE} items={entry.growthAreas} />
              </div>
            )}
          </div>
        );
      })}

      <div
        style={{
          background: "#fff",
          border: `1px solid ${LINE}`,
          borderLeft: `4px solid ${ORANGE}`,
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 1px 2px rgba(59,33,20,.05), 0 8px 24px rgba(59,33,20,.06)",
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontFamily: "Norwige, sans-serif", fontWeight: 400, color: ESPRESSO }}>
          {patternPanel.heading}
        </h3>
        <WorkRow label={patternPanel.tableStakesLabel} color={RUST} items={patternPanel.tableStakesItems} />
        <WorkRow label={patternPanel.growthLabel} color={ORANGE} items={patternPanel.growthItems} />
      </div>
    </div>
  );
}

function WorkRow({ label, color, items }: { label: string; color: string; items: string[] }) {
  return (
    <div style={{ margin: "10px 0" }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 4,
          color,
          fontFamily: "'Neue Montreal', sans-serif",
        }}
      >
        {label}
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, color: ESPRESSO }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
