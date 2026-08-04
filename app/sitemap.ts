import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { getIndexedIndustries } from '@/lib/industries';
import { volumeNumbers } from './ctrla/_volumes';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.rovstudios.com';

    // ICP industry landing pages. Only pages promoted to indexed: true appear
    // here. Phase 1 drafts (indexed: false) are intentionally excluded, so this
    // list is empty until Andi personally promotes a page.
    const indexedIndustries = getIndexedIndustries();
    const industryPages = indexedIndustries.map((page) => ({
        url: `${baseUrl}/industries/${page.slug}`,
        lastModified: page.dateModified,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // The /industries hub only belongs in the sitemap once it has something
    // indexable to point at, matching the noindex rule on the page itself.
    const industryHub =
        indexedIndustries.length > 0
            ? [
                  {
                      url: `${baseUrl}/industries`,
                      lastModified: indexedIndustries
                          .map((p) => p.dateModified)
                          .sort()
                          .reverse()[0],
                      changeFrequency: 'monthly' as const,
                      priority: 0.8,
                  },
              ]
            : [];

    const blogPosts = getAllPosts()
        .filter((post) => !post.externalUrl)
        .map((post) => ({
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
            url: `${baseUrl}/brand`,
            lastModified: '2026-07-31',
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        // The single funnel CTA. Every article, post, and bio link lands here.
        {
            url: `${baseUrl}/report`,
            lastModified: '2026-08-03',
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/web/brief`,
            lastModified: '2026-08-01',
            changeFrequency: 'yearly',
            priority: 0.7,
        },
        // Canonical /web SEO pages. The like-named blog posts are externalUrl
        // stubs that 308-redirect here (and are filtered out of blogPosts above),
        // so these canonical targets must be listed explicitly.
        {
            url: `${baseUrl}/web/how-much-does-a-website-cost-in-atlanta`,
            lastModified: '2026-07-02',
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/web/real-estate-agent-website-atlanta`,
            lastModified: '2026-07-02',
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/web/why-isnt-my-business-showing-up-on-google`,
            lastModified: '2026-07-02',
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/web/skills-that-matter-in-the-ai-era`,
            lastModified: '2026-07-21',
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/web/missed-call-text-back-atlanta-hvac`,
            lastModified: '2026-07-05',
            changeFrequency: 'monthly',
            priority: 0.8,
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
            url: `${baseUrl}/about`,
            lastModified: '2026-06-26',
            changeFrequency: 'monthly',
            priority: 0.7,
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
            lastModified: '2026-06-15',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/ctrla/dreamasia`,
            lastModified: '2026-06-21',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/ctrla/the-fold`,
            lastModified: '2026-06-28',
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/ctrla/cookbook`,
            lastModified: '2026-06-28',
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/ctrla/atl`,
            lastModified: '2026-07-22',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...['music', 'web-dev', 'design', 'video'].map((id) => ({
            url: `${baseUrl}/ctrla/toolkit/${id}`,
            lastModified: '2026-06-15',
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        })),
        // Toolkit history-lesson extensions.
        ...['music', 'web-dev', 'design', 'video'].map((id) => ({
            url: `${baseUrl}/ctrla/toolkit/${id}/history`,
            lastModified: '2026-07-13',
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        })),
        // CTRL-A back-issue archive — one entry per known volume.
        ...volumeNumbers.map((n) => ({
            url: `${baseUrl}/ctrla/vol/${n}`,
            lastModified: '2026-06-15',
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        })),
        {
            url: `${baseUrl}/blog`,
            lastModified: '2026-03-30',
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/resources`,
            lastModified: '2026-07-03',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/resources/toolkits/web-dev`,
            lastModified: '2026-07-03',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/resources/toolkits/design`,
            lastModified: '2026-07-03',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/resources/playbooks/real-estate-agents`,
            lastModified: '2026-07-03',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...industryHub,
        ...industryPages,
        ...blogPosts,
    ];
}
