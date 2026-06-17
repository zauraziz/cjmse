import Link from 'next/link';
import { SUBJECT_ICONS } from '@/lib/icons';

export default function SubjectTile({ slug, name, count }) {
  return (
    <Link className="subj" href={`/articles?subject=${slug}`}>
      <span className="subj__ic">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
             dangerouslySetInnerHTML={{ __html: SUBJECT_ICONS[slug] || '' }} />
      </span>
      <span>
        <span className="subj__n">{name}</span>
        <span className="subj__c">{count} məqalə</span>
      </span>
    </Link>
  );
}
