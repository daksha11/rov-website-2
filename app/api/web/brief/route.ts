// app/api/web/brief/route.ts
// ─────────────────────────────────────────────────────────────
// Project brief capture for /web/brief. This is the long-form intake: enough
// answers to understand the vision and build a real demo without a discovery
// call first. Everything past name/email/business is optional so a half-filled
// brief still reaches the inbox.
//
// Delivery is env-driven, mirroring app/api/leads/route.ts:
//   1. LEAD_WEBHOOK_URL  — if set, POST the brief JSON to it.
//   2. RESEND_API_KEY    — else, if set, email via Resend to BRIEF_TO_EMAIL.
//   3. neither set        — 503 { ok:false, code:"not_configured" }.
//
// Env (shared with the site lead route unless noted):
//   LEAD_WEBHOOK_URL     https://...                (optional)
//   RESEND_API_KEY       re_...                     (optional)
//   BRIEF_TO_EMAIL       you@example.com            (optional; falls back to LEAD_TO_EMAIL)
//   LEAD_FROM_EMAIL      onboarding@resend.dev      (optional; Resend path)
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToKlaviyo } from "@/utils/klaviyo";

export const runtime = "nodejs";
export const maxDuration = 15;

const DEFAULT_TO_EMAIL = "rangeofviewmusic@gmail.com";
// Briefs join the same Klaviyo web-leads list as every other site form.
const LEADS_LIST_ID = process.env.KLAVIYO_LEADS_LIST_ID || "WGRd8Q";
// Resend refuses senders on unverified domains. Until rovstudios.com is
// verified in Resend, send from their sandbox address.
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";

const short = z.string().trim().max(160).optional().or(z.literal(""));
const long = z.string().trim().max(1500).optional().or(z.literal(""));
const tags = z.array(z.string().trim().max(80)).max(30).optional();

const bodySchema = z.object({
  // Required: the minimum we need to reply at all.
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  businessName: z.string().trim().min(1).max(160),

  // 1. Business
  website: short,
  industry: short,
  location: short,

  // 2. Goals
  goal: short,
  successMetric: long,
  audience: long,

  // 3. Scope
  projectType: short,
  pages: tags,
  features: tags,

  // 4. Vision and taste
  references: long,
  likes: long,
  vibe: tags,
  colors: short,
  avoid: long,

  // 5. Content and logistics
  brandAssets: short,
  media: short,
  copyStatus: short,
  timeline: short,
  budget: short,

  // 6. Contact
  phone: short,
  contactPref: short,
  notes: long,
  page: z.string().trim().max(300).optional().or(z.literal("")),

  // Honeypot — real users never fill this. Bots do.
  company: z.string().max(0).optional(),
});

type Brief = z.infer<typeof bodySchema>;

function list(values?: string[]) {
  return values && values.length ? values.join(", ") : "—";
}

function val(v?: string) {
  return v && v.trim() ? v.trim() : "—";
}

function briefToText(b: Brief) {
  return [
    `WHO`,
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    `Phone: ${val(b.phone)}`,
    `Prefers: ${val(b.contactPref)}`,
    "",
    `BUSINESS`,
    `Business: ${b.businessName}`,
    `Current site: ${val(b.website)}`,
    `Industry: ${val(b.industry)}`,
    `Location / service area: ${val(b.location)}`,
    "",
    `GOALS`,
    `Primary goal: ${val(b.goal)}`,
    `What success looks like: ${val(b.successMetric)}`,
    `Who it is for: ${val(b.audience)}`,
    "",
    `SCOPE`,
    `Project type: ${val(b.projectType)}`,
    `Pages: ${list(b.pages)}`,
    `Features: ${list(b.features)}`,
    "",
    `VISION`,
    `Reference sites: ${val(b.references)}`,
    `What they like about them: ${val(b.likes)}`,
    `Feel: ${list(b.vibe)}`,
    `Colors: ${val(b.colors)}`,
    `Avoid: ${val(b.avoid)}`,
    "",
    `READINESS`,
    `Brand assets: ${val(b.brandAssets)}`,
    `Photos / video: ${val(b.media)}`,
    `Copy: ${val(b.copyStatus)}`,
    `Timeline: ${val(b.timeline)}`,
    `Budget: ${val(b.budget)}`,
    "",
    `NOTES`,
    val(b.notes),
    "",
    `Submitted from: ${val(b.page) === "—" ? "/web/brief" : b.page}`,
  ].join("\n");
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function briefToHtml(b: Brief) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#8a8378;font:12px/1.5 Helvetica,Arial,sans-serif;vertical-align:top;white-space:nowrap">${esc(
      label
    )}</td><td style="padding:6px 0;color:#1c1512;font:14px/1.6 Helvetica,Arial,sans-serif">${esc(
      value
    ).replace(/\n/g, "<br>")}</td></tr>`;

  const group = (title: string, rows: string) =>
    `<h3 style="margin:26px 0 8px;font:600 12px/1 Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#90422C">${title}</h3><table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${rows}</table>`;

  return `<div style="background:#FFF4E3;padding:28px">
<div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e7ddc9;border-radius:14px;padding:28px">
<p style="margin:0 0 4px;font:600 12px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#8a8378">New website brief</p>
<h2 style="margin:0;font:700 24px/1.25 Georgia,serif;color:#3B2114">${esc(b.businessName)}</h2>
${group(
    "Who",
    row("Name", b.name) +
      row("Email", b.email) +
      row("Phone", val(b.phone)) +
      row("Prefers", val(b.contactPref))
  )}
${group(
    "Business",
    row("Current site", val(b.website)) +
      row("Industry", val(b.industry)) +
      row("Location", val(b.location))
  )}
${group(
    "Goals",
    row("Primary goal", val(b.goal)) +
      row("Success looks like", val(b.successMetric)) +
      row("Audience", val(b.audience))
  )}
${group(
    "Scope",
    row("Project type", val(b.projectType)) +
      row("Pages", list(b.pages)) +
      row("Features", list(b.features))
  )}
${group(
    "Vision",
    row("References", val(b.references)) +
      row("What they like", val(b.likes)) +
      row("Feel", list(b.vibe)) +
      row("Colors", val(b.colors)) +
      row("Avoid", val(b.avoid))
  )}
${group(
    "Readiness",
    row("Brand assets", val(b.brandAssets)) +
      row("Photos / video", val(b.media)) +
      row("Copy", val(b.copyStatus)) +
      row("Timeline", val(b.timeline)) +
      row("Budget", val(b.budget))
  )}
${group("Notes", row("Anything else", val(b.notes)))}
<p style="margin:26px 0 0;font:12px/1.5 Helvetica,Arial,sans-serif;color:#8a8378">Submitted from ${esc(
    val(b.page) === "—" ? "/web/brief" : (b.page as string)
  )}</p>
</div></div>`;
}

async function timedFetch(url: string, init: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(id);
  }
}

async function deliverWebhook(url: string, brief: Brief) {
  const res = await timedFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "web-brief", ...brief }),
  });
  return res.ok;
}

async function deliverResend(apiKey: string, brief: Brief) {
  const to = process.env.BRIEF_TO_EMAIL || process.env.LEAD_TO_EMAIL || DEFAULT_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  const res = await timedFetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: brief.email,
      subject: `Website brief: ${brief.businessName}${brief.budget ? ` (${brief.budget})` : ""}`,
      text: briefToText(brief),
      html: briefToHtml(brief),
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
      { ok: false, error: "Please fill in your name, business, and a valid email." },
      { status: 400 }
    );
  }

  const brief = parsed.data;

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!webhookUrl && !resendKey) {
    console.error("Brief route not configured: set LEAD_WEBHOOK_URL or RESEND_API_KEY.");
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        error: "This form isn't wired up yet. Please email us directly.",
      },
      { status: 503 }
    );
  }

  // Best-effort list add, same pattern as the shared lead route: never fatal.
  const klaviyoPromise = subscribeToKlaviyo({
    listId: LEADS_LIST_ID,
    email: brief.email,
    name: brief.name,
    source: "web:brief",
  });

  try {
    const delivered = webhookUrl
      ? await deliverWebhook(webhookUrl, brief)
      : await deliverResend(resendKey as string, brief);

    await klaviyoPromise;

    if (delivered) return NextResponse.json({ ok: true });

    console.error("Brief delivery failed (non-2xx from provider).");
    return NextResponse.json(
      { ok: false, error: "We could not send that right now. Please try again in a moment." },
      { status: 502 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Brief exception:", msg);
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
