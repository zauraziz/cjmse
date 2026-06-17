export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/queries';
import { fmtDate, fmtViews, TYPE_LABEL } from '@/lib/format';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cjmse.adda.edu.az';
const OJS = process.env.NEXT_PUBLIC_OJS_URL || '#';

export async function generateMetadata({ params }) {
  const a = await getArticleBySlug(params.slug);
  if (!a) return { title: 'Məqalə tapılmadı' };
  const pages = (a.pages || '').split(/[–-]/);
  const authorsMeta = (a.authors || []).map((au) => au.full_name);
  const url = `${SITE}/article/${a.slug}`;
  const iso = a.published_at ? new Date(a.published_at).toISOString().slice(0, 10) : '';

  const other = {
    citation_title: a.title,
    citation_journal_title: 'Caspian Journal of Maritime Science & Engineering',
    citation_publisher: 'Azərbaycan Dövlət Dəniz Akademiyası (ADDA)',
    citation_author: authorsMeta,
    citation_publication_date: iso ? iso.replace(/-/g, '/') : '',
    citation_volume: a.volume ? String(a.volume) : '',
    citation_issue: a.number ? String(a.number) : '',
    citation_firstpage: pages[0] || '',
    citation_lastpage: pages[1] || '',
    citation_doi: a.doi || '',
    citation_language: a.language || 'az',
    citation_abstract_html_url: url,
    citation_pdf_url: a.pdf_url ? `${SITE}${a.pdf_url}` : '',
    'DC.title': a.title,
    'DC.creator': authorsMeta,
    'DC.date': iso,
    'DC.identifier': a.doi ? `https://doi.org/${a.doi}` : url,
    'DC.publisher': 'ADDA',
    'DC.language': a.language || 'az',
    'DC.rights': a.license || 'CC BY 4.0',
  };
  for (const k of Object.keys(other)) {
    const v = other[k];
    if (v === '' || v == null || (Array.isArray(v) && v.length === 0)) delete other[k];
  }

  return {
    title: a.title,
    description: a.abstract || undefined,
    alternates: { canonical: url },
    other,
  };
}

export default async function ArticlePage({ params }) {
  const a = await getArticleBySlug(params.slug);
  if (!a) notFound();
  const authors = a.authors || [];

  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 860 }}>
        <div style={{ marginBottom: 18 }}>
          <Link href="/articles" style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--teal-d)' }}>← Bütün məqalələr</Link>
        </div>

        <div className="art__top">
          <span className="type-tag">{TYPE_LABEL[a.type] || a.type}</span>
          <Link className="art__subj" href={`/articles?subject=${a.subject_slug}`}>{a.subject_az}</Link>
          <span className="oa">Açıq giriş</span>
        </div>

        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '2rem', lineHeight: 1.2, margin: '10px 0 14px' }}>{a.title}</h1>

        <div style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.7 }}>
          {authors.map((au, i) => (
            <span key={i}>
              {au.full_name}
              {au.orcid && (
                <a href={`https://orcid.org/${au.orcid}`} target="_blank" rel="noopener noreferrer" title="ORCID" style={{ color: '#A6CE39', marginLeft: 4, fontWeight: 700 }}>iD</a>
              )}
              {au.is_corresponding && <sup title="Əlaqələndirici müəllif"> ✉</sup>}
              {i < authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        {authors.some((au) => au.affiliation) && (
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
            {[...new Set(authors.map((au) => au.affiliation).filter(Boolean))].join(' · ')}
          </div>
        )}

        <div className="art__meta" style={{ marginTop: 14 }}>
          <span>{a.issue_title}</span>
          <span>səh. {a.pages}</span>
          <span>{fmtDate(a.published_at)}</span>
          {a.doi && <a className="doi" href={`https://doi.org/${a.doi}`} target="_blank" rel="noopener noreferrer">DOI: {a.doi}</a>}
          <span>{a.license || 'CC BY 4.0'}</span>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '22px 0' }}>
          {a.pdf_url && <a className="btn btn--primary" href={a.pdf_url} target="_blank" rel="noopener noreferrer">Tam mətn (PDF)</a>}
          {a.data_url && <a className="btn btn--ghost" href={a.data_url} target="_blank" rel="noopener noreferrer">Research data</a>}
          <a className="btn btn--ghost" href={OJS} target="_blank" rel="noopener noreferrer">OJS-də bax</a>
        </div>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>Xülasə</h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-2)' }}>{a.abstract}</p>

        <div className="panel" style={{ marginTop: 24 }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
            <b style={{ color: 'var(--ink)' }}>İstinad:</b> {authors.map((au) => au.full_name).join(', ')} ({a.year}). {a.title}. <i>Caspian Journal of Maritime Science &amp; Engineering</i>, {a.volume}({a.number}), {a.pages}.{a.doi ? ' https://doi.org/' + a.doi : ''}
          </div>
        </div>
      </div>
    </section>
  );
}
