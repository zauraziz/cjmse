export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { getLang } from '@/lib/serverLang';

const C = {
  title:    { az: 'Əlaqə', en: 'Contact', ru: 'Контакты' },
  intro:    { az: 'Müəlliflərlə redaksiyanın bütün ünsiyyəti jurnalın rəsmi kanalları üzərindən aparılır. Məqalə təqdimatı və status izlənməsi onlayn sistem vasitəsilə həyata keçirilir.',
              en: 'All communication between authors and the editorial office is conducted through the journal’s official channels. Submission and status tracking are handled via the online system.',
              ru: 'Вся связь между авторами и редакцией осуществляется через официальные каналы журнала. Подача и отслеживание статуса — через онлайн-систему.' },
  pub:      { az: 'Naşir', en: 'Publisher', ru: 'Издатель' },
  email:    { az: 'E-poçt', en: 'Email', ru: 'Эл. почта' },
  addr:     { az: 'Ünvan', en: 'Address', ru: 'Адрес' },
  submit:   { az: 'Məqalə göndər', en: 'Submit an article', ru: 'Подать статью' },
  guide:    { az: 'Müəllif qaydaları', en: 'Author guidelines', ru: 'Руководство для авторов' },
};

export const metadata = { title: 'Əlaqə' };

export default function ContactPage() {
  const lang = getLang();
  const L = (m) => m[lang] || m.az;
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <h1 className="sec-title">{L(C.title)}</h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>{L(C.intro)}</p>
        <div style={{ fontSize: 15, lineHeight: 2, color: 'var(--ink-2)', marginTop: 14, background: 'var(--mist)', borderRadius: 12, padding: '16px 18px' }}>
          <div><b>{L(C.pub)}:</b> Azərbaycan Dövlət Dəniz Akademiyası (ADDA)</div>
          <div><b>{L(C.email)}:</b> <a href="mailto:cjmse@adda.edu.az" style={{ color: 'var(--teal-d)' }}>cjmse@adda.edu.az</a></div>
          <div><b>{L(C.addr)}:</b> Bakı, Azərbaycan · <a href="https://adda.edu.az" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>adda.edu.az</a></div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
          <Link className="btn btn--primary" href="/submit">{L(C.submit)}</Link>
          <Link className="btn btn--ghost" href="/for-authors">{L(C.guide)}</Link>
        </div>
      </div>
    </section>
  );
}
