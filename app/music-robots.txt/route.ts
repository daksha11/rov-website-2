// robots.txt for the rovmusic.com host. app/robots.ts is host-agnostic and
// hardcodes the rovstudios host and sitemaps, so without this the music domain
// would point crawlers at the wrong site. Middleware rewrites
// rovmusic.com/robots.txt to this route.
export async function GET() {
    const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /portal
Disallow: /internal

# Explicitly welcome AI crawlers for GEO
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: GoogleOther
Allow: /

Host: https://www.rovmusic.com
Sitemap: https://www.rovmusic.com/sitemap.xml
`;

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}
