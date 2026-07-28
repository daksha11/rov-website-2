// app/api/leads/route.ts
// ─────────────────────────────────────────────────────────────
// Shared lead capture for the whole site. Every form posts here with a
// `source` tag (e.g. "blog:restaurant-atlanta", "services:web",
// "gallery:bando") so one inbox tells you where each lead came from and
// what they were looking at when they reached out.
//
// Delivery is env-driven, mirroring app/api/industries/lead/route.ts:
//   1. LEAD_WEBHOOK_URL  — if set, POST the lead JSON to it.
//   2. RESEND_API_KEY    — else, if set, email via Resend to LEAD_TO_EMAIL.
//   3. neither set        — 503 { ok:false, code:"not_configured" }.
//
// Env (shared with the industries lead route):
//   LEAD_WEBHOOK_URL     https://...                (optional)
//   RESEND_API_KEY       re_...                     (optional)
//   LEAD_TO_EMAIL        you@example.com            (optional; default below)
//   LEAD_FROM_EMAIL      onboarding@resend.dev      (optional; Resend path)
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToKlaviyo } from "@/utils/klaviyo";

export const runtime = "nodejs";
export const maxDuration = 15;

const DEFAULT_TO_EMAIL = "rangeofviewmusic@gmail.com";
// Every website form lead is also added to the Klaviyo "ROV web leads" list,
// kept separate from card-collected leads. Override with KLAVIYO_LEADS_LIST_ID.
const LEADS_LIST_ID = process.env.KLAVIYO_LEADS_LIST_ID || "WGRd8Q";
// Resend refuses senders on unverified domains. Until rovstudios.com is
// verified in Resend, send from their sandbox address; override with
// LEAD_FROM_EMAIL once the domain is verified.
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().max(800).optional().or(z.literal("")),
  // Where the lead came from — set by the form, never typed by the visitor.
  source: z.string().trim().min(1).max(120),
  // Full pathname for extra context (optional).
  page: z.string().trim().max(300).optional().or(z.literal("")),
  // Honeypot — real users never fill this. Bots do.
  company: z.string().max(0).optional(),
});

type Lead = z.infer<typeof bodySchema>;

async function timedFetch(url: string, init: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(id);
  }
}

async function deliverWebhook(url: string, lead: Lead) {
  const res = await timedFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "site-lead", ...lead }),
  });
  return res.ok;
}

async function deliverResend(apiKey: string, lead: Lead) {
  const to = process.env.LEAD_TO_EMAIL || DEFAULT_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  const lines = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Source: ${lead.source}`,
    `Page: ${lead.page || "n/a"}`,
    "",
    "What they're working on:",
    lead.message || "(none)",
  ].join("\n");

  const res = await timedFetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `New lead [${lead.source}]: ${lead.name}`,
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

  const lead = parsed.data;

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!webhookUrl && !resendKey) {
    console.error("Leads route not configured: set LEAD_WEBHOOK_URL or RESEND_API_KEY.");
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        error: "This form isn't wired up yet. Please email us directly.",
      },
      { status: 503 }
    );
  }

  // Add the lead to the Klaviyo business-leads list in parallel with the email.
  // Non-fatal: subscribeToKlaviyo never throws, and the email is the primary
  // delivery, so a Klaviyo hiccup must not fail the submission.
  const klaviyoPromise = subscribeToKlaviyo({
    listId: LEADS_LIST_ID,
    email: lead.email,
    name: lead.name,
    source: lead.source,
  });

  try {
    const delivered = webhookUrl
      ? await deliverWebhook(webhookUrl, lead)
      : await deliverResend(resendKey as string, lead);

    await klaviyoPromise; // best-effort; result logged inside the helper

    if (delivered) return NextResponse.json({ ok: true });

    console.error("Lead delivery failed (non-2xx from provider).");
    return NextResponse.json(
      { ok: false, error: "We could not send that right now. Please try again in a moment." },
      { status: 502 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Lead exception:", msg);
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
