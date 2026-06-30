import { getSubmissionById, getSubjectsWithCounts } from '@/lib/queries';
import { updateSubmission } from '../../../../actions';
import SubmissionEditForm from '@/components/admin/SubmissionEditForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditSubmission({ params }) {
  const [sub, subjects] = await Promise.all([getSubmissionById(params.id), getSubjectsWithCounts()]);
  if (!sub) notFound();
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <Link href={`/admin/submissions/${sub.id}`} style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--teal-d)' }}>← Təqdimat</Link>
      </div>
      <h1 className="adm-h1">Təqdimatı redaktə et</h1>
      <p className="adm-sub">Bütün məlumatları redaktə edin, qaydalara uyğun formata salın, sonra təqdimat səhifəsindən resenzentə göndərin.</p>
      <div className="adm-sec"><SubmissionEditForm action={updateSubmission} subjects={subjects} sub={sub} /></div>
    </div>
  );
}
