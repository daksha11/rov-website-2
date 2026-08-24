import { getMusicPosts } from "@/lib/blog";

// Sitemap for the rovmusic.com host. This app serves two domains, so the
// default /sitemap.xml (app/sitemap.ts) is rovstudios-only. Middleware rewrites
// rovmusic.com/sitemap.xml to this route so each domain advertises its own URLs.
//
// Keep the static list in sync with MUSIC_SUBPAGES / MUSIC_SUBTREES in
// middleware.ts — those are the clean top-level URLs the music host exposes,
// and they are the canonicals set in app/sound/page.tsx, app/sound/sam-suen,
// and app/sound/blog. Posts are appended from content/blog where site: music.
export async function GET() {
    const baseUrl = "https://www.rovmusic.com";

    const pages = [
        { path: "/", lastModified: "2026-08-05", changeFrequency: "monthly", priority: "1.0" },
        { path: "/pricing", lastModified: "2026-08-05", changeFrequency: "monthly", priority: "0.9" },
        { path: "/atlanta-studios", lastModified: "2026-08-05", changeFrequency: "monthly", priority: "0.9" },
        { path: "/toolkit", lastModified: "2026-08-05", changeFrequency: "monthly", priority: "0.9" },
        { path: "/credits", lastModified: "2026-08-05", changeFrequency: "monthly", priority: "0.9" },
        { path: "/authors", lastModified: "2026-08-24", changeFrequency: "yearly", priority: "0.6" },
        { path: "/blog", lastModified: "2026-08-05", changeFrequency: "weekly", priority: "0.8" },
        { path: "/sam-suen", lastModified: "2026-08-04", changeFrequency: "monthly", priority: "0.8" },
    ];

    // Stub posts redirect elsewhere, so they never belong in the sitemap.
    const postPages = getMusicPosts()
        .filter((post) => !post.externalUrl)
        .map((post) => ({
            path: `/blog/${post.slug}`,
            lastModified: (post.dateModified || post.date || "").slice(0, 10),
            changeFrequency: "monthly",
            priority: "0.7",
        }));

    const allPages = [...pages, ...postPages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
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
