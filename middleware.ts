import { type NextRequest, NextResponse } from "next/server";

// rovmusic.com is served from this same app. Its home is the sound page.
// Host matching is by substring so it covers rovmusic.com, www.rovmusic.com,
// and a local rovmusic.localhost:3000 for testing.
const MUSIC_HOST = "rovmusic";
const STUDIOS_HOST = "rovstudios";

export async function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase();
  const { pathname } = request.nextUrl;

  if (host.includes(MUSIC_HOST)) {
    // Serve the music (sound) page at the music-domain root.
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/sound", request.url));
    }
    // Keep one canonical home: /sound folds back to / on the music host.
    if (pathname === "/sound") {
      return NextResponse.redirect(new URL("/", request.url), 308);
    }
  } else if (host.includes(STUDIOS_HOST) && pathname === "/sound") {
    // Migration: the sound page now lives on rovmusic.com. Scoped to the
    // production studios domain so /sound stays testable on localhost.
    return NextResponse.redirect("https://www.rovmusic.com/", 308);
  }

  try {
    const { createClient } = await import("@/utils/supabase/middleware");
    const { supabaseResponse } = createClient(request);
    return supabaseResponse;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
