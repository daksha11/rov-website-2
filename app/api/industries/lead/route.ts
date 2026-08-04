// app/api/industries/lead/route.ts
// ─────────────────────────────────────────────────────────────
// Lead capture for the /industries/[slug] ICP landing pages.
//
// Delivery is env-driven, so the provider choice (Resend, an n8n
// webhook, SMTP, ...) is a config change, not a code change:
//   1. LEAD_WEBHOOK_URL  — if set, POST the lead JSON to it.
//   2. RESEND_API_KEY    — else, if set, email the lead via Resend
//      to LEAD_TO_EMAIL (default admin@pursuenetworking.com).
//   3. neither set        — 503 { ok:false, code:"not_configured" }
//      so the form is testable before wiring, and surfaces an honest
//      error instead of pretending to have captured the lead.
//
// Separately and always: the lead is added to the Klaviyo "ROV web leads" list,
// the same one app/api/leads and app/api/web/brief use. Best-effort, never
// blocks or fails the submission.
//
// Env:
//   LEAD_WEBHOOK_URL       https://...           (optional)
//   RESEND_API_KEY         re_...                (optional)
//   LEAD_TO_EMAIL          you@example.com       (optional; default below)
//   LEAD_FROM_EMAIL        leads@rovstudios.com  (optional; Resend path)
//   KLAVIYO_PRIVATE_KEY    pk_...                (required for the list add)
//   KLAVIYO_LEADS_LIST_ID  XXXXXX                (optional; defaults to WGRd8Q)
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToKlaviyo } from "@/utils/klaviyo";

export const runtime = "nodejs";
export const maxDuration = 15;

const DEFAULT_TO_EMAIL = "admin@pursuenetworking.com";
const DEFAULT_FROM_EMAIL = "leads@rovstudios.com";

// Same "ROV web leads" list the other business forms use, so every B2B lead
// lands in one place regardless of which page captured it. Matches
// app/api/leads/route.ts. Override with KLAVIYO_LEADS_LIST_ID.
const LEADS_LIST_ID = process.env.KLAVIYO_LEADS_LIST_ID || "WGRd8Q";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  business: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(500).optional().or(z.literal("")),
  icpSlug: z.string().trim().max(80).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  // Honeypot — real users never fill this. Bots do.
  company: z.string().max(0).optional(),
});

type Lead = z.infer<typeof bodySchema>;

async function timedFetch(url: string, init: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(id);
  }
}

async function deliverWebhook(url: string, lead: Lead) {
  const res = await timedFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "industries-lead", ...lead }),
  });
  return res.ok;
}

async function deliverResend(apiKey: string, lead: Lead) {
  const to = process.env.LEAD_TO_EMAIL || DEFAULT_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  const lines = [
    `Name: ${lead.name}`,
    `Business: ${lead.business}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "—"}`,
    `ICP page: ${lead.icpSlug || "—"}`,
    `UTM: ${lead.utmSource || "—"} / ${lead.utmMedium || "—"} / ${lead.utmCampaign || "—"}`,
    "",
    "What they need:",
    lead.message || "(none)",
  ].join("\n");

  const res = await timedFetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `New lead${lead.icpSlug ? ` (${lead.icpSlug})` : ""}: ${lead.business}`,
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
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  if (!parsed.success) {
    // Honeypot trip (company field non-empty) → answer OK, do nothing, so
    // bots get no signal.
    const honeypotTripped = parsed.error.issues.some(
      (i) => i.path[0] === "company"
    );
    if (honeypotTripped) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, business, and a valid email." },
      { status: 400 }
    );
  }

  const lead = parsed.data;

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!webhookUrl && !resendKey) {
    console.error(
      "Industries lead route not configured: set LEAD_WEBHOOK_URL or RESEND_API_KEY."
    );
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        error: "Lead capture is not configured yet. Please email us directly.",
      },
      { status: 503 }
    );
  }

  // Add to the Klaviyo business-leads list alongside the email. Non-fatal:
  // subscribeToKlaviyo never throws and the email is the primary delivery, so a
  // Klaviyo hiccup must not fail the submission.
  const klaviyoPromise = subscribeToKlaviyo({
    listId: LEADS_LIST_ID,
    email: lead.email,
    name: lead.name,
    source: `industries:${lead.icpSlug || "unknown"}`,
  });

  try {
    const delivered = webhookUrl
      ? await deliverWebhook(webhookUrl, lead)
      : await deliverResend(resendKey as string, lead);

    await klaviyoPromise; // best-effort; result logged inside the helper

    if (delivered) return NextResponse.json({ ok: true });

    console.error("Industries lead delivery failed (non-2xx from provider).");
    return NextResponse.json(
      {
        ok: false,
        error: "We could not send that right now. Please try again in a moment.",
      },
      { status: 502 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Industries lead exception:", msg);
    const isTimeout = msg.toLowerCase().includes("abort");
    return NextResponse.json(
      {
        ok: false,
        error: isTimeout
          ? "That took too long. Please try again."
          : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
