export const dynamic = 'force-dynamic';

import { getMetrics } from '@/lib/queries';

export const metadata = { title: 'Haqqında' };

const BOARD = [
  { n: 'Prof. Dr. ___', r: 'Baş redaktor', a: 'ADDA · Dəniz nəqliyyatı' },
  { n: 'Dos. Dr. ___', r: 'Baş redaktor müavini', a: 'ADDA · Gəmi energetikası' },
  { n: 'Prof. Dr. ___', r: 'Bölmə redaktoru', a: 'Beynəlxalq · Hidrotexnika' },
  { n: 'Dr. ___', r: 'Bölmə redaktoru', a: 'Beynəlxalq · Dəniz IT' },
  { n: 'Prof. Dr. ___', r: 'Redaksiya heyəti', a: 'Beynəlxalq · Logistika' },
  { n: 'Dos. Dr. ___', r: 'Redaksiya heyəti', a: 'ADDA · Elektrotexnika' },
  { n: 'Dr. ___', r: 'Redaksiya heyəti', a: 'Beynəlxalq · Ekologiya' },
  { n: '___', r: 'Məsul katib', a: 'ADDA · Redaksiya' },
];

export default async function AboutPage() {
  const m = await getMetrics();
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 860 }}>
        <h1 className="sec-title">Jurnal haqqında</h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          «Elmi Əsərləri» — Caspian Journal of Maritime Science &amp; Engineering (CJMSE) — Azərbaycan Dövlət Dəniz
          Akademiyasının resenziyalı, açıq girişli elmi jurnalıdır. Əhatə dairəsi: dəniz nəqliyyatı və naviqasiya, gəmi
          energetikası, elektrotexnika və avtomatika, hidrotexnika, logistika, dəniz ekologiyası, gəmiqayırma və rəqəmsal
          dəniz texnologiyaları.
        </p>

        <div className="mstrip" style={{ margin: '24px 0', borderRadius: 14 }}>
          <div className="mstrip__c"><div className="mstrip__v">{m.articles}</div><div className="mstrip__l">Dərc olunmuş məqalə</div></div>
          <div className="mstrip__c"><div className="mstrip__v">{m.issues}</div><div className="mstrip__l">Nömrə</div></div>
          <div className="mstrip__c"><div className="mstrip__v">{m.authors}</div><div className="mstrip__l">Müəllif</div></div>
          <div className="mstrip__c"><div className="mstrip__v">{m.citations}</div><div className="mstrip__l">İstinad</div></div>
        </div>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>İndeksləşmə və standartlar</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          CrossRef DOI · ORCID · JATS XML metadata · DOAJ · CC BY 4.0 · PKP Preservation Network. Scopus və Web of Science
          üzrə müraciət hazırlığı davam edir. ISSN: XXXX-XXXX (online).
        </p>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>Redaksiya heyəti</h2>
        <div className="board">
          {BOARD.map((b, i) => (
            <div className="bm" key={i}>
              <div className="bm__av" aria-hidden="true" />
              <div>
                <div className="bm__n">{b.n}</div>
                <div className="bm__r">{b.r}</div>
                <div className="bm__a">{b.a}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>
          Qeyd: redaksiya heyətinin adları, mənsubiyyət və ORCID identifikatorları real dəyərlərlə əvəz olunmalıdır.
        </p>
      </div>
    </section>
  );
}
