// app/api/ctrla/submissions/route.ts
// ─────────────────────────────────────────────────────────────
// CTRL-A community submissions.
//
// POST: create a submission. Auth comes from the Supabase session
// cookie; the insert runs as the USER (RLS enforces author_id =
// auth.uid() and status = 'pending'), so this route can never be
// tricked into publishing on someone's behalf. After the write
// succeeds we fire a best-effort Klaviyo "Submission Received"
// event — a Klaviyo hiccup never fails the submission.
//
// Light rate limit: 10 submissions per rolling 24h per user.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { fireCtrlaEvent } from "@/lib/ctrla/klaviyo-events";

export const runtime = "nodejs";
export const maxDuration = 15;

const MAX_PER_DAY = 10;

const toolkitSlug = z.enum(["music", "web-dev", "design", "video"]);
const url = z.string().trim().url().max(300);
const tags = z.array(z.string().trim().min(1).max(24)).max(6);

const bodySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("tool"),
    toolkitSlug,
    title: z.string().trim().min(2).max(80),
    url,
    body: z.string().trim().min(10).max(600), // why it earns a slot
    tags: tags.optional(),
    level: z.enum(["Beginner", "Intermediate", "Pro"]).optional(),
  }),
  z.object({
    type: z.literal("idea"),
    toolkitSlug: toolkitSlug.optional(),
    title: z.string().trim().min(4).max(100),
    body: z.string().trim().min(20).max(1200),
  }),
  z.object({
    type: z.literal("signal"),
    toolkitSlug,
    title: z.string().trim().min(4).max(120),
    body: z.string().trim().min(10).max(600),
    url: url.optional(),
    kind: z.enum(["Release", "Shift", "Trend", "Sunset"]).optional(),
  }),
  z.object({
    type: z.literal("resource"),
    toolkitSlug,
    title: z.string().trim().min(2).max(100),
    url,
    body: z.string().trim().max(600).optional(),
  }),
]);

export async function POST(req: NextRequest) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something in the form is missing or too long." },
      { status: 400 },
    );
  }

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, code: "unauthenticated", error: "Sign in to submit." },
      { status: 401 },
    );
  }

  // Rolling 24h rate limit (reads only the user's own rows via RLS).
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("ctrla_submissions")
    .select("id", { count: "exact", head: true })
    .eq("author_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_PER_DAY) {
    return NextResponse.json(
      { ok: false, error: "That is plenty for one day. Come back tomorrow." },
      { status: 429 },
    );
  }

  const { type, toolkitSlug: toolkit, title, ...rest } = body;
  const payload: Record<string, unknown> = { title };
  if ("url" in rest && rest.url) payload.url = rest.url;
  if ("body" in rest && rest.body) payload.body = rest.body;
  if ("tags" in rest && rest.tags?.length) payload.tags = rest.tags;
  if ("level" in rest && rest.level) payload.level = rest.level;
  if ("kind" in rest && rest.kind) payload.kind = rest.kind;

  const { data: row, error } = await supabase
    .from("ctrla_submissions")
    .insert({
      author_id: user.id,
      toolkit_slug: toolkit ?? null,
      type,
      payload,
    })
    .select("id")
    .single();

  if (error || !row) {
    console.error("ctrla submission insert error:", error?.message);
    return NextResponse.json(
      { ok: false, error: "Could not save your submission. Try again." },
      { status: 502 },
    );
  }

  // Best-effort: never blocks the response path's success.
  if (user.email) {
    await fireCtrlaEvent("CTRL-A Submission Received", user.email, {
      submission_id: row.id,
      submission_type: type,
      toolkit: toolkit ?? "general",
      title,
    });
  }

  return NextResponse.json({ ok: true, id: row.id });
}
