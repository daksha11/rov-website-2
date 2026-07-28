// utils/klaviyo.ts
// ─────────────────────────────────────────────────────────────
// Shared Klaviyo subscribe helper, used by both the CTRL-A signup route
// (app/api/klaviyo/subscribe) and the site lead route (app/api/leads).
//
// Two paths, picked at runtime:
//   1. SERVER  — if KLAVIYO_PRIVATE_KEY is set, use the server Subscribe
//      job (honors the list's opt-in settings). Name/source enrichment
//      rides along via a best-effort profile upsert first.
//   2. CLIENT  — otherwise, use the public Client Subscriptions API with
//      only the public company id (safe to expose), so forms work before
//      a private key is provisioned.
//
// Env:
//   KLAVIYO_PRIVATE_KEY             pk_live_...   (optional, server path)
//   NEXT_PUBLIC_KLAVIYO_COMPANY_ID  U3jthw        (optional public id)
//   KLAVIYO_REVISION               2024-10-15     (optional API version)
// ─────────────────────────────────────────────────────────────

const DEFAULT_COMPANY_ID = "U3jthw"; // public onsite id, already on the site
const DEFAULT_REVISION = "2024-10-15";

const PRIVATE_KEY = process.env.KLAVIYO_PRIVATE_KEY;
const COMPANY_ID = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID || DEFAULT_COMPANY_ID;
const REVISION = process.env.KLAVIYO_REVISION || DEFAULT_REVISION;

export type KlaviyoSubscribeInput = {
  listId: string;
  email: string;
  name?: string;
  source?: string;
};

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

// Best-effort profile upsert (private key path). Carries name + source, which
// the subscribe job itself will not accept. Never fatal to the subscribe.
async function upsertProfileServer(email: string, name?: string, source?: string) {
  if (!name && !source) return;
  const attributes: Record<string, unknown> = { email, ...splitName(name) };
  if (source) attributes.properties = { signup_source: source };

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

async function subscribeServer({ listId, email, name, source }: KlaviyoSubscribeInput) {
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

  return timedFetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${PRIVATE_KEY}`,
      revision: REVISION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function subscribeClient({ listId, email, name, source }: KlaviyoSubscribeInput) {
  const profileAttributes: Record<string, unknown> = { email, ...splitName(name) };
  if (source) profileAttributes.properties = { signup_source: source };

  const payload = {
    data: {
      type: "subscription",
      attributes: { profile: { data: { type: "profile", attributes: profileAttributes } } },
      relationships: { list: { data: { type: "list", id: listId } } },
    },
  };

  return timedFetch(
    `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(COMPANY_ID)}`,
    {
      method: "POST",
      headers: { revision: REVISION, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }
  );
}

// Returns true on success (202/2xx). Never throws — callers can treat a false
// return as "not added" without try/catch.
export async function subscribeToKlaviyo(input: KlaviyoSubscribeInput): Promise<boolean> {
  if (!input.listId) return false;
  const useServer = !!PRIVATE_KEY;
  try {
    const res = useServer ? await subscribeServer(input) : await subscribeClient(input);
    if (res.status === 202 || res.ok) return true;
    const text = await res.text().catch(() => "");
    console.error(`Klaviyo subscribe failed (${res.status}):`, text.slice(0, 500));
    return false;
  } catch (err) {
    console.error("Klaviyo subscribe exception:", err instanceof Error ? err.message : "unknown");
    return false;
  }
}
