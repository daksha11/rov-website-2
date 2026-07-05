"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE GALLEY FRIDGE
// A brushed-steel fridge drifting in the void. It holds exactly
// three things: one Meal, one Snack, one Drink. Closed, they are
// magnets on the door. Pull the handle (a real drag on mouse, a
// tap on touch) and the door swings open on a staged animation,
// the interior lights, and the shelf settles in — then the whole
// scene steps forward into the full galley: every recipe, one at
// a time, Tinder-style (RecipeSwipeDeck).
//
// The fiction: on a ship the kitchen is the galley, so this is the
// galley fridge keeping a creative crew fueled.
//
// Lightweight on purpose: one component, hand-rolled, no libraries.
// Styling lives in globals.css under .ctrla-fridge-*. The interior
// light + cast shadow track the door swing via one CSS var (--lit),
// ramped in JS so the light follows the door, not its own clock.
// Two synthesized sounds (a door thunk on open, a low hum while open)
// are generated at runtime with Web Audio and are gesture-gated.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { galley, galleyMeta, cookbook, type GalleyRecipe, type GalleyCategory } from "../data";
import RecipeSwipeDeck from "./RecipeSwipeDeck";

type FridgeState = "closed" | "opening" | "open";

// Fixed order on both door and shelf: meal → snack → drink.
const ORDER: GalleyCategory[] = ["meal", "snack", "drink"];

// Once the door is fully open and the shelf has settled, step forward into
// the full swipe deck automatically — the shelf is a beat, not a destination.
const ENTER_DECK_DELAY_MS = 1300;

// Drag tuning: pull the handle left to open. The door follows the pointer
// through the first ~20° of resistance, then commits past the threshold.
const DRAG_MAX_DEG = -20; // furthest the door tracks the pointer before commit
const DRAG_COMMIT_DEG = -13; // release past this and the swing completes
const DRAG_PX_PER_DEG = 3.4; // pointer travel that maps to one degree of swing
const CLICK_SLOP_PX = 4; // movement under this counts as a click, not a drag

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// ── Sound (synthesized, restrained, gesture-gated) ─────
// Built lazily on the first open (a user gesture, autoplay-legal). Never
// touches AudioContext on page load. Two voices only: a short filtered
// "thunk" as the seal releases, and a barely-there ~50Hz hum while open.
function useFridgeSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const humRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  const ensureCtx = useCallback((): AudioContext | null => {
    if (ctxRef.current) return ctxRef.current;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctxRef.current = new Ctor();
    return ctxRef.current;
  }, []);

  const playThunk = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx) return;
    ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    // Filtered noise burst — the rubber seal letting go.
    const len = Math.floor(ctx.sampleRate * 0.2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 180;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    src.connect(lp).connect(noiseGain).connect(ctx.destination);
    src.start(now);
    src.stop(now + 0.2);

    // Low sine thump — the weight of the door.
    const thump = ctx.createOscillator();
    thump.type = "sine";
    thump.frequency.setValueAtTime(82, now);
    thump.frequency.exponentialRampToValueAtTime(42, now + 0.16);
    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(0.0001, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.34, now + 0.01);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    thump.connect(thumpGain).connect(ctx.destination);
    thump.start(now);
    thump.stop(now + 0.24);
  }, [ensureCtx]);

  const startHum = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx || humRef.current) return;
    ctx.resume().catch(() => {});
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 50;
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    gain.gain.setTargetAtTime(0.02, ctx.currentTime, 0.6); // barely audible
    humRef.current = { osc, gain };
  }, [ensureCtx]);

  const stopHum = useCallback(() => {
    const ctx = ctxRef.current;
    const hum = humRef.current;
    if (!ctx || !hum) return;
    hum.gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3);
    hum.osc.stop(ctx.currentTime + 1);
    humRef.current = null;
  }, []);

  useEffect(
    () => () => {
      humRef.current = null;
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    },
    [],
  );

  return { playThunk, startHum, stopHum };
}

// Category glyphs, drawn with currentColor so the accent tints them.
export function Glyph({ category }: { category: GalleyCategory }) {
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

// One door magnet: glyph + category + name + credit + Time/Cost chips.
// Clicking any magnet just opens the fridge (same as the handle) — the
// magnets are a menu preview, not a per-recipe shortcut.
function Magnet({ recipe, onOpen }: { recipe: GalleyRecipe; onOpen: () => void }) {
  const meta = galleyMeta[recipe.category];
  return (
    <button
      type="button"
      className="ctrla-fridge-magnet"
      style={{ ["--accent" as string]: meta.accent }}
      onClick={onOpen}
      aria-label={`${meta.label}: ${recipe.name} — open the galley`}
    >
      <span className="ctrla-fridge-magnet-glyph">
        <Glyph category={recipe.category} />
      </span>
      <span className="ctrla-fridge-magnet-text">
        <span className="ctrla-fridge-magnet-cat">{meta.label}</span>
        <span className="ctrla-fridge-magnet-name">{recipe.name}</span>
        {recipe.by && <span className="ctrla-fridge-credit">brought by {recipe.by}</span>}
      </span>
      <span className="ctrla-fridge-magnet-chips">
        <span>{recipe.timeMins}m</span>
        <span>${recipe.costUsd}</span>
      </span>
    </button>
  );
}

// The chef of the volume, pinned to the door as a photo/monogram magnet.
// Decorative (not a recipe), so it is a labelled tile, not a button.
function ChefMagnet({ chef }: { chef: NonNullable<typeof cookbook.chef> }) {
  const initials = chef.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="ctrla-fridge-chef-magnet">
      <span className="ctrla-fridge-chef-photo" aria-hidden>
        {chef.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={chef.photo} alt="" />
        ) : (
          initials
        )}
      </span>
      <span className="ctrla-fridge-chef-text">
        <span className="ctrla-fridge-chef-role">Chef of the volume</span>
        <span className="ctrla-fridge-chef-name">
          {chef.name}, {chef.city}
        </span>
      </span>
    </div>
  );
}

// Interior shelf row — decorative only. It settles in as the door swings
// open, then the scene steps forward into the full swipe deck, so there is
// nothing to click here anymore.
function ShelfItem({ recipe, delay }: { recipe: GalleyRecipe; delay: number }) {
  const meta = galleyMeta[recipe.category];
  return (
    <li style={{ animationDelay: `${delay}s` }}>
      <div className="ctrla-fridge-shelf-item" style={{ ["--accent" as string]: meta.accent }}>
        <span className="ctrla-fridge-shelf-glyph">
          <Glyph category={recipe.category} />
        </span>
        <span className="ctrla-fridge-shelf-name">{recipe.name}</span>
        <span className="ctrla-fridge-shelf-cat">{meta.label}</span>
      </div>
    </li>
  );
}

export function Gauge({ label, value }: { label: string; value: string }) {
  return (
    <div className="ctrla-fridge-gauge">
      <span className="ctrla-fridge-gauge-val">{value}</span>
      <span className="ctrla-fridge-gauge-label">{label}</span>
    </div>
  );
}

export default function GalleyFridge() {
  const cabinetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterDeckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<FridgeState>("closed");
  const [deckOpen, setDeckOpen] = useState(false);
  // While dragging the handle: the live door angle in degrees (null = idle).
  const [dragDeg, setDragDeg] = useState<number | null>(null);
  const dragStartX = useRef(0);
  const suppressClick = useRef(false);

  const { playThunk, startHum, stopHum } = useFridgeSound();

  const recipes = useMemo(
    () => ORDER.map((c) => galley.find((r) => r.category === c)).filter(Boolean) as GalleyRecipe[],
    [],
  );
  const chef = cookbook.chef;
  const submitUrl = cookbook.submitUrl ?? "/contact";

  // The full galley, shuffled once, is what the swipe deck steps through —
  // not just the 3 curated door picks.
  const deckRecipes = useMemo(() => {
    const shuffled = [...galley];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // A small, stable starfield seated behind the appliance.
  const stars = useMemo(
    () => Array.from({ length: 26 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 1.6 + 0.6, o: Math.random() * 0.5 + 0.2 })),
    [],
  );

  const rampLight = useCallback((to: number, durMs: number) => {
    const el = cabinetRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
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
  }, []);

  const openFridge = useCallback(() => {
    if (state === "open" || state === "opening") return;
    setState("opening");
    playThunk();
    rampLight(0.35, 450);
    timer.current = setTimeout(() => {
      setState("open");
      rampLight(1, 900);
      startHum();
      // Let the shelf settle in, then step forward into the full deck.
      enterDeckTimer.current = setTimeout(() => {
        setDeckOpen(true);
      }, ENTER_DECK_DELAY_MS);
    }, 380);
  }, [state, playThunk, rampLight, startHum]);

  const closeFridge = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (enterDeckTimer.current) clearTimeout(enterDeckTimer.current);
    setState("closed");
    setDeckOpen(false);
    rampLight(0, 500);
    stopHum();
  }, [rampLight, stopHum]);

  // ── Handle drag: pointer follows the swing, commits past a threshold ──
  const onHandlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // When open, or on touch / reduced-motion, fall back to a plain tap (click).
    if (state !== "closed") return;
    if (e.pointerType === "touch" || prefersReducedMotion()) return;
    e.preventDefault();
    handleRef.current?.setPointerCapture(e.pointerId);
    dragStartX.current = e.clientX;
    setDragDeg(0);
  };

  const onHandlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragDeg === null) return;
    const dx = e.clientX - dragStartX.current; // negative when pulling the door open
    const deg = Math.max(DRAG_MAX_DEG, Math.min(0, dx / DRAG_PX_PER_DEG));
    setDragDeg(deg);
    // Interior warms as the seal cracks, so the pull feels physical.
    cabinetRef.current?.style.setProperty("--lit", ((deg / DRAG_MAX_DEG) * 0.22).toFixed(3));
  };

  const onHandlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragDeg === null) return;
    handleRef.current?.releasePointerCapture(e.pointerId);
    const dx = e.clientX - dragStartX.current;
    const moved = Math.abs(dx) > CLICK_SLOP_PX;
    const committed = dragDeg <= DRAG_COMMIT_DEG;
    setDragDeg(null);
    suppressClick.current = true; // pointerup already resolved the gesture
    if (committed || !moved) {
      openFridge(); // a real pull, or a click-like tap on the handle
    } else {
      rampLight(0, 260); // released short of the threshold — settle back shut
    }
  };

  const onHandleClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (state === "open") closeFridge();
    else openFridge();
  };

  const exitDeck = useCallback(() => {
    closeFridge();
    handleRef.current?.focus();
  }, [closeFridge]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (enterDeckTimer.current) clearTimeout(enterDeckTimer.current);
    },
    [],
  );

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
                  <ShelfItem key={r.id} recipe={r} delay={0.18 + i * 0.09} />
                ))}
              </ul>
              <span aria-hidden className="ctrla-fridge-shelf-bar" />
            </div>
          </div>

          {/* Door — swings on rotateY, holds magnets + handle. While dragging,
              an inline angle overrides the CSS state transform. */}
          <div
            className={`ctrla-fridge-door${dragDeg !== null ? " dragging" : ""}`}
            style={dragDeg !== null ? { transform: `rotateY(${dragDeg}deg)` } : undefined}
          >
            <span aria-hidden className="ctrla-fridge-gasket" />
            <div className="ctrla-fridge-magnets">
              {recipes.map((r) => (
                <Magnet key={r.id} recipe={r} onOpen={openFridge} />
              ))}
              {chef && <ChefMagnet chef={chef} />}
            </div>
            <button
              ref={handleRef}
              type="button"
              className="ctrla-fridge-handle"
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              onClick={onHandleClick}
              aria-label={isOpen ? "Close the fridge" : "Open the fridge"}
            >
              <span aria-hidden />
            </button>
          </div>
        </div>

        <p className="ctrla-fridge-hint">
          {isOpen ? "stepping into the galley…" : "pull the handle. the whole galley is inside."}
        </p>

        {/* Community hook — a simple link, not a built form (deferred capture). */}
        <a className="ctrla-fridge-submit" href={submitUrl}>
          Leave something in the fridge <span aria-hidden>→</span>
        </a>
      </div>

      {deckOpen && <RecipeSwipeDeck recipes={deckRecipes} onClose={exitDeck} submitUrl={submitUrl} />}
    </div>
  );
}
