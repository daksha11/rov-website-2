// app/api/daily/play/route.ts
// Play today's taste test. Signed in: one transaction records the play,
// ticks the streak (with the weekly grace day), and pays credits (base +
// a random spike rolled HERE, never in the browser + milestone bonuses).
// Anonymous: counts the vote and returns the reveal, nothing accumulates.
// The unique (user, challenge) constraint makes replays pay nothing.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/admin";
import { DAILY } from "@/lib/credits/config";
import { todayET } from "@/lib/daily/date";
import { isDevPreview, PREVIEW_CHALLENGE } from "@/lib/daily/preview";

export const runtime = "nodejs";
export const maxDuration = 15;

const bodySchema = z.object({ choice: z.enum(["a", "b"]) });

type PlayResult = {
  success: boolean;
  code?: string;
  already_played?: boolean;
  choice?: string;
  matched?: boolean;
  counts_a?: number;
  counts_b?: number;
  editors_pick?: string;
  editors_note?: string;
  streak?: number;
  longest?: number;
  freeze_available?: boolean;
  taste_plays?: number;
  taste_agreements?: number;
  awarded?: number;
  points?: number | null;
};

export async function POST(req: NextRequest) {
  let choice: "a" | "b";
  try {
    choice = bodySchema.parse(await req.json()).choice;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const admin = createServiceClient();
  if (!admin) {
    // Dev preview: simulate the reveal (nothing is saved, nothing is paid).
    if (isDevPreview()) {
      const c = PREVIEW_CHALLENGE;
      return NextResponse.json({
        ok: true,
        preview: true,
        signedIn: false,
        choice,
        matched: choice === c.editors_pick,
        countsA: c.counts_a + (choice === "a" ? 1 : 0),
        countsB: c.counts_b + (choice === "b" ? 1 : 0),
        editorsPick: c.editors_pick,
        editorsNote: c.editors_note,
      });
    }
    console.error("Daily not configured: set SUPABASE_SERVICE_ROLE_KEY.");
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const date = todayET();

  // Who is asking? Anonymous is allowed; it just accumulates nothing.
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const { data, error } = await admin.rpc("play_daily_anon", {
      p_date: date,
      p_choice: choice,
    });
    if (error) {
      console.error("play_daily_anon error:", error.message);
      return NextResponse.json({ ok: false, error: "Could not record your pick." }, { status: 502 });
    }
    const r = data as PlayResult;
    if (!r.success) return NextResponse.json({ ok: false, code: r.code }, { status: 400 });
    return NextResponse.json({ ok: true, signedIn: false, ...shape(r) });
  }

  // The spike is the variable-reward part: rolled server-side per play.
  const spike = Math.floor(Math.random() * (DAILY.spikeMax + 1));

  const { data, error } = await admin.rpc("play_daily", {
    p_user_id: user.id,
    p_date: date,
    p_choice: choice,
    p_base: DAILY.basePoints,
    p_spike: spike,
    p_milestones: DAILY.streakBonuses,
  });

  if (error) {
    console.error("play_daily error:", error.message);
    return NextResponse.json({ ok: false, error: "Could not record your play." }, { status: 502 });
  }

  const r = data as PlayResult;
  if (!r.success) return NextResponse.json({ ok: false, code: r.code }, { status: 400 });

  return NextResponse.json({
    ok: true,
    signedIn: true,
    alreadyPlayed: r.already_played ?? false,
    streak: r.streak ?? 0,
    longest: r.longest ?? 0,
    freezeAvailable: r.freeze_available ?? true,
    tastePlays: r.taste_plays ?? 0,
    tasteAgreements: r.taste_agreements ?? 0,
    awarded: r.awarded ?? 0,
    points: r.points ?? null,
    ...shape(r),
  });
}

// The reveal payload, shared by both paths.
function shape(r: PlayResult) {
  return {
    choice: r.choice,
    matched: r.matched ?? false,
    countsA: r.counts_a ?? 0,
    countsB: r.counts_b ?? 0,
    editorsPick: r.editors_pick,
    editorsNote: r.editors_note,
  };
}
