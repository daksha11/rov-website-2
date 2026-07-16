// app/api/credits/earn/route.ts
// Server-authoritative credit earning. The browser asks to claim an action;
// we verify the session, look up the reward, and award via the service-role
// RPC (deduped). The client can never set its own balance.
//
// Dedupe key is built per reward shape:
//   once            → user:action                  (once ever)
//   perMeta "guide" → user:action:<guide-slug>     (once per guide)
//   cap  "weekly"   → user:action:<iso-week>        (once per ISO week)
//   otherwise       → null                          (unbounded, unused here)
//
// After a real award we fire best-effort Klaviyo events: a per-action
// "Credits Earned" always, plus "Guide Completed" for guide-complete. A
// Klaviyo hiccup never fails the claim.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/admin";
import { REWARDS, CLAIMABLE, type EarnAction } from "@/lib/credits/config";
import { fireCtrlaEvent } from "@/lib/ctrla/klaviyo-events";

export const runtime = "nodejs";
export const maxDuration = 15;

const bodySchema = z.object({
  action: z.enum([
    "follow-instagram",
    "referral",
    "social-engagement",
    "guide-complete",
    "contribution-approved",
    "contribution-featured",
  ]),
  // Required when the reward is per-meta (guide-complete). Ignored otherwise.
  guide: z.string().trim().min(1).max(80).optional(),
});

// ISO-week key like "2026-W29", stable within a calendar week (UTC).
function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay() || 7; // Mon=1..Sun=7
  date.setUTCDate(date.getUTCDate() + 4 - day); // nearest Thursday
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  let action: EarnAction;
  let guide: string | undefined;
  try {
    const parsed = bodySchema.parse(await req.json());
    action = parsed.action;
    guide = parsed.guide;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Only browser-claimable actions are allowed here (referral and the
  // contribution awards are server-attributed elsewhere).
  if (!CLAIMABLE.includes(action)) {
    return NextResponse.json({ ok: false, error: "That reward cannot be claimed here." }, { status: 400 });
  }

  const reward = REWARDS[action];

  // guide-complete needs a guide slug to scope its once-per-guide dedupe.
  if (reward.perMeta === "guide" && !guide) {
    return NextResponse.json({ ok: false, error: "Missing guide." }, { status: 400 });
  }

  // Who is asking?
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, code: "unauthenticated", error: "Sign in to earn credits." }, { status: 401 });
  }

  const admin = createServiceClient();
  if (!admin) {
    console.error("Credits not configured: set SUPABASE_SERVICE_ROLE_KEY.");
    return NextResponse.json({ ok: false, code: "not_configured", error: "Credits are not configured yet." }, { status: 503 });
  }

  // Build the dedupe key per reward shape.
  let dedupeKey: string | null = null;
  if (reward.perMeta === "guide") dedupeKey = `${user.id}:${action}:${guide}`;
  else if (reward.cap === "weekly") dedupeKey = `${user.id}:${action}:${isoWeekKey(new Date())}`;
  else if (reward.once) dedupeKey = `${user.id}:${action}`;

  const meta = reward.perMeta === "guide" ? { guide } : {};

  const { data, error } = await admin.rpc("award_credits", {
    p_user_id: user.id,
    p_action: action,
    p_amount: reward.points,
    p_dedupe_key: dedupeKey,
    p_meta: meta,
  });

  if (error) {
    console.error("award_credits error:", error.message);
    return NextResponse.json({ ok: false, error: "Could not award credits. Please try again." }, { status: 502 });
  }

  const result = data as { success: boolean; already_claimed?: boolean; points?: number; awarded?: number };
  if (result.already_claimed) {
    return NextResponse.json({ ok: true, alreadyClaimed: true, points: result.points ?? null, awarded: 0 });
  }
  if (!result.success) {
    return NextResponse.json({ ok: false, error: "Could not award credits." }, { status: 400 });
  }

  // Best-effort Klaviyo, never blocks the claim's success.
  if (user.email) {
    await fireCtrlaEvent("CTRL-A Credits Earned", user.email, {
      action,
      awarded: result.awarded ?? reward.points,
      balance: result.points,
      ...(guide ? { guide } : {}),
    });
    if (action === "guide-complete") {
      await fireCtrlaEvent("CTRL-A Guide Completed", user.email, { guide, balance: result.points });
    }
  }

  return NextResponse.json({ ok: true, points: result.points, awarded: result.awarded });
}
