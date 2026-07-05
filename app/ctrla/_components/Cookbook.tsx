// ═══════════════════════════════════════════════════════
// CTRL-A — THE COOKBOOK (landing teaser)
// A digital muse feeds the maker too. This compact section is the
// on-page anchor for TOC row 05. It states the purpose and shows a
// closed "mini-fridge": the three magnets (meal / snack / drink)
// plus the volume's chef, all wrapped as one link into the full
// galley at /ctrla/cookbook. No full recipes here, just the hook.
// ═══════════════════════════════════════════════════════

import { ed, Bleed, Rule, Label, Kicker } from "./editorial";
import { galley, galleyMeta, cookbook, type GalleyCategory } from "../data";

const ORDER: GalleyCategory[] = ["meal", "snack", "drink"];

// The closed door: the same three picks the fridge opens to, as static
// magnet chips. Purely a teaser, so it links rather than opens.
function MiniMagnet({ category }: { category: GalleyCategory }) {
  const recipe = galley.find((r) => r.category === category);
  const meta = galleyMeta[category];
  if (!recipe) return null;
  return (
    <span className="ctrla-fridge-mini-magnet" style={{ ["--accent" as string]: meta.accent }}>
      <span className="ctrla-fridge-mini-cat">{meta.label}</span>
      <span className="ctrla-fridge-mini-name">{recipe.name}</span>
      {recipe.by && <span className="ctrla-fridge-credit">brought by {recipe.by}</span>}
    </span>
  );
}

export default function Cookbook() {
  const accent = ed.gold;
  const chef = cookbook.chef;
  const submitUrl = cookbook.submitUrl ?? "/contact";

  return (
    <section id="cookbook" style={{ background: "transparent", padding: "clamp(48px,7vw,96px) 0", scrollMarginTop: 80 }}>
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(18px,2.4vw,30px)" }}>
          <Kicker color={accent}>{cookbook.eyebrow}</Kicker>
          <Label color={accent}>Meal · Snack · Drink</Label>
        </div>
        <Rule color={ed.hair} style={{ marginBottom: "clamp(24px,3.5vw,44px)" }} />

        <div className="ctrla-cookbook-peek">
          {/* The pitch */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(40px,6.5vw,92px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: ed.ink, margin: 0 }}>
              The Cookbook<span style={{ color: accent }}>.</span>
            </h2>
            <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(16px,2.1vw,26px)", lineHeight: 1.3, color: accent, margin: "clamp(12px,1.6vw,18px) 0 0", maxWidth: 460 }}>
              {cookbook.lede}
            </p>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(16px,2.2vw,24px) 0 0", maxWidth: 480 }}>
              {cookbook.note}
            </p>

            {chef && (
              <p className="ctrla-fridge-credit ctrla-fridge-credit-lg" style={{ margin: "clamp(18px,2.4vw,26px) 0 0" }}>
                Chef of the volume: {chef.name}, {chef.city}. {chef.bio}
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "clamp(18px,3vw,32px)", flexWrap: "wrap", marginTop: "clamp(22px,3vw,32px)" }}>
              <a href="/ctrla/cookbook" className="ctrla-cover-cta" style={{ fontFamily: ed.mono, fontSize: "clamp(12px,1.4vw,15px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ed.ground, background: accent, padding: "15px 30px", borderRadius: 4, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
                Open the galley <span aria-hidden>→</span>
              </a>
              <a href={submitUrl} className="ctrla-fridge-submit" style={{ margin: 0 }}>
                Leave something in the fridge <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* The closed mini-fridge — links into the full galley */}
          <a href="/ctrla/cookbook" className="ctrla-fridge-mini" aria-label="Open the galley fridge">
            <span aria-hidden className="ctrla-fridge-mini-badge">CTRL-A · GALLEY</span>
            <span className="ctrla-fridge-mini-door">
              <span className="ctrla-fridge-mini-magnets">
                {ORDER.map((c) => (
                  <MiniMagnet key={c} category={c} />
                ))}
                {chef && (
                  <span className="ctrla-fridge-mini-chef">
                    <span className="ctrla-fridge-mini-chef-role">Chef · {chef.name}</span>
                  </span>
                )}
              </span>
              <span aria-hidden className="ctrla-fridge-mini-handle" />
            </span>
            <span aria-hidden className="ctrla-fridge-mini-cta">Pull the handle →</span>
          </a>
        </div>
      </Bleed>
    </section>
  );
}
