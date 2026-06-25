export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getIssuesWithCounts, getArticlesByIssue } from '@/lib/queries';
import { fmtDate, TYPE_LABEL } from '@/lib/format';

export const metadata = { title: 'Nömrələr' };

export default async function IssuesPage() {
  const [issues, articles] = await Promise.all([getIssuesWithCounts(), getArticlesByIssue()]);
  const byIssue = {};
  for (const art of articles) {
    const k = art.issue_id || 'none';
    (byIssue[k] = byIssue[k] || []).push(art);
  }
  return (
    <section className="band">
      <div className="wrap">
        <h1 className="sec-title">Nömrələr üzrə məqalələr</h1>
        {issues.length === 0 && <p style={{ color: 'var(--muted)' }}>Hələ nömrə yoxdur.</p>}
        {issues.map((i) => {
          const arts = byIssue[i.id] || [];
          return (
            <div key={i.id} style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', borderBottom: '2px solid var(--line)', paddingBottom: 10, marginBottom: 12 }}>
                <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '1.3rem', color: 'var(--ink)', margin: 0 }}>
                  Cild {i.volume}, № {i.number} ({i.year})
                </h2>
                {i.is_current && <span className="oa">Cari nömrə</span>}
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--muted)' }}>
                  {arts.length} məqalə{i.published_at ? ' · ' + fmtDate(i.published_at) : ''}
                </span>
              </div>
              {arts.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Bu nömrədə hələ məqalə yoxdur.</p>}
              {arts.map((art) => (
                <div className="art" key={art.id} style={{ paddingTop: 14, paddingBottom: 14 }}>
                  <div className="art__top">
                    <span className="type-tag">{TYPE_LABEL[art.type] || art.type}</span>
                    {art.pages && <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--muted)' }}>səh. {art.pages}</span>}
                  </div>
                  <h3 style={{ margin: '6px 0 4px', fontSize: '1.05rem', fontFamily: 'var(--f-display)' }}>
                    <Link href={`/article/${art.slug}`} style={{ color: 'var(--ink)' }}>{art.title}</Link>
                  </h3>
                  {art.authors && <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{art.authors}</div>}
                </div>
              ))}
            </div>
          );
        })}
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--muted)', marginTop: 10 }}>
          Arxiv tam mətnləri ilə birlikdə CrossRef DOI vasitəsilə daimi olaraq əlçatandır.
        </p>
      </div>
    </section>
  );
}
