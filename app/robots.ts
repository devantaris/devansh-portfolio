import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/blueprint.html', '/projects/'],
            },
        ],
        sitemap: `${SITE.url}/sitemap.xml`,
    };
}
