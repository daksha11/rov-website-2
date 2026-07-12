// ─────────────────────────────────────────────────────────────
// CTRL-A Daily — DEV-ONLY preview challenge.
// Local .env.local has no SUPABASE_SERVICE_ROLE_KEY (it lives on
// Vercel), so the /api/daily routes can't reach the database in
// development. Instead of an error state, they serve this sample
// in dev only, so the game is playable and designable locally.
// Production without the key still returns 503, never fake data.
// ─────────────────────────────────────────────────────────────

export const isDevPreview = () =>
  process.env.NODE_ENV === "development" && !process.env.SUPABASE_SERVICE_ROLE_KEY;

export const PREVIEW_CHALLENGE = {
  number: 1,
  volume: 1,
  kind: "taste-test",
  prompt: "Two headlines for the same portfolio site. Which is sharper? (Preview mode: local sample, votes are not saved.)",
  option_a: { label: "Option A", text: "We craft unforgettable digital experiences that elevate your brand." },
  option_b: { label: "Option B", text: "We design websites people actually finish reading." },
  editors_pick: "b" as const,
  editors_note:
    "A says nothing you could disprove, which means it says nothing. B makes one small claim you can picture, and specificity is what makes copy feel true.",
  counts_a: 31,
  counts_b: 69,
};
