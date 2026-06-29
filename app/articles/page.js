export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ArticleCard from '@/components/ArticleCard';
import ArticlesToolbar from '@/components/ArticlesToolbar';
import { getArticles, getSubjectsWithCounts, getIssuesWithCounts } from '@/lib/queries';
import { getLang, getT } from '@/lib/serverLang';

export const metadata = { title: 'Məqalələr' };

export default async function ArticlesPage({ searchParams }) {
  const query = searchParams?.q || '';
  const subject = searchParams?.subject || 'all';
  const issue = searchParams?.issue || 'all';
  const sort = searchParams?.sort || 'date';
  const lang = getLang();
  const t = getT();

  const [articles, subjects, issues] = await Promise.all([
    getArticles({ query, subject, sort, issue }),
    getSubjectsWithCounts(),
    getIssuesWithCounts(),
  ]);
  const subjNameOf = (s) => (lang === 'en' && s.name_en) ? s.name_en : (lang === 'ru' && s.name_ru) ? s.name_ru : s.name_az;
  const subjMatch = subjects.find((s) => s.slug === subject);
  const subjName = subjMatch ? subjNameOf(subjMatch) : '';
  const iss = issues.find((i) => String(i.id) === String(issue));
  const issLabel = iss ? (iss.title || `Cild ${iss.volume}, № ${iss.number} (${iss.year})`) : '';

  return (
    <section className="band">
      <div className="wrap">
        <h1 className="sec-title">{t.a_articlesTitle}</h1>
        <Suspense fallback={null}>
          <ArticlesToolbar subjects={subjects} issues={issues} t={t} lang={lang} />
        </Suspense>
        <div className="reslabel">
          {articles.length} {t.a_count}{subjName ? ' · ' + subjName : ''}{issLabel ? ' · ' + issLabel : ''}{query ? ' · «' + query + '»' : ''}
        </div>
        {articles.length ? (
          <div className="artlist">
            {articles.map((a) => <ArticleCard key={a.slug} a={a} t={t} lang={lang} />)}
          </div>
        ) : (
          <div className="empty">{t.a_noMatch}</div>
        )}
      </div>
    </section>
  );
}
