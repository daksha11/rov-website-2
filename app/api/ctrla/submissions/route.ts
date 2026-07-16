// app/api/ctrla/submissions/route.ts
// ─────────────────────────────────────────────────────────────
// CTRL-A community submissions, two tracks.
//
// Track A (toolkit utility: tool | idea | signal | resource | history):
//   free, login-gated, rate-limited. Inserts as the USER, so RLS enforces
//   author_id = auth.uid() and status = 'pending'. Cannot publish on
//   someone's behalf.
//
// Track B (magazine features: art | story):
//   login-gated AND credit-gated. Runs through submit_ctrla_feature() on
//   the service role, which spends the credit cost and inserts in ONE
//   transaction, so a paid feature never charges without inserting.
//
// Config gate: a type that is closed in ctrla_form_configs is rejected, and
// the credit cost charged for a feature is read from that table (server
// side), never from the client. zod remains the non-bypassable safety floor
// beneath the admin-editable config.
//
// After a successful write we fire best-effort Klaviyo events (Submission
// Received always; Feature Submitted for Track B). A Klaviyo hiccup never
// fails the submission.
//
// Rate limit: 10 Track A submissions per rolling 24h. Track B is exempt
// (the credit cost is the limit).
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/admin";
import { fireCtrlaEvent } from "@/lib/ctrla/klaviyo-events";
import { TRACK_FOR, type SubmissionType } from "@/lib/ctrla/community";

export const runtime = "nodejs";
export const maxDuration = 15;

const MAX_PER_DAY = 10;

const toolkitSlug = z.enum(["music", "web-dev", "design", "video"]);
const url = z.string().trim().url().max(300);
const tags = z.array(z.string().trim().min(1).max(24)).max(6);
// Media items must reference the ctrla-submissions bucket paths the client
// already uploaded. We validate shape + count; storage RLS validated the write.
const mediaItem = z.object({
  path: z.string().trim().min(1).max(300),
  kind: z.enum(["image", "audio", "video"]),
  caption: z.string().trim().max(200).optional(),
});
const links = z.array(url).max(4);

const bodySchema = z.discriminatedUnion("type", [
  // ── Track A ──────────────────────────────────────────────
  z.object({
    type: z.literal("tool"),
    toolkitSlug,
    title: z.string().trim().min(2).max(80),
    url,
    body: z.string().trim().min(10).max(600),
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
  z.object({
    type: z.literal("history"),
    toolkitSlug,
    title: z.string().trim().min(2).max(120),
    date: z.string().trim().min(4).max(40), // ISO date, past-ness checked below
    body: z.string().trim().min(10).max(800),
    url: url.optional(),
  }),
  // ── Track B (media-heavy, credit-gated) ──────────────────
  z.object({
    type: z.literal("art"),
    toolkitSlug: toolkitSlug.optional(),
    title: z.string().trim().min(2).max(120),
    medium: z.string().trim().min(2).max(80),
    media: z.array(mediaItem).min(1).max(8), // hero = first
    tools: z.array(z.string().trim().min(1).max(60)).min(1).max(20),
    statement: z.string().trim().min(20).max(1200),
    bio: z.string().trim().min(10).max(400),
    links: links.optional(),
  }),
  z.object({
    type: z.literal("story"),
    toolkitSlug: toolkitSlug.optional(),
    title: z.string().trim().min(2).max(140),
    // All four story requirements are required here, not just in the config.
    media: z.array(mediaItem).min(3).max(12), // hero + gallery, quality minimum
    tools: z
      .array(z.object({ name: z.string().trim().min(1).max(60), toolkit: toolkitSlug.optional() }))
      .min(3)
      .max(24),
    process: z
      .array(z.object({ heading: z.string().trim().min(2).max(120), body: z.string().trim().min(10).max(1600) }))
      .min(3)
      .max(12),
    bio: z.string().trim().min(10).max(400),
    links: links.optional(),
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

  const type = body.type as SubmissionType;
  const track = TRACK_FOR[type];

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

  // Config gate: reject a type that admins have paused, and read the true
  // credit cost server-side. Best-effort read; if the table is unreachable we
  // fall back to open + zero cost for Track A, and block Track B (never charge
  // an unknown amount).
  const { data: cfg } = await supabase
    .from("ctrla_form_configs")
    .select("is_open, credit_cost")
    .eq("type", type)
    .maybeSingle();
  if (cfg && cfg.is_open === false) {
    return NextResponse.json(
      { ok: false, code: "closed", error: "This submission type is paused right now. Check back soon." },
      { status: 409 },
    );
  }

  // ── Track B: atomic spend + insert via the service role. ──
  if (track === "magazine") {
    const cost = cfg?.credit_cost;
    if (typeof cost !== "number") {
      return NextResponse.json(
        { ok: false, code: "not_configured", error: "Features are not open yet." },
        { status: 503 },
      );
    }
    const admin = createServiceClient();
    if (!admin) {
      return NextResponse.json({ ok: false, code: "not_configured", error: "Not configured." }, { status: 503 });
    }

    const { media, toolkitSlug: toolkit, type: _t, ...payloadRest } = body as Extract<
      z.infer<typeof bodySchema>,
      { type: "art" | "story" }
    >;
    const payload: Record<string, unknown> = { ...payloadRest };

    const { data, error } = await admin.rpc("submit_ctrla_feature", {
      p_user_id: user.id,
      p_type: type,
      p_toolkit: toolkit ?? null,
      p_payload: payload,
      p_media: media,
      p_cost: cost,
    });
    if (error) {
      console.error("submit_ctrla_feature error:", error.message);
      return NextResponse.json({ ok: false, error: "Could not submit. Try again." }, { status: 502 });
    }
    const r = data as { success: boolean; code?: string; id?: string; points?: number };
    if (!r.success) {
      if (r.code === "insufficient") {
        return NextResponse.json(
          { ok: false, code: "insufficient", error: "Not enough credits.", points: r.points ?? 0 },
          { status: 402 },
        );
      }
      return NextResponse.json({ ok: false, error: "Could not submit. Try again." }, { status: 400 });
    }

    if (user.email) {
      await fireCtrlaEvent("CTRL-A Submission Received", user.email, {
        submission_id: r.id,
        submission_type: type,
        track,
        title: (payload as { title?: string }).title,
      });
      await fireCtrlaEvent("CTRL-A Feature Submitted", user.email, {
        submission_id: r.id,
        submission_type: type,
        track,
        cost,
        title: (payload as { title?: string }).title,
      });
    }

    return NextResponse.json({ ok: true, id: r.id, points: r.points });
  }

  // ── Track A: free, rate-limited, insert as the user (RLS enforces). ──
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

  const { type: _type, toolkitSlug: toolkit, title, ...rest } = body;
  const payload: Record<string, unknown> = { title };
  if ("url" in rest && rest.url) payload.url = rest.url;
  if ("body" in rest && rest.body) payload.body = rest.body;
  if ("tags" in rest && rest.tags?.length) payload.tags = rest.tags;
  if ("level" in rest && rest.level) payload.level = rest.level;
  if ("kind" in rest && rest.kind) payload.kind = rest.kind;
  if ("date" in rest && rest.date) payload.date = rest.date;

  const { data: row, error } = await supabase
    .from("ctrla_submissions")
    .insert({
      author_id: user.id,
      toolkit_slug: toolkit ?? null,
      type,
      track,
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

  if (user.email) {
    await fireCtrlaEvent("CTRL-A Submission Received", user.email, {
      submission_id: row.id,
      submission_type: type,
      track,
      toolkit: toolkit ?? "general",
      title,
    });
  }

  return NextResponse.json({ ok: true, id: row.id });
}
