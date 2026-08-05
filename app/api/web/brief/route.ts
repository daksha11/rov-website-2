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
import { leadRateLimit, rateLimitResponse } from "@/lib/rate-limit";

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
  // Required: the minimum we need to reply at all. Business name is optional
  // because the form asks for a URL first and most visitors have one; when it
  // is missing we derive a label from the domain.
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  businessName: z.string().trim().max(160).optional().or(z.literal("")),

  // "initial" is the gated submission that captures the lead. "details" is the
  // optional deepening they can fill in after, which arrives as a follow-up.
  stage: z.enum(["initial", "details"]).optional(),

  // What our own crawl found on their site, carried through from screen 1 so
  // the brief email shows what they were shown.
  siteTitle: short,
  siteFindings: tags,

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

// What to call this lead in the subject line and email header. The form leads
// with a URL rather than a business name, so fall back to the bare domain.
function briefLabel(b: Brief) {
  if (b.businessName && b.businessName.trim()) return b.businessName.trim();
  const site = b.website && b.website.trim();
  if (site) {
    const domain = site
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/[/?#].*$/, "")
      .trim();
    if (domain) return domain;
  }
  return b.name;
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
    `Business: ${briefLabel(b)}`,
    `Site title: ${val(b.siteTitle)}`,
    `What we found: ${list(b.siteFindings)}`,
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

// ── Email typography ────────────────────────────────────────────
// Norwige is served from the live site so mail clients that honor
// @font-face (Apple Mail, iOS Mail) render the real brand face. Gmail and
// Outlook strip @font-face, so every element also carries an inline stack:
// they fall back to italic Helvetica, which keeps the slanted display feel
// the brand leans on. Color and layout carry the identity everywhere else.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.rovstudios.com").replace(/\/$/, "");
const NORWIGE_DIR = `${SITE_URL}/font/norwige-font-family-1750004186-0`;

// Norwige only ships italic cuts, and the brand always sets it italic.
const DISPLAY = "'Norwige','Helvetica Neue',Helvetica,Arial,sans-serif";
const TEXT = "'Roboto','Helvetica Neue',Helvetica,Arial,sans-serif";

const FONT_STYLE = `
<style type="text/css">
@font-face{font-family:'Norwige';src:url('${NORWIGE_DIR}/Norwige-SemiBoldItalic-BF68175f326e730.otf') format('opentype');font-weight:600;font-style:italic;font-display:swap}
@font-face{font-family:'Norwige';src:url('${NORWIGE_DIR}/Norwige-ExtraBoldItalicItalic-BF68175f3224386.otf') format('opentype');font-weight:800;font-style:italic;font-display:swap}
@font-face{font-family:'Norwige';src:url('${NORWIGE_DIR}/Norwige-MediumItalic-BF68175f325d0c2.otf') format('opentype');font-weight:500;font-style:italic;font-display:swap}
body{margin:0;padding:0;background:#FFF4E3}
a{color:#90422C}
@media (max-width:620px){.brief-card{padding:22px !important}.brief-title{font-size:26px !important}}
</style>`;

function briefToHtml(b: Brief) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:7px 14px 7px 0;color:#8a8378;font-family:${TEXT};font-size:12px;line-height:1.5;vertical-align:top;white-space:nowrap">${esc(
      label
    )}</td><td style="padding:7px 0;color:#1c1512;font-family:${TEXT};font-size:14px;line-height:1.6">${esc(
      value
    ).replace(/\n/g, "<br>")}</td></tr>`;

  const group = (title: string, rows: string) =>
    `<h3 style="margin:28px 0 6px;font-family:${DISPLAY};font-style:italic;font-weight:600;font-size:15px;line-height:1;letter-spacing:.06em;color:#90422C">${title}</h3>
<div style="height:1px;background:#e7ddc9;margin-bottom:10px"></div>
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse">${rows}</table>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${FONT_STYLE}</head>
<body style="margin:0;padding:0;background:#FFF4E3">
<div style="background:#FFF4E3;padding:28px 20px">
<div class="brief-card" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e7ddc9;border-radius:14px;padding:30px">
<p style="margin:0 0 10px;font-family:${TEXT};font-size:11px;line-height:1;letter-spacing:.2em;text-transform:uppercase;color:#8a8378">Range of View Studios &middot; ${
    b.stage === "details" ? "Added detail on an existing brief" : "New website brief"
  }</p>
<h2 class="brief-title" style="margin:0;font-family:${DISPLAY};font-style:italic;font-weight:800;font-size:30px;line-height:1.2;color:#3B2114">${esc(
    briefLabel(b)
  )}</h2>
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
      row("Site title", val(b.siteTitle)) +
      row("What we found", list(b.siteFindings)) +
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
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:30px">
<tr><td style="padding-top:16px;border-top:1px solid #e7ddc9">
<a href="mailto:${esc(b.email)}" style="display:inline-block;background:#90422C;color:#FFF4E3;text-decoration:none;border-radius:999px;padding:12px 26px;font-family:${DISPLAY};font-style:italic;font-weight:600;font-size:14px;letter-spacing:.03em">Reply to ${esc(
      b.name.split(" ")[0] || "them"
    )}</a>
<p style="margin:14px 0 0;font-family:${TEXT};font-size:12px;line-height:1.5;color:#8a8378">Submitted from ${esc(
    val(b.page) === "—" ? "/web/brief" : (b.page as string)
  )}</p>
</td></tr></table>
</div></div></body></html>`;
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
      subject:
        brief.stage === "details"
          ? `Added detail: ${briefLabel(brief)}`
          : `Website brief: ${briefLabel(brief)}${brief.budget ? ` (${brief.budget})` : ""}`,
      text: briefToText(brief),
      html: briefToHtml(brief),
    }),
  });
  return res.ok;
}

export async function POST(req: NextRequest) {
  // Generous enough for the two legitimate posts one visitor makes here: the
  // gated brief, then the optional deepening afterwards.
  const limit = leadRateLimit(req, "web-brief");
  if (!limit.ok) return rateLimitResponse(limit);

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
