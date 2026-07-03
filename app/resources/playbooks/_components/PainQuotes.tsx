"use client";

import { useState } from "react";
import type { PainFilter, PainQuote } from "../_content/types";

const ESPRESSO = "#3B2114";
const RUST = "#90422C";
const LINE = "rgba(59,33,20,0.14)";

export function PainQuotes({ filters, quotes }: { filters: PainFilter[]; quotes: PainQuote[] }) {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? quotes : quotes.filter((q) => q.tags.includes(active));

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActive(f.id)}
            style={{
              background: active === f.id ? ESPRESSO : "#fff",
              color: active === f.id ? "#FFF4E3" : "rgba(59,33,20,0.65)",
              border: `1px solid ${active === f.id ? ESPRESSO : LINE}`,
              borderRadius: 20,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Neue Montreal', sans-serif",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div>
        {visible.map((q, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: `1px solid ${LINE}`,
              borderLeft: `4px solid ${q.real ? RUST : "#C9C1B0"}`,
              borderRadius: 10,
              padding: "16px 18px",
              marginBottom: 14,
              boxShadow: "0 1px 2px rgba(59,33,20,.05), 0 8px 24px rgba(59,33,20,.06)",
            }}
          >
            <p style={{ margin: "0 0 8px", fontSize: 16, fontStyle: "italic", color: ESPRESSO }}>&ldquo;{q.quote}&rdquo;</p>
            <div style={{ fontSize: 13, color: "rgba(59,33,20,0.65)", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <span style={{ fontWeight: 600, fontStyle: "normal", color: ESPRESSO }}>{q.who}</span>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 20,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  background: q.real ? "rgba(144,66,44,0.12)" : "#EEEAE0",
                  color: q.real ? RUST : "#75705F",
                }}
              >
                {q.real ? "real agent" : "article voice"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
