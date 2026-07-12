// app/api/daily/route.ts
// Today's taste test, minus the reveal. daily_challenges is fully locked
// behind RLS, so this service-role route is the only way to read it, and
// it deliberately never returns editors_pick / editors_note. The reveal
// only comes back from /api/daily/play, after you've picked.

import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/admin";
import { todayET } from "@/lib/daily/date";
import { isDevPreview, PREVIEW_CHALLENGE } from "@/lib/daily/preview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function GET() {
  const admin = createServiceClient();
  if (!admin) {
    // Local dev without the service key: serve the built-in sample so the
    // game is playable and designable offline. Production stays strict.
    if (isDevPreview()) {
      return NextResponse.json({
        ok: true,
        preview: true,
        date: todayET(),
        number: PREVIEW_CHALLENGE.number,
        volume: PREVIEW_CHALLENGE.volume,
        kind: PREVIEW_CHALLENGE.kind,
        prompt: PREVIEW_CHALLENGE.prompt,
        optionA: PREVIEW_CHALLENGE.option_a,
        optionB: PREVIEW_CHALLENGE.option_b,
      });
    }
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const date = todayET();

  const [{ data: challenge, error }, { count }] = await Promise.all([
    admin
      .from("daily_challenges")
      .select("id, publish_date, volume, kind, prompt, option_a, option_b")
      .eq("publish_date", date)
      .maybeSingle(),
    // "Taste Test No. N" = how many dailies have ever published, today included.
    admin
      .from("daily_challenges")
      .select("id", { count: "exact", head: true })
      .lte("publish_date", date),
  ]);

  if (error) {
    console.error("daily fetch error:", error.message);
    return NextResponse.json({ ok: false, error: "Could not load today's test." }, { status: 502 });
  }
  if (!challenge) {
    return NextResponse.json({ ok: false, code: "no_challenge" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    date,
    number: count ?? null,
    volume: challenge.volume,
    kind: challenge.kind,
    prompt: challenge.prompt,
    optionA: challenge.option_a,
    optionB: challenge.option_b,
  });
}
