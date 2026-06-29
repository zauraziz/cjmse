export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ArticleCard from '@/components/ArticleCard';
import ArticlesToolbar from '@/components/ArticlesToolbar';
import { getArticles, getSubjectsWithCounts, getIssuesWithCounts } from '@/lib/queries';

export const metadata = { title: 'Məqalələr' };

export default async function ArticlesPage({ searchParams }) {
  const query = searchParams?.q || '';
  const subject = searchParams?.subject || 'all';
  const issue = searchParams?.issue || 'all';
  const sort = searchParams?.sort || 'date';

  const [articles, subjects, issues] = await Promise.all([
    getArticles({ query, subject, sort, issue }),
    getSubjectsWithCounts(),
    getIssuesWithCounts(),
  ]);
  const subjName = subjects.find((s) => s.slug === subject)?.name_az;
  const iss = issues.find((i) => String(i.id) === String(issue));
  const issLabel = iss ? (iss.title || `Cild ${iss.volume}, № ${iss.number} (${iss.year})`) : '';

  return (
    <section className="band">
      <div className="wrap">
        <h1 className="sec-title">Məqalələr</h1>
        <Suspense fallback={null}>
          <ArticlesToolbar subjects={subjects} issues={issues} />
        </Suspense>
        <div className="reslabel">
          {articles.length} məqalə{subjName ? ' · ' + subjName : ''}{issLabel ? ' · ' + issLabel : ''}{query ? ' · «' + query + '»' : ''}
        </div>
        {articles.length ? (
          <div className="artlist">
            {articles.map((a) => <ArticleCard key={a.slug} a={a} />)}
          </div>
        ) : (
          <div className="empty">Bu meyarlara uyğun məqalə tapılmadı. Filtri sıfırlayın və ya başqa açar söz yoxlayın.</div>
        )}
      </div>
    </section>
  );
}
