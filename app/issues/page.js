export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getIssuesWithCounts } from '@/lib/queries';
import { fmtDate } from '@/lib/format';

export const metadata = { title: 'Nömrələr' };

export default async function IssuesPage() {
  const issues = await getIssuesWithCounts();
  return (
    <section className="band">
      <div className="wrap">
        <h1 className="sec-title">Nömrələr</h1>
        <div className="subjects">
          {issues.map((i) => (
            <Link key={i.id} className="subj" href={`/articles?sort=date`} style={{ alignItems: 'flex-start' }}>
              <span className="subj__ic">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2V6a2 2 0 0 1 2-2z" />
                </svg>
              </span>
              <span>
                <span className="subj__n">
                  Cild {i.volume}, № {i.number} ({i.year}){i.is_current && <span className="oa" style={{ marginLeft: 8 }}>Cari</span>}
                </span>
                <span className="subj__c">{i.count} məqalə{i.published_at ? ' · ' + fmtDate(i.published_at) : ''}</span>
              </span>
            </Link>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--muted)', marginTop: 18 }}>
          Arxiv tam mətnləri ilə birlikdə CrossRef DOI vasitəsilə daimi olaraq əlçatandır.
        </p>
      </div>
    </section>
  );
}
