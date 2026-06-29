"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE GALLEY FRIDGE
// A brushed-steel fridge drifting in the void. It holds exactly
// three things: one Meal, one Snack, one Drink. Closed, they are
// magnets on the door. Pull the handle and the door swings open on
// a staged animation, the interior lights, and the same three settle
// on the shelf. Click any one for ingredients + Time/Cost/Serves.
//
// The fiction: on a ship the kitchen is the galley, so this is the
// galley fridge keeping a creative crew fueled.
//
// Lightweight on purpose: one component, hand-rolled, no libraries.
// Styling lives in globals.css under .ctrla-fridge-*. The interior
// light + cast shadow track the door swing via one CSS var (--lit),
// ramped in JS so the light follows the door, not its own clock.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { galley, galleyMeta, type GalleyRecipe, type GalleyCategory } from "../data";

type FridgeState = "closed" | "opening" | "open";

// Fixed order on both door and shelf: meal → snack → drink.
const ORDER: GalleyCategory[] = ["meal", "snack", "drink"];

// Category glyphs, drawn with currentColor so the accent tints them.
function Glyph({ category }: { category: GalleyCategory }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (category === "meal") {
    // fork + spoon
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden {...common}>
        <path d="M8 3v7M6 3v4M10 3v4M8 10v11" />
        <path d="M16 3c-1.6 0-2.5 2-2.5 4.5S15 12 16 12s2.5-2 2.5-4.5S17.6 3 16 3zM16 12v9" />
      </svg>
    );
  }
  if (category === "snack") {
    // cloche / dome
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden {...common}>
        <path d="M3.5 17a8.5 8.5 0 0 1 17 0" />
        <path d="M2.5 17h19M12 8.5V6" />
        <circle cx="12" cy="5" r="1" />
      </svg>
    );
  }
  // drink — mug
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden {...common}>
      <path d="M6 8h11v8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z" />
      <path d="M17 10h2.5a2 2 0 0 1 0 5H17" />
      <path d="M9 3c-.6.8-.6 1.7 0 2.5M13 3c-.6.8-.6 1.7 0 2.5" />
    </svg>
  );
}

// One door magnet: glyph + category + name + Time/Cost chips.
function Magnet({ recipe, onOpen }: { recipe: GalleyRecipe; onOpen: (r: GalleyRecipe) => void }) {
  const meta = galleyMeta[recipe.category];
  return (
    <button
      type="button"
      className="ctrla-fridge-magnet"
      style={{ ["--accent" as string]: meta.accent }}
      onClick={() => onOpen(recipe)}
      aria-label={`${meta.label}: ${recipe.name} — open recipe`}
    >
      <span className="ctrla-fridge-magnet-glyph">
        <Glyph category={recipe.category} />
      </span>
      <span className="ctrla-fridge-magnet-text">
        <span className="ctrla-fridge-magnet-cat">{meta.label}</span>
        <span className="ctrla-fridge-magnet-name">{recipe.name}</span>
      </span>
      <span className="ctrla-fridge-magnet-chips">
        <span>{recipe.timeMins}m</span>
        <span>${recipe.costUsd}</span>
      </span>
    </button>
  );
}

// Interior shelf row: same data, lighter weight.
function ShelfItem({ recipe, onOpen, delay }: { recipe: GalleyRecipe; onOpen: (r: GalleyRecipe) => void; delay: number }) {
  const meta = galleyMeta[recipe.category];
  return (
    <li style={{ animationDelay: `${delay}s` }}>
      <button
        type="button"
        className="ctrla-fridge-shelf-item"
        style={{ ["--accent" as string]: meta.accent }}
        onClick={() => onOpen(recipe)}
        aria-label={`${meta.label}: ${recipe.name} — open recipe`}
      >
        <span className="ctrla-fridge-shelf-glyph">
          <Glyph category={recipe.category} />
        </span>
        <span className="ctrla-fridge-shelf-name">{recipe.name}</span>
        <span className="ctrla-fridge-shelf-cat">{meta.label}</span>
      </button>
    </li>
  );
}

function Gauge({ label, value }: { label: string; value: string }) {
  return (
    <div className="ctrla-fridge-gauge">
      <span className="ctrla-fridge-gauge-val">{value}</span>
      <span className="ctrla-fridge-gauge-label">{label}</span>
    </div>
  );
}

// Recipe detail drawer: a fixed dialog over the page.
function Drawer({ recipe, onClose }: { recipe: GalleyRecipe; onClose: () => void }) {
  const meta = galleyMeta[recipe.category];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ctrla-fridge-backdrop" onClick={onClose}>
      <div
        className="ctrla-fridge-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={recipe.name}
        style={{ ["--accent" as string]: meta.accent }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="ctrla-fridge-drawer-close" onClick={onClose} aria-label="Close recipe">
          ✕
        </button>
        <span className="ctrla-fridge-drawer-cat">{meta.label}</span>
        <h4 className="ctrla-fridge-drawer-name">{recipe.name}</h4>
        <p className="ctrla-fridge-drawer-cuisine">{recipe.cuisine}</p>
        <p className="ctrla-fridge-drawer-blurb">{recipe.blurb}</p>

        <div className="ctrla-fridge-gauges">
          <Gauge label="Time" value={`${recipe.timeMins} min`} />
          <Gauge label="Cost" value={`$${recipe.costUsd}`} />
          <Gauge label="Serves" value={`${recipe.serves}`} />
        </div>

        <div className="ctrla-fridge-drawer-ing">
          <span className="ctrla-fridge-drawer-ing-label">Fuel</span>
          <ul>
            {recipe.ingredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function GalleyFridge() {
  const cabinetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<FridgeState>("closed");
  const [active, setActive] = useState<GalleyRecipe | null>(null);

  const recipes = useMemo(
    () => ORDER.map((c) => galley.find((r) => r.category === c)).filter(Boolean) as GalleyRecipe[],
    [],
  );

  // A small, stable starfield seated behind the appliance.
  const stars = useMemo(
    () => Array.from({ length: 26 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 1.6 + 0.6, o: Math.random() * 0.5 + 0.2 })),
    [],
  );

  function rampLight(to: number, durMs: number) {
    const el = cabinetRef.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--lit", String(to));
      return;
    }
    const from = parseFloat(getComputedStyle(el).getPropertyValue("--lit")) || 0;
    const start = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / durMs);
      el.style.setProperty("--lit", (from + (to - from) * k).toFixed(3));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function openFridge() {
    if (state === "open" || state === "opening") return;
    setState("opening");
    rampLight(0.35, 450);
    timer.current = setTimeout(() => {
      setState("open");
      rampLight(1, 900);
    }, 380);
  }

  function closeFridge() {
    if (timer.current) clearTimeout(timer.current);
    setState("closed");
    rampLight(0, 500);
  }

  function openRecipe(r: GalleyRecipe) {
    if (state !== "open") openFridge();
    setActive(r);
  }

  function closeDrawer() {
    setActive(null);
    handleRef.current?.focus();
  }

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const isOpen = state === "open";

  return (
    <div className="ctrla-fridge-wrap">
      {/* Starfield, behind the appliance */}
      <div aria-hidden className="ctrla-fridge-stars">
        {stars.map((s, i) => (
          <span key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }} />
        ))}
      </div>

      <div className={`ctrla-fridge-scene ${state}`}>
        {isOpen && (
          <button type="button" className="ctrla-fridge-close" onClick={closeFridge} aria-label="Close the fridge">
            Close the door <span aria-hidden>✕</span>
          </button>
        )}
        <div className="ctrla-fridge-body">
          {/* Hinges + badge + plinth, decorative */}
          <span aria-hidden className="ctrla-fridge-hinge top" />
          <span aria-hidden className="ctrla-fridge-hinge bottom" />
          <span aria-hidden className="ctrla-fridge-badge">CTRL-A · GALLEY</span>
          <span aria-hidden className="ctrla-fridge-plinth" />

          {/* Interior — light + cast shadow driven by --lit */}
          <div ref={cabinetRef} className="ctrla-fridge-cabinet" style={{ ["--lit" as string]: 0 }}>
            <span aria-hidden className="ctrla-fridge-glow" />
            <span aria-hidden className="ctrla-fridge-cast" />
            <div className="ctrla-fridge-bay">
              <ul className="ctrla-fridge-shelf">
                {recipes.map((r, i) => (
                  <ShelfItem key={r.id} recipe={r} onOpen={openRecipe} delay={0.18 + i * 0.09} />
                ))}
              </ul>
              <span aria-hidden className="ctrla-fridge-shelf-bar" />
            </div>
          </div>

          {/* Door — swings on rotateY, holds magnets + handle */}
          <div className="ctrla-fridge-door">
            <span aria-hidden className="ctrla-fridge-gasket" />
            <div className="ctrla-fridge-magnets">
              {recipes.map((r) => (
                <Magnet key={r.id} recipe={r} onOpen={openRecipe} />
              ))}
            </div>
            <button
              ref={handleRef}
              type="button"
              className="ctrla-fridge-handle"
              onClick={() => (isOpen ? closeFridge() : openFridge())}
              aria-label={isOpen ? "Close the fridge" : "Open the fridge"}
            >
              <span aria-hidden />
            </button>
          </div>
        </div>

        <p className="ctrla-fridge-hint">
          {isOpen ? "the galley is stocked. pick one." : "pull the handle. three things, always stocked."}
        </p>
      </div>

      {active && <Drawer recipe={active} onClose={closeDrawer} />}
    </div>
  );
}
