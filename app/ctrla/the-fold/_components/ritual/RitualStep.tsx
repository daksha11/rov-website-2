"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — ritual step
// One step of the intention flow. Presentational only: choices
// are text rows with a hairline and an accent tick, never filled
// buttons or icon chips. The controller decides advancement.
// ═══════════════════════════════════════════════════════

import { ed, Label } from "../../../_components/editorial";

export interface ChoiceOption {
  id: string;
  label: string;
  hint?: string;
}

interface RitualStepProps {
  n: string;
  total: string;
  prompt: string;
  kind: "choice" | "input";
  // choice
  options?: ChoiceOption[];
  selected?: string;
  onSelect?: (id: string) => void;
  // input
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  onAdvance?: () => void;
  advanceLabel?: string;
  canAdvance?: boolean;
  // nav
  onBack: () => void;
  backLabel: string;
}

export default function RitualStep({
  n,
  total,
  prompt,
  kind,
  options,
  selected,
  onSelect,
  value,
  onChange,
  placeholder,
  onAdvance,
  advanceLabel,
  canAdvance,
  onBack,
  backLabel,
}: RitualStepProps) {
  return (
    <div key={n} className="fold-fade-up" style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "clamp(20px,3vw,30px)" }}>
        <Label color={ed.gold}>{n}</Label>
        <span style={{ color: ed.inkFaint, fontFamily: ed.mono, fontSize: 11 }}>/</span>
        <Label color={ed.inkFaint}>{total}</Label>
      </div>

      <h2
        style={{
          fontFamily: ed.serif,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(34px,6.5vw,72px)",
          lineHeight: 0.96,
          letterSpacing: "-0.01em",
          color: ed.paper,
          margin: "0 0 clamp(28px,4vw,48px)",
        }}
      >
        {prompt}
      </h2>

      {kind === "choice" && options && (
        <div role="radiogroup" aria-label={prompt}>
          {options.map((opt) => {
            const isSel = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSel}
                onClick={() => onSelect?.(opt.id)}
                className="fold-choice"
                data-selected={isSel ? "true" : "false"}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderTop: `1px solid ${ed.hair}`,
                  padding: "clamp(16px,2.4vw,22px) 0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 16,
                  textAlign: "left",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "baseline", gap: 16 }}>
                  <span
                    aria-hidden
                    className="fold-choice-tick"
                    style={{ width: 16, height: 2, alignSelf: "center", background: ed.gold, flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontFamily: ed.grotesque,
                      fontWeight: 600,
                      fontSize: "clamp(22px,3.2vw,38px)",
                      letterSpacing: "-0.01em",
                      color: isSel ? ed.gold : ed.paper,
                    }}
                  >
                    {opt.label}
                  </span>
                </span>
                {opt.hint && (
                  <span
                    style={{
                      fontFamily: ed.body,
                      fontSize: "clamp(12px,1.5vw,16px)",
                      color: ed.inkFaint,
                      maxWidth: 280,
                      textAlign: "right",
                    }}
                  >
                    {opt.hint}
                  </span>
                )}
              </button>
            );
          })}
          <div style={{ height: 1, background: ed.hair }} />
        </div>
      )}

      {kind === "input" && (
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap", borderBottom: `1px solid ${ed.gold}`, paddingBottom: 12 }}>
            <span
              style={{
                fontFamily: ed.serif,
                fontStyle: "italic",
                fontSize: "clamp(22px,3.4vw,40px)",
                color: ed.inkFaint,
                whiteSpace: "nowrap",
              }}
            >
              {placeholder}
            </span>
            <input
              autoFocus
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdvance) onAdvance?.();
              }}
              aria-label={prompt}
              style={{
                flex: 1,
                minWidth: 220,
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: ed.serif,
                fontStyle: "italic",
                fontSize: "clamp(22px,3.4vw,40px)",
                color: ed.paper,
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => onAdvance?.()}
            className="fold-enter-cta"
            style={{
              marginTop: "clamp(32px,4vw,48px)",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 700,
                fontSize: "clamp(20px,2.6vw,30px)",
                color: ed.paper,
              }}
            >
              {advanceLabel}
            </span>
            <span aria-hidden className="fold-enter-arrow" style={{ color: ed.gold, transition: "transform .3s ease" }}>
              →
            </span>
          </button>
        </div>
      )}

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="ctrla-back"
        style={{
          marginTop: "clamp(36px,5vw,56px)",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: ed.inkFaint }}>←</span>
        <Label color={ed.inkFaint}>{backLabel}</Label>
      </button>
    </div>
  );
}
