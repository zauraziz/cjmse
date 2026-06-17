export const dynamic = 'force-dynamic';
import { getArticles } from '@/lib/queries';

export default async function sitemap() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://cjmse.adda.edu.az';
  const staticUrls = ['', '/articles', '/issues', '/about', '/for-authors', '/ethics'].map((p) => ({
    url: site + p,
    changeFrequency: 'weekly',
  }));
  let articleUrls = [];
  try {
    const articles = await getArticles({});
    articleUrls = articles.map((a) => ({
      url: `${site}/article/${a.slug}`,
      lastModified: a.published_at ? new Date(a.published_at) : undefined,
      changeFrequency: 'monthly',
    }));
  } catch (e) {
    // build/offline fallback: static URLs only
  }
  return [...staticUrls, ...articleUrls];
}
