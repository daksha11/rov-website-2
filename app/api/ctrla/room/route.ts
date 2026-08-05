// app/api/ctrla/room/route.ts
// ─────────────────────────────────────────────────────────────
// Live CTRL-A Discord stats for the join section on /ctrla.
//
// Exists as a route rather than a server component because CtrlAContent is a
// client component and cannot mount an async server one. This also keeps
// /ctrla fully static: the page ships, then this fills in.
//
// The bot token never leaves the server. The response is public but contains
// only what a visitor would see by joining anyway: a headcount and the next
// public event.
//
// Cached for 5 minutes. Discord's member count is approximate and the event
// schedule moves weekly, so anything tighter is wasted requests.
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { getRoomSnapshot } from "@/lib/ctrla/discord";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET() {
  // getRoomSnapshot never throws; null means unconfigured or Discord is down.
  const snapshot = await getRoomSnapshot();

  return NextResponse.json(
    { ok: true, room: snapshot },
    {
      headers: {
        // Serve stale while refreshing so a slow Discord never delays the page.
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
      },
    }
  );
}
