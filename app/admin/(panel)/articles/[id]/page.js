import { getArticleEdit, getSubjectsWithCounts, getIssuesWithCounts, getAuthorsAdmin } from '@/lib/queries';
import { updateArticle } from '../../../actions';
import ArticleForm from '@/components/admin/ArticleForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditArticle({ params }) {
  const [article, subjects, issues, authors] = await Promise.all([
    getArticleEdit(params.id), getSubjectsWithCounts(), getIssuesWithCounts(), getAuthorsAdmin(),
  ]);
  if (!article) notFound();
  return (
    <div>
      <h1 className="adm-h1">Məqaləni redaktə et</h1>
      <div className="adm-sec">
        <ArticleForm action={updateArticle} subjects={subjects} issues={issues} allAuthors={authors} article={article} />
      </div>
    </div>
  );
}
