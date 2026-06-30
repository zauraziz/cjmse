import Link from 'next/link';
import { getMetrics, getAdminAttention } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · İcmal' };

export default async function Dashboard() {
  const [m, att] = await Promise.all([getMetrics(), getAdminAttention()]);
  const Row = ({ items, label, color }) => items.length === 0 ? null : (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>{label} ({items.length})</div>
      {items.map((s) => (
        <Link key={s.id} href={`/admin/submissions/${s.id}`} style={{ display: 'block', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 8, marginBottom: 6, color: 'var(--ink)', fontSize: 14 }}>
          {s.title} <span style={{ color: 'var(--muted)', fontSize: 12.5 }}>· {s.author_name}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="adm-h1">İcmal</h1>
      <p className="adm-sub">Jurnal məzmununun və redaksiya prosesinin idarəetmə paneli.</p>

      {att.total > 0 && (
        <div className="adm-sec" style={{ borderLeft: '4px solid var(--gold, #c79a3b)' }}>
          <h2 style={{ marginTop: 0 }}>⚠ Diqqət tələb edir ({att.total})</h2>
          <Row items={att.newSubs} label="Yeni göndərmələr — yoxlama gözləyir" color="#b3261e" />
          <Row items={att.reviewsReady} label="Resenziya rəyləri daxil olub — qərar gözləyir" color="var(--teal-d)" />
          <Row items={att.authorUpdates} label="Müəllif yeniləyib / düzəliş yükləyib" color="#9a6a00" />
        </div>
      )}

      <div className="adm-cards">
        <div className="adm-stat"><b>{m.articles}</b><span>Məqalə</span></div>
        <div className="adm-stat"><b>{m.issues}</b><span>Nömrə</span></div>
        <div className="adm-stat"><b>{m.authors}</b><span>Müəllif</span></div>
        <div className="adm-stat"><b>{m.citations}</b><span>İstinad</span></div>
      </div>
      <div className="adm-quick">
        <Link className="adm-btn" href="/admin/articles/new">+ Məqalə əlavə et</Link>
        <Link className="adm-btn adm-btn--ghost" href="/admin/submissions">Göndərmələr</Link>
        <Link className="adm-btn adm-btn--ghost" href="/admin/reviewers">Resenzentlər</Link>
      </div>
    </div>
  );
}
