// app/api/ctrla/forms/route.ts
// ─────────────────────────────────────────────────────────────
// Admin form-config editor backend. Staff read the full set (including
// closed types) and update a type's config: open/closed, title, intro,
// credit cost, and field list. Public submit pages read the same table
// directly (RLS grants select to everyone); this route is the staff write
// path with a real server-side role gate, in the requireStaff mold.
//
// The config drives the UI only. The submissions API's zod is the
// non-bypassable floor, so a config can never make the server accept a
// payload zod rejects, or charge an amount the server does not know.
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

const fieldSchema = z.object({
  key: z.string().trim().min(1).max(40),
  label: z.string().trim().min(1).max(120),
  kind: z.enum(["text", "textarea", "url", "tags", "select", "toolkit", "date", "media", "tools", "sections"]),
  required: z.boolean(),
  help: z.string().trim().max(300).optional(),
  maxLength: z.number().int().positive().max(20000).optional(),
  options: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
  min: z.number().int().optional(),
  max: z.number().int().optional(),
});

const putSchema = z.object({
  type: z.enum(["tool", "idea", "signal", "resource", "history", "art", "story"]),
  is_open: z.boolean().optional(),
  title: z.string().trim().min(1).max(140).optional(),
  intro: z.string().trim().max(400).nullable().optional(),
  credit_cost: z.number().int().min(0).max(100000).optional(),
  fields: z.array(fieldSchema).max(40).optional(),
  sort: z.number().int().optional(),
});

// GET: all configs, including closed ones (staff view).
export async function GET() {
  const gate = await requireStaff();
  if (!gate.user) return NextResponse.json({ ok: false }, { status: gate.status });

  const admin = createServiceClient();
  if (!admin) return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });

  const { data, error } = await admin
    .from("ctrla_form_configs")
    .select("type, track, is_open, title, intro, credit_cost, fields, sort")
    .order("sort", { ascending: true });
  if (error) {
    console.error("form configs read error:", error.message);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true, configs: data ?? [] });
}

// PUT: update one type's config.
export async function PUT(req: NextRequest) {
  let body: z.infer<typeof putSchema>;
  try {
    body = putSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const gate = await requireStaff();
  if (!gate.user) return NextResponse.json({ ok: false }, { status: gate.status });

  const admin = createServiceClient();
  if (!admin) return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });

  const { type, ...rest } = body;
  const patch: Record<string, unknown> = { ...rest, updated_at: new Date().toISOString(), updated_by: gate.user.id };

  const { error } = await admin.from("ctrla_form_configs").update(patch).eq("type", type);
  if (error) {
    console.error("form config update error:", error.message);
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
