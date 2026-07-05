// ═══════════════════════════════════════════════════════
// CTRL-A — GALLEY SWIPE FEEDBACK
// Stub only: no backend exists yet. Swap the body of
// `submitGalleyFeedback` for a real call (API route, Supabase, etc.)
// once one is wired up — the swipe deck already calls this on every
// like / dislike / mod so nothing else needs to change.
// ═══════════════════════════════════════════════════════

export type GalleySwipeAction = "like" | "dislike" | "mod";

export interface GalleySwipeEntry {
  recipeId: string;
  action: GalleySwipeAction;
  /** Only present for "mod" — the suggested change. */
  note?: string;
}

export async function submitGalleyFeedback(entry: GalleySwipeEntry): Promise<void> {
  console.log("[galley feedback]", entry);
}
