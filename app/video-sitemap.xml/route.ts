export async function GET() {
    const videos = [
        {
            loc: "https://www.rovstudios.com/video-production",
            title: "Atlanta Skyline Cinematic Aerial Shot",
            description: "Cinematic aerial footage of the Atlanta skyline captured by Range of View Studios for real estate and commercial clients.",
            contentUrl: "https://www.rovstudios.com/videoprod/Atlskylineweb.mp4",
            thumbnailUrl: "https://www.rovstudios.com/thumbnails/videohero1.webp",
            duration: 30,
            publicationDate: "2025-01-15",
        },
        {
            loc: "https://www.rovstudios.com/video-production",
            title: "Gladstone Property Walkthrough",
            description: "Premium real estate video walkthrough showcasing dynamic visual storytelling by ROV Studios.",
            contentUrl: "https://www.rovstudios.com/videoprod/Gladshotweb.mp4",
            thumbnailUrl: "https://www.rovstudios.com/thumbnails/videohero2.webp",
            duration: 25,
            publicationDate: "2025-01-15",
        },
        {
            loc: "https://www.rovstudios.com/video-production",
            title: "Mountain Landscape Aerial Footage",
            description: "Breathtaking mountain landscape captured from above by Range of View Studios drone cinematography team.",
            contentUrl: "https://www.rovstudios.com/videoprod/Mountainweb.mp4",
            thumbnailUrl: "https://www.rovstudios.com/thumbnails/videohero3.webp",
            duration: 20,
            publicationDate: "2025-01-15",
        },
        {
            loc: "https://www.rovstudios.com/video-production",
            title: "Boxing Event Coverage",
            description: "High-energy boxing event videography capturing raw intensity frame by frame, produced by ROV Studios.",
            contentUrl: "https://www.rovstudios.com/videoprod/postprod/Boxingeditcolor.mp4",
            thumbnailUrl: "https://www.rovstudios.com/thumbnails/boxing1.webp",
            duration: 35,
            publicationDate: "2025-02-01",
        },
        {
            loc: "https://www.rovstudios.com/sound",
            title: "Stars Collide Music Video",
            description: "Stars Collide official music video, mixed and mastered by Range of View Studios sound engineering team.",
            contentUrl: "https://www.rovstudios.com/soundpage/starscollidemv.mp4",
            thumbnailUrl: "https://www.rovstudios.com/thumbnails/soundhero.webp",
            duration: 210,
            publicationDate: "2025-01-10",
        },
        {
            loc: "https://www.rovstudios.com/sound",
            title: "Starboy Music Video",
            description: "Starboy official music video, produced and engineered by Range of View Studios.",
            contentUrl: "https://www.rovstudios.com/video/starboymv.mp4",
            thumbnailUrl: "https://www.rovstudios.com/thumbnails/starboythumb.webp",
            duration: 180,
            publicationDate: "2025-01-15",
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
      <video:duration>${v.duration}</video:duration>
      <video:publication_date>${v.publicationDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>
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
