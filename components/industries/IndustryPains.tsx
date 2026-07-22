import type { IndustryPain } from "@/lib/types";
import { HEADING, BODY, BLACK, PILL_TEXT } from "./shared";
import { Reveal } from "./Reveal";

/** Pain cards on black. Art direction: left-anchored, asymmetric header column
 *  with a numbered eyebrow, and warm dark cards on a 2-up grid with hover lift
 *  + alternating radii. */
export function IndustryPains({
  pains,
  heading = "What's actually getting in the way",
  eyebrowNo = "01",
}: {
  pains: IndustryPain[];
  heading?: string;
  eyebrowNo?: string;
}) {
  if (!pains || pains.length === 0) return null;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: BLACK,
        padding: "clamp(56px, 7vw, 88px) clamp(20px, 6%, 6%)",
      }}
    >
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
        <Reveal style={{ maxWidth: 640 }}>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: PILL_TEXT,
              margin: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>{eyebrowNo}</span>
            <span
              aria-hidden
              style={{ width: 28, height: 1, background: "rgba(234,154,97,0.5)" }}
            />
            <span>The problem</span>
          </p>
          <h2
            style={{
              fontFamily: HEADING,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
              lineHeight: 1.15,
              color: "#FFFFFF",
              margin: "0 0 44px",
            }}
          >
            {heading}
          </h2>
        </Reveal>
        <div
          className="icp-pain-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 18,
          }}
        >
          {pains.map((p, i) => (
            <Reveal key={i} delay={i * 70}>
              <div
                className="icp-pain-card"
                style={{
                  height: "100%",
                  background:
                    "linear-gradient(135deg, rgba(126, 42, 12, 0.18) 0%, rgba(159, 45, 0, 0.06) 100%)",
                  border: "1px solid rgba(159, 45, 0, 0.28)",
                  borderRadius: i % 2 === 0 ? "18px" : "18px 18px 18px 4px",
                  padding: "28px 26px",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontFamily: HEADING,
                    fontStyle: "italic",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "rgba(234,154,97,0.55)",
                    display: "block",
                    marginBottom: 14,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  style={{
                    fontFamily: HEADING,
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    lineHeight: 1.25,
                    color: "#FFF4E3",
                    margin: "0 0 12px",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: BODY,
                    fontWeight: 300,
                    fontSize: 15.5,
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.62)",
                    margin: 0,
                  }}
                >
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Two-up grid on desktop so a 4-card set never orphans a lone card.
           !important because the base 1fr is set inline (inline beats sheets). */
        @media (min-width: 760px) {
          .icp-pain-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .icp-pain-card { transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease; }
        @media (hover: hover) {
          .icp-pain-card:hover {
            transform: translateY(-3px);
            border-color: rgba(234,154,97,0.4);
            box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .icp-pain-card { transition: none; }
          .icp-pain-card:hover { transform: none; }
        }
      `,
        }}
      />
    </section>
  );
}
