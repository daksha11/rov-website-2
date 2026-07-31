import Link from "next/link";
import Image from "next/image";
import type { IndustrySpotlight as SpotlightData } from "@/lib/types";
import { HEADING, BODY, BLACK, PILL_TEXT, EMBER_LIGHT } from "./shared";
import { Reveal } from "./Reveal";

/**
 * One client, said large. A row of small testimonial cards reads as filler on
 * these pages; a single on-corridor client at full width reads as evidence.
 * Image left, oversized italic quote right, with the client's location carried
 * as context (where their storefront is, not an endorsement by the landmark).
 */
export function IndustrySpotlight({ spotlight }: { spotlight: SpotlightData }) {
  const { quote, name, role, place, stat, image, imageAlt, link, linkLabel } =
    spotlight;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: BLACK,
        padding: "clamp(56px, 8vw, 104px) clamp(20px, 6%, 6%)",
      }}
    >
      {/* Ambient ember wash behind the quote side. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-10%",
          top: "6%",
          width: "60%",
          height: "80%",
          background:
            "radial-gradient(ellipse, rgba(234,154,97,0.13) 0%, transparent 66%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <Reveal style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
        <div className="icp-spot-grid">
          {image && (
            <div className="icp-spot-media">
              <Image
                src={image}
                alt={imageAlt || `${name}`}
                fill
                sizes="(max-width: 900px) 100vw, 460px"
                style={{ objectFit: "cover" }}
              />
              {stat && (
                <span className="icp-spot-stat" aria-hidden>
                  {stat}
                </span>
              )}
            </div>
          )}

          <figure style={{ margin: 0 }}>
            <span
              aria-hidden
              style={{
                display: "block",
                fontFamily: HEADING,
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(3.5rem, 8vw, 6rem)",
                lineHeight: 0.7,
                color: "rgba(234,154,97,0.35)",
                marginBottom: 8,
              }}
            >
              &ldquo;
            </span>
            <blockquote
              style={{
                margin: 0,
                fontFamily: HEADING,
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3.4vw, 2.6rem)",
                lineHeight: 1.24,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              {quote}
            </blockquote>

            <figcaption style={{ marginTop: "clamp(24px, 3vw, 34px)" }}>
              <span
                aria-hidden
                style={{
                  display: "block",
                  width: 44,
                  height: 2,
                  background: "rgba(234,154,97,0.55)",
                  marginBottom: 18,
                }}
              />
              <span
                style={{
                  display: "block",
                  fontFamily: HEADING,
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
                  color: "#FFFFFF",
                }}
              >
                {name}
              </span>
              {role && (
                <span
                  style={{
                    display: "block",
                    fontFamily: BODY,
                    fontWeight: 300,
                    fontSize: 15,
                    color: "rgba(255,255,255,0.6)",
                    marginTop: 4,
                  }}
                >
                  {role}
                </span>
              )}
              {place && (
                <span
                  style={{
                    display: "block",
                    fontFamily: BODY,
                    fontWeight: 600,
                    fontSize: 11.5,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: PILL_TEXT,
                    marginTop: 12,
                  }}
                >
                  {place}
                </span>
              )}
              {link && (
                <Link
                  href={link}
                  style={{
                    display: "inline-block",
                    marginTop: 20,
                    fontFamily: BODY,
                    fontWeight: 500,
                    fontSize: 15,
                    color: EMBER_LIGHT,
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                  }}
                >
                  {linkLabel || "Read the case study"} →
                </Link>
              )}
            </figcaption>
          </figure>
        </div>
      </Reveal>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .icp-spot-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(28px, 5vw, 60px);
          align-items: center;
        }
        .icp-spot-media {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(234,154,97,0.22);
          box-shadow: 0 34px 80px rgba(0,0,0,0.6);
        }
        .icp-spot-stat {
          position: absolute;
          left: 18px;
          bottom: 18px;
          font-family: ${BODY};
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #FFF4E3;
          background: rgba(12,10,9,0.72);
          border: 1px solid rgba(234,154,97,0.45);
          backdrop-filter: blur(8px);
          border-radius: 999px;
          padding: 9px 16px;
        }
        @media (min-width: 900px) {
          .icp-spot-grid { grid-template-columns: 0.85fr 1.15fr; }
        }
      `,
        }}
      />
    </section>
  );
}
