import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin', '/portal', '/internal', '/ctrla/brand-kit/builder'],
            },
            // Explicitly welcome AI crawlers for GEO
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'GoogleOther',
                allow: '/',
            },
        ],
        // List both content sitemaps directly so crawlers discover the video
        // sitemap too. /sitemap-index.xml also references both for engines that
        // prefer a sitemap index.
        sitemap: [
            'https://www.rovstudios.com/sitemap.xml',
            'https://www.rovstudios.com/video-sitemap.xml',
        ],
        host: 'https://www.rovstudios.com',
    };
}
