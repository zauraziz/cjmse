export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { sql } from '@/lib/db';
import { sendEmail, subscribeWelcomeHtml } from '@/lib/email';

const RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
    }
    const token = randomBytes(18).toString('hex');
    const r = await sql.query(
      `insert into subscribers (email, token) values ($1,$2)
       on conflict (email) do update set active = true
       returning token`, [email, token]);
    const tok = (r[0] && r[0].token) || token;
    const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://cjmse.adda.edu.az';
    await sendEmail({
      to: email,
      subject: 'CJMSE — Abunəlik təsdiqləndi',
      html: subscribeWelcomeHtml(`${site}/api/unsubscribe?t=${tok}`),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
