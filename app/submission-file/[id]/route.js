export const dynamic = 'force-dynamic';
import { q } from '@/lib/db';

export async function GET(req, { params }) {
  const r = await q(`select filename, mime, data from submission_files where id = $1`, [params.id]);
  if (!r[0] || !r[0].data) return new Response('Not found', { status: 404 });
  const buf = Buffer.from(r[0].data, 'base64');
  return new Response(buf, {
    headers: {
      'Content-Type': r[0].mime || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${(r[0].filename || 'file').replace(/"/g, '')}"`,
    },
  });
}
