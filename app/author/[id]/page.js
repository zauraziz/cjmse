export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAuthorPublic } from '@/lib/queries';
import { fmtDate } from '@/lib/format';
import { getLang, getT } from '@/lib/serverLang';
import { typeLabel } from '@/lib/i18n';

export async function generateMetadata({ params }) {
  const a = await getAuthorPublic(params.id);
  if (!a) return { title: 'Müəllif tapılmadı' };
  return { title: a.full_name };
}

export default async function AuthorPage({ params }) {
  const author = await getAuthorPublic(params.id);
  if (!author) notFound();
  const lang = getLang();
  const t = getT();
  const titleOf = (art) => (lang === 'en' && art.title_en) ? art.title_en : (lang === 'ru' && art.title_ru) ? art.title_ru : art.title;

  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <div style={{ marginBottom: 16 }}>
          <Link href="/articles" style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--teal-d)' }}>{t.a_backToArticles}</Link>
        </div>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '1.9rem', margin: '0 0 8px' }}>
          {author.full_name}
          {author.orcid && <a href={`https://orcid.org/${author.orcid}`} target="_blank" rel="noopener noreferrer" title="ORCID" style={{ color: '#A6CE39', marginLeft: 8, fontWeight: 700, fontSize: '1rem' }}>iD</a>}
        </h1>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--muted)', lineHeight: 2 }}>
          {author.affiliation && <div>{t.a_affiliation}: <span style={{ color: 'var(--ink-2)' }}>{author.affiliation}</span></div>}
          {author.orcid && <div>{t.a_orcid}: <a href={`https://orcid.org/${author.orcid}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>{author.orcid}</a></div>}
          {author.email && <div>{t.a_email}: <a href={`mailto:${author.email}`} style={{ color: 'var(--teal-d)' }}>{author.email}</a></div>}
        </div>

        <h2 className="abs-h" style={{ marginTop: 24 }}>{t.a_authorArticles} ({author.articles.length})</h2>
        {author.articles.length === 0 && <p style={{ color: 'var(--muted)' }}>{t.a_authorNoArticles}</p>}
        {author.articles.map((art) => (
          <div className="art" key={art.slug}>
            <div className="art__top">
              <span className="type-tag">{typeLabel(t, art.type)}</span>
              {art.pages && <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--muted)' }}>{t.a_pagesAbbr} {art.pages}</span>}
              {art.is_corresponding && <span className="oa" title={t.a_corresponding}>✉</span>}
            </div>
            <h3 style={{ margin: '6px 0 4px', fontSize: '1.05rem', fontFamily: 'var(--f-display)' }}>
              <Link href={`/article/${art.slug}`} style={{ color: 'var(--ink)' }}>{titleOf(art)}</Link>
            </h3>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              {art.issue_title || (art.volume ? `Cild ${art.volume}, № ${art.number} (${art.year})` : '')}
              {art.published_at ? ' · ' + fmtDate(art.published_at) : ''}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
