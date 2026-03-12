import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Prevent crawling of private/admin routes if any exist in future
            disallow: '/api/auth/',
        },
        sitemap: ['https://rovstudios.com/sitemap.xml', 'https://rovstudios.com/video-sitemap.xml'],
        host: 'https://rovstudios.com',
    };
}
