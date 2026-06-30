export const dynamic = 'force-dynamic';
import { getFaqs } from '@/lib/queries';
import FaqAccordion from '@/components/FaqAccordion';
import { getT } from '@/lib/serverLang';

export const metadata = { title: 'FAQ' };

export default async function FaqPage() {
  const faqs = await getFaqs();
  const t = getT();
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 800 }}>
        <h1 className="sec-title">{t.foot_faq}</h1>
        {faqs.length === 0 ? <p style={{ color: 'var(--muted)' }}>—</p> : <FaqAccordion faqs={faqs} />}
      </div>
    </section>
  );
}
