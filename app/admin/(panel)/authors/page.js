import Link from 'next/link';
import { getAuthorsAdmin } from '@/lib/queries';
import { createAuthor, deleteAuthor } from '../../actions';
import AuthorForm from '@/components/admin/AuthorForm';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Müəlliflər' };

export default async function AuthorsAdmin() {
  const authors = await getAuthorsAdmin();
  return (
    <div>
      <h1 className="adm-h1">Müəlliflər</h1>
      <div className="adm-sec">
        <h2>Yeni müəllif əlavə et</h2>
        <AuthorForm action={createAuthor} />
      </div>
      <div className="adm-sec">
        <h2>Müəlliflər ({authors.length})</h2>
        <table className="adm-table">
          <thead><tr><th>Ad</th><th>ORCID</th><th>Mənsubiyyət</th><th>Məqalə</th><th></th></tr></thead>
          <tbody>
            {authors.map((a) => (
              <tr key={a.id}>
                <td><Link href={`/admin/authors/${a.id}`}>{a.full_name}</Link></td>
                <td>{a.orcid || '—'}</td>
                <td>{a.affiliation || '—'}</td>
                <td>{a.articles}</td>
                <td><div className="adm-row-act"><Link href={`/admin/authors/${a.id}`}>Redaktə</Link><DeleteButton action={deleteAuthor} id={a.id} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
