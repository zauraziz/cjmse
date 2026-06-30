import Link from 'next/link';
import { fmtViews, fmtDate } from '@/lib/format';
import { typeLabel } from '@/lib/i18n';

export default function ArticleCard({ a, t, lang = 'az' }) {
  const tr = t || {};
  const title = (lang === 'en' && a.title_en) ? a.title_en : (lang === 'ru' && a.title_ru) ? a.title_ru : a.title;
  const subject = (lang === 'en' && a.subject_en) ? a.subject_en : (lang === 'ru' && a.subject_ru) ? a.subject_ru : a.subject_az;
  const issueLabel = a.issue_title || (a.issue_volume ? `${tr.a_vol || 'Cild'} ${a.issue_volume}, № ${a.issue_number} (${a.issue_year})` : '');
  const formats = ['HTML', 'PDF'];
  if (a.data_url) formats.push('Data');
  return (
    <article className="art">
      <div className="art__top">
        <span className="type-tag">{typeLabel(tr, a.type)}</span>
        <span className="art__subj">{subject}</span>
        <span className="oa">{tr.a_openAccess || 'Açıq giriş'}</span>
      </div>
      <h3 className="art__title"><Link href={`/article/${a.slug}`}>{title}</Link></h3>
      <div className="art__authors">{a.authors}</div>
      <div className="art__meta">
        <span>{issueLabel}</span>
        <span>{tr.a_pagesAbbr || 'səh.'} {a.pages}</span>
        <span>{fmtDate(a.published_at)}</span>
        {a.doi && <span className="doi">DOI: {a.doi}</span>}
      </div>
      <div className="art__foot">
        <span className="fmts">{formats.map((f) => <span key={f} className="fmt-chip">{f}</span>)}</span>
        <span className="art__stat">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
          {fmtViews(a.views)} {tr.a_reads || 'oxunma'}
        </span>
        <span className="art__stat">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 8h10M7 12h6M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          {a.citations} {tr.a_cites || 'istinad'}
        </span>
      </div>
    </article>
  );
}
