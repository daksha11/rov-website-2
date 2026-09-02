// lib/ctrla/progress.ts
// ─────────────────────────────────────────────────────────────
// Progress on the path, and the hook every surface reads it through.
//
// Storage mirrors profile.ts: localStorage first (instant, works signed
// out), synced to the account when there is one (see ./sync.ts). A stop
// is done when the site saw it happen (source "auto"), the person told us
// (source "self", the Finish link), or an editor confirmed it ("review",
// an approved submission).
//
// Keys are `${craft}:${stop}`; the shared stops (look, work) live under
// `all:` so a kit counts for every craft.
// ─────────────────────────────────────────────────────────────

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCtrlAProfile, type CraftSlug, type CtrlAProfile } from "./profile";
import { STOPS, pathFor, progressCraft, type PathStop, type StopId } from "./path";

export const PROGRESS_STORAGE_KEY = "ctrla.progress.v1";
export const PROGRESS_EVENT = "ctrla:progress";

export type ProgressSource = "auto" | "self" | "review";
export interface ProgressEntry {
  /** ISO timestamp. */
  at: string;
  source: ProgressSource;
  evidence?: Record<string, unknown>;
}
export type ProgressMap = Record<string, ProgressEntry>;

export const progressKey = (craft: CraftSlug | "all", stop: StopId) => `${craft}:${stop}`;

export function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as unknown) : {};
    if (!data || typeof data !== "object") return {};
    const out: ProgressMap = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      const e = v as ProgressEntry;
      if (e && typeof e.at === "string" && (e.source === "auto" || e.source === "self" || e.source === "review")) out[k] = e;
    }
    return out;
  } catch {
    return {};
  }
}

/** Write the whole map. `silent` skips the sync (used by sync itself). */
export function writeProgress(map: ProgressMap, silent = false) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* private mode or full quota: the session still works */
  }
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { silent } }));
}

/** Merge two maps: the earlier completion wins, so nothing is ever undone. */
export function mergeProgress(a: ProgressMap, b: ProgressMap): ProgressMap {
  const out: ProgressMap = { ...a };
  for (const [k, e] of Object.entries(b)) {
    if (!out[k] || e.at < out[k].at) out[k] = e;
  }
  return out;
}

/**
 * Mark a stop done. Idempotent: a stop already done keeps its first date.
 * Pushes to the account in the background when signed in (sync.ts listens).
 */
export function markDone(craft: CraftSlug, stop: StopId, evidence?: Record<string, unknown>, source: ProgressSource = "auto") {
  const key = progressKey(progressCraft(craft, stop), stop);
  const map = readProgress();
  if (map[key]) return false;
  map[key] = { at: new Date().toISOString(), source, ...(evidence ? { evidence } : {}) };
  writeProgress(map);
  return true;
}

export const isDone = (map: ProgressMap, craft: CraftSlug, stop: StopId) => !!map[progressKey(progressCraft(craft, stop), stop)];

/** Clear everything local. The account copy is cleared by DELETE /api/ctrla/path. */
export function clearProgress() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { silent: true } }));
}

function subscribe(fn: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === PROGRESS_STORAGE_KEY) fn();
  };
  window.addEventListener(PROGRESS_EVENT, fn);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, fn);
    window.removeEventListener("storage", onStorage);
  };
}

export interface PathStopState extends PathStop {
  done: boolean;
  entry: ProgressEntry | null;
}

export interface UseCtrlAPath {
  /** False until the first client read; gate anything that depends on it. */
  ready: boolean;
  profile: CtrlAProfile | null;
  /** Primary craft, or null with no profile. */
  craft: CraftSlug | null;
  /** The five stops for the primary craft, with done flags. Empty without a craft. */
  stops: PathStopState[];
  /** The first stop not done, or null when the path is complete. */
  next: PathStopState | null;
  doneCount: number;
  progress: ProgressMap;
  markDone: (stop: StopId, evidence?: Record<string, unknown>, source?: ProgressSource) => boolean;
}

export function useCtrlAPath(craftOverride?: CraftSlug): UseCtrlAPath {
  const { profile, ready: profileReady } = useCtrlAProfile();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    setReady(true);
    return subscribe(sync);
  }, []);

  const craft = craftOverride ?? profile?.crafts[0] ?? null;

  const stops = useMemo<PathStopState[]>(() => {
    if (!craft) return [];
    return pathFor(craft).map((s) => {
      const entry = progress[progressKey(progressCraft(craft, s.id), s.id)] ?? null;
      return { ...s, done: !!entry, entry };
    });
  }, [craft, progress]);

  const next = stops.find((s) => !s.done) ?? null;
  const doneCount = stops.filter((s) => s.done).length;

  const mark = useCallback(
    (stop: StopId, evidence?: Record<string, unknown>, source: ProgressSource = "auto") => {
      if (!craft) return false;
      return markDone(craft, stop, evidence, source);
    },
    [craft]
  );

  return { ready: ready && profileReady, profile, craft, stops, next, doneCount, progress, markDone: mark };
}

/** Every stop id, for iteration in server code that cannot import React. */
export { STOPS };
