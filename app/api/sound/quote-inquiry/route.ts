// app/api/sound/quote-inquiry/route.ts
// ─────────────────────────────────────────────────────────────
// Inquiry capture for the rovmusic quote questionnaire. Pricing beyond the flat
// intro/recording rates is consultative, so the questionnaire ends by emailing
// you the visitor's needs + our ballpark estimate here (or booking a call).
//
// Delivery is env-driven, mirroring app/api/industries/lead/route.ts:
//   1. SUB_WEBHOOK_URL   — if set, POST the inquiry JSON to it.
//   2. RESEND_API_KEY    — else, if set, email via Resend to SUB_TO_EMAIL
//      (default stems@rovstudios.com).
//   3. neither set        — 503 { ok:false, code:"not_configured" } so the
//      form is testable before wiring and fails honestly.
//
// Env:
//   SUB_WEBHOOK_URL   https://...            (optional)
//   RESEND_API_KEY    re_...                 (optional; shared with lead route)
//   SUB_TO_EMAIL      you@example.com        (optional; default below)
//   SUB_FROM_EMAIL    plans@rovstudios.com   (optional; Resend path)
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 15;

const DEFAULT_TO_EMAIL = "stems@rovstudios.com";
const DEFAULT_FROM_EMAIL = "plans@rovstudios.com";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  // Questionnaire context (all optional so the form still works if answers are skipped).
  need: z.string().trim().max(80).optional().or(z.literal("")),
  songs: z.string().trim().max(40).optional().or(z.literal("")),
  extras: z.string().trim().max(200).optional().or(z.literal("")),
  cadence: z.string().trim().max(40).optional().or(z.literal("")),
  estimate: z.string().trim().max(120).optional().or(z.literal("")),
  links: z.string().trim().max(500).optional().or(z.literal("")),
  message: z.string().trim().max(800).optional().or(z.literal("")),
  // Honeypot — real users never fill this. Bots do.
  company: z.string().max(0).optional(),
});

type Inquiry = z.infer<typeof bodySchema>;

async function timedFetch(url: string, init: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(id);
  }
}

async function deliverWebhook(url: string, inquiry: Inquiry) {
  const res = await timedFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "quote-inquiry", ...inquiry }),
  });
  return res.ok;
}

async function deliverResend(apiKey: string, inquiry: Inquiry) {
  const to = process.env.SUB_TO_EMAIL || DEFAULT_TO_EMAIL;
  const from = process.env.SUB_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  const lines = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    "",
    `Needs: ${inquiry.need || "—"}`,
    `Songs: ${inquiry.songs || "—"}`,
    `Extras: ${inquiry.extras || "—"}`,
    `Cadence: ${inquiry.cadence || "—"}`,
    `Our estimate: ${inquiry.estimate || "—"}`,
    `Links: ${inquiry.links || "—"}`,
    "",
    "Notes:",
    inquiry.message || "(none)",
  ].join("\n");

  const res = await timedFetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.email,
      subject: `New quote request: ${inquiry.name}${inquiry.need ? ` (${inquiry.need})` : ""}`,
      text: lines,
    }),
  });
  return res.ok;
}

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!parsed.success) {
    // Honeypot trip (company field non-empty) → answer OK, do nothing.
    const honeypotTripped = parsed.error.issues.some((i) => i.path[0] === "company");
    if (honeypotTripped) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { ok: false, error: "Please fill in your name and a valid email." },
      { status: 400 }
    );
  }

  const inquiry = parsed.data;

  const webhookUrl = process.env.SUB_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!webhookUrl && !resendKey) {
    console.error("Quote inquiry route not configured: set SUB_WEBHOOK_URL or RESEND_API_KEY.");
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        error: "Inquiries aren't wired up yet. Please email stems@rovstudios.com directly.",
      },
      { status: 503 }
    );
  }

  try {
    const delivered = webhookUrl
      ? await deliverWebhook(webhookUrl, inquiry)
      : await deliverResend(resendKey as string, inquiry);

    if (delivered) return NextResponse.json({ ok: true });

    console.error("Quote inquiry delivery failed (non-2xx from provider).");
    return NextResponse.json(
      { ok: false, error: "We could not send that right now. Please try again in a moment." },
      { status: 502 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Quote inquiry exception:", msg);
    const isTimeout = msg.toLowerCase().includes("abort");
    return NextResponse.json(
      {
        ok: false,
        error: isTimeout ? "That took too long. Please try again." : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
