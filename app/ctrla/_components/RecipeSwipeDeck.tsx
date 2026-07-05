"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE GALLEY SWIPE DECK
// What the fridge opens into: every recipe, one card at a time,
// Tinder-style. Drag right to like, left to pass, or tap the pencil
// to suggest a mod instead of judging it outright. Full-screen,
// mounted by GalleyFridge once the door has finished its swing.
//
// Hand-rolled drag (pointer events + inline transform), no gesture
// library. Reduced-motion skips the fling and just swaps the card.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import { galleyMeta, type GalleyRecipe } from "../data";
import { Glyph, Gauge, prefersReducedMotion } from "./GalleyFridge";
import { submitGalleyFeedback, type GalleySwipeAction } from "../_lib/galleyFeedback";

const SWIPE_THRESHOLD_PX = 110;
const EXIT_ANIM_MS = 300;

type ExitDir = "like" | "dislike" | "mod" | null;

function Card({ recipe }: { recipe: GalleyRecipe }) {
  const meta = galleyMeta[recipe.category];
  return (
    <div className="ctrla-swipe-card-inner" style={{ ["--accent" as string]: meta.accent }}>
      <span className="ctrla-swipe-card-glyph">
        <Glyph category={recipe.category} />
      </span>
      <span className="ctrla-swipe-card-cat">{meta.label}</span>
      <h3 className="ctrla-swipe-card-name">{recipe.name}</h3>
      <p className="ctrla-swipe-card-cuisine">{recipe.cuisine}</p>
      {recipe.by && <p className="ctrla-fridge-credit">brought by {recipe.by}</p>}
      <p className="ctrla-swipe-card-blurb">{recipe.blurb}</p>

      <div className="ctrla-fridge-gauges">
        <Gauge label="Time" value={`${recipe.timeMins} min`} />
        <Gauge label="Cost" value={`$${recipe.costUsd}`} />
        <Gauge label="Serves" value={`${recipe.serves}`} />
      </div>

      <div className="ctrla-swipe-card-ing">
        <span className="ctrla-fridge-drawer-ing-label">Fuel</span>
        <ul>
          {recipe.ingredients.map((ing) => (
            <li key={ing}>{ing}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function RecipeSwipeDeck({
  recipes,
  onClose,
  submitUrl,
}: {
  recipes: GalleyRecipe[];
  onClose: () => void;
  submitUrl: string;
}) {
  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("enter");
  const [index, setIndex] = useState(0);
  const [exitDir, setExitDir] = useState<ExitDir>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [modOpen, setModOpen] = useState(false);
  const [modText, setModText] = useState("");
  const [tally, setTally] = useState({ liked: 0, passed: 0, modded: 0 });
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = recipes[index];
  const next = recipes[index + 1];
  const done = index >= recipes.length;

  // Mount transition: fade/scale in on the next frame.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase("idle"));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  const requestClose = useCallback(() => {
    setPhase("exit");
    setTimeout(onClose, prefersReducedMotion() ? 0 : 320);
  }, [onClose]);

  const commit = useCallback(
    (action: GalleySwipeAction) => {
      if (!current || exitDir) return;
      submitGalleyFeedback({
        recipeId: current.id,
        action,
        note: action === "mod" ? modText.trim() || undefined : undefined,
      });
      setTally((t) => ({
        liked: t.liked + (action === "like" ? 1 : 0),
        passed: t.passed + (action === "dislike" ? 1 : 0),
        modded: t.modded + (action === "mod" ? 1 : 0),
      }));
      setModOpen(false);
      setModText("");
      setExitDir(action);
      const delay = prefersReducedMotion() ? 0 : EXIT_ANIM_MS;
      advanceTimer.current = setTimeout(() => {
        setIndex((i) => i + 1);
        setExitDir(null);
        setDrag(null);
      }, delay);
    },
    [current, exitDir, modText],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      else if (e.key === "ArrowRight" && !modOpen) commit("like");
      else if (e.key === "ArrowLeft" && !modOpen) commit("dislike");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose, commit, modOpen]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (exitDir || modOpen) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    setDrag({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const onPointerUp = () => {
    if (!dragStart.current) return;
    dragStart.current = null;
    setDragging(false);
    const dx = drag?.x ?? 0;
    if (dx > SWIPE_THRESHOLD_PX) commit("like");
    else if (dx < -SWIPE_THRESHOLD_PX) commit("dislike");
    else setDrag(null);
  };

  let cardStyle: React.CSSProperties;
  if (exitDir === "like") {
    cardStyle = { transform: "translateX(160%) rotate(24deg)", transition: "transform 0.3s ease-in", opacity: 0.5 };
  } else if (exitDir === "dislike") {
    cardStyle = { transform: "translateX(-160%) rotate(-24deg)", transition: "transform 0.3s ease-in", opacity: 0.5 };
  } else if (exitDir === "mod") {
    cardStyle = { transform: "translateY(-140%)", transition: "transform 0.3s ease-in", opacity: 0.5 };
  } else if (drag) {
    cardStyle = { transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 18}deg)`, transition: "none" };
  } else {
    cardStyle = { transform: "translate(0, 0) rotate(0deg)", transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)" };
  }

  const likeOpacity = drag && drag.x > 0 ? Math.min(1, drag.x / SWIPE_THRESHOLD_PX) : 0;
  const passOpacity = drag && drag.x < 0 ? Math.min(1, -drag.x / SWIPE_THRESHOLD_PX) : 0;

  return (
    <div className={`ctrla-swipe-overlay ${phase}`} role="dialog" aria-modal="true" aria-label="The galley">
      <div className="ctrla-swipe-top">
        <span className="ctrla-swipe-progress">
          {done ? recipes.length : index + 1} / {recipes.length}
        </span>
        <button type="button" className="ctrla-swipe-close" onClick={requestClose} aria-label="Close the galley">
          ✕
        </button>
      </div>

      {!done ? (
        <>
          <div className="ctrla-swipe-stack">
            {next && (
              <div className="ctrla-swipe-card ctrla-swipe-card-next" aria-hidden>
                <Card recipe={next} />
              </div>
            )}
            {current && (
              <div
                className={`ctrla-swipe-card${dragging ? " dragging" : ""}`}
                style={cardStyle}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <span className="ctrla-swipe-stamp like" style={{ opacity: likeOpacity }}>
                  LIKE
                </span>
                <span className="ctrla-swipe-stamp pass" style={{ opacity: passOpacity }}>
                  PASS
                </span>
                <Card recipe={current} />
                {modOpen && (
                  <div className="ctrla-swipe-mod-panel" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      autoFocus
                      placeholder="What would make this recipe better?"
                      value={modText}
                      onChange={(e) => setModText(e.target.value)}
                    />
                    <div className="ctrla-swipe-mod-actions">
                      <button type="button" className="ctrla-swipe-mod-send" onClick={() => commit("mod")}>
                        Send suggestion
                      </button>
                      <button type="button" className="ctrla-swipe-mod-cancel" onClick={() => setModOpen(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!modOpen && (
            <div className="ctrla-swipe-actions">
              <button type="button" aria-label="Pass" onClick={() => commit("dislike")}>
                ✕
              </button>
              <button type="button" aria-label="Suggest a mod" onClick={() => setModOpen(true)}>
                ✎
              </button>
              <button type="button" aria-label="Like" onClick={() => commit("like")}>
                ♥
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="ctrla-swipe-end">
          <h3>That&rsquo;s the whole galley.</h3>
          <p>
            {tally.liked} liked · {tally.modded} mod{tally.modded === 1 ? "" : "s"} suggested · {tally.passed} passed
          </p>
          <a href={submitUrl}>Leave something in the fridge →</a>
          <button type="button" onClick={requestClose}>
            Close the door
          </button>
        </div>
      )}
    </div>
  );
}
