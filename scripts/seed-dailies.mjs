// ═══════════════════════════════════════════════════════
// CTRL-A — seed The Daily
// Pushes a batch of authored taste tests into daily_challenges,
// assigning consecutive dates. Upserts on publish_date, so re-running
// with edits updates rows in place and never duplicates.
//
//   npm run seed:dailies                      -> starts today (ET)
//   npm run seed:dailies -- --start=2026-08-01
//   npm run seed:dailies -- --batch=vol-01    -> content/dailies/<batch>.mjs
//
// Needs NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
// (read from .env.local like the app itself).
// ═══════════════════════════════════════════════════════

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Minimal .env.local loader (no dotenv dependency in this repo).
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

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
  })
);

const todayET = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());

const start = typeof args.start === "string" ? args.start : todayET();
if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) {
  console.error(`--start must be YYYY-MM-DD, got "${start}".`);
  process.exit(1);
}

const batch = typeof args.batch === "string" ? args.batch : "vol-01";
const mod = await import(pathToFileURL(resolve(root, "content", "dailies", `${batch}.mjs`)).href);
const { volume, dailies } = mod;

const addDays = (iso, n) => {
  const d = new Date(`${iso}T12:00:00Z`); // noon UTC dodges DST edges
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const rows = dailies.map((d, i) => {
  for (const [field, ok] of [
    ["prompt", typeof d.prompt === "string" && d.prompt.length > 0],
    ["a", d.a && typeof d.a === "object"],
    ["b", d.b && typeof d.b === "object"],
    ["pick", d.pick === "a" || d.pick === "b"],
    ["note", typeof d.note === "string" && d.note.length > 0],
  ]) {
    if (!ok) {
      console.error(`Entry ${i + 1} has a bad "${field}" field.`);
      process.exit(1);
    }
  }
  return {
    publish_date: addDays(start, i),
    volume,
    kind: "taste-test",
    prompt: d.prompt,
    option_a: d.a,
    option_b: d.b,
    editors_pick: d.pick,
    editors_note: d.note,
  };
});

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { error } = await supabase
  .from("daily_challenges")
  .upsert(rows, { onConflict: "publish_date" });

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(
  `Seeded ${rows.length} dailies (${batch}, vol ${volume}): ${rows[0].publish_date} through ${rows[rows.length - 1].publish_date}.`
);
