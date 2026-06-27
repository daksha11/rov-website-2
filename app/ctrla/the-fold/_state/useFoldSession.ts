"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — cafe state
// You arrive, then you are inside, standing in a place. Moving
// between places is the whole interaction. Visits accrue so the
// back patio (Golden Hour) can be earned. In-memory for V1.
// ═══════════════════════════════════════════════════════

import { useCallback, useReducer } from "react";
import type { Phase, Place } from "./types";
import { isRoom } from "./foldConfig";

export interface FoldState {
  phase: Phase;
  place: Place;
  visited: number; // distinct room entries, for unlocks
  note: string; // optional "what are you on", per visit
}

type Action =
  | { type: "ARRIVE" }
  | { type: "GO"; place: Place }
  | { type: "SET_NOTE"; note: string };

const initialState: FoldState = {
  phase: "arriving",
  place: "commons",
  visited: 0,
  note: "",
};

function reducer(state: FoldState, action: Action): FoldState {
  switch (action.type) {
    case "ARRIVE":
      return { ...state, phase: "inside" };
    case "GO":
      return {
        ...state,
        place: action.place,
        visited: isRoom(action.place) ? state.visited + 1 : state.visited,
      };
    case "SET_NOTE":
      return { ...state, note: action.note };
    default:
      return state;
  }
}

export function useFoldSession() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const arrive = useCallback(() => dispatch({ type: "ARRIVE" }), []);
  const go = useCallback((place: Place) => dispatch({ type: "GO", place }), []);
  const setNote = useCallback((note: string) => dispatch({ type: "SET_NOTE", note }), []);

  return { state, arrive, go, setNote };
}
