export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIssueById, getArticlesForIssue } from '@/lib/queries';
import { fmtDate } from '@/lib/format';
import { getLang, getT } from '@/lib/serverLang';
import { typeLabel } from '@/lib/i18n';

export async function generateMetadata({ params }) {
  const i = await getIssueById(params.id);
  if (!i) return { title: 'Nömrə tapılmadı' };
  return { title: `Cild ${i.volume}, № ${i.number} (${i.year})` };
}

export default async function IssuePage({ params }) {
  const issue = await getIssueById(params.id);
  if (!issue) notFound();
  const arts = await getArticlesForIssue(params.id);
  const lang = getLang();
  const t = getT();
  const titleOf = (art) => (lang === 'en' && art.title_en) ? art.title_en : (lang === 'ru' && art.title_ru) ? art.title_ru : art.title;

  return (
    <section className="band">
      <div className="wrap">
        <div style={{ marginBottom: 16 }}>
          <Link href="/issues" style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--teal-d)' }}>{t.a_backToArchive}</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', borderBottom: '2px solid var(--line)', paddingBottom: 12, marginBottom: 16 }}>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', margin: 0 }}>
            {t.a_vol} {issue.volume}, № {issue.number} ({issue.year})
          </h1>
          {issue.is_current && <span className="oa">{t.a_currentIssue}</span>}
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--muted)' }}>
            {arts.length} {t.a_count}{issue.published_at ? ' · ' + fmtDate(issue.published_at) : ''}
          </span>
        </div>
        {issue.title && <p style={{ color: 'var(--ink-2)', margin: '-6px 0 16px' }}>{issue.title}</p>}
        {arts.length === 0 && <p style={{ color: 'var(--muted)' }}>{t.a_noArtInIssue}</p>}
        {arts.map((art) => (
          <div className="art" key={art.id}>
            <div className="art__top">
              <span className="type-tag">{typeLabel(t, art.type)}</span>
              {art.pages && <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--muted)' }}>{t.a_pagesAbbr} {art.pages}</span>}
            </div>
            <h3 style={{ margin: '6px 0 4px', fontSize: '1.05rem', fontFamily: 'var(--f-display)' }}>
              <Link href={`/article/${art.slug}`} style={{ color: 'var(--ink)' }}>{titleOf(art)}</Link>
            </h3>
            {art.authors && <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 2 }}>{art.authors}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
