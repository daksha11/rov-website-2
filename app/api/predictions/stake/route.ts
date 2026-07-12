// app/api/predictions/stake/route.ts
// Stake credits on a Signals prediction. Spend + record happen in ONE
// SQL transaction (stake_prediction), so a crash can never eat credits.
// One stake per user per prediction; bounds enforced here and in SQL.
// Resolution happens on the volume-publish checklist:
//   SELECT resolve_prediction('<id>', <winning option>);  -- pays winners 2x

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/admin";
import { PREDICTION_STAKE } from "@/lib/credits/config";

export const runtime = "nodejs";
export const maxDuration = 15;

const bodySchema = z.object({
  predictionId: z.string().uuid(),
  option: z.number().int().min(0),
  stake: z.number().int().min(PREDICTION_STAKE.min).max(PREDICTION_STAKE.max),
});

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
  if (!user) {
    return NextResponse.json({ ok: false, code: "unauthenticated", error: "Sign in to stake credits." }, { status: 401 });
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const { data, error } = await admin.rpc("stake_prediction", {
    p_user_id: user.id,
    p_prediction_id: body.predictionId,
    p_option: body.option,
    p_stake: body.stake,
  });

  if (error) {
    console.error("stake_prediction error:", error.message);
    return NextResponse.json({ ok: false, error: "Could not place your stake." }, { status: 502 });
  }

  const r = data as { success: boolean; code?: string; points?: number; message?: string };
  if (!r.success) {
    const msg =
      r.code === "closed" ? "This call is closed."
      : r.code === "already_staked" ? "You already staked on this one."
      : r.message || "Could not place your stake.";
    return NextResponse.json({ ok: false, code: r.code, error: msg, points: r.points ?? null }, { status: 400 });
  }

  return NextResponse.json({ ok: true, points: r.points });
}
