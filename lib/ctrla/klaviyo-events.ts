// lib/ctrla/klaviyo-events.ts
// ─────────────────────────────────────────────────────────────
// Fire a Klaviyo event for the CTRL-A community loop (submission
// received / approved / featured / rejected). Events power the
// flows; the subscribe endpoint handles list membership.
//
// Strictly best-effort: never throws, never blocks the submission.
// Silently no-ops when KLAVIYO_PRIVATE_KEY is not configured.
// ─────────────────────────────────────────────────────────────

const REVISION = process.env.KLAVIYO_REVISION || "2024-10-15";

export type CtrlaEventName =
  | "CTRL-A Submission Received"
  | "CTRL-A Submission Approved"
  | "CTRL-A Submission Featured"
  | "CTRL-A Submission Rejected";

export async function fireCtrlaEvent(
  event: CtrlaEventName,
  email: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  const key = process.env.KLAVIYO_PRIVATE_KEY;
  if (!key || !email) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch("https://a.klaviyo.com/api/events/", {
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
            properties,
            metric: { data: { type: "metric", attributes: { name: event } } },
            profile: { data: { type: "profile", attributes: { email } } },
          },
        },
      }),
    });
    if (!res.ok) {
      console.error(`Klaviyo event "${event}" failed:`, res.status);
    }
  } catch (err) {
    console.error(`Klaviyo event "${event}" error:`, err);
  } finally {
    clearTimeout(timer);
  }
}
