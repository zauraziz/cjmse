import Link from 'next/link';
import { getArticlesAdmin, getSubjectsWithCounts, getIssuesWithCounts, getAuthorsAdmin } from '@/lib/queries';
import { createArticle, deleteArticle } from '../../actions';
import ArticleForm from '@/components/admin/ArticleForm';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Məqalələr' };

export default async function ArticlesAdmin() {
  const [articles, subjects, issues, authors] = await Promise.all([
    getArticlesAdmin(), getSubjectsWithCounts(), getIssuesWithCounts(), getAuthorsAdmin(),
  ]);
  return (
    <div>
      <h1 className="adm-h1">Məqalələr</h1>
      <div className="adm-sec">
        <h2>Yeni məqalə əlavə et</h2>
        <ArticleForm action={createArticle} subjects={subjects} issues={issues} allAuthors={authors} />
      </div>
      <div className="adm-sec">
        <h2>Məqalələr ({articles.length})</h2>
        <table className="adm-table">
          <thead><tr><th>Başlıq</th><th>Müəlliflər</th><th>Nömrə</th><th>DOI</th><th></th></tr></thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id}>
                <td><Link href={`/admin/articles/${a.id}`}>{a.title}</Link></td>
                <td>{a.authors || '—'}</td>
                <td>{a.issue_title || '—'}</td>
                <td>{a.doi || '—'}</td>
                <td><div className="adm-row-act"><Link href={`/admin/articles/${a.id}`}>Redaktə</Link><DeleteButton action={deleteArticle} id={a.id} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
