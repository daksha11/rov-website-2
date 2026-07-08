// app/api/klaviyo/subscribe/route.ts
// ─────────────────────────────────────────────────────────────
// CTRL-A email signup → Klaviyo.
//
// Two paths, picked automatically at runtime:
//   1. SERVER  (preferred) — if KLAVIYO_PRIVATE_KEY is set, we call
//      Klaviyo's server Subscribe-Profiles bulk job. The private key
//      never leaves the server, and this honors the list's opt-in
//      settings (single or double). Extra profile attributes (name,
//      source) ride along on the same call.
//   2. CLIENT  (fallback) — if there is no private key but we do have
//      a list id, we call Klaviyo's public Client Subscriptions API
//      using only the public company id (safe to expose). This lets
//      the form work in production before a private key is provisioned.
//
// Both require a KLAVIYO_LIST_ID (the audience the signup joins).
// If neither a private key nor a list id is configured, we return a
// clear 503 so the form surfaces an honest error instead of pretending.
//
// Env:
//   KLAVIYO_PRIVATE_KEY          pk_live_...   (optional, server path)
//   KLAVIYO_LIST_ID              XXXXXX        (required to subscribe)
//   NEXT_PUBLIC_KLAVIYO_COMPANY_ID  U3jthw     (optional, public id;
//                                               defaults to the site's)
//   KLAVIYO_REVISION             2024-10-15    (optional, API version)
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 15;

const DEFAULT_COMPANY_ID = "U3jthw"; // public onsite id, already on the site
const DEFAULT_REVISION = "2024-10-15";

const PRIVATE_KEY = process.env.KLAVIYO_PRIVATE_KEY;
const COMPANY_ID = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID || DEFAULT_COMPANY_ID;
const REVISION = process.env.KLAVIYO_REVISION || DEFAULT_REVISION;

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

function splitName(name?: string): { first_name?: string; last_name?: string } {
  const n = (name || "").trim();
  if (!n) return {};
  const parts = n.split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0] };
  return { first_name: parts.slice(0, -1).join(" "), last_name: parts[parts.length - 1] };
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

// ── Best-effort profile upsert (private key). Carries the fields the
// subscribe job will not accept: name and source properties. Create-or-
// update, so it is safe on repeat signups. Never fatal to the signup. ──
async function upsertProfileServer(email: string, name?: string, source?: string) {
  const attributes: Record<string, unknown> = { email, ...splitName(name) };
  if (source) attributes.properties = { ctrla_source: source, signup_source: source };
  // Nothing worth sending beyond the email itself.
  if (!name && !source) return;

  try {
    const res = await timedFetch("https://a.klaviyo.com/api/profile-import/", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${PRIVATE_KEY}`,
        revision: REVISION,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ data: { type: "profile", attributes } }),
    });
    if (!res.ok && res.status !== 409) {
      const text = await res.text().catch(() => "");
      console.error(`Klaviyo profile upsert non-fatal (${res.status}):`, text.slice(0, 300));
    }
  } catch (err) {
    console.error("Klaviyo profile upsert non-fatal exception:", err instanceof Error ? err.message : "unknown");
  }
}

// ── Preferred: server-side subscribe with the private key. The subscribe
// job accepts only email + subscriptions on the profile, so enrichment
// (name, source) happens in upsertProfileServer above. ──
async function subscribeServer(listId: string, email: string, name?: string, source?: string) {
  await upsertProfileServer(email, name, source);

  const payload = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        profiles: {
          data: [
            {
              type: "profile",
              attributes: {
                email,
                subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
              },
            },
          ],
        },
        historical_import: false,
      },
      relationships: { list: { data: { type: "list", id: listId } } },
    },
  };

  const res = await timedFetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${PRIVATE_KEY}`,
      revision: REVISION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res;
}

// ── Fallback: public Client Subscriptions API (company id only) ──
async function subscribeClient(listId: string, email: string, name?: string, source?: string) {
  const profileAttributes: Record<string, unknown> = {
    email,
    ...splitName(name),
  };
  if (source) profileAttributes.properties = { ctrla_source: source, signup_source: source };

  const payload = {
    data: {
      type: "subscription",
      attributes: {
        profile: { data: { type: "profile", attributes: profileAttributes } },
      },
      relationships: { list: { data: { type: "list", id: listId } } },
    },
  };

  const res = await timedFetch(
    `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(COMPANY_ID)}`,
    {
      method: "POST",
      headers: {
        revision: REVISION,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  return res;
}

export async function POST(req: NextRequest) {
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

  const useServer = !!PRIVATE_KEY && !!listId;
  const useClient = !PRIVATE_KEY && !!listId;

  if (!useServer && !useClient) {
    console.error(
      "Klaviyo signup not configured: set KLAVIYO_LIST_ID (and optionally KLAVIYO_PRIVATE_KEY)."
    );
    return NextResponse.json(
      { ok: false, code: "not_configured", error: "Signup is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const res = useServer
      ? await subscribeServer(listId as string, email, name || undefined, source)
      : await subscribeClient(listId as string, email, name || undefined, source);

    // Klaviyo returns 202 Accepted on success for both endpoints.
    if (res.status === 202 || res.ok) {
      return NextResponse.json({ ok: true });
    }

    const text = await res.text().catch(() => "");
    console.error(`Klaviyo subscribe failed (${res.status}):`, text.slice(0, 500));

    // 4xx that is not our fault (e.g. bad list id) should not look like a
    // user error; give a friendly retry message but log the detail.
    return NextResponse.json(
      { ok: false, error: "We could not add you right now. Please try again in a moment." },
      { status: 502 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Klaviyo subscribe exception:", msg);
    const isTimeout = msg.toLowerCase().includes("abort");
    return NextResponse.json(
      { ok: false, error: isTimeout ? "That took too long. Please try again." : "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
