'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Brand from './Brand';
import Subscribe from './Subscribe';

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
            <h6 style={{ marginTop: 22 }}>{tr.foot_subHeading}</h6>
            <Subscribe t={tr} compact />
          </div>
          <div>
            <h6>{tr.foot_nav}</h6>
            <ul>
              <li><Link href="/articles">{tr.foot_allArticles}</Link></li>
              <li><Link href="/issues">{tr.nav_issues}</Link></li>
              <li><Link href="/#subjects">{tr.foot_subjects}</Link></li>
              <li><Link href="/faq">{tr.nav_faq}</Link></li>
              <li><Link href="/contact">{tr.nav_contact}</Link></li>
            </ul>
          </div>
          <div>
            <h6>{tr.foot_forAuthors}</h6>
            <ul>
              <li><Link href="/submit">{tr.foot_submit}</Link></li>
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

        <div className="foot__credit">
          <div className="c-left">
            <span className="c-copy">© 2026 Caspian Journal of Maritime Science &amp; Engineering · ADDA. {tr.foot_rights}</span>
            <span className="c-issn">E-ISSN 2220-1025 · P-ISSN 2220-1025 · DOI 10.30546/cjmse</span>
          </div>
          <span className="c-dev">{tr.foot_developedBy} <b>Zaur Əziz</b></span>
        </div>
      </div>
    </footer>
  );
}
