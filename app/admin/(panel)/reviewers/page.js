import { getReviewers } from '@/lib/queries';
import { createReviewer, deleteReviewer } from '../../actions';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Resenzentlər' };

export default async function ReviewersAdmin() {
  const reviewers = await getReviewers();
  return (
    <div>
      <h1 className="adm-h1">Resenzentlər ({reviewers.length})</h1>

      <div className="adm-sec">
        <h2>Yeni resenzent əlavə et</h2>
        <form action={createReviewer} className="adm-form">
          <div className="adm-field"><label>Tam ad *</label><input name="full_name" required placeholder="A.B. Soyadov" /></div>
          <div className="adm-field"><label>E-poçt</label><input name="email" type="email" placeholder="resenzent@nümunə.az" /></div>
          <div className="adm-field full"><label>Mənsubiyyət / ixtisas</label><input name="affiliation" placeholder="ADDA · Gəmi mexanikası" /></div>
          <div className="adm-actions"><button className="adm-btn" type="submit">Əlavə et</button></div>
        </form>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 8 }}>Resenzent təyin edildikdə ona avtomatik e-poçt dəvəti göndərilir (RESEND_API_KEY təyin edilibsə).</p>
      </div>

      <div className="adm-sec">
        {reviewers.length === 0 && <p style={{ color: 'var(--muted)' }}>Hələ resenzent yoxdur.</p>}
        {reviewers.length > 0 && (
          <table className="adm-table">
            <thead><tr><th>Ad</th><th>E-poçt</th><th>Mənsubiyyət</th><th></th></tr></thead>
            <tbody>
              {reviewers.map((r) => (
                <tr key={r.id}>
                  <td>{r.full_name}</td>
                  <td>{r.email || '—'}</td>
                  <td>{r.affiliation || '—'}</td>
                  <td><DeleteButton action={deleteReviewer} id={r.id} small /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
