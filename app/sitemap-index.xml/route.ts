export async function GET() {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.rovstudios.com/sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://www.rovstudios.com/video-sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}
