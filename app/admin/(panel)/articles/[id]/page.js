import { getArticleEdit, getSubjectsWithCounts, getIssuesWithCounts, getAuthorsAdmin } from '@/lib/queries';
import { createArticle, updateArticle } from '../../../actions';
import ArticleForm from '@/components/admin/ArticleForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ArticleEditOrNew({ params, searchParams }) {
  const isNew = params.id === 'new';
  const saved = searchParams?.saved;
  const [subjects, issues, authors] = await Promise.all([
    getSubjectsWithCounts(), getIssuesWithCounts(), getAuthorsAdmin(),
  ]);
  const article = isNew ? null : await getArticleEdit(params.id);
  if (!isNew && !article) notFound();
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <Link href="/admin/articles" style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--teal-d)' }}>← Məqalələr</Link>
      </div>
      <h1 className="adm-h1">{isNew ? 'Yeni məqalə əlavə et' : 'Məqaləni redaktə et'}</h1>
      {isNew && saved && (
        <div style={{ background: '#e7f6ec', color: '#1a7f37', border: '1px solid #acdcb8', borderRadius: 10, padding: '11px 14px', fontSize: 14, marginBottom: 16 }}>
          ✓ Məqalə yadda saxlanıldı. Aşağıda yeni boş forma — növbəti məqaləni əlavə edə bilərsiniz.
        </div>
      )}
      <div className="adm-sec">
        <ArticleForm
          key={isNew ? (saved || 'new') : article.id}
          action={isNew ? createArticle : updateArticle}
          subjects={subjects} issues={issues} allAuthors={authors} article={article}
        />
      </div>
    </div>
  );
}
