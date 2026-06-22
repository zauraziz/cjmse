'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { ADMIN_COOKIE, sessionToken, verifyPassword, isAuthed } from '@/lib/auth';

/* ---------------- helpers (not exported) ---------------- */
function str(v) {
  const s = (v ?? '').toString().trim();
  return s === '' ? null : s;
}
function int(v) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}
function slugify(s) {
  return (s || '')
    .toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}
function revalidateAll() {
  ['/', '/articles', '/issues', '/about'].forEach((p) => revalidatePath(p));
}
function guard() {
  if (!isAuthed()) redirect('/admin/login');
}
async function setAuthorsAndKeywords(articleId, formData, clear) {
  if (clear) {
    await sql.query(`delete from article_authors where article_id = $1`, [articleId]);
    await sql.query(`delete from article_keywords where article_id = $1`, [articleId]);
  }
  let authors = [];
  try { authors = JSON.parse(formData.get('authors') || '[]'); } catch { authors = []; }
  let pos = 1;
  for (const a of authors) {
    if (!a || !a.authorId) continue;
    await sql.query(
      `insert into article_authors (article_id, author_id, author_position, is_corresponding)
       values ($1,$2,$3,$4)
       on conflict (article_id, author_id)
       do update set author_position = excluded.author_position, is_corresponding = excluded.is_corresponding`,
      [articleId, a.authorId, pos++, !!a.isCorresponding]);
  }
  const kwRaw = str(formData.get('keywords')) || '';
  const terms = [...new Set(kwRaw.split(',').map((t) => t.trim()).filter(Boolean))];
  for (const term of terms) {
    await sql.query(`insert into keywords (term) values ($1) on conflict (term) do nothing`, [term]);
    const k = await sql.query(`select id from keywords where term = $1`, [term]);
    if (k[0]) {
      await sql.query(
        `insert into article_keywords (article_id, keyword_id) values ($1,$2) on conflict do nothing`,
        [articleId, k[0].id]);
    }
  }
}

/* ---------------- auth ---------------- */
export async function login(formData) {
  if (verifyPassword(formData.get('password'))) {
    cookies().set(ADMIN_COOKIE, sessionToken(), {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8,
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
  const title = str(formData.get('title')) || `Cild ${volume}, № ${number} (${year})`;
  const isCurrent = formData.get('is_current') === 'on';
  const pub = str(formData.get('published_at'));
  if (isCurrent) await sql.query(`update issues set is_current = false`);
  await sql.query(
    `insert into issues (volume, number, year, title, is_current, published_at)
     values ($1,$2,$3,$4,$5,$6)`,
    [volume, number, year, title, isCurrent, pub]);
  revalidateAll();
  redirect('/admin/issues');
}

export async function updateIssue(formData) {
  guard();
  const id = str(formData.get('id'));
  const volume = int(formData.get('volume'));
  const number = int(formData.get('number'));
  const year = int(formData.get('year'));
  const title = str(formData.get('title')) || `Cild ${volume}, № ${number} (${year})`;
  const isCurrent = formData.get('is_current') === 'on';
  const pub = str(formData.get('published_at'));
  if (isCurrent) await sql.query(`update issues set is_current = false where id <> $1`, [id]);
  await sql.query(
    `update issues set volume=$1, number=$2, year=$3, title=$4, is_current=$5, published_at=$6 where id=$7`,
    [volume, number, year, title, isCurrent, pub, id]);
  revalidateAll();
  redirect('/admin/issues');
}

export async function deleteIssue(formData) {
  guard();
  await sql.query(`delete from issues where id = $1`, [str(formData.get('id'))]);
  revalidateAll();
  redirect('/admin/issues');
}

/* ---------------- authors ---------------- */
export async function createAuthor(formData) {
  guard();
  const name = str(formData.get('full_name'));
  if (!name) redirect('/admin/authors?error=1');
  await sql.query(
    `insert into authors (full_name, orcid, affiliation, email) values ($1,$2,$3,$4)`,
    [name, str(formData.get('orcid')), str(formData.get('affiliation')), str(formData.get('email'))]);
  revalidateAll();
  redirect('/admin/authors');
}

export async function updateAuthor(formData) {
  guard();
  const id = str(formData.get('id'));
  await sql.query(
    `update authors set full_name=$1, orcid=$2, affiliation=$3, email=$4 where id=$5`,
    [str(formData.get('full_name')), str(formData.get('orcid')),
     str(formData.get('affiliation')), str(formData.get('email')), id]);
  revalidateAll();
  redirect('/admin/authors');
}

export async function deleteAuthor(formData) {
  guard();
  await sql.query(`delete from authors where id = $1`, [str(formData.get('id'))]);
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
  while ((await sql.query(`select 1 from articles where slug = $1`, [slug])).length) {
    slug = `${base}-${++n}`;
  }
  const ins = await sql.query(
    `insert into articles
       (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     returning id`,
    [slug, title, str(formData.get('abstract')), str(formData.get('type')) || 'research',
     str(formData.get('subject_id')), str(formData.get('issue_id')), str(formData.get('pages')),
     doi, str(formData.get('language')) || 'az', str(formData.get('pdf_url')),
     str(formData.get('data_url')), int(formData.get('views')) || 0,
     int(formData.get('citations')) || 0, str(formData.get('published_at'))]);
  await setAuthorsAndKeywords(ins[0].id, formData, false);
  revalidateAll();
  redirect('/admin/articles');
}

export async function updateArticle(formData) {
  guard();
  const id = str(formData.get('id'));
  await sql.query(
    `update articles set
       title=$1, abstract=$2, type=$3, subject_id=$4, issue_id=$5, pages=$6, doi=$7,
       language=$8, pdf_url=$9, data_url=$10, views=$11, citations=$12, published_at=$13
     where id=$14`,
    [str(formData.get('title')), str(formData.get('abstract')), str(formData.get('type')) || 'research',
     str(formData.get('subject_id')), str(formData.get('issue_id')), str(formData.get('pages')),
     str(formData.get('doi')), str(formData.get('language')) || 'az', str(formData.get('pdf_url')),
     str(formData.get('data_url')), int(formData.get('views')) || 0,
     int(formData.get('citations')) || 0, str(formData.get('published_at')), id]);
  await setAuthorsAndKeywords(id, formData, true);
  revalidateAll();
  redirect('/admin/articles');
}

export async function deleteArticle(formData) {
  guard();
  await sql.query(`delete from articles where id = $1`, [str(formData.get('id'))]);
  revalidateAll();
  redirect('/admin/articles');
}
