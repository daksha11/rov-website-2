"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — orchestrator
// Owns the phase machine and decides what is on screen. The
// editorial shell (backdrop, nav, intro, ritual) is the light
// path. The room is dynamically imported (ssr:false) so the
// heavy subsystems that will live inside it never touch the
// landing chunk.
// ═══════════════════════════════════════════════════════

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { NavigationDock } from "@/components/NavDoc";
import CosmicBackdrop from "../_components/CosmicBackdrop";
import { ed, Bleed, Rule, Label } from "../_components/editorial";
import { useFoldSession } from "./_state/useFoldSession";
import FoldLanding from "./_components/landing/FoldLanding";
import IntentionRitual from "./_components/ritual/IntentionRitual";
import EnterTransition from "./_components/ritual/EnterTransition";

// Heavy, deferred. Loaded only when the visitor commits to entering.
const TheFoldRoom = dynamic(() => import("./_components/room/TheFoldRoom"), {
  ssr: false,
});

export default function TheFoldContent() {
  const {
    state,
    beginRitual,
    cancelRitual,
    commitIntention,
    enter,
    setSoundscape,
    endSession,
    exit,
  } = useFoldSession();
  const { phase } = state;
  const inRoom =
    phase === "entering" ||
    phase === "active" ||
    phase === "ending" ||
    phase === "done";

  // Match the magazine ground while on this route.
  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = ed.ground;
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  // The room is immersive: lock page scroll while inside it.
  useEffect(() => {
    if (!inRoom) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [inRoom]);

  return (
    <>
      {!inRoom && (
        <div
          className="fold-root"
          style={{
            background: "transparent",
            minHeight: "100vh",
            width: "100%",
            overflowX: "hidden",
            position: "relative",
          }}
        >
          <CosmicBackdrop />
          <NavigationDock />

          {/* Back-nav masthead */}
          <div style={{ position: "relative", zIndex: 5 }}>
            <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <a
                  href="/ctrla"
                  className="ctrla-back"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                  }}
                >
                  <span style={{ color: ed.amber }}>←</span>
                  <Label color={ed.ink}>CTRL-A · Vol. 01</Label>
                </a>
                <Label color={ed.inkFaint}>The Fold</Label>
              </div>
            </Bleed>
            <Rule />
          </div>

          {phase === "landing" && <FoldLanding onEnter={beginRitual} />}
          {phase === "ritual" && (
            <IntentionRitual onComplete={commitIntention} onBack={cancelRitual} />
          )}
        </div>
      )}

      {inRoom && state.intention && (
        <TheFoldRoom
          phase={phase}
          intention={state.intention}
          soundscape={state.soundscape}
          sessionCount={state.sessionCount}
          startedAt={state.startedAt}
          onSetSoundscape={setSoundscape}
          onEnd={endSession}
          onAgain={beginRitual}
          onExit={exit}
        />
      )}

      {/* The immersive handoff. Sits above the freshly mounted room and
          reveals it, then flips the phase to active. */}
      {phase === "entering" && <EnterTransition onDone={enter} />}
    </>
  );
}
