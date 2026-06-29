export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIssueById, getArticlesForIssue } from '@/lib/queries';
import { fmtDate, TYPE_LABEL } from '@/lib/format';

export async function generateMetadata({ params }) {
  const i = await getIssueById(params.id);
  if (!i) return { title: 'Nömrə tapılmadı' };
  return { title: `Cild ${i.volume}, № ${i.number} (${i.year})` };
}

export default async function IssuePage({ params }) {
  const issue = await getIssueById(params.id);
  if (!issue) notFound();
  const arts = await getArticlesForIssue(params.id);
  return (
    <section className="band">
      <div className="wrap">
        <div style={{ marginBottom: 16 }}>
          <Link href="/issues" style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--teal-d)' }}>← Arxiv</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', borderBottom: '2px solid var(--line)', paddingBottom: 12, marginBottom: 16 }}>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', margin: 0 }}>
            Cild {issue.volume}, № {issue.number} ({issue.year})
          </h1>
          {issue.is_current && <span className="oa">Cari nömrə</span>}
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--muted)' }}>
            {arts.length} məqalə{issue.published_at ? ' · ' + fmtDate(issue.published_at) : ''}
          </span>
        </div>
        {issue.title && <p style={{ color: 'var(--ink-2)', margin: '-6px 0 16px' }}>{issue.title}</p>}
        {arts.length === 0 && <p style={{ color: 'var(--muted)' }}>Bu nömrədə hələ məqalə yoxdur.</p>}
        {arts.map((art) => (
          <div className="art" key={art.id}>
            <div className="art__top">
              <span className="type-tag">{TYPE_LABEL[art.type] || art.type}</span>
              {art.pages && <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--muted)' }}>səh. {art.pages}</span>}
            </div>
            <h3 style={{ margin: '6px 0 4px', fontSize: '1.05rem', fontFamily: 'var(--f-display)' }}>
              <Link href={`/article/${art.slug}`} style={{ color: 'var(--ink)' }}>{art.title}</Link>
            </h3>
            {art.title_en && <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--teal-d)' }}>{art.title_en}</div>}
            {art.authors && <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 2 }}>{art.authors}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
