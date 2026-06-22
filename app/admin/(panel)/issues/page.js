import Link from 'next/link';
import { getIssuesWithCounts } from '@/lib/queries';
import { createIssue, deleteIssue } from '../../actions';
import IssueForm from '@/components/admin/IssueForm';
import DeleteButton from '@/components/admin/DeleteButton';
import { fmtDate } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Nömrələr' };

export default async function IssuesAdmin() {
  const issues = await getIssuesWithCounts();
  return (
    <div>
      <h1 className="adm-h1">Nömrələr</h1>
      <div className="adm-sec">
        <h2>Yeni nömrə əlavə et</h2>
        <IssueForm action={createIssue} />
      </div>
      <div className="adm-sec">
        <h2>Mövcud nömrələr ({issues.length})</h2>
        <table className="adm-table">
          <thead><tr><th>Nömrə</th><th>İl</th><th>Məqalə</th><th>Nəşr tarixi</th><th>Cari</th><th></th></tr></thead>
          <tbody>
            {issues.map((i) => (
              <tr key={i.id}>
                <td><Link href={`/admin/issues/${i.id}`}>Cild {i.volume}, № {i.number}</Link></td>
                <td>{i.year}</td>
                <td>{i.count}</td>
                <td>{i.published_at ? fmtDate(i.published_at) : '—'}</td>
                <td>{i.is_current ? <span className="adm-tag">Cari</span> : ''}</td>
                <td><div className="adm-row-act"><Link href={`/admin/issues/${i.id}`}>Redaktə</Link><DeleteButton action={deleteIssue} id={i.id} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
