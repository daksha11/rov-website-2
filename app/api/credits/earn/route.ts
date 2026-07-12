// app/api/credits/earn/route.ts
// Server-authoritative credit earning. The browser asks to claim an action;
// we verify the session, look up the reward, and award via the service-role
// RPC (deduped). The client can never set its own balance.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/admin";
import { REWARDS, CLAIMABLE, type EarnAction } from "@/lib/credits/config";

export const runtime = "nodejs";
export const maxDuration = 15;

const bodySchema = z.object({
  action: z.enum(["follow-instagram", "referral"]),
});

export async function POST(req: NextRequest) {
  let action: EarnAction;
  try {
    const parsed = bodySchema.parse(await req.json());
    action = parsed.action;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Only browser-claimable actions are allowed here (referral is server-attributed).
  if (!CLAIMABLE.includes(action)) {
    return NextResponse.json({ ok: false, error: "That reward cannot be claimed here." }, { status: 400 });
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

  const reward = REWARDS[action];
  const dedupeKey = reward.once ? `${user.id}:${action}` : null;

  const { data, error } = await admin.rpc("award_credits", {
    p_user_id: user.id,
    p_action: action,
    p_amount: reward.points,
    p_dedupe_key: dedupeKey,
    p_meta: {},
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

  return NextResponse.json({ ok: true, points: result.points, awarded: result.awarded });
}
