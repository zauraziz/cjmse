import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { logout } from '../actions';
import { getAttentionCount } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }) {
  requireAdmin();
  const attention = await getAttentionCount();
  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand">CJMSE · Admin</div>
        <nav>
          <Link href="/admin">İcmal</Link>
          <Link href="/admin/issues">Nömrələr</Link>
          <Link href="/admin/authors">Müəlliflər</Link>
          <Link href="/admin/articles">Məqalələr</Link>
          <Link href="/admin/submissions">
            Göndərmələr
            {attention > 0 && <span style={{ marginLeft: 8, background: '#b3261e', color: '#fff', borderRadius: 999, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>{attention}</span>}
          </Link>
          <Link href="/admin/reviewers">Resenzentlər</Link>
          <Link href="/">↗ Sayta bax</Link>
        </nav>
        <form action={logout}><button className="adm-logout" type="submit">Çıxış</button></form>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
