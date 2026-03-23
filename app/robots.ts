import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/api/',
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
        sitemap: [
            'https://rovstudios.com/sitemap.xml',
            'https://rovstudios.com/video-sitemap.xml',
        ],
        host: 'https://rovstudios.com',
    };
}
