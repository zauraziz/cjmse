import Link from 'next/link';
import { fmtViews, fmtDate, TYPE_LABEL } from '@/lib/format';

export default function ArticleCard({ a }) {
  const formats = ['HTML', 'PDF'];
  if (a.data_url) formats.push('Data');
  return (
    <article className="art">
      <div className="art__top">
        <span className="type-tag">{TYPE_LABEL[a.type] || a.type}</span>
        <span className="art__subj">{a.subject_az}</span>
        <span className="oa">Açıq giriş</span>
      </div>
      <h3 className="art__title"><Link href={`/article/${a.slug}`}>{a.title}</Link></h3>
      <div className="art__authors">{a.authors}</div>
      <div className="art__meta">
        <span>{a.issue_title}</span>
        <span>səh. {a.pages}</span>
        <span>{fmtDate(a.published_at)}</span>
        <span className="doi">DOI: {a.doi}</span>
      </div>
      <div className="art__foot">
        <span className="fmts">{formats.map((f) => <span key={f} className="fmt-chip">{f}</span>)}</span>
        <span className="art__stat">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
          {fmtViews(a.views)} oxunma
        </span>
        <span className="art__stat">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 8h10M7 12h6M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          {a.citations} istinad
        </span>
      </div>
    </article>
  );
}
