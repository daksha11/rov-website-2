import type { IndustryStat } from "@/lib/types";
import { HEADING, BODY, NEAR_BLACK, ACCENT_TEXT_GRADIENT, PILL_TEXT } from "./shared";
import { Reveal } from "./Reveal";

/** Stats row on deep black — big gradient Norwige numerals, Roboto labels.
 *  Art direction: the row lifts up over the hero (negative margin overlap),
 *  tiles sit on staggered baselines with slightly varied radii, and a thin
 *  vertical ember rule drops out of the band to tie it into the pains below.
 *  Scroll-reveal per tile (Reveal respects prefers-reduced-motion). */
export function IndustryStats({ stats }: { stats: IndustryStat[] }) {
  if (!stats || stats.length === 0) return null;

  return (
    <section
      style={{
        position: "relative",
        zIndex: 2,
        background: NEAR_BLACK,
        padding: "0 clamp(20px, 6%, 6%) clamp(40px, 6vw, 64px)",
      }}
    >
      <div
        className="icp-stats-grid"
        style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          marginTop: "clamp(-44px, -6vw, -76px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: 18,
        }}
      >
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 90}>
            <div
              className="icp-stat-tile"
              style={{
                height: "100%",
                background: "rgba(126, 42, 12, 0.15)",
                border: "1px solid rgba(202, 53, 0, 0.20)",
                // Alternating radii so the row is not a strip of identical boxes.
                borderRadius: i % 2 === 0 ? "20px 20px 20px 6px" : "6px 20px 20px 20px",
                padding: "clamp(28px, 4vw, 40px) clamp(20px, 3vw, 28px)",
                boxShadow: "0 22px 60px rgba(0,0,0,0.45)",
              }}
            >
              <div
                style={{
                  fontFamily: HEADING,
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "clamp(2.5rem, 5.5vw, 3.5rem)",
                  lineHeight: 1,
                  marginBottom: 14,
                  background: ACCENT_TEXT_GRADIENT,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: BODY,
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                {s.label}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Staggered baselines on wide viewports only (restacks flat on mobile).
           Targets the inner tile so it survives the Reveal inline transform. */
        @media (min-width: 760px) {
          .icp-stats-grid > *:nth-child(even) .icp-stat-tile { transform: translateY(18px); }
        }
        .icp-stat-tile { border-top: 2px solid ${PILL_TEXT}22; }
      `,
        }}
      />
    </section>
  );
}
