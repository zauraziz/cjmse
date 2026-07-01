export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/queries';
import { fmtDate } from '@/lib/format';
import { getLang, getT } from '@/lib/serverLang';
import { typeLabel } from '@/lib/i18n';
import CitationBlock from '@/components/CitationBlock';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cjmse.adda.edu.az';

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
    citation_pdf_url: a.pdf_url ? (a.pdf_url.startsWith('http') ? a.pdf_url : `${SITE}${a.pdf_url}`) : '',
    citation_keywords: a.keywords || a.keywords_en || '',
    'DC.title': a.title,
    'DC.creator': authorsMeta,
    'DC.date': iso,
    'DC.identifier': a.doi ? `https://doi.org/${a.doi}` : url,
    'DC.publisher': 'ADDA',
    'DC.language': a.language || 'az',
    'DC.rights': a.license || 'CC BY 4.0',
    'DC.subject': a.keywords_en || a.keywords || '',
  };
  for (const k of Object.keys(other)) {
    const v = other[k];
    if (v === '' || v == null || (Array.isArray(v) && v.length === 0)) delete other[k];
  }

  return { title: a.title, description: a.abstract || undefined, alternates: { canonical: url }, other };
}

export default async function ArticlePage({ params }) {
  const a = await getArticleBySlug(params.slug);
  if (!a) notFound();
  const authors = a.authors || [];
  const lang = getLang();
  const t = getT();

  const titleByLang = { az: a.title, en: a.title_en, ru: a.title_ru };
  const displayTitle = titleByLang[lang] || a.title;
  const otherTitles = ['az', 'en', 'ru']
    .filter((l) => l !== lang && titleByLang[l] && titleByLang[l] !== displayTitle)
    .map((l) => ({ code: l, text: titleByLang[l] }));

  const subjByLang = { az: a.subject_az, en: a.subject_en, ru: a.subject_ru };
  const subjectName = subjByLang[lang] || a.subject_az;

  const absByLang = [
    { code: 'az', label: 'Xülasə', text: a.abstract },
    { code: 'en', label: 'Abstract (English)', text: a.abstract_en },
    { code: 'ru', label: 'Аннотация', text: a.abstract_ru },
  ];
  const orderedAbs = [...absByLang]
    .sort((x, y) => (x.code === lang ? -1 : y.code === lang ? 1 : 0))
    .filter((b) => b.text);

  const kwByLang = [
    { code: 'az', label: t.a_kwAz, text: a.keywords },
    { code: 'en', label: t.a_kwEn, text: a.keywords_en },
    { code: 'ru', label: t.a_kwRu, text: a.keywords_ru },
  ];
  const orderedKw = [...kwByLang]
    .sort((x, y) => (x.code === lang ? -1 : y.code === lang ? 1 : 0))
    .filter((b) => b.text);

  const isoPub = a.published_at ? new Date(a.published_at).toISOString().slice(0, 10) : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: a.title,
    name: a.title,
    inLanguage: a.language || 'az',
    url: `${SITE}/article/${a.slug}`,
    ...(isoPub ? { datePublished: isoPub } : {}),
    author: authors.map((au) => ({ '@type': 'Person', name: au.full_name, ...(au.orcid ? { identifier: `https://orcid.org/${au.orcid}` } : {}) })),
    publisher: { '@type': 'Organization', name: 'Azerbaijan State Marine Academy (ADDA)' },
    isPartOf: { '@type': 'PublicationIssue', ...(a.number ? { issueNumber: String(a.number) } : {}), isPartOf: { '@type': 'PublicationVolume', ...(a.volume ? { volumeNumber: String(a.volume) } : {}), name: 'Caspian Journal of Maritime Science & Engineering' } },
    ...(a.abstract ? { abstract: a.abstract } : {}),
    ...(a.keywords ? { keywords: a.keywords } : {}),
    ...(a.doi ? { sameAs: `https://doi.org/${a.doi}`, identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: a.doi } } : {}),
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
  };

  return (
    <section className="band">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap" style={{ maxWidth: 860 }}>
        <div style={{ marginBottom: 18 }}>
          <Link href="/articles" style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--teal-d)' }}>{t.a_backToArticles}</Link>
        </div>

        <div className="art__top">
          <span className="type-tag">{typeLabel(t, a.type)}</span>
          <Link className="art__subj" href={`/articles?subject=${a.subject_slug}`}>{subjectName}</Link>
          <span className="oa">{t.a_openAccess}</span>
        </div>

        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '2rem', lineHeight: 1.2, margin: '10px 0 6px' }}>{displayTitle}</h1>
        {otherTitles.map((ot) => (
          <p key={ot.code} style={{ fontFamily: 'var(--f-display)', fontSize: '1.12rem', fontStyle: 'italic', color: 'var(--teal-d)', margin: '0 0 4px' }}>
            {ot.text}{ot.code === 'az' && lang !== 'az' ? <span style={{ fontFamily: 'var(--f-mono)', fontStyle: 'normal', fontSize: 11, color: 'var(--muted)' }}> — {t.a_original}</span> : null}
          </p>
        ))}

        <div style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.7, marginTop: 8 }}>
          {authors.map((au, i) => (
            <span key={i}>
              <Link href={`/author/${au.author_id}`} style={{ color: 'var(--ink)', fontWeight: 500 }}>{au.full_name}</Link>
              {au.orcid && (
                <a href={`https://orcid.org/${au.orcid}`} target="_blank" rel="noopener noreferrer" title="ORCID" style={{ color: '#A6CE39', marginLeft: 4, fontWeight: 700 }}>iD</a>
              )}
              {au.is_corresponding && <sup title={t.a_corresponding}> ✉</sup>}
              {i < authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        {authors.some((au) => au.affiliation) && (
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
            {[...new Set(authors.map((au) => au.affiliation).filter(Boolean))].join(' · ')}
          </div>
        )}
        {authors.some((au) => au.research_group) && (
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
            {t.a_group}: {[...new Set(authors.map((au) => au.research_group).filter(Boolean))].join(' · ')}
          </div>
        )}

        <div className="art__meta" style={{ marginTop: 14 }}>
          {a.udc && <span>{t.a_udc}: {a.udc}</span>}
          <span>{a.issue_title || (a.issue_volume ? `${t.a_vol} ${a.issue_volume}, № ${a.issue_number} (${a.issue_year})` : (a.volume ? `${t.a_vol} ${a.volume}, № ${a.number} (${a.year})` : ""))}</span>
          <span>{t.a_pagesAbbr} {a.pages}</span>
          <span>{fmtDate(a.published_at)}</span>
          {a.doi && <a className="doi" href={`https://doi.org/${a.doi}`} target="_blank" rel="noopener noreferrer">DOI: {a.doi}</a>}
          <span>{a.license || 'CC BY 4.0'}</span>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '22px 0' }}>
          {a.pdf_url && <a className="btn btn--primary" href={a.pdf_url} download={`${a.slug}.pdf`}>{t.a_pdfDownload}</a>}
          {a.data_url && <a className="btn btn--ghost" href={a.data_url} target="_blank" rel="noopener noreferrer">{t.a_researchData}</a>}
        </div>

        {orderedAbs.map((b) => (
          <div key={b.code} style={{ marginTop: 22 }}>
            <h2 className="abs-h">{b.label}</h2>
            <p className="abs-t">{b.text}</p>
          </div>
        ))}

        {orderedKw.length > 0 && (
          <div style={{ marginTop: 18 }}>
            {orderedKw.map((b) => (
              <p key={b.code} style={{ fontSize: 14, color: '#111', margin: '4px 0' }}>
                <b style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--muted)' }}>{b.label}: </b>{b.text}
              </p>
            ))}
          </div>
        )}

        {a.pdf_url && (
          <div style={{ marginTop: 26 }}>
            <h2 className="abs-h">{t.a_fullText}</h2>
            <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: 'var(--shadow)' }}>
              <object data={a.pdf_url} type="application/pdf" style={{ width: '100%', height: '78vh', display: 'block' }}>
                <iframe src={a.pdf_url} title={t.a_fullText} style={{ width: '100%', height: '78vh', border: 'none' }} />
              </object>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 8 }}>
              {t.a_pdfNotShown} <a href={a.pdf_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>{t.a_openNew}</a> {lang === 'az' ? 'və ya' : lang === 'ru' ? 'или' : 'or'} <a href={a.pdf_url} download={`${a.slug}.pdf`} style={{ color: 'var(--teal-d)' }}>{t.a_orDownload}</a>.
            </p>
          </div>
        )}

        <CitationBlock
          label={t.a_citeAs}
          copyText={`${authors.map((au) => au.full_name).join(', ')} (${a.year}). ${a.title}. Caspian Journal of Maritime Science & Engineering, ${a.volume}(${a.number}), ${a.pages}.${a.doi ? ' https://doi.org/' + a.doi : ''}`}
        >
          {authors.map((au) => au.full_name).join(', ')} ({a.year}). {a.title}. <i>Caspian Journal of Maritime Science &amp; Engineering</i>, {a.volume}({a.number}), {a.pages}.{a.doi ? ' https://doi.org/' + a.doi : ''}
        </CitationBlock>
      </div>
    </section>
  );
}
