export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getSubjectsWithCounts } from '@/lib/queries';
import { createSubmission } from '@/app/admin/actions';
import SubmitForm from '@/components/SubmitForm';

export const metadata = {
  title: 'Məqalə göndər',
  description: 'CJMSE jurnalına məqalə təqdim edin və statusu şifrəsiz, e-poçta gələn şəxsi keçidlə izləyin.',
};

export default async function SubmitPage({ searchParams }) {
  const subjects = await getSubjectsWithCounts();
  const err = searchParams?.error;
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <h1 className="sec-title">Məqalə göndər</h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          Aşağıdakı formanı doldurun. Təqdimatdan sonra e-poçtunuza <b>şəxsi izləmə keçidi</b> göndəriləcək —
          məqalənizin statusunu şifrə daxil etmədən, həmin keçidlə istənilən vaxt izləyə bilərsiniz. Təqdimdən əvvəl{' '}
          <Link href="/for-authors" style={{ color: 'var(--teal-d)' }}>müəllif qaydaları</Link> ilə tanış olun.
        </p>
        {err && (
          <div style={{ background: '#fdecea', color: '#b3261e', border: '1px solid #f3c2bd', borderRadius: 10, padding: '11px 14px', fontSize: 14, margin: '14px 0' }}>
            {err === 'spam' ? 'Təqdimat qəbul edilmədi.' : 'Zəruri sahələri (başlıq, müəllif, e-poçt) doldurun.'}
          </div>
        )}
        <div className="adm-sec" style={{ marginTop: 16 }}>
          <SubmitForm action={createSubmission} subjects={subjects} />
        </div>
      </div>
    </section>
  );
}
