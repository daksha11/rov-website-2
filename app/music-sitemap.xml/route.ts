// Sitemap for the rovmusic.com host. This app serves two domains, so the
// default /sitemap.xml (app/sitemap.ts) is rovstudios-only. Middleware rewrites
// rovmusic.com/sitemap.xml to this route so each domain advertises its own URLs.
//
// Keep this list in sync with MUSIC_SUBPAGES in middleware.ts — those are the
// clean top-level URLs the music host exposes, and they are the canonicals set
// in app/sound/page.tsx and app/sound/sam-suen/page.tsx.
export async function GET() {
    const baseUrl = "https://www.rovmusic.com";

    const pages = [
        { path: "/", lastModified: "2026-08-05", changeFrequency: "monthly", priority: "1.0" },
        { path: "/pricing", lastModified: "2026-08-05", changeFrequency: "monthly", priority: "0.9" },
        { path: "/sam-suen", lastModified: "2026-08-04", changeFrequency: "monthly", priority: "0.8" },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
    .map(
        (p) => `  <url>
    <loc>${baseUrl}${p.path === "/" ? "/" : p.path}</loc>
    <lastmod>${p.lastModified}</lastmod>
    <changefreq>${p.changeFrequency}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}
