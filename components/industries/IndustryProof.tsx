import Link from "next/link";
import Image from "next/image";
import type { IndustryProof as ProofData } from "@/lib/types";
import { HEADING, BODY, EMBER_LIGHT, PILL_TEXT, BLACK } from "./shared";
import { Reveal } from "./Reveal";

/**
 * Trust slot — a dark feature panel in the DDKFeatureTestimonial vein: ambient
 * ember glow, eyebrow with a hairline, big italic heading, and a stat block.
 * Three shapes per proof.type (case-study / credentials / logos).
 */
export function IndustryProof({ proof }: { proof: ProofData }) {
  if (!proof || (!proof.heading && !proof.body)) return null;

  if (proof.type === "logos") {
    return (
      <section
        style={{ background: BLACK, padding: "clamp(56px, 9vw, 88px) clamp(20px, 6%, 6%)" }}
      >
        <Reveal style={{ maxWidth: 1040, margin: "0 auto", textAlign: "center" }}>
          {proof.heading && (
            <h2
              style={{
                fontFamily: HEADING,
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(1.6rem, 3.5vw, 2.25rem)",
                color: "#FFFFFF",
                margin: "0 0 12px",
              }}
            >
              {proof.heading}
            </h2>
          )}
          {proof.body && (
            <p
              style={{
                fontFamily: BODY,
                fontWeight: 300,
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.6)",
                margin: "0 auto 28px",
                maxWidth: 560,
              }}
            >
              {proof.body}
            </p>
          )}
          {proof.logos && proof.logos.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "28px 40px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {proof.logos.map((l, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={l.src}
                  alt={l.alt}
                  style={{
                    height: 34,
                    width: "auto",
                    opacity: 0.7,
                    filter: "brightness(0) invert(1)",
                  }}
                />
              ))}
            </div>
          )}
        </Reveal>
      </section>
    );
  }

  const isCaseStudy = proof.type === "case-study";
  const hasStat = !!(proof.stat && proof.stat.value);
  const hasImage = !!proof.image;

  /**
   * Credentials with structured points: the body becomes a short lede and the
   * substance moves into a 2x2 card grid, with the stat sitting beside the
   * heading instead of floating in an empty right column. Pages without
   * `points` fall through to the original prose panel below.
   */
  if (proof.type === "credentials" && proof.points && proof.points.length > 0) {
    return (
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: BLACK,
          padding: "clamp(56px, 7vw, 92px) clamp(20px, 6%, 6%)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "-6%",
            top: "10%",
            width: "55%",
            height: "70%",
            background:
              "radial-gradient(ellipse, rgba(234,154,97,0.12) 0%, transparent 68%)",
            filter: "blur(72px)",
            pointerEvents: "none",
          }}
        />
        <Reveal style={{ position: "relative", maxWidth: 1040, margin: "0 auto" }}>
          <div
            style={{
              borderRadius: 24,
              padding: 1,
              background:
                "linear-gradient(135deg, rgba(234,154,97,0.45) 0%, rgba(234,154,97,0.06) 45%, rgba(234,154,97,0.02) 100%)",
            }}
          >
            <div
              style={{
                borderRadius: 23,
                padding: "clamp(30px, 5vw, 56px)",
                background:
                  "linear-gradient(160deg, rgba(30,26,23,1) 0%, rgba(12,10,9,1) 100%)",
              }}
            >
              {/* Header row: heading left, stat hard right so the top of the
                  panel carries weight on both sides. */}
              <div className="icp-proof-head">
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        display: "inline-block",
                        width: 22,
                        height: 1,
                        background: "rgba(234,154,97,0.5)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: BODY,
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: PILL_TEXT,
                      }}
                    >
                      Why us
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: HEADING,
                      fontStyle: "italic",
                      fontWeight: 700,
                      fontSize: "clamp(1.6rem, 3.6vw, 2.5rem)",
                      lineHeight: 1.15,
                      color: "#FFFFFF",
                      margin: "0 0 16px",
                      maxWidth: 560,
                    }}
                  >
                    {proof.heading}
                  </h2>
                  <p
                    style={{
                      fontFamily: BODY,
                      fontWeight: 300,
                      fontSize: "clamp(0.98rem, 1.6vw, 1.06rem)",
                      lineHeight: 1.65,
                      color: "rgba(255,255,255,0.62)",
                      margin: 0,
                      maxWidth: 560,
                    }}
                  >
                    {proof.body}
                  </p>
                </div>

                {hasStat && (
                  <div className="icp-proof-stat">
                    <span
                      style={{
                        fontFamily: HEADING,
                        fontStyle: "italic",
                        fontWeight: 700,
                        fontSize: "clamp(2.6rem, 6vw, 4rem)",
                        lineHeight: 0.95,
                        color: "#FFFFFF",
                        display: "block",
                      }}
                    >
                      {proof.stat!.value}
                    </span>
                    <span
                      style={{
                        fontFamily: BODY,
                        fontWeight: 300,
                        fontSize: 14,
                        lineHeight: 1.45,
                        color: "rgba(255,255,255,0.6)",
                        display: "block",
                        marginTop: 10,
                      }}
                    >
                      {proof.stat!.label}
                    </span>
                  </div>
                )}
              </div>

              {/* The substance, as cards rather than a paragraph. */}
              <div className="icp-proof-points">
                {proof.points.map((pt) => (
                  <div
                    key={pt.label}
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      padding: "20px 20px 22px",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: HEADING,
                        fontStyle: "italic",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        lineHeight: 1.2,
                        color: PILL_TEXT,
                        margin: "0 0 8px",
                      }}
                    >
                      {pt.label}
                    </h3>
                    <p
                      style={{
                        fontFamily: BODY,
                        fontWeight: 300,
                        fontSize: 14.5,
                        lineHeight: 1.55,
                        color: "rgba(255,255,255,0.66)",
                        margin: 0,
                      }}
                    >
                      {pt.text}
                    </p>
                  </div>
                ))}
              </div>

              {proof.link && (
                <div style={{ marginTop: 26 }}>
                  <Link
                    href={proof.link}
                    style={{
                      fontFamily: BODY,
                      fontWeight: 500,
                      fontSize: 15,
                      color: EMBER_LIGHT,
                      textDecoration: "underline",
                      textUnderlineOffset: 4,
                    }}
                  >
                    Read the full story →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Reveal>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .icp-proof-head { display: grid; grid-template-columns: 1fr; gap: 28px; }
          .icp-proof-stat {
            border-left: 2px solid rgba(234,154,97,0.45);
            padding-left: 20px;
            align-self: start;
          }
          .icp-proof-points {
            display: grid;
            grid-template-columns: 1fr;
            gap: 14px;
            margin-top: clamp(28px, 4vw, 40px);
          }
          @media (min-width: 700px) {
            .icp-proof-points { grid-template-columns: 1fr 1fr; }
          }
          @media (min-width: 900px) {
            .icp-proof-head { grid-template-columns: 1.55fr 1fr; gap: 44px; align-items: start; }
          }
        `,
          }}
        />
      </section>
    );
  }

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: BLACK,
        padding: "clamp(56px, 7vw, 92px) clamp(20px, 6%, 6%)",
      }}
    >
      {/* Ambient ember glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-6%",
          top: "12%",
          width: "50%",
          height: "70%",
          background:
            "radial-gradient(ellipse, rgba(234,154,97,0.10) 0%, transparent 68%)",
          filter: "blur(72px)",
          pointerEvents: "none",
        }}
      />
      <Reveal style={{ position: "relative", maxWidth: 1040, margin: "0 auto" }}>
        <div
          style={{
            borderRadius: 24,
            padding: 1,
            background:
              "linear-gradient(135deg, rgba(234,154,97,0.45) 0%, rgba(234,154,97,0.06) 45%, rgba(234,154,97,0.02) 100%)",
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: 23,
              padding: "clamp(32px, 6vw, 64px)",
              background:
                "linear-gradient(160deg, rgba(30,26,23,1) 0%, rgba(12,10,9,1) 100%)",
              // Visible so the case-study image can overhang the card's top edge.
              overflow: "visible",
            }}
          >
            {/* Clip layer just for the corner glow (keeps the panel able to overhang). */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 23,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-20%",
                  right: "-15%",
                  width: 320,
                  height: 320,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(234,154,97,0.35) 0%, transparent 65%)",
                  opacity: 0.25,
                }}
              />
            </div>

            <div
              className="icp-proof-grid"
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "clamp(28px, 5vw, 56px)",
                alignItems: "center",
              }}
            >
              {/* Copy */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 22,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 22,
                      height: 1,
                      background: "rgba(234,154,97,0.5)",
                    }}
                    aria-hidden
                  />
                  <span
                    style={{
                      fontFamily: BODY,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: PILL_TEXT,
                    }}
                  >
                    {isCaseStudy ? "Case study" : "Why us"}
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: HEADING,
                    fontStyle: "italic",
                    fontWeight: 700,
                    fontSize: "clamp(1.6rem, 3.6vw, 2.5rem)",
                    lineHeight: 1.15,
                    color: "#FFFFFF",
                    margin: "0 0 18px",
                    maxWidth: 640,
                  }}
                >
                  {proof.heading}
                </h2>
                <p
                  style={{
                    fontFamily: BODY,
                    fontWeight: 300,
                    fontSize: "clamp(1rem, 2vw, 1.125rem)",
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.7)",
                    margin: 0,
                    maxWidth: 640,
                  }}
                >
                  {proof.body}
                </p>

                {proof.link && (
                  <div style={{ marginTop: 26 }}>
                    <Link
                      href={proof.link}
                      style={{
                        fontFamily: BODY,
                        fontWeight: 500,
                        fontSize: 15,
                        color: EMBER_LIGHT,
                        textDecoration: "underline",
                        textUnderlineOffset: 4,
                      }}
                    >
                      Read the full story →
                    </Link>
                  </div>
                )}
              </div>

              {/* Image + stat column */}
              {(hasImage || hasStat) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {hasImage && (
                    <div
                      className="icp-proof-img"
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "4 / 3",
                        borderRadius: 18,
                        overflow: "hidden",
                        border: "1px solid rgba(234,154,97,0.2)",
                        background: "var(--gradient-ember)",
                        boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
                      }}
                    >
                      <Image
                        src={proof.image!}
                        alt={proof.imageAlt || proof.heading || "Case study visual"}
                        fill
                        sizes="(max-width: 820px) 100vw, 420px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                  {hasStat && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        padding: "clamp(24px, 3vw, 32px)",
                        borderRadius: 18,
                        background: "rgba(234,154,97,0.05)",
                        border: "1px solid rgba(234,154,97,0.2)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: HEADING,
                          fontStyle: "italic",
                          fontWeight: 700,
                          fontSize: "clamp(3rem, 7vw, 4.5rem)",
                          lineHeight: 1,
                          color: "#FFFFFF",
                        }}
                      >
                        {proof.stat!.value}
                      </span>
                      <span
                        style={{
                          fontFamily: BODY,
                          fontWeight: 300,
                          fontSize: 15,
                          lineHeight: 1.5,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        {proof.stat!.label}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (min-width: 820px) {
          .icp-proof-grid { grid-template-columns: 1.4fr 1fr !important; }
          /* The image overhangs the card: rises above the top edge and bleeds
             toward the right, so it reads as crossing the panel boundary. */
          .icp-proof-img {
            margin-top: clamp(-72px, -6vw, -40px);
            margin-right: clamp(-40px, -4vw, -20px);
          }
        }
      `,
        }}
      />
    </section>
  );
}
