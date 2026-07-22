import type { IndustryPullQuote as PullQuoteData } from "@/lib/types";
import { BLACK, ACCENT_TEXT_GRADIENT, PILL_TEXT, BODY } from "./shared";
import { Reveal } from "./Reveal";
import GradientBlob from "@/components/effects/GradientBlob";

/**
 * Editorial pull-quote band — a single sentence lifted from the body, set huge
 * in NorwigeHeroItalic, placed asymmetrically (left- or right-anchored) with an
 * ember-gradient accent word. A soft GradientBlob sits behind for depth. This is
 * the page's one "breath" moment: a narrow column against a wide dark band.
 */
export function IndustryPullQuote({
  quote,
  align = "left",
}: {
  quote: PullQuoteData;
  align?: "left" | "right";
}) {
  if (!quote || !quote.text) return null;

  const { text, accent } = quote;
  // Split the sentence around the accent substring (verbatim match).
  let head = text;
  let mid = "";
  let tail = "";
  if (accent && text.includes(accent)) {
    const at = text.indexOf(accent);
    head = text.slice(0, at);
    mid = accent;
    tail = text.slice(at + accent.length);
  }

  const isRight = align === "right";

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: BLACK,
        padding: "clamp(52px, 7vw, 88px) clamp(20px, 6%, 6%)",
      }}
    >
      <GradientBlob
        position={isRight ? "bottom-left" : "top-right"}
        opacity={0.28}
        size="620px"
        blur="180px"
      />
      <figure
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1180,
          margin: "0 auto",
          padding: 0,
        }}
      >
        <Reveal
          style={{
            maxWidth: "min(100%, 860px)",
            marginLeft: isRight ? "auto" : 0,
            marginRight: isRight ? 0 : "auto",
            textAlign: isRight ? "right" : "left",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "block",
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: PILL_TEXT,
              marginBottom: 26,
            }}
          >
            {isRight ? "In short" : "The idea"}
          </span>
          <blockquote
            style={{
              margin: 0,
              fontFamily: "NorwigeHeroItalic, sans-serif",
              fontWeight: "normal",
              fontSize: "clamp(1.9rem, 5vw, 4rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.01em",
              color: "#FFFFFF",
            }}
          >
            {head}
            {mid && (
              <span
                style={{
                  background: ACCENT_TEXT_GRADIENT,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {mid}
              </span>
            )}
            {tail}
          </blockquote>
        </Reveal>
      </figure>
    </section>
  );
}
