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
    // Each domain advertises its own crawl rules and URL set. app/robots.ts and
    // app/sitemap.ts are rovstudios-only, so the music host gets its own pair.
    if (pathname === "/robots.txt") {
      return NextResponse.rewrite(new URL("/music-robots.txt", request.url));
    }
    if (pathname === "/sitemap.xml") {
      return NextResponse.rewrite(new URL("/music-sitemap.xml", request.url));
    }
    // The studios-only sitemaps belong to one host. Serving them here would put
    // rovstudios URLs behind a rovmusic address, so send crawlers to the source.
    if (pathname === "/sitemap-index.xml" || pathname === "/video-sitemap.xml") {
      return NextResponse.redirect(`https://www.rovstudios.com${pathname}`, 308);
    }
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
  } else if (host.includes(STUDIOS_HOST)) {
    if (pathname === "/sound" || pathname.startsWith("/sound/")) {
      // Migration: the sound pages now live on rovmusic.com. Scoped to the
      // production studios domain so /sound stays testable on localhost.
      const stripped = pathname.slice("/sound".length) || "/";
      return NextResponse.redirect(`https://www.rovmusic.com${stripped}`, 308);
    }
    // The music crawl files are only meant to be reachable on the music host.
    // They exist as real routes in this app, so close the studios-side door.
    if (pathname === "/music-sitemap.xml") {
      return NextResponse.redirect("https://www.rovmusic.com/sitemap.xml", 308);
    }
    if (pathname === "/music-robots.txt") {
      return NextResponse.redirect("https://www.rovmusic.com/robots.txt", 308);
    }
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
