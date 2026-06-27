"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — session state machine
// The single source of truth. Audio, presence, and the timer
// are all EFFECTS that react to `phase`; nothing else starts
// those subsystems. This is what keeps teardown honest and the
// heavy systems behind a single, deliberate entry point.
// ═══════════════════════════════════════════════════════

import { useCallback, useReducer } from "react";
import type { Intention, Phase, Soundscape } from "./types";

export interface FoldState {
  phase: Phase;
  intention: Intention | null;
  soundscape: Soundscape;
  startedAt: number | null;
  // In-memory only for V1. "The space remembers you" within a visit.
  sessionCount: number;
}

type Action =
  | { type: "BEGIN_RITUAL" }
  | { type: "CANCEL_RITUAL" }
  | { type: "COMMIT_INTENTION"; intention: Intention }
  | { type: "ENTER"; at: number }
  | { type: "SET_SOUNDSCAPE"; soundscape: Soundscape }
  | { type: "END_SESSION" }
  | { type: "FINISH" }
  | { type: "EXIT" };

const initialState: FoldState = {
  phase: "landing",
  intention: null,
  soundscape: "wide-open",
  startedAt: null,
  sessionCount: 0,
};

function reducer(state: FoldState, action: Action): FoldState {
  switch (action.type) {
    case "BEGIN_RITUAL":
      return { ...state, phase: "ritual" };
    case "CANCEL_RITUAL":
      return { ...state, phase: "landing" };
    case "COMMIT_INTENTION":
      // Move into the immersive handoff. The room mounts here, under
      // the transition overlay, so the reveal lands on a real room.
      return { ...state, phase: "entering", intention: action.intention };
    case "ENTER":
      return {
        ...state,
        phase: "active",
        startedAt: action.at,
        sessionCount: state.sessionCount + 1,
      };
    case "SET_SOUNDSCAPE":
      return { ...state, soundscape: action.soundscape };
    case "END_SESSION":
      return { ...state, phase: "ending" };
    case "FINISH":
      return { ...state, phase: "done" };
    case "EXIT":
      // Back to the editorial intro. Heavy subsystems unmount with the room.
      return { ...state, phase: "landing", intention: null, startedAt: null };
    default:
      return state;
  }
}

export function useFoldSession() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const beginRitual = useCallback(() => dispatch({ type: "BEGIN_RITUAL" }), []);
  const cancelRitual = useCallback(() => dispatch({ type: "CANCEL_RITUAL" }), []);
  const commitIntention = useCallback(
    (intention: Intention) => dispatch({ type: "COMMIT_INTENTION", intention }),
    []
  );
  // `enter` is fired by the transition once it has fully covered the screen,
  // so the swap to the live room is never visible as a flash.
  const enter = useCallback(() => dispatch({ type: "ENTER", at: Date.now() }), []);
  const setSoundscape = useCallback(
    (soundscape: Soundscape) => dispatch({ type: "SET_SOUNDSCAPE", soundscape }),
    []
  );
  const endSession = useCallback(() => dispatch({ type: "END_SESSION" }), []);
  const finish = useCallback(() => dispatch({ type: "FINISH" }), []);
  const exit = useCallback(() => dispatch({ type: "EXIT" }), []);

  return {
    state,
    beginRitual,
    cancelRitual,
    commitIntention,
    enter,
    setSoundscape,
    endSession,
    finish,
    exit,
  };
}
