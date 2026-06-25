import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const rows = await q(
    `select ap.data from articles a join article_pdfs ap on ap.article_id = a.id where a.slug = $1`,
    [params.slug]);
  if (!rows[0] || !rows[0].data) {
    return new Response('PDF tapılmadı', { status: 404 });
  }
  const buf = Buffer.from(rows[0].data, 'base64');
  return new Response(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${params.slug}.pdf"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
