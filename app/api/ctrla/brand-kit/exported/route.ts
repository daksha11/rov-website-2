// app/api/ctrla/brand-kit/exported/route.ts
// ─────────────────────────────────────────────────────────────
// Fire the reliable server-side "CTRL-A Brand Kit Exported" event after a
// successful export. Kept separate from the spend so tracking never blocks
// the download. Best-effort: a missing session or a Klaviyo hiccup just
// no-ops. The onsite "Brand Kit Started" signal fires client-side via
// _learnq; this is the one export event we want to be reliable.
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { fireCtrlaEvent } from "@/lib/ctrla/klaviyo-events";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST() {
  try {
    const supabase = createClient(await cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) {
      await fireCtrlaEvent("CTRL-A Brand Kit Exported", user.email, {});
    }
  } catch {
    /* best-effort, never surfaced */
  }
  return NextResponse.json({ ok: true });
}
