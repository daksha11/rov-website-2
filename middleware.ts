import { type NextRequest, NextResponse } from "next/server";

// rovmusic.com is served from this same app. Its home is the sound page.
// Host matching is by substring so it covers rovmusic.com, www.rovmusic.com,
// and a local rovmusic.localhost:3000 for testing.
const MUSIC_HOST = "rovmusic";
const STUDIOS_HOST = "rovstudios";

// Music-site subpages that live under app/sound/ but get clean top-level
// URLs on the music host (rovmusic.com/sam-suen ← app/sound/sam-suen).
const MUSIC_SUBPAGES = ["/sam-suen"];

export async function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase();
  const { pathname } = request.nextUrl;

  if (host.includes(MUSIC_HOST)) {
    // Serve the music (sound) page at the music-domain root.
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/sound", request.url));
    }
    // Clean URLs for music subpages: /sam-suen serves /sound/sam-suen.
    if (MUSIC_SUBPAGES.includes(pathname)) {
      return NextResponse.rewrite(new URL(`/sound${pathname}`, request.url));
    }
    // Keep one canonical URL per page: /sound paths fold back on the music host.
    if (pathname === "/sound" || pathname.startsWith("/sound/")) {
      const stripped = pathname.slice("/sound".length) || "/";
      return NextResponse.redirect(new URL(stripped, request.url), 308);
    }
  } else if (
    host.includes(STUDIOS_HOST) &&
    (pathname === "/sound" || pathname.startsWith("/sound/"))
  ) {
    // Migration: the sound pages now live on rovmusic.com. Scoped to the
    // production studios domain so /sound stays testable on localhost.
    const stripped = pathname.slice("/sound".length) || "/";
    return NextResponse.redirect(`https://www.rovmusic.com${stripped}`, 308);
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
