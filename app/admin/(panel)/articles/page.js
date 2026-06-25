import Link from 'next/link';
import { getArticlesAdmin } from '@/lib/queries';
import { deleteArticle } from '../../actions';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Məqalələr' };

export default async function ArticlesAdmin() {
  const articles = await getArticlesAdmin();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h1 className="adm-h1">Məqalələr</h1>
        <Link className="adm-btn" href="/admin/articles/new">+ Yeni məqalə əlavə et</Link>
      </div>
      <div className="adm-sec" style={{ marginTop: 16 }}>
        <h2>Bütün məqalələr ({articles.length})</h2>
        {articles.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Hələ məqalə yoxdur. Yuxarıdakı «+ Yeni məqalə əlavə et» düyməsi ilə əlavə edin.</p>}
        {articles.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
