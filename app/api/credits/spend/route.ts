// app/api/credits/spend/route.ts
// ─────────────────────────────────────────────────────────────
// Server-authoritative credit spending. The browser asks to spend on a
// named item; we verify the session, look up the cost from the one config
// table, and spend via the service-role spend_credits RPC. The RPC checks
// the balance and writes a `spend:<item>` row to the credit_events ledger
// atomically, so a spend can never overdraw and always shows in the
// activity feed. The client can never set its own balance or price.
//
// This is the single spend path for the whole app (brand-kit export today,
// magazine features next). The legacy deduct_brand_kit_points RPC, which
// moved the balance without a ledger row, is retired in favor of this.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/admin";
import { COSTS, type CostItem } from "@/lib/credits/config";

export const runtime = "nodejs";
export const maxDuration = 15;

const bodySchema = z.object({
  item: z.enum(Object.keys(COSTS) as [CostItem, ...CostItem[]]),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  let item: CostItem;
  try {
    item = bodySchema.parse(await req.json()).item;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, code: "unauthenticated", error: "Sign in to continue." },
      { status: 401 },
    );
  }

  const admin = createServiceClient();
  if (!admin) {
    console.error("Credits not configured: set SUPABASE_SERVICE_ROLE_KEY.");
    return NextResponse.json(
      { ok: false, code: "not_configured", error: "Credits are not configured yet." },
      { status: 503 },
    );
  }

  const amount = COSTS[item];

  const { data, error } = await admin.rpc("spend_credits", {
    p_user_id: user.id,
    p_amount: amount,
    p_reason: item,
  });

  if (error) {
    console.error("spend_credits error:", error.message);
    return NextResponse.json({ ok: false, error: "Could not complete that. Please try again." }, { status: 502 });
  }

  const result = data as { success: boolean; points?: number; message?: string };
  if (!result.success) {
    // Most common cause is an insufficient balance; say so cleanly.
    return NextResponse.json(
      { ok: false, code: "insufficient", error: "Not enough credits.", points: result.points ?? 0 },
      { status: 402 },
    );
  }

  return NextResponse.json({ ok: true, points: result.points, spent: amount, item });
}
