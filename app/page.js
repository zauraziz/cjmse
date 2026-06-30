export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Cover from '@/components/Cover';
import ArticleCard from '@/components/ArticleCard';
import SubjectTile from '@/components/SubjectTile';
import TopPanel from '@/components/TopPanel';
import FaqAccordion from '@/components/FaqAccordion';
import {
  getMetrics, getSubjectsWithCounts, getCurrentIssue, getArticlesInIssue,
  getLatestArticles, getMostRead, getMostCited, getFaqs,
} from '@/lib/queries';
import { getT, getLang } from '@/lib/serverLang';

const OJS = process.env.NEXT_PUBLIC_OJS_URL || '#';

export default async function Home() {
  const t = getT();
  const lang = getLang();
  const current = await getCurrentIssue();
  const [metrics, subjects, latest, mostRead, mostCited, faqs, currentArticles] = await Promise.all([
    getMetrics(), getSubjectsWithCounts(), getLatestArticles(6), getMostRead(5),
    getMostCited(5), getFaqs(), current ? getArticlesInIssue(current.id) : Promise.resolve([]),
  ]);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero" id="current">
        <div className="wrap">
          <div className="hero__grid">
            <Cover volume={current?.volume ?? 27} number={current?.number ?? 2} year={current?.year ?? 2026} />
            <div className="hero__main">
              <div className="hero__issue">
                <span className="pulse" />{t.a_currentIssue} · {current?.title || (current ? `${t.a_vol} ${current.volume}, № ${current.number} (${current.year})` : `${t.a_vol} 27, № 2 (2026)`)}
              </div>
              <h1>{t.hero_title}</h1>
              <p style={{ fontFamily: 'var(--f-display)', fontSize: '1.18rem', color: 'var(--teal-d)', marginTop: 10, fontStyle: 'italic' }}>
                {t.hero_sub}
              </p>
              <p className="scope">{t.hero_desc}</p>
              <div className="hero__cta">
                <Link className="btn btn--primary" href="/articles">{t.hero_browse}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
                <Link className="btn btn--ghost" href="/issues">{t.a_archiveTitle}</Link>
              </div>
              <div className="hero__idx">
                <span className="idx-badge"><b>DOAJ</b></span>
                <span className="idx-badge"><b>CrossRef</b> DOI</span>
                <span className="idx-badge"><b>ORCID</b></span>
                <span className="idx-badge">Scopus/WoS <b>hazırlıq</b></span>
                <span className="idx-badge"><b>CC BY 4.0</b></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- METRICS ---------- */}
      <div className="mstrip">
        <div className="mstrip__c"><div className="mstrip__v">~28%</div><div className="mstrip__l">Qəbul faizi</div></div>
        <div className="mstrip__c"><div className="mstrip__v">≤ 10 həftə</div><div className="mstrip__l">İlk qərara qədər (orta)</div></div>
        <div className="mstrip__c"><div className="mstrip__v">100%</div><div className="mstrip__l">Açıq giriş · DOI əhatəsi</div></div>
        <div className="mstrip__c"><div className="mstrip__v">≥ 2</div><div className="mstrip__l">Müstəqil rəyçi / məqalə</div></div>
      </div>

      {/* ---------- SUBJECTS ---------- */}
      <section className="band band--sm" id="subjects">
        <div className="wrap">
          <h2 className="sec-title">Tədqiqat sahələri</h2>
          <div className="subjects">
            {subjects.map((s) => <SubjectTile key={s.slug} slug={s.slug} name={s.name_az} count={s.count} />)}
          </div>
        </div>
      </section>

      {/* ---------- BROWSE / LATEST ---------- */}
      <section className="band band-mist" id="browse">
        <div className="wrap">
          <h2 className="sec-title">Son məqalələr</h2>
          <div className="layout">
            <div>
              <div className="artlist">
                {latest.map((a) => <ArticleCard key={a.slug} a={a} />)}
              </div>
              <div style={{ marginTop: 22 }}>
                <Link className="btn btn--ghost" href="/articles">Bütün məqalələr
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
            </div>
            <aside className="side">
              <TopPanel mostRead={mostRead} mostCited={mostCited} />
              <div className="panel">
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.1rem', margin: '0 0 4px' }}>Cari nömrə</h3>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color: 'var(--muted)', marginBottom: 12 }}>
                  {current?.title} · {currentArticles.length} məqalə
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
                  {currentArticles.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/article/${a.slug}`} style={{ color: 'var(--ink)', fontWeight: 600, fontSize: 13.5, lineHeight: 1.35 }}>{a.title}</Link>
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>səh. {a.pages}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="band" id="faq">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <h2 className="sec-title">Tez-tez verilən suallar</h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
    </>
  );
}
