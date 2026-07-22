import type { CSSProperties } from "react";
import { HEADING } from "./shared";

/**
 * Oversized typographic backdrop — a huge Norwige word or numeral set behind a
 * section as an art-directed texture. Purely decorative (aria-hidden), sits at
 * z-index 0 so real content (z-index 1) reads on top. Two fills: a very low
 * opacity solid ("fill") or an outlined stroke ("stroke"). Shrinks hard on
 * mobile and never causes horizontal scroll (the parent must clip overflow).
 */
export function GhostType({
  text,
  position = "right",
  variant = "fill",
  top,
}: {
  text: string;
  position?: "left" | "right" | "center";
  variant?: "fill" | "stroke";
  /** Vertical anchor as a CSS value (default roughly centered). */
  top?: string;
}) {
  const horizontal =
    position === "left"
      ? { left: "-2%", textAlign: "left" as const }
      : position === "center"
      ? { left: 0, right: 0, textAlign: "center" as const }
      : { right: "-2%", textAlign: "right" as const };

  const strokeStyle: CSSProperties =
    variant === "stroke"
      ? {
          color: "transparent",
          WebkitTextStroke: "1px rgba(234,154,97,0.14)",
        }
      : { color: "rgba(234,154,97,0.05)" };

  return (
    <span
      aria-hidden
      className="icp-ghost-type"
      style={{
        position: "absolute",
        top: top ?? "50%",
        transform: top ? "none" : "translateY(-50%)",
        fontFamily: HEADING,
        fontWeight: 800,
        fontStyle: "italic",
        lineHeight: 0.8,
        letterSpacing: "-0.02em",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        zIndex: 0,
        fontSize: "clamp(4.5rem, 20vw, 15rem)",
        ...horizontal,
        ...strokeStyle,
      }}
    >
      {text}
    </span>
  );
}
