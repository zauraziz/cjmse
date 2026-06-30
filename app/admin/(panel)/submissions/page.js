import Link from 'next/link';
import { getSubmissionsAdmin } from '@/lib/queries';
import { fmtDate, TYPE_LABEL } from '@/lib/format';
import { statusLabel } from '@/lib/status';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Göndərmələr' };

export default async function SubmissionsAdmin() {
  const subs = await getSubmissionsAdmin();
  return (
    <div>
      <h1 className="adm-h1">Göndərmələr ({subs.length})</h1>
      <div className="adm-sec">
        {subs.length === 0 && <p style={{ color: 'var(--muted)' }}>Hələ təqdimat yoxdur.</p>}
        {subs.length > 0 && (
          <table className="adm-table">
            <thead><tr><th>Başlıq</th><th>Müəllif</th><th>Növ</th><th>Status</th><th>Tarix</th><th></th></tr></thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td><Link href={`/admin/submissions/${s.id}`}>{s.title}</Link></td>
                  <td>{s.author_name}<br /><span style={{ fontSize: 11, color: 'var(--muted)' }}>{s.email}</span></td>
                  <td>{TYPE_LABEL[s.type] || s.type}</td>
                  <td><span className="adm-tag">{statusLabel(s.status, 'az')}</span></td>
                  <td>{fmtDate(s.created_at)}</td>
                  <td><div className="adm-row-act"><Link href={`/admin/submissions/${s.id}`}>İdarə et</Link><a href={`/track/${s.token}`} target="_blank" rel="noopener noreferrer">İzləmə ↗</a></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
