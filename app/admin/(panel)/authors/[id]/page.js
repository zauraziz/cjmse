import { getAuthorById } from '@/lib/queries';
import { updateAuthor } from '../../../actions';
import AuthorForm from '@/components/admin/AuthorForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditAuthor({ params }) {
  const author = await getAuthorById(params.id);
  if (!author) notFound();
  return (
    <div>
      <h1 className="adm-h1">Müəllifi redaktə et</h1>
      <div className="adm-sec"><AuthorForm action={updateAuthor} author={author} /></div>
    </div>
  );
}
