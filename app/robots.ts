import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin', '/portal', '/ctrla/brand-kit/builder'],
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
            'https://www.rovstudios.com/sitemap.xml',
        ],
        host: 'https://www.rovstudios.com',
    };
}
