// app/api/credits/refer/route.ts
// Referral attribution. Called once after a NEW user signs in carrying a
// referral code (captured from ?ref= and stored client-side). We set the
// new user's referred_by exactly once, and award the referrer for each
// distinct friend they bring in. Self-referral and re-attribution are
// rejected. All writes go through the service role.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/admin";
import { REWARDS } from "@/lib/credits/config";

export const runtime = "nodejs";
export const maxDuration = 15;

const bodySchema = z.object({
  code: z.string().trim().min(4).max(32),
});

export async function POST(req: NextRequest) {
  let code: string;
  try {
    code = bodySchema.parse(await req.json()).code.toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, code: "unauthenticated" }, { status: 401 });
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  // Find the referrer by code.
  const { data: referrer } = await admin
    .from("profiles")
    .select("id")
    .eq("referral_code", code)
    .maybeSingle();

  // No such code, or someone using their own link: nothing to do.
  if (!referrer || referrer.id === user.id) {
    return NextResponse.json({ ok: true, attributed: false });
  }

  // Attribute exactly once: only set referred_by if it is still null.
  const { data: updated } = await admin
    .from("profiles")
    .update({ referred_by: referrer.id })
    .eq("id", user.id)
    .is("referred_by", null)
    .select("id")
    .maybeSingle();

  // Already attributed before: do not re-award.
  if (!updated) {
    return NextResponse.json({ ok: true, attributed: false, alreadyAttributed: true });
  }

  // Reward the referrer, deduped per referred friend.
  await admin.rpc("award_credits", {
    p_user_id: referrer.id,
    p_action: "referral",
    p_amount: REWARDS.referral.points,
    p_dedupe_key: `referral:${user.id}`,
    p_meta: { referred: user.id },
  });

  return NextResponse.json({ ok: true, attributed: true });
}
