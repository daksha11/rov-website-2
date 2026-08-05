// app/api/klaviyo/subscribe/route.ts
// ─────────────────────────────────────────────────────────────
// CTRL-A email signup → Klaviyo.
//
// The subscribe logic (server key path + public client fallback) lives in
// utils/klaviyo.ts and is shared with the site lead route (app/api/leads).
// This route just validates the signup, resolves the list, and reports a
// clean result.
//
// Requires a list: KLAVIYO_LIST_ID (or a per-request listId override). If no
// list is configured we return a clear 503 instead of pretending to subscribe.
//
// Env:
//   KLAVIYO_PRIVATE_KEY             pk_live_...   (optional, server path)
//   KLAVIYO_LIST_ID                 XXXXXX        (required to subscribe)
//   NEXT_PUBLIC_KLAVIYO_COMPANY_ID  U3jthw        (optional public id)
//   KLAVIYO_REVISION               2024-10-15     (optional API version)
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToKlaviyo } from "@/utils/klaviyo";
import { leadRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 15;

const bodySchema = z.object({
  email: z.string().trim().email().max(254),
  // Optional extras for segmentation. Name split is best-effort.
  name: z.string().trim().max(120).optional().or(z.literal("")),
  source: z.string().trim().max(80).optional(),
  // Optional per-form list override; otherwise the env default is used.
  listId: z.string().trim().max(20).optional(),
  // Honeypot — real users never fill this. Bots do.
  company: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  // Generous on purpose: this route serves the /card QR flow, where a whole
  // room of people scanning at an event shares one wifi IP. A list add is also
  // cheap to undo, unlike a lost handshake.
  const limit = leadRateLimit(req, "klaviyo-subscribe", 25);
  if (!limit.ok) return rateLimitResponse(limit);

  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!parsed.success) {
    // Honeypot trip (company field non-empty) lands here too; answer OK so
    // bots get no signal, but do not actually call Klaviyo.
    const honeypotTripped = parsed.error.issues.some((i) => i.path[0] === "company");
    if (honeypotTripped) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const { email, name, source } = parsed.data;
  const listId = parsed.data.listId || process.env.KLAVIYO_LIST_ID;

  if (!listId) {
    console.error("Klaviyo signup not configured: set KLAVIYO_LIST_ID.");
    return NextResponse.json(
      { ok: false, code: "not_configured", error: "Signup is not configured yet." },
      { status: 503 }
    );
  }

  // Preserve the ctrla_source property that existing Klaviyo segments may key on.
  const properties = source ? { ctrla_source: source } : undefined;

  const ok = await subscribeToKlaviyo({ listId, email, name: name || undefined, source, properties });
  if (ok) return NextResponse.json({ ok: true });

  return NextResponse.json(
    { ok: false, error: "We could not add you right now. Please try again in a moment." },
    { status: 502 }
  );
}
