export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ArticleCard from '@/components/ArticleCard';
import ArticlesToolbar from '@/components/ArticlesToolbar';
import { getArticles, getSubjectsWithCounts } from '@/lib/queries';

export const metadata = { title: 'Məqalələr' };

export default async function ArticlesPage({ searchParams }) {
  const query = searchParams?.q || '';
  const subject = searchParams?.subject || 'all';
  const sort = searchParams?.sort || 'date';

  const [articles, subjects] = await Promise.all([
    getArticles({ query, subject, sort }),
    getSubjectsWithCounts(),
  ]);
  const subjName = subjects.find((s) => s.slug === subject)?.name_az;

  return (
    <section className="band">
      <div className="wrap">
        <h1 className="sec-title">Məqalələr</h1>
        <Suspense fallback={null}>
          <ArticlesToolbar subjects={subjects} />
        </Suspense>
        <div className="reslabel">
          {articles.length} məqalə{subjName ? ' · ' + subjName : ''}{query ? ' · «' + query + '»' : ''}
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
