import type { IndustryService } from "@/lib/types";
import { HEADING, BODY, NEAR_BLACK, PILL_TEXT } from "./shared";
import { Reveal } from "./Reveal";

/** Service cards for this ICP, in the CreativeAddOns/PricingTiers dark card
 *  language: ember icon chip, Norwige italic name, Roboto blurb on black. */
export function IndustryServices({
  services,
  heading = "What we'd build for you",
  eyebrowNo = "03",
}: {
  services: IndustryService[];
  heading?: string;
  eyebrowNo?: string;
}) {
  if (!services || services.length === 0) return null;

  return (
    <section
      style={{ background: NEAR_BLACK, padding: "clamp(56px, 7vw, 88px) clamp(20px, 6%, 6%)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Left-anchored header — consistent with every other section header. */}
        <Reveal
          className="icp-svc-head"
          style={{ maxWidth: 640, textAlign: "start" }}
        >
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
              justifyContent: "flex-start",
              gap: 12,
            }}
          >
            <span>{eyebrowNo}</span>
            <span
              aria-hidden
              style={{ width: 28, height: 1, background: "rgba(234,154,97,0.5)" }}
            />
            <span>What we build</span>
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
          className="icp-svc-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 18,
          }}
        >
          {services.map((s, i) => (
            <Reveal key={i} delay={i * 70}>
              <div
                className="icp-svc-card"
                style={{
                  height: "100%",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: i % 2 === 0 ? "18px 4px 18px 18px" : "18px",
                  padding: "28px 26px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Ember icon chip */}
                <div
                  aria-hidden
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(234,154,97,0.22)",
                    background:
                      "linear-gradient(160deg, rgba(234,154,97,0.10) 0%, rgba(234,154,97,0.02) 100%)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={PILL_TEXT}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: HEADING,
                    fontStyle: "italic",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    color: "#FFF4E3",
                    margin: "0 0 12px",
                  }}
                >
                  {s.name}
                </h3>
                <p
                  style={{
                    fontFamily: BODY,
                    fontWeight: 300,
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.55)",
                    margin: 0,
                  }}
                >
                  {s.blurb}
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
          .icp-svc-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .icp-svc-card { transition: border-color 200ms ease, background 200ms ease; }
        @media (hover: hover) {
          .icp-svc-card:hover {
            border-color: rgba(234,154,97,0.3);
            background: rgba(255,255,255,0.035);
          }
        }
      `,
        }}
      />
    </section>
  );
}
