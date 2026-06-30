export const dynamic = 'force-dynamic';
import { getArticles } from '@/lib/queries';

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://cjmse.adda.edu.az';
  let articles = [];
  try { articles = await getArticles({}); } catch { articles = []; }
  const items = articles.slice(0, 50).map((a) => {
    const url = `${site}/article/${a.slug}`;
    const date = a.published_at ? new Date(a.published_at).toUTCString() : '';
    return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${a.authors ? `<dc:creator>${esc(a.authors)}</dc:creator>` : ''}
      ${date ? `<pubDate>${date}</pubDate>` : ''}
      ${a.doi ? `<dc:identifier>https://doi.org/${esc(a.doi)}</dc:identifier>` : ''}
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CJMSE — Caspian Journal of Maritime Science &amp; Engineering</title>
    <link>${site}</link>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Azərbaycan Dövlət Dəniz Akademiyasının resenziyalı, açıq girişli elmi jurnalı.</description>
    <language>az</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=1800' } });
}
