import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const base = SITE.url;
    return [
        { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
        { url: `${base}/projects/`, changeFrequency: 'monthly', priority: 0.8 },
    ];
}
