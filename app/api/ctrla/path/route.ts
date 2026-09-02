// app/api/ctrla/path/route.ts
// ─────────────────────────────────────────────────────────────
// The account copy of a person's CTRL-A profile and progress.
//
//   POST    merge the browser's copy in, return the merged result
//   GET     return the account copy
//   DELETE  forget everything (the "delete my path" control)
//
// Runs as the signed-in user, so RLS does the authorisation; there is no
// service role here. Merge rules: the newest profile wins, the earliest
// completion of a stop wins. Nothing here can undo progress.
// ─────────────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 15;

const CRAFTS = ["music", "design", "web-dev", "video"] as const;
const STOPS = ["learn", "look", "work", "finish", "show"] as const;

const profileSchema = z
  .object({
    v: z.literal(1),
    crafts: z.array(z.enum(CRAFTS)).min(1).max(4),
    level: z.enum(["beginner", "expert"]),
    intent: z.enum(["craft", "brand", "release", "atlanta"]),
    hasBrand: z.boolean(),
    completedAt: z.string().datetime(),
  })
  .nullable();

const entrySchema = z.object({
  at: z.string().datetime(),
  source: z.enum(["auto", "self", "review"]),
  evidence: z.record(z.string(), z.unknown()).optional(),
});

const bodySchema = z.object({
  profile: profileSchema.optional(),
  progress: z.record(z.string(), entrySchema).optional(),
});

type Profile = z.infer<typeof profileSchema>;
type Entry = z.infer<typeof entrySchema>;

const keyOf = (craft: string, stop: string) => `${craft}:${stop}`;
const splitKey = (key: string): { craft: string; stop: string } | null => {
  const [craft, stop] = key.split(":");
  if (!craft || !stop) return null;
  if (![...CRAFTS, "all"].includes(craft)) return null;
  if (!STOPS.includes(stop as (typeof STOPS)[number])) return null;
  return { craft, stop };
};

async function readAccount(supabase: ReturnType<typeof createClient>, userId: string) {
  const [{ data: row }, { data: rows }] = await Promise.all([
    supabase.from("profiles").select("ctrla_profile, ctrla_profile_at").eq("id", userId).maybeSingle(),
    supabase.from("ctrla_progress").select("craft, stop, evidence, source, done_at").eq("user_id", userId),
  ]);
  const parsed = profileSchema.safeParse(row?.ctrla_profile ?? null);
  const profile: Profile = parsed.success ? parsed.data : null;
  const progress: Record<string, Entry> = {};
  for (const r of rows ?? []) {
    progress[keyOf(r.craft, r.stop)] = { at: r.done_at, source: r.source, evidence: (r.evidence as Record<string, unknown>) ?? undefined };
  }
  return { profile, progress };
}

export async function GET() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, code: "unauthenticated" }, { status: 401 });
  const account = await readAccount(supabase, user.id);
  return NextResponse.json({ ok: true, ...account });
}

export async function POST(req: NextRequest) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, code: "unauthenticated" }, { status: 401 });

  const account = await readAccount(supabase, user.id);

  // Profile: newest completedAt wins.
  let profile = account.profile;
  const incoming = body.profile ?? null;
  if (incoming && (!profile || incoming.completedAt > profile.completedAt)) {
    const { error } = await supabase
      .from("profiles")
      .update({ ctrla_profile: incoming, ctrla_profile_at: incoming.completedAt })
      .eq("id", user.id);
    if (error) console.error("ctrla_profile update error:", error.message);
    else profile = incoming;
  }

  // Progress: insert what the account lacks; keep the earlier date otherwise.
  const merged: Record<string, Entry> = { ...account.progress };
  const inserts: { user_id: string; craft: string; stop: string; evidence: Record<string, unknown>; source: string; done_at: string }[] = [];
  for (const [key, entry] of Object.entries(body.progress ?? {})) {
    const parts = splitKey(key);
    if (!parts) continue;
    const have = merged[key];
    if (!have) {
      merged[key] = entry;
      inserts.push({ user_id: user.id, craft: parts.craft, stop: parts.stop, evidence: entry.evidence ?? {}, source: entry.source, done_at: entry.at });
    } else if (entry.at < have.at) {
      merged[key] = entry;
      await supabase
        .from("ctrla_progress")
        .update({ done_at: entry.at, source: entry.source, evidence: entry.evidence ?? {} })
        .eq("user_id", user.id)
        .eq("craft", parts.craft)
        .eq("stop", parts.stop);
    }
  }
  if (inserts.length) {
    const { error } = await supabase.from("ctrla_progress").upsert(inserts, { onConflict: "user_id,craft,stop", ignoreDuplicates: true });
    if (error) console.error("ctrla_progress insert error:", error.message);
  }

  return NextResponse.json({ ok: true, profile, progress: merged });
}

export async function DELETE() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, code: "unauthenticated" }, { status: 401 });
  await Promise.all([
    supabase.from("profiles").update({ ctrla_profile: null, ctrla_profile_at: null }).eq("id", user.id),
    supabase.from("ctrla_progress").delete().eq("user_id", user.id),
  ]);
  return NextResponse.json({ ok: true });
}
