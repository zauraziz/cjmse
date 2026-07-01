export const runtime = 'nodejs';
import { sql } from '@/lib/db';

function page(msg) {
  return `<!doctype html><html lang="az"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CJMSE</title>
<style>body{font-family:system-ui,Arial,sans-serif;background:#FAF8F3;color:#0E2942;display:grid;place-items:center;min-height:100vh;margin:0}
.card{background:#fff;border:1px solid #E6E0D5;border-radius:14px;padding:34px 40px;max-width:440px;text-align:center;box-shadow:0 16px 40px -26px rgba(14,41,66,.34)}
h1{font-size:20px;margin:0 0 8px;color:#145063}p{font-size:15px;line-height:1.6;color:#516A7E;margin:0}
a{color:#145063;font-weight:600}</style></head>
<body><div class="card"><h1>${msg.h}</h1><p>${msg.p}</p><p style="margin-top:16px"><a href="/">← cjmse.az</a></p></div></body></html>`;
}

export async function GET(req) {
  const t = new URL(req.url).searchParams.get('t');
  let ok = false;
  if (t) {
    try {
      const r = await sql.query(`update subscribers set active = false where token = $1 returning id`, [t]);
      ok = !!(r && r[0]);
    } catch (e) { ok = false; }
  }
  const msg = ok
    ? { h: 'Abunəlikdən çıxdınız', p: 'Artıq yeni məqalə bildirişləri almayacaqsınız. İstədiyiniz vaxt yenidən abunə ola bilərsiniz.' }
    : { h: 'Keçid etibarsızdır', p: 'Bu abunəlik keçidi tapılmadı və ya artıq istifadə olunub.' };
  return new Response(page(msg), { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
