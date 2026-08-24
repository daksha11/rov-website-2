// lib/ctrla/profile.ts
// ─────────────────────────────────────────────────────────────
// The CTRL-A reader profile: what the intake quiz at /ctrla/start
// learns about a visitor, and the single place everything else reads
// it back from.
//
// Four facts, nothing more:
//   crafts    — what they make, primary first. Maps to toolkit ids.
//   level     — beginner or expert. Picks the default toolkit mode.
//   intent    — what they came to do. Picks the doors on the reveal.
//   hasBrand  — whether they have a look yet. Triggers the brand-kit-first
//               journey for beginners on the landing page.
//
// Storage is localStorage only, on purpose. The whole system needs one
// small fact remembered on the device that answered; it does not need a
// row in the database. `readProfile` / `writeProfile` are the seam if
// that ever changes — swap their bodies, leave every caller alone.
//
// Everything here is safe to call during SSR: reads return null, writes
// no-op. The hook hydrates in an effect so a signed-out first paint can
// never flash the wrong variant.
// ─────────────────────────────────────────────────────────────

"use client";

import { useCallback, useEffect, useState } from "react";
import type { ToolkitSlug } from "./community";

export const PROFILE_STORAGE_KEY = "ctrla.profile.v1";

/** Fired on write so any mounted consumer re-reads without a reload. */
export const PROFILE_EVENT = "ctrla:profile";

export type CraftSlug = ToolkitSlug;
export type Level = "beginner" | "expert";
export type Intent = "craft" | "brand" | "release" | "atlanta";

export interface CtrlAProfile {
  v: 1;
  /** What they make, most important first. Never empty on a completed quiz. */
  crafts: CraftSlug[];
  level: Level;
  intent: Intent;
  hasBrand: boolean;
  /** ISO timestamp of the answer. */
  completedAt: string;
}

/**
 * What we persist. A visitor who skipped the invite has no profile but
 * must still be remembered as skipped, so the invite stops asking.
 */
interface StoredState {
  profile?: CtrlAProfile;
  /** They closed the invite without answering. */
  dismissedAt?: string;
}

const isCraft = (v: unknown): v is CraftSlug =>
  v === "music" || v === "design" || v === "web-dev" || v === "video";

/**
 * Parse defensively. Anything hand-edited, half-written, or left over from
 * a future version is treated as absent rather than trusted, so a bad blob
 * degrades to "we never asked" instead of throwing on render.
 */
function parse(raw: string | null): StoredState {
  if (!raw) return {};
  try {
    const data = JSON.parse(raw) as StoredState;
    if (!data || typeof data !== "object") return {};

    const out: StoredState = {};
    if (typeof data.dismissedAt === "string") out.dismissedAt = data.dismissedAt;

    const p = data.profile;
    if (
      p &&
      p.v === 1 &&
      Array.isArray(p.crafts) &&
      p.crafts.length > 0 &&
      p.crafts.every(isCraft) &&
      (p.level === "beginner" || p.level === "expert") &&
      (p.intent === "craft" || p.intent === "brand" || p.intent === "release" || p.intent === "atlanta") &&
      typeof p.hasBrand === "boolean"
    ) {
      out.profile = {
        v: 1,
        crafts: p.crafts,
        level: p.level,
        intent: p.intent,
        hasBrand: p.hasBrand,
        completedAt: typeof p.completedAt === "string" ? p.completedAt : new Date().toISOString(),
      };
    }
    return out;
  } catch {
    return {};
  }
}

/** Read the stored state. Returns an empty state on the server. */
export function readState(): StoredState {
  if (typeof window === "undefined") return {};
  try {
    return parse(window.localStorage.getItem(PROFILE_STORAGE_KEY));
  } catch {
    return {};
  }
}

export function readProfile(): CtrlAProfile | null {
  return readState().profile ?? null;
}

function writeState(next: StoredState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode or a full quota — the session still works, it just forgets */
  }
  window.dispatchEvent(new CustomEvent(PROFILE_EVENT));
}

/** Save a completed quiz. Answering also clears any earlier dismissal. */
export function writeProfile(profile: Omit<CtrlAProfile, "v" | "completedAt">) {
  writeState({
    profile: { ...profile, v: 1, completedAt: new Date().toISOString() },
  });
}

/** They closed the invite without answering. Never ask again unprompted. */
export function dismissInvite() {
  const current = readState();
  if (current.profile || current.dismissedAt) return;
  writeState({ ...current, dismissedAt: new Date().toISOString() });
}

/** Clear everything, for the "start over" link on the reveal. */
export function clearProfile() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
  window.dispatchEvent(new CustomEvent(PROFILE_EVENT));
}

/**
 * Subscribe to profile changes, in this tab (custom event) and in others
 * (storage event). Returns an unsubscribe.
 */
function subscribe(fn: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === PROFILE_STORAGE_KEY) fn();
  };
  window.addEventListener(PROFILE_EVENT, fn);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(PROFILE_EVENT, fn);
    window.removeEventListener("storage", onStorage);
  };
}

export interface UseCtrlAProfile {
  profile: CtrlAProfile | null;
  /** Whether they closed the invite without answering. */
  dismissed: boolean;
  /**
   * False until the first client read lands. Gate any profile-dependent
   * rendering on this, or the server HTML and the first client paint
   * disagree and React tears the tree down.
   */
  ready: boolean;
  save: (profile: Omit<CtrlAProfile, "v" | "completedAt">) => void;
  dismiss: () => void;
  clear: () => void;
}

export function useCtrlAProfile(): UseCtrlAProfile {
  const [state, setState] = useState<StoredState>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setState(readState());
    sync();
    setReady(true);
    return subscribe(sync);
  }, []);

  return {
    profile: state.profile ?? null,
    dismissed: Boolean(state.dismissedAt),
    ready,
    save: useCallback((p: Omit<CtrlAProfile, "v" | "completedAt">) => writeProfile(p), []),
    dismiss: useCallback(() => dismissInvite(), []),
    clear: useCallback(() => clearProfile(), []),
  };
}

// ── Labels ───────────────────────────────────────────────────
// Kept here so the quiz, the reveal, and every later surface say the
// same words about the same answer.

export const CRAFT_LABEL: Record<CraftSlug, string> = {
  music: "Music",
  design: "Design",
  "web-dev": "Websites",
  video: "Video",
};

/** Plain-English sentence read back on the reveal. */
export function profileSentence(p: CtrlAProfile): string {
  const makes =
    p.crafts[0] === "web-dev" ? "you build websites" :
    p.crafts[0] === "video" ? "you shoot video" :
    p.crafts[0] === "design" ? "you're a designer" :
    "you make music";
  const stage = p.level === "beginner" ? "you're early" : "you've been at it a while";
  const want =
    p.intent === "craft" ? "you want to get better" :
    p.intent === "brand" ? "you want a look that fits" :
    p.intent === "release" ? "you want to finish something" :
    "you want to meet people in Atlanta";
  return `${makes[0].toUpperCase()}${makes.slice(1)}, ${stage}, and ${want}.`;
}
