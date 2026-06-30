'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Brand from './Brand';
import LangSwitch from './LangSwitch';

const OJS = process.env.NEXT_PUBLIC_OJS_URL || '#';

export default function Header({ lang = 'az', t }) {
  const [open, setOpen] = useState(false);
  const [qv, setQv] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;
  const tr = t || {};

  function submit(e) {
    e.preventDefault();
    router.push('/articles' + (qv ? '?q=' + encodeURIComponent(qv) : ''));
    setOpen(false);
  }

  return (
    <>
      <div className="topbar">
        <div className="wrap topbar__in">
          <span className="topbar__l">{tr.topInfo}</span>
          <nav className="topbar__r" aria-label="Köməkçi keçidlər">
            <Link href="/information/readers">{tr.foot_readers}</Link><span className="sep" />
            <Link href="/information/authors">{tr.foot_authorsInfo}</Link><span className="sep" />
            <Link href="/information/librarians">{tr.foot_librarians}</Link><span className="sep" />
            <Link href="/contact">{tr.nav_contact}</Link><span className="sep" />
            <Link href="/faq">{tr.nav_faq}</Link><span className="sep" />
            <LangSwitch current={lang} />
          </nav>
        </div>
      </div>

      <header className={'head' + (open ? ' open' : '')}>
        <div className="wrap head__in">
          <Brand />
          <form className="head__search" role="search" onSubmit={submit}>
            <label className="search">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <input value={qv} onChange={(e) => setQv(e.target.value)} type="search" placeholder={tr.searchPh} aria-label="Axtarış" />
            </label>
          </form>
          <nav className="head__nav" aria-label="Əsas naviqasiya">
            <Link href="/articles" onClick={() => setOpen(false)}>{tr.nav_articles}</Link>
            <Link href="/issues" onClick={() => setOpen(false)}>{tr.nav_issues}</Link>
            <Link href="/for-authors" onClick={() => setOpen(false)}>{tr.nav_forAuthors}</Link>
            <Link href="/ethics" onClick={() => setOpen(false)}>{tr.nav_ethics}</Link>
            <Link href="/about" onClick={() => setOpen(false)}>{tr.nav_about}</Link>
          </nav>
          <Link className="btn btn--primary head__cta" href="/submit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>{tr.submit}
          </Link>
          <button className="navtoggle" aria-label={tr.menu} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </header>
    </>
  );
}
