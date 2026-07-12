// ─────────────────────────────────────────────────────────────
// CTRL-A Daily — the one definition of "today".
// A day is a calendar date in America/New_York (the brand's home
// timezone), so everyone worldwide plays the same puzzle and the
// reset is literally midnight in Atlanta. Server-side only source
// of truth; the client never computes the date for anything that
// matters.
// ─────────────────────────────────────────────────────────────

export function todayET(): string {
  // en-CA gives ISO "YYYY-MM-DD" directly.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}
