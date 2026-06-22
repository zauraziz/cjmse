import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { logout } from '../actions';

export const dynamic = 'force-dynamic';

export default function PanelLayout({ children }) {
  requireAdmin();
  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand">CJMSE · Admin</div>
        <nav>
          <Link href="/admin">İcmal</Link>
          <Link href="/admin/issues">Nömrələr</Link>
          <Link href="/admin/authors">Müəlliflər</Link>
          <Link href="/admin/articles">Məqalələr</Link>
          <Link href="/">↗ Sayta bax</Link>
        </nav>
        <form action={logout}><button className="adm-logout" type="submit">Çıxış</button></form>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
