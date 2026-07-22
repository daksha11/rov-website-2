import { BODY, NEAR_BLACK, PILL_TEXT } from "./shared";

/**
 * Thin scrolling ticker strip — one per page. Pure CSS animation (no JS, no
 * deps): the phrase track is duplicated and translated -50% so the loop is
 * seamless. Pauses on hover. Fully static under prefers-reduced-motion (the
 * animation is removed, and the row simply shows the first, non-scrolling copy
 * clipped to the band). Overflow is clipped so it can never cause page scroll.
 */
export function IndustryMarquee({
  phrases,
  sep = "·",
  tone = "dark",
}: {
  phrases: string[];
  sep?: string;
  tone?: "dark" | "ember";
}) {
  if (!phrases || phrases.length === 0) return null;

  const bg =
    tone === "ember"
      ? "linear-gradient(90deg, rgba(144,66,44,0.20) 0%, rgba(59,33,20,0.20) 100%)"
      : NEAR_BLACK;

  // One rendered sequence of the phrases with separators between them.
  const Sequence = ({ hidden }: { hidden?: boolean }) => (
    <span className="icp-mq-seq" aria-hidden={hidden}>
      {phrases.map((p, i) => (
        <span className="icp-mq-item" key={i}>
          <span className="icp-mq-text">{p}</span>
          <span className="icp-mq-sep" aria-hidden>
            {sep}
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className="icp-marquee"
      role="marquee"
      aria-label={phrases.join(", ")}
      style={{
        background: bg,
        borderTop: "1px solid rgba(234,154,97,0.14)",
        borderBottom: "1px solid rgba(234,154,97,0.14)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div className="icp-mq-track">
        <Sequence />
        <Sequence hidden />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .icp-marquee { -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); }
        .icp-mq-track {
          display: flex;
          width: max-content;
          animation: icp-mq-scroll 34s linear infinite;
        }
        .icp-marquee:hover .icp-mq-track { animation-play-state: paused; }
        .icp-mq-seq { display: flex; flex-shrink: 0; padding: 14px 0; }
        .icp-mq-item { display: inline-flex; align-items: center; }
        .icp-mq-text {
          font-family: ${BODY};
          font-weight: 600;
          font-size: 12.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,244,227,0.78);
          white-space: nowrap;
        }
        .icp-mq-sep {
          color: ${PILL_TEXT};
          margin: 0 clamp(20px, 4vw, 44px);
          font-size: 13px;
        }
        @keyframes icp-mq-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .icp-mq-track { animation: none; transform: none; }
        }
      `,
        }}
      />
    </div>
  );
}
