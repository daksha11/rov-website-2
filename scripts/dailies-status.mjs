// ═══════════════════════════════════════════════════════
// CTRL-A — The Daily, status report
//   npm run dailies:status
//
// Shows what is scheduled, how many days of runway remain, any
// gaps in the calendar, and how people are playing. This is the
// management dashboard, in the terminal, no admin UI to maintain.
//
// Needs NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in
// .env.local (same as the seed script).
// ═══════════════════════════════════════════════════════

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const file of [".env.local", ".env"]) {
  const p = resolve(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (check .env.local).");
  process.exit(1);
}

const todayET = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
const today = todayET();

const supabase = createClient(url, key, { auth: { persistSession: false } });

const [{ data: challenges, error }, { count: playCount }, { count: playerCount }] = await Promise.all([
  supabase
    .from("daily_challenges")
    .select("publish_date, volume, prompt, counts_a, counts_b")
    .order("publish_date", { ascending: true }),
  supabase.from("daily_plays").select("id", { count: "exact", head: true }),
  supabase.from("user_streaks").select("user_id", { count: "exact", head: true }),
]);

if (error) {
  console.error("Could not read daily_challenges:", error.message);
  console.error("If the table does not exist yet, run utils/spbase-docs/daily-system-setup.sql in the Supabase SQL editor.");
  process.exit(1);
}

if (!challenges || challenges.length === 0) {
  console.log("No dailies scheduled at all. Run: npm run seed:dailies");
  process.exit(0);
}

const past = challenges.filter((c) => c.publish_date < today);
const current = challenges.find((c) => c.publish_date === today);
const future = challenges.filter((c) => c.publish_date > today);

console.log(`THE DAILY · status as of ${today} (ET)\n`);

if (current) {
  const total = current.counts_a + current.counts_b;
  console.log(`Today   ${current.publish_date}  "${current.prompt.slice(0, 60)}..."`);
  console.log(`        ${total} votes so far (${current.counts_a} A / ${current.counts_b} B)\n`);
} else {
  console.log("Today   NOTHING SCHEDULED. The page shows 'no test today'. Seed something!\n");
}

console.log(`Past    ${past.length} published`);
console.log(`Queued  ${future.length} scheduled ahead`);

if (future.length > 0) {
  const last = future[future.length - 1].publish_date;
  console.log(`Runway  through ${last} (${future.length} days)`);
  if (future.length <= 5) {
    console.log(`        LOW RUNWAY: author the next batch and run npm run seed:dailies -- --start=<date> --batch=<file>`);
  }
}

// Gaps in the schedule from today forward.
const dates = new Set(challenges.map((c) => c.publish_date));
const gaps = [];
if (future.length > 0) {
  const last = future[future.length - 1].publish_date;
  let d = new Date(`${today}T12:00:00Z`);
  const end = new Date(`${last}T12:00:00Z`);
  while (d <= end) {
    const iso = d.toISOString().slice(0, 10);
    if (!dates.has(iso)) gaps.push(iso);
    d.setUTCDate(d.getUTCDate() + 1);
  }
}
if (gaps.length > 0) {
  console.log(`Gaps    ${gaps.join(", ")} (fine if intentional; the page degrades gracefully)`);
}

console.log(`\nPlays   ${playCount ?? 0} signed-in plays all time · ${playerCount ?? 0} players with a streak record`);

// Engagement on the last 7 published.
const recent = past.slice(-7);
if (recent.length > 0) {
  console.log(`\nLast ${recent.length} days:`);
  for (const c of recent) {
    const total = c.counts_a + c.counts_b;
    const pctA = total ? Math.round((c.counts_a / total) * 100) : 0;
    console.log(`  ${c.publish_date}  ${String(total).padStart(4)} votes  ${pctA}/${100 - pctA}  "${c.prompt.slice(0, 48)}..."`);
  }
}
