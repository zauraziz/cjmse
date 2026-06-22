import { getIssueById } from '@/lib/queries';
import { updateIssue } from '../../../actions';
import IssueForm from '@/components/admin/IssueForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditIssue({ params }) {
  const issue = await getIssueById(params.id);
  if (!issue) notFound();
  return (
    <div>
      <h1 className="adm-h1">Nömrəni redaktə et</h1>
      <div className="adm-sec"><IssueForm action={updateIssue} issue={issue} /></div>
    </div>
  );
}
