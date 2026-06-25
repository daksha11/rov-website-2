// ═══════════════════════════════════════════════════════
// CTRL-A — THE COOKBOOK (teaser)
// A digital muse feeds the maker too. This section states the
// purpose and teases one dish: the volume's most appetising
// pick. No full recipes here, just the hook. The "plate"
// reads as a little planet, on theme with the space world.
// ═══════════════════════════════════════════════════════

import Image from "next/image";
import { ed, Bleed, Rule, Label, Kicker } from "./editorial";
import { cookbook } from "../data";

function MetaStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Label color={ed.inkFaint}>{label}</Label>
      <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(16px,1.8vw,21px)", letterSpacing: "-0.01em", color: accent }}>
        {value}
      </span>
    </div>
  );
}

export default function Cookbook() {
  const peek = cookbook.recipes.find((r) => r.featured) ?? cookbook.recipes[0];
  const accent = ed.gold;

  return (
    <section id="cookbook" style={{ background: "transparent", padding: "clamp(56px,8vw,104px) 0", scrollMarginTop: 0 }}>
      <Bleed>
        <Kicker color={ed.gold} style={{ marginBottom: 16 }}>{cookbook.eyebrow}</Kicker>

        {/* Purpose */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(40px,7.5vw,104px)", letterSpacing: "-0.03em", lineHeight: 0.88, color: ed.ink, margin: 0 }}>
            The Cookbook<span style={{ color: accent }}>.</span>
          </h2>
          <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(16px,2.1vw,28px)", lineHeight: 1.3, color: accent, textAlign: "right", maxWidth: 420, margin: 0 }}>
            {cookbook.lede}
          </p>
        </div>
        <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(18px,2.4vw,28px) 0 0", maxWidth: 620 }}>
          {cookbook.note}
        </p>

        <Rule style={{ margin: "clamp(32px,4.5vw,56px) 0" }} />

        {/* Sneak peek — a plate emerging from the void. The frame is
            feathered so the photo melts into the cosmic backdrop instead
            of a hard rectangle; gold registration corners + grain frame
            it as an editorial plate. */}
        <div className="ctrla-cookbook-peek">
          {/* The dish */}
          <div className="ctrla-plate-frame">
            {/* Soft gold halo that seats the plate in space */}
            <span aria-hidden className="ctrla-plate-glow" />

            <div
              className="ctrla-plate"
              style={{
                background: peek.image
                  ? ed.panel
                  : `radial-gradient(120% 130% at 30% 25%, ${accent}2E 0%, ${ed.panel} 52%, ${ed.ground} 100%)`,
              }}
            >
              {peek.image ? (
                <Image src={peek.image} alt={peek.name} fill sizes="(max-width: 820px) 92vw, 560px" style={{ objectFit: "cover" }} />
              ) : (
                <>
                  {/* The plate, a little planet */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: "min(48%, 220px)",
                      aspectRatio: "1 / 1",
                      borderRadius: "50%",
                      background: `radial-gradient(circle at 34% 30%, ${accent}, ${ed.panel} 78%)`,
                      boxShadow: `0 0 60px ${accent}44, inset 0 0 0 1px ${ed.hair}`,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 16,
                      bottom: 14,
                      fontFamily: ed.mono,
                      fontSize: "clamp(8px,0.9vw,10px)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: ed.inkFaint,
                    }}
                  >
                    Hero shot: {peek.name}
                  </span>
                </>
              )}
              {/* Cosmic grain ties the photo to the rest of the world */}
              <span aria-hidden className="ctrla-grain ctrla-plate-grain" />
            </div>

            {/* Gold registration corners — crop marks bracketing the plate */}
            <span aria-hidden className="ctrla-plate-tick tl" />
            <span aria-hidden className="ctrla-plate-tick bl" />
            <span aria-hidden className="ctrla-plate-tick br" />

            {/* Sneak-peek tag */}
            <span
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                zIndex: 4,
                fontFamily: ed.mono,
                fontSize: 9,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: ed.ground,
                background: accent,
                padding: "5px 10px",
              }}
            >
              Sneak peek
            </span>
          </div>

          {/* The pitch */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Kicker color={ed.gold} style={{ marginBottom: 14 }}>This volume&apos;s pick</Kicker>
            <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 12 }}>
              {peek.origin}
              {peek.by ? ` · ${peek.by}` : ""}
            </Label>
            <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(34px,5vw,68px)", letterSpacing: "-0.03em", lineHeight: 0.92, color: ed.ink, margin: "0 0 18px" }}>
              {peek.name}
            </h3>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 26px", maxWidth: 480 }}>
              {peek.blurb}
            </p>
            <div style={{ display: "flex", gap: "clamp(24px,3.5vw,52px)", paddingTop: 22, borderTop: `1px solid ${ed.hair}` }}>
              <MetaStat label="Time" value={peek.time} accent={accent} />
              <MetaStat label="Cost" value={peek.cost} accent={accent} />
              <MetaStat label="Serves" value={peek.serves} accent={accent} />
            </div>
          </div>
        </div>
      </Bleed>
    </section>
  );
}
