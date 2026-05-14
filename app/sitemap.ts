import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.rovstudios.com';

    const blogPosts = getAllPosts().map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.dateModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: '2025-03-23',
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/sound`,
            lastModified: '2025-03-23',
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/video-production`,
            lastModified: '2025-03-15',
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/web`,
            lastModified: '2025-03-15',
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/ai-automation`,
            lastModified: '2026-04-29',
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/works`,
            lastModified: '2026-05-14',
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/casestudy`,
            lastModified: '2025-02-15',
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/casestudy/bando`,
            lastModified: '2025-02-01',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/casestudy/ikna`,
            lastModified: '2025-02-01',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/casestudy/dkm`,
            lastModified: '2025-02-01',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/casestudy/pursue-networking`,
            lastModified: '2025-02-01',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/casestudy/atlanta-tech-meetup`,
            lastModified: '2025-02-01',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/ctrla`,
            lastModified: '2025-03-01',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: '2026-03-30',
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...blogPosts,
    ];
}
