import { q } from '@/lib/db';

const ARTICLE_SELECT = `
  select a.slug, a.title, a.type, a.pages, a.doi, a.views, a.citations,
         a.published_at, a.data_url, a.pdf_url,
         s.name_az as subject_az, s.slug as subject_slug,
         i.title as issue_title,
         (select string_agg(au.full_name, ', ' order by aa.author_position)
            from article_authors aa join authors au on au.id = aa.author_id
            where aa.article_id = a.id) as authors
  from articles a
  left join subjects s on s.id = a.subject_id
  left join issues   i on i.id = a.issue_id`;

export async function getMetrics() {
  const r = await q(`
    select
      (select count(*) from articles)                          as articles,
      (select count(*) from issues)                            as issues,
      (select count(distinct author_id) from article_authors)  as authors,
      (select coalesce(sum(citations), 0) from articles)       as citations`);
  return r[0] || { articles: 0, issues: 0, authors: 0, citations: 0 };
}

export async function getSubjectsWithCounts() {
  return await q(`
    select s.slug, s.name_az, s.name_en, count(a.id)::int as count
    from subjects s
    left join articles a on a.subject_id = s.id
    group by s.id
    order by s.sort_order`);
}

export async function getCurrentIssue() {
  const r = await q(`
    select i.*, (select count(*) from articles a where a.issue_id = i.id)::int as count
    from issues i
    where i.is_current = true
    order by i.published_at desc
    limit 1`);
  return r[0] || null;
}

export async function getArticlesInIssue(issueId) {
  return await q(`${ARTICLE_SELECT} where a.issue_id = $1 order by a.pages`, [issueId]);
}

export async function getLatestArticles(limit = 6) {
  return await q(`${ARTICLE_SELECT} order by a.published_at desc limit $1`, [limit]);
}

export async function getMostRead(limit = 5) {
  return await q(`${ARTICLE_SELECT} order by a.views desc limit $1`, [limit]);
}

export async function getMostCited(limit = 5) {
  return await q(`${ARTICLE_SELECT} order by a.citations desc limit $1`, [limit]);
}

export async function getArticles({ query = '', subject = 'all', sort = 'date', issue = 'all' } = {}) {
  const order =
    sort === 'views' ? 'a.views desc'
    : sort === 'cites' ? 'a.citations desc'
    : 'a.published_at desc';
  return await q(
    `${ARTICLE_SELECT}
     where ($1 = '' OR a.title ILIKE '%' || $1 || '%' OR exists(
              select 1 from article_authors aa join authors au on au.id = aa.author_id
              where aa.article_id = a.id and au.full_name ILIKE '%' || $1 || '%'))
       and ($2 = 'all' OR s.slug = $2)
       and ($3 = 'all' OR a.issue_id::text = $3)
     order by ${order}`,
    [query, subject, issue]
  );
}

export async function getArticleBySlug(slug) {
  const r = await q(
    `select a.*, s.name_az as subject_az, s.name_en as subject_en, s.slug as subject_slug,
            i.title as issue_title, i.volume, i.number, i.year
     from articles a
     left join subjects s on s.id = a.subject_id
     left join issues   i on i.id = a.issue_id
     where a.slug = $1`,
    [slug]
  );
  if (!r[0]) return null;
  const authors = await q(
    `select au.full_name, au.orcid, au.affiliation, aa.author_position, aa.is_corresponding
     from article_authors aa join authors au on au.id = aa.author_id
     where aa.article_id = $1
     order by aa.author_position`,
    [r[0].id]
  );
  return { ...r[0], authors };
}

export async function getIssuesWithCounts() {
  return await q(`
    select i.*, (select count(*) from articles a where a.issue_id = i.id)::int as count
    from issues i
    order by i.year desc, i.number desc`);
}

export async function getFaqs() {
  return await q(`select category, question, answer from faqs order by sort_order`);
}

/* =================== ADMIN (CRUD list/detail) =================== */

export async function getAuthorsAdmin() {
  return await q(`
    select a.id, a.full_name, a.orcid, a.affiliation, a.email,
           count(aa.article_id)::int as articles
    from authors a
    left join article_authors aa on aa.author_id = a.id
    group by a.id
    order by a.full_name`);
}

export async function getAuthorById(id) {
  const r = await q(`select * from authors where id = $1`, [id]);
  return r[0] || null;
}

export async function getIssueById(id) {
  const r = await q(`select * from issues where id = $1`, [id]);
  return r[0] || null;
}

export async function getArticlesAdmin() {
  return await q(`
    select a.id, a.slug, a.title, a.doi, a.published_at, a.type,
           s.name_az as subject_az, i.title as issue_title,
           (select string_agg(au.full_name, ', ' order by aa.author_position)
              from article_authors aa join authors au on au.id = aa.author_id
              where aa.article_id = a.id) as authors
    from articles a
    left join subjects s on s.id = a.subject_id
    left join issues   i on i.id = a.issue_id
    order by a.created_at desc`);
}

export async function getArticleEdit(id) {
  const r = await q(`select * from articles where id = $1`, [id]);
  if (!r[0]) return null;
  const authorLinks = await q(
    `select author_id, author_position, is_corresponding
     from article_authors where article_id = $1 order by author_position`, [id]);
  const kw = await q(
    `select k.term from article_keywords ak join keywords k on k.id = ak.keyword_id
     where ak.article_id = $1`, [id]);
  return { ...r[0], authorLinks, keywords: kw.map((x) => x.term) };
}

export async function getArticlesByIssue() {
  return await q(`
    select a.id, a.slug, a.title, a.title_en, a.pages, a.type, a.issue_id, a.published_at,
      (select string_agg(au.full_name, ', ' order by aa.author_position)
         from article_authors aa join authors au on au.id = aa.author_id
         where aa.article_id = a.id) as authors
    from articles a
    order by a.published_at desc nulls last, a.created_at desc`);
}

export async function getArticlesForIssue(issueId) {
  return await q(`
    select a.id, a.slug, a.title, a.title_en, a.pages, a.type, a.published_at,
      (select string_agg(au.full_name, ', ' order by aa.author_position)
         from article_authors aa join authors au on au.id = aa.author_id
         where aa.article_id = a.id) as authors
    from articles a
    where a.issue_id = $1
    order by a.published_at desc nulls last, a.created_at desc`, [issueId]);
}
