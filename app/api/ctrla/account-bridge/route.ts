// app/api/ctrla/account-bridge/route.ts
// ─────────────────────────────────────────────────────────────
// The rung 1 → rung 2 hinge, server side. When an authenticated user is
// seen (including someone who signed in with Google before ever giving us
// their email through a form), this sets the account_* profile properties
// on their Klaviyo profile and fires "CTRL-A Account Created" once, so the
// activation flow can run and segments know they have an account.
//
// List membership itself is handled by /api/klaviyo/subscribe (called from
// useLeadSync). This route is the reliable server backstop that makes a
// login-first lead a real, segmentable account profile. Best-effort: a
// Klaviyo hiccup never fails, and it no-ops without a private key.
//
// Dedupe is client-side (useLeadSync's localStorage key). Re-firing is low
// harm since Klaviyo activation flows trigger once per profile, but keep
// the client guard so we do not spam the event on every navigation.
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 15;

const REVISION = process.env.KLAVIYO_REVISION || "2024-10-15";

async function klaviyoAccountCreated(email: string, createdAtISO: string) {
  const key = process.env.KLAVIYO_PRIVATE_KEY;
  if (!key || !email) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    await fetch("https://a.klaviyo.com/api/events/", {
      method: "POST",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Authorization: `Klaviyo-API-Key ${key}`,
        revision: REVISION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "event",
          attributes: {
            properties: { source: "google-login" },
            metric: { data: { type: "metric", attributes: { name: "CTRL-A Account Created" } } },
            profile: {
              data: {
                type: "profile",
                attributes: {
                  email,
                  // Account properties for segmentation (members vs anonymous leads).
                  properties: {
                    account_created: true,
                    account_created_at: createdAtISO,
                    signup_source: "google-login",
                  },
                },
              },
            },
          },
        },
      }),
    });
  } catch {
    /* best-effort */
  } finally {
    clearTimeout(timer);
  }
}

export async function POST() {
  try {
    const supabase = createClient(await cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) {
      const createdAt = user.created_at || new Date().toISOString();
      await klaviyoAccountCreated(user.email, createdAt);
    }
  } catch {
    /* best-effort, never surfaced */
  }
  return NextResponse.json({ ok: true });
}
