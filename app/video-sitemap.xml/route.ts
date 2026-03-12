export async function GET() {
    const videos = [
        {
            loc: "https://rovstudios.com/video-production",
            title: "Atlanta Skyline Cinematic Aerial Shot",
            description: "Cinematic aerial footage of the Atlanta skyline captured by Range of View Studios for real estate and commercial clients.",
            contentUrl: "https://rovstudios.com/videoprod/Atlskylineweb.mp4",
            thumbnailUrl: "https://rovstudios.com/thumbnails/videohero1.webp",
        },
        {
            loc: "https://rovstudios.com/video-production",
            title: "Gladstone Property Walkthrough",
            description: "Premium real estate video walkthrough showcasing dynamic visual storytelling by ROV Studios.",
            contentUrl: "https://rovstudios.com/videoprod/Gladshotweb.mp4",
            thumbnailUrl: "https://rovstudios.com/thumbnails/videohero2.webp",
        },
        {
            loc: "https://rovstudios.com/video-production",
            title: "Mountain Landscape Aerial Footage",
            description: "Breathtaking mountain landscape captured from above by Range of View Studios drone cinematography team.",
            contentUrl: "https://rovstudios.com/videoprod/Mountainweb.mp4",
            thumbnailUrl: "https://rovstudios.com/thumbnails/videohero3.webp",
        },
        {
            loc: "https://rovstudios.com/video-production",
            title: "Boxing Event Coverage",
            description: "High-energy boxing event videography capturing raw intensity frame by frame, produced by ROV Studios.",
            contentUrl: "https://rovstudios.com/videoprod/postprod/Boxingeditcolor.mp4",
            thumbnailUrl: "https://rovstudios.com/thumbnails/boxing1.webp",
        },
        {
            loc: "https://rovstudios.com/sound",
            title: "Stars Collide Music Video",
            description: "Stars Collide official music video, mixed and mastered by Range of View Studios sound engineering team.",
            contentUrl: "https://rovstudios.com/soundpage/starscollidemv.mp4",
            thumbnailUrl: "https://rovstudios.com/thumbnails/soundhero.webp",
        },
        {
            loc: "https://rovstudios.com/sound",
            title: "Starboy Music Video",
            description: "Starboy official music video, produced and engineered by Range of View Studios.",
            contentUrl: "https://rovstudios.com/video/starboymv.mp4",
            thumbnailUrl: "https://rovstudios.com/thumbnails/starboythumb.webp",
        },
    ];

    const escapeXml = (str: string) =>
        str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videos
    .map(
        (v) => `  <url>
    <loc>${escapeXml(v.loc)}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(v.thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(v.title)}</video:title>
      <video:description>${escapeXml(v.description)}</video:description>
      <video:content_loc>${escapeXml(v.contentUrl)}</video:content_loc>
    </video:video>
  </url>`
    )
    .join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}
