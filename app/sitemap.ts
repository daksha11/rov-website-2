import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://rovstudios.com';

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
            url: `${baseUrl}/ai`,
            lastModified: '2025-03-23',
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/ai-automation`,
            lastModified: '2025-03-15',
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
            url: `${baseUrl}/ctrla`,
            lastModified: '2025-03-01',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];
}
