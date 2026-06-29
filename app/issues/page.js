export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getIssuesWithCounts } from '@/lib/queries';
import { fmtDate } from '@/lib/format';
import { getT } from '@/lib/serverLang';

export const metadata = { title: 'Arxiv' };

export default async function IssuesArchive() {
  const issues = await getIssuesWithCounts();
  const t = getT();
  return (
    <section className="band">
      <div className="wrap">
        <h1 className="sec-title">{t.a_archiveTitle}</h1>
        <p style={{ color: 'var(--muted)', margin: '-6px 0 20px', fontSize: 14.5 }}>{t.a_archiveIntro}</p>
        {issues.length === 0 && <p style={{ color: 'var(--muted)' }}>{t.a_noIssues}</p>}
        <div className="subjects">
          {issues.map((i) => (
            <Link key={i.id} className="subj" href={`/issues/${i.id}`} style={{ alignItems: 'flex-start' }}>
              <span className="subj__ic">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2V6a2 2 0 0 1 2-2z" />
                </svg>
              </span>
              <span>
                <span className="subj__n">
                  {t.a_vol} {i.volume}, № {i.number} ({i.year}){i.is_current && <span className="oa" style={{ marginLeft: 8 }}>{t.a_current}</span>}
                </span>
                <span className="subj__c">{i.count} {t.a_count}{i.published_at ? ' · ' + fmtDate(i.published_at) : ''}</span>
              </span>
            </Link>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>{t.a_archiveCrossref}</p>
      </div>
    </section>
  );
}
