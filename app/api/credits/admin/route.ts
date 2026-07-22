// app/api/credits/admin/route.ts
// ─────────────────────────────────────────────────────────────
// Admin credits console backend. Staff only (admin / engineer), in the
// same requireStaff mold as the review + forms routes. Two jobs:
//
//   GET  ?q=<email|handle>   look a member up: identity, balance, ledger.
//   POST { userId, delta, reason }   grant (delta>0) or deduct (delta<0),
//        with a required reason written to the ledger meta.
//
// The adjustment runs through the service-role admin_adjust_credits RPC so
// the browser can never move a balance directly; this route only opens the
// door after the role gate passes.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 15;

async function requireStaff() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, status: 401 as const };
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin" && me?.role !== "engineer") return { user: null, status: 403 as const };
  return { user, status: 200 as const };
}

// GET: find a member and return balance + recent ledger.
export async function GET(req: NextRequest) {
  const gate = await requireStaff();
  if (!gate.user) return NextResponse.json({ ok: false }, { status: gate.status });

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (!q) return NextResponse.json({ ok: false, error: "Enter an email or handle." }, { status: 400 });

  const admin = createServiceClient();
  if (!admin) return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });

  // Match by exact email or handle (case-insensitive), newest profile first.
  const { data: people, error: pErr } = await admin
    .from("profiles")
    .select("id, full_name, handle, email, role")
    .or(`email.ilike.${q},handle.ilike.${q}`)
    .limit(1);
  if (pErr) {
    console.error("economy lookup error:", pErr.message);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  const person = people?.[0];
  if (!person) return NextResponse.json({ ok: true, found: false });

  const [{ data: wallet }, { data: ledger }] = await Promise.all([
    admin.from("brand_kit_credits").select("points").eq("user_id", person.id).maybeSingle(),
    admin
      .from("credit_events")
      .select("id, action, points, meta, created_at")
      .eq("user_id", person.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return NextResponse.json({
    ok: true,
    found: true,
    person,
    balance: wallet?.points ?? 0,
    ledger: ledger ?? [],
  });
}

const postSchema = z.object({
  userId: z.string().uuid(),
  delta: z.number().int().refine((n) => n !== 0, "No change").pipe(z.number().int().min(-100000).max(100000)),
  reason: z.string().trim().min(3).max(200),
});

// POST: grant or deduct with a reason.
export async function POST(req: NextRequest) {
  let body: z.infer<typeof postSchema>;
  try {
    body = postSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request. A reason of at least 3 characters is required." }, { status: 400 });
  }

  const gate = await requireStaff();
  if (!gate.user) return NextResponse.json({ ok: false }, { status: gate.status });

  const admin = createServiceClient();
  if (!admin) return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });

  const { data, error } = await admin.rpc("admin_adjust_credits", {
    p_user_id: body.userId,
    p_delta: body.delta,
    p_reason: body.reason,
    p_actor: gate.user.id,
  });
  if (error) {
    console.error("admin_adjust_credits error:", error.message);
    return NextResponse.json({ ok: false, error: "Adjustment failed." }, { status: 502 });
  }
  const r = data as { success: boolean; points?: number; message?: string };
  if (!r.success) {
    return NextResponse.json({ ok: false, error: r.message ?? "Adjustment rejected." }, { status: 422 });
  }
  return NextResponse.json({ ok: true, balance: r.points });
}
