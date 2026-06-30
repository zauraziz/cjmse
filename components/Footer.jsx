'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Brand from './Brand';

export default function Footer({ t }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  const tr = t || {};
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <Brand footer />
            <p>{tr.foot_about}</p>
          </div>
          <div>
            <h6>{tr.foot_nav}</h6>
            <ul>
              <li><Link href="/issues">{tr.foot_current}</Link></li>
              <li><Link href="/articles">{tr.foot_allArticles}</Link></li>
              <li><Link href="/#subjects">{tr.foot_subjects}</Link></li>
              <li><Link href="/issues">{tr.foot_archive}</Link></li>
              <li><Link href="/#faq">{tr.foot_faq}</Link></li>
            </ul>
          </div>
          <div>
            <h6>{tr.foot_forAuthors}</h6>
            <ul>
              <li><Link href="/for-authors">{tr.foot_submit}</Link></li>
              <li><Link href="/for-authors">{tr.foot_guide}</Link></li>
              <li><Link href="/ethics">{tr.foot_reviewEthics}</Link></li>
              <li><Link href="/about">{tr.foot_openAccess}</Link></li>
              <li><Link href="/about">{tr.foot_board}</Link></li>
            </ul>
          </div>
          <div>
            <h6>{tr.foot_indexing}</h6>
            <div className="foot__idx">
              <span>DOAJ</span><span>CrossRef</span><span>ORCID</span><span>JATS XML</span><span>CC BY 4.0</span><span>PKP PN</span><span>Scopus/WoS</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, marginTop: 4, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.4px' }}>{tr.foot_info}:</span>
          <Link href="/information/readers">{tr.foot_readers}</Link>
          <Link href="/information/authors">{tr.foot_authorsInfo}</Link>
          <Link href="/information/librarians">{tr.foot_librarians}</Link>
        </div>
        <div className="foot__bottom">
          <span className="meta">© 2026 ADDA · Elmi Əsərləri (CJMSE) · ISSN XXXX-XXXX</span>
          <span className="disclaimer">{tr.foot_disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
