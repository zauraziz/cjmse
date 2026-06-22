'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Brand from './Brand';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <Brand footer />
            <p>Azərbaycan Dövlət Dəniz Akademiyasının resenziyalı, açıq girişli elmi jurnalı — dənizçilik, nəqliyyat və mühəndislik elmləri üzrə.</p>
          </div>
          <div>
            <h6>Naviqasiya</h6>
            <ul>
              <li><Link href="/issues">Cari nömrə</Link></li>
              <li><Link href="/articles">Bütün məqalələr</Link></li>
              <li><Link href="/#subjects">Tədqiqat sahələri</Link></li>
              <li><Link href="/issues">Arxiv</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h6>Müəlliflər üçün</h6>
            <ul>
              <li><Link href="/for-authors">Məqalə göndər</Link></li>
              <li><Link href="/for-authors">Müəllif təlimatı</Link></li>
              <li><Link href="/ethics">Resenziya və etika</Link></li>
              <li><Link href="/about">Açıq giriş</Link></li>
              <li><Link href="/about">Redaksiya heyəti</Link></li>
            </ul>
          </div>
          <div>
            <h6>İndeksləşmə və standartlar</h6>
            <div className="foot__idx">
              <span>DOAJ</span><span>CrossRef</span><span>ORCID</span><span>JATS XML</span><span>CC BY 4.0</span><span>PKP PN</span><span>Scopus/WoS hazırlıq</span>
            </div>
          </div>
        </div>
        <div className="foot__bottom">
          <span className="meta">© 2026 ADDA · Elmi Əsərləri (CJMSE) · ISSN XXXX-XXXX</span>
          <span className="disclaimer">Məzmun nümunə xarakterlidir; ISSN, DOI, redaksiya adları və metrikalar real dəyərlərlə əvəz olunmalıdır.</span>
        </div>
      </div>
    </footer>
  );
}
