import Link from 'next/link';
import { getMetrics } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · İcmal' };

export default async function Dashboard() {
  const m = await getMetrics();
  return (
    <div>
      <h1 className="adm-h1">İcmal</h1>
      <p className="adm-sub">Jurnal məzmununun idarəetmə paneli — nömrələr, müəlliflər və məqalələr.</p>
      <div className="adm-cards">
        <div className="adm-stat"><b>{m.articles}</b><span>Məqalə</span></div>
        <div className="adm-stat"><b>{m.issues}</b><span>Nömrə</span></div>
        <div className="adm-stat"><b>{m.authors}</b><span>Müəllif</span></div>
        <div className="adm-stat"><b>{m.citations}</b><span>İstinad</span></div>
      </div>
      <div className="adm-quick">
        <Link className="adm-btn" href="/admin/articles/new">+ Məqalə əlavə et</Link>
        <Link className="adm-btn adm-btn--ghost" href="/admin/issues">+ Nömrə</Link>
        <Link className="adm-btn adm-btn--ghost" href="/admin/authors">+ Müəllif</Link>
      </div>
    </div>
  );
}
