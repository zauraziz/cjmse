'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';
import { put } from '@vercel/blob';
import { sql } from '@/lib/db';
import { ADMIN_COOKIE, sessionToken, verifyPassword, isAuthed } from '@/lib/auth';
import { sendEmail, submissionEmailHtml, statusEmailHtml } from '@/lib/email';
import { statusLabel } from '@/lib/status';

const TYPES = ['research', 'review', 'technical', 'short', 'editorial', 'casestudy'];

/* ---------------- input sanitizers ---------------- */
function str(v) {
  const s = (v ?? '').toString().trim();
  return s === '' ? null : s;
}
function int(v) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}
function uuid(v) {
  const s = (v ?? '').toString().trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s) ? s : null;
}
function enumVal(v, allowed, fb) {
  const s = (v ?? '').toString().trim();
  return allowed.includes(s) ? s : fb;
}
function dateVal(v) {
  const s = (v ?? '').toString().trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}
function slugify(s) {
  const map = { 'ə':'e','ğ':'g','ı':'i','İ':'i','ö':'o','ş':'s','ç':'c','ü':'u','x':'x','q':'q' };
  return (s || '').toString()
    .replace(/[əğıİöşçü]/gi, (ch) => map[ch.toLowerCase()] || ch)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}
function revalidateAll() {
  ['/', '/articles', '/issues', '/about', '/admin/articles', '/admin/articles/new', '/admin/authors', '/admin/issues']
    .forEach((p) => revalidatePath(p));
}
function guard() {
  if (!isAuthed()) redirect('/admin/login');
}

/** Store an uploaded PDF: Vercel Blob if configured, otherwise base64 in the DB.
 *  Updates articles.pdf_url to the viewable URL. Only runs if a real PDF file was sent. */
async function storePdf(formData, articleId, slug) {
  const file = formData.get('pdf');
  if (!file || typeof file === 'string' || !file.size) return;
  if (file.type && file.type !== 'application/pdf') return;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const safe = (slug || 'article').replace(/[^a-z0-9-]/gi, '-').slice(0, 60);
    const blob = await put(`pdf/${safe}-${Date.now()}.pdf`, file, { access: 'public', contentType: 'application/pdf' });
    await sql.query(`update articles set pdf_url = $1 where id = $2`, [blob.url, articleId]);
  } else {
    try {
      const b64 = Buffer.from(await file.arrayBuffer()).toString('base64');
      await sql.query(
        `insert into article_pdfs (article_id, data) values ($1,$2)
         on conflict (article_id) do update set data = excluded.data`, [articleId, b64]);
      await sql.query(`update articles set pdf_url = $1 where id = $2`, [`/pdf/${slug}`, articleId]);
    } catch (e) {
      // article_pdfs cədvəli yoxdursa (migration-v3 işə salınmayıb) — məqaləni çökdürmə
      console.error('PDF DB storage failed (run migration-v3.sql):', e?.message);
    }
  }
}

async function setAuthors(articleId, formData, clear) {
  if (clear) await sql.query(`delete from article_authors where article_id = $1`, [articleId]);
  let authors = [];
  try { authors = JSON.parse(formData.get('authors') || '[]'); } catch { authors = []; }
  let pos = 1;
  const seen = new Set();
  for (const a of authors) {
    const name = ((a && a.name) || '').trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;            // eyni təqdimatda təkrar adı keç
    seen.add(key);
    let aid;
    const found = await sql.query(
      `select id from authors where lower(trim(full_name)) = lower(trim($1)) limit 1`, [name]);
    if (found[0]) {
      aid = found[0].id;                    // mövcud müəllif — təkrar yaratma
    } else {
      const ins = await sql.query(
        `insert into authors (full_name, orcid, affiliation) values ($1,$2,$3) returning id`,
        [name, (a.orcid || '').trim() || null, (a.affiliation || '').trim() || null]);
      aid = ins[0].id;                      // yeni müəllif — avtomatik yaradılır
    }
    await sql.query(
      `insert into article_authors (article_id, author_id, author_position, is_corresponding)
       values ($1,$2,$3,$4)
       on conflict (article_id, author_id)
       do update set author_position = excluded.author_position, is_corresponding = excluded.is_corresponding`,
      [articleId, aid, pos++, !!a.isCorresponding]);
  }
}

/* ---------------- auth ---------------- */
export async function login(formData) {
  if (verifyPassword(formData.get('password'))) {
    cookies().set(ADMIN_COOKIE, sessionToken(), {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
    });
    redirect('/admin');
  }
  redirect('/admin/login?error=1');
}

export async function logout() {
  cookies().delete(ADMIN_COOKIE);
  redirect('/admin/login');
}

/* ---------------- issues ---------------- */
export async function createIssue(formData) {
  guard();
  const volume = int(formData.get('volume'));
  const number = int(formData.get('number'));
  const year = int(formData.get('year'));
  const title = str(formData.get('title')) || null;
  const isCurrent = formData.get('is_current') === 'on';
  if (isCurrent) await sql.query(`update issues set is_current = false`);
  await sql.query(
    `insert into issues (volume, number, year, title, is_current, published_at) values ($1,$2,$3,$4,$5,$6)`,
    [volume, number, year, title, isCurrent, dateVal(formData.get('published_at'))]);
  revalidateAll();
  redirect('/admin/issues');
}

export async function updateIssue(formData) {
  guard();
  const id = uuid(formData.get('id'));
  if (!id) redirect('/admin/issues');
  const volume = int(formData.get('volume'));
  const number = int(formData.get('number'));
  const year = int(formData.get('year'));
  const title = str(formData.get('title')) || null;
  const isCurrent = formData.get('is_current') === 'on';
  if (isCurrent) await sql.query(`update issues set is_current = false where id <> $1`, [id]);
  await sql.query(
    `update issues set volume=$1, number=$2, year=$3, title=$4, is_current=$5, published_at=$6 where id=$7`,
    [volume, number, year, title, isCurrent, dateVal(formData.get('published_at')), id]);
  revalidateAll();
  redirect('/admin/issues');
}

export async function deleteIssue(formData) {
  guard();
  const id = uuid(formData.get('id'));
  if (id) await sql.query(`delete from issues where id = $1`, [id]);
  revalidateAll();
  redirect('/admin/issues');
}

/* ---------------- authors ---------------- */
export async function createAuthor(formData) {
  guard();
  const name = str(formData.get('full_name'));
  if (!name) redirect('/admin/authors?error=1');
  const dup = await sql.query(`select id from authors where lower(trim(full_name)) = lower(trim($1)) limit 1`, [name]);
  if (dup[0]) { revalidateAll(); redirect('/admin/authors?exists=1'); }
  await sql.query(
    `insert into authors (full_name, orcid, affiliation, email) values ($1,$2,$3,$4)`,
    [name, str(formData.get('orcid')), str(formData.get('affiliation')), str(formData.get('email'))]);
  revalidateAll();
  redirect('/admin/authors');
}

export async function updateAuthor(formData) {
  guard();
  const id = uuid(formData.get('id'));
  if (!id) redirect('/admin/authors');
  await sql.query(
    `update authors set full_name=$1, orcid=$2, affiliation=$3, email=$4 where id=$5`,
    [str(formData.get('full_name')), str(formData.get('orcid')),
     str(formData.get('affiliation')), str(formData.get('email')), id]);
  revalidateAll();
  redirect('/admin/authors');
}

export async function deleteAuthor(formData) {
  guard();
  const id = uuid(formData.get('id'));
  if (id) await sql.query(`delete from authors where id = $1`, [id]);
  revalidateAll();
  redirect('/admin/authors');
}

/* ---------------- articles ---------------- */
export async function createArticle(formData) {
  guard();
  const title = str(formData.get('title'));
  if (!title) redirect('/admin/articles?error=1');
  const doi = str(formData.get('doi'));
  let base = doi ? slugify(doi.split('/').pop()) : slugify(title);
  if (!base) base = 'meqale';
  let slug = base, n = 1;
  while ((await sql.query(`select 1 from articles where slug = $1`, [slug])).length) slug = `${base}-${++n}`;

  const ins = await sql.query(
    `insert into articles
       (slug,title,title_en,abstract,abstract_en,keywords,keywords_en,type,subject_id,issue_id,
        pages,doi,language,pdf_url,data_url,views,citations,published_at,
        title_ru,abstract_ru,keywords_ru,udc)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
     returning id`,
    [slug, title, str(formData.get('title_en')), str(formData.get('abstract')), str(formData.get('abstract_en')),
     str(formData.get('keywords')), str(formData.get('keywords_en')),
     enumVal(formData.get('type'), TYPES, 'research'),
     uuid(formData.get('subject_id')), uuid(formData.get('issue_id')),
     str(formData.get('pages')), doi, str(formData.get('language')) || 'az',
     str(formData.get('pdf_url')), str(formData.get('data_url')),
     int(formData.get('views')) || 0, int(formData.get('citations')) || 0, dateVal(formData.get('published_at')),
     str(formData.get('title_ru')), str(formData.get('abstract_ru')), str(formData.get('keywords_ru')), str(formData.get('udc'))]);
  await setAuthors(ins[0].id, formData, false);
  await storePdf(formData, ins[0].id, slug);
  revalidateAll();
  redirect('/admin/articles/new?saved=' + Date.now());
}

export async function updateArticle(formData) {
  guard();
  const id = uuid(formData.get('id'));
  if (!id) redirect('/admin/articles');

  await sql.query(
    `update articles set
       title=$1, title_en=$2, abstract=$3, abstract_en=$4, keywords=$5, keywords_en=$6,
       type=$7, subject_id=$8, issue_id=$9, pages=$10, doi=$11, language=$12,
       pdf_url=$13, data_url=$14, views=$15, citations=$16, published_at=$17,
       title_ru=$18, abstract_ru=$19, keywords_ru=$20, udc=$21
     where id=$22`,
    [str(formData.get('title')), str(formData.get('title_en')), str(formData.get('abstract')), str(formData.get('abstract_en')),
     str(formData.get('keywords')), str(formData.get('keywords_en')),
     enumVal(formData.get('type'), TYPES, 'research'),
     uuid(formData.get('subject_id')), uuid(formData.get('issue_id')),
     str(formData.get('pages')), str(formData.get('doi')), str(formData.get('language')) || 'az',
     str(formData.get('pdf_url')), str(formData.get('data_url')),
     int(formData.get('views')) || 0, int(formData.get('citations')) || 0, dateVal(formData.get('published_at')),
     str(formData.get('title_ru')), str(formData.get('abstract_ru')), str(formData.get('keywords_ru')), str(formData.get('udc')), id]);
  await setAuthors(id, formData, true);
  const sl = await sql.query(`select slug from articles where id = $1`, [id]);
  await storePdf(formData, id, sl[0] && sl[0].slug);
  revalidateAll();
  redirect('/admin/articles');
}

export async function deleteArticle(formData) {
  guard();
  const id = uuid(formData.get('id'));
  if (id) await sql.query(`delete from articles where id = $1`, [id]);
  revalidateAll();
  redirect('/admin/articles');
}

/* ---------------- submissions (public submit + tracking) ---------------- */
export async function createSubmission(formData) {
  // honeypot: bots fill hidden "website" field
  if (str(formData.get('website'))) redirect('/submit?error=spam');
  const title = str(formData.get('title'));
  const author_name = str(formData.get('author_name'));
  const email = str(formData.get('email'));
  if (!title || !author_name || !email) redirect('/submit?error=1');

  const token = randomBytes(18).toString('hex');
  await sql.query(
    `insert into submissions
       (token,title,author_name,email,coauthors,type,language,subject_id,abstract,keywords,manuscript_url,status)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'submitted')`,
    [token, title, author_name, email, str(formData.get('coauthors')),
     enumVal(formData.get('type'), TYPES, 'research'), str(formData.get('language')) || 'az',
     uuid(formData.get('subject_id')), str(formData.get('abstract')), str(formData.get('keywords')),
     str(formData.get('manuscript_url'))]);

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://cjmse.adda.edu.az';
  await sendEmail({
    to: email,
    subject: 'CJMSE — Məqalə təqdimatınız qəbul edildi',
    html: submissionEmailHtml(title, `${site}/track/${token}`),
  });
  revalidatePath('/admin/submissions');
  redirect(`/track/${token}?new=1`);
}

export async function updateSubmissionStatus(formData) {
  guard();
  const id = uuid(formData.get('id'));
  if (!id) redirect('/admin/submissions');
  const status = str(formData.get('status')) || 'submitted';
  const note = str(formData.get('note'));
  const r = await sql.query(
    `update submissions set status=$1, note=$2, updated_at=now() where id=$3 returning token, email, title`,
    [status, note, id]);
  if (r[0]) {
    const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://cjmse.adda.edu.az';
    await sendEmail({
      to: r[0].email,
      subject: 'CJMSE — Məqalənizin statusu yeniləndi',
      html: statusEmailHtml(r[0].title, statusLabel(status, 'az'), note, `${site}/track/${r[0].token}`),
    });
    revalidatePath(`/track/${r[0].token}`);
  }
  revalidatePath('/admin/submissions');
  redirect('/admin/submissions');
}

export async function deleteSubmission(formData) {
  guard();
  const id = uuid(formData.get('id'));
  if (id) await sql.query(`delete from submissions where id = $1`, [id]);
  revalidatePath('/admin/submissions');
}
