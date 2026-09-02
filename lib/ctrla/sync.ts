// lib/ctrla/sync.ts
// ─────────────────────────────────────────────────────────────
// The profile and progress follow the person once they sign in.
//
// Rules, decided 2026-09-01:
//   - Signed out, everything lives in localStorage and just works.
//   - On sign-in (and on every visit while signed in) the local copy is
//     pushed to /api/ctrla/path, merged with the account copy, and the
//     merged result is written back locally. Newest profile wins; the
//     earliest completion of a stop wins, so nothing is ever undone.
//   - Every later local change (markDone, writeProfile) pushes again in
//     the background. Best-effort: the network never blocks the UI.
//
// Mount useCtrlASync() once, in the CTRL-A layout, via <CtrlAPathSync/>.
// ─────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { PROFILE_EVENT, readProfile, writeProfile, type CtrlAProfile } from "./profile";
import { PROGRESS_EVENT, mergeProgress, readProgress, writeProgress, type ProgressMap } from "./progress";

interface Wire {
  profile: CtrlAProfile | null;
  progress: ProgressMap;
}

async function push(): Promise<Wire | null> {
  const body: Wire = { profile: readProfile(), progress: readProgress() };
  const res = await fetch("/api/ctrla/path", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as ({ ok: boolean } & Wire) | null;
  return data?.ok ? data : null;
}

/** Apply the account's merged copy locally without triggering another push. */
function applyMerged(merged: Wire) {
  const local = readProfile();
  // Newest completedAt wins. writeProfile stamps a fresh completedAt, so
  // only write when the account copy is actually newer.
  if (merged.profile && (!local || merged.profile.completedAt > local.completedAt)) {
    syncing = true;
    writeProfile({ crafts: merged.profile.crafts, level: merged.profile.level, intent: merged.profile.intent, hasBrand: merged.profile.hasBrand });
    syncing = false;
  }
  const localProgress = readProgress();
  const next = mergeProgress(localProgress, merged.progress);
  if (JSON.stringify(next) !== JSON.stringify(localProgress)) writeProgress(next, true);
}

let syncing = false;

export function useCtrlASync() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signedIn = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const run = async () => {
      if (!signedIn.current || cancelled) return;
      try {
        const merged = await push();
        if (merged && !cancelled) applyMerged(merged);
      } catch {
        /* best-effort */
      }
    };

    // Debounced push on any local change, unless the change came from us.
    const onLocal = (e: Event) => {
      if (syncing) return;
      if ((e as CustomEvent).detail?.silent) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(run, 800);
    };
    window.addEventListener(PROFILE_EVENT, onLocal);
    window.addEventListener(PROGRESS_EVENT, onLocal);

    supabase.auth.getSession().then(({ data: { session } }) => {
      signedIn.current = !!session?.user;
      void run();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      signedIn.current = !!session?.user;
      if (event === "SIGNED_IN") void run();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
      window.removeEventListener(PROFILE_EVENT, onLocal);
      window.removeEventListener(PROGRESS_EVENT, onLocal);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
}

/**
 * Start Google sign-in and come back to this page. The one call every
 * gate uses, so the redirect behaviour is identical everywhere.
 */
export async function signInWithGoogle(returnTo?: string) {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}${returnTo ?? window.location.pathname + window.location.search}` },
  });
}
