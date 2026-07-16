// app/api/ctrla/review/route.ts
// ─────────────────────────────────────────────────────────────
// Approve / feature / reject a CTRL-A community submission.
// Staff only: the session user must have role admin or engineer.
// The status flip runs through review_ctrla_submission() with the
// service role (regular users have no UPDATE grant at all), then
// the author gets the matching Klaviyo event so a flow can email
// them "you're in" or "not this time" with the review note.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/admin";
import { fireCtrlaEvent, type CtrlaEventName } from "@/lib/ctrla/klaviyo-events";
import { REWARDS } from "@/lib/credits/config";

// A review decision that pays the author credits, and how much.
const AWARD_FOR: Partial<Record<"approved" | "featured", "contribution-approved" | "contribution-featured">> = {
  approved: "contribution-approved",
  featured: "contribution-featured",
};

export const runtime = "nodejs";
export const maxDuration = 15;

const bodySchema = z.object({
  submissionId: z.string().uuid(),
  status: z.enum(["approved", "featured", "rejected"]),
  note: z.string().trim().max(500).optional(),
});

const EVENT_FOR: Record<string, CtrlaEventName> = {
  approved: "CTRL-A Submission Approved",
  featured: "CTRL-A Submission Featured",
  rejected: "CTRL-A Submission Rejected",
};

async function requireStaff() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, status: 401 as const };
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin" && me?.role !== "engineer") return { user: null, status: 403 as const };
  return { user, status: 200 as const };
}

// GET: the pending queue, oldest first, with author identity.
// Runs on the service role because regular RLS (rightly) hides
// other people's pending rows; the staff check above is the gate.
export async function GET() {
  const gate = await requireStaff();
  if (!gate.user) {
    return NextResponse.json({ ok: false }, { status: gate.status });
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const { data, error } = await admin
    .from("ctrla_submissions")
    .select("id, toolkit_slug, type, track, credit_cost, media, status, payload, created_at, profiles!ctrla_submissions_author_id_fkey(full_name, handle, email)")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("ctrla queue read error:", error.message);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  // Sign media so the reviewer can actually see a feature's gallery. The
  // bucket is private; signed URLs are short-lived and staff-only here.
  const rows = (data ?? []) as Array<{ media?: { path: string; kind: string }[] | null; [k: string]: unknown }>;
  await Promise.all(
    rows.map(async (row) => {
      if (Array.isArray(row.media) && row.media.length) {
        row.media = await Promise.all(
          row.media.map(async (m) => {
            const { data: signed } = await admin.storage.from("ctrla-submissions").createSignedUrl(m.path, 3600);
            return { ...m, url: signed?.signedUrl ?? null };
          }),
        );
      }
    }),
  );

  return NextResponse.json({ ok: true, queue: rows });
}

export async function POST(req: NextRequest) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const gate = await requireStaff();
  if (!gate.user) {
    return NextResponse.json({ ok: false }, { status: gate.status });
  }
  const user = gate.user;

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const { data, error } = await admin.rpc("review_ctrla_submission", {
    p_submission_id: body.submissionId,
    p_status: body.status,
    p_reviewer_id: user.id,
    p_note: body.note ?? null,
  });
  if (error) {
    console.error("review_ctrla_submission error:", error.message);
    return NextResponse.json({ ok: false, error: "Review failed." }, { status: 502 });
  }
  const r = data as { success: boolean; code?: string };
  if (!r.success) {
    return NextResponse.json({ ok: false, code: r.code }, { status: 404 });
  }

  // Tell the author (best-effort). Service client reads their email + id.
  const { data: sub } = await admin
    .from("ctrla_submissions")
    .select("author_id, type, toolkit_slug, payload, profiles!ctrla_submissions_author_id_fkey(email)")
    .eq("id", body.submissionId)
    .single();
  const authorEmail = (sub?.profiles as { email?: string } | null)?.email;

  // Pay the author for a good outcome. Deduped per submission+status so a
  // re-review (or approve-then-feature) never double-pays for the same rung.
  const awardAction = AWARD_FOR[body.status as "approved" | "featured"];
  if (awardAction && sub?.author_id) {
    const { error: awardErr } = await admin.rpc("award_credits", {
      p_user_id: sub.author_id,
      p_action: awardAction,
      p_amount: REWARDS[awardAction].points,
      p_dedupe_key: `submission:${body.submissionId}:${body.status}`,
      p_meta: { submission_id: body.submissionId },
    });
    if (awardErr) console.error("contribution award error:", awardErr.message);
    if (authorEmail) {
      await fireCtrlaEvent("CTRL-A Credits Earned", authorEmail, {
        action: awardAction,
        awarded: REWARDS[awardAction].points,
        submission_id: body.submissionId,
      });
    }
  }

  if (authorEmail) {
    await fireCtrlaEvent(EVENT_FOR[body.status], authorEmail, {
      submission_id: body.submissionId,
      submission_type: sub?.type,
      toolkit: sub?.toolkit_slug ?? "general",
      title: (sub?.payload as { title?: string } | null)?.title,
      review_note: body.note ?? "",
    });
  }

  return NextResponse.json({ ok: true, status: body.status });
}
