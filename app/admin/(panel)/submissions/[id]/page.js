import { getSubmissionById } from '@/lib/queries';
import { updateSubmissionStatus, deleteSubmission } from '../../../actions';
import DeleteButton from '@/components/admin/DeleteButton';
import { fmtDate, TYPE_LABEL } from '@/lib/format';
import { STATUS_ORDER, STATUS_LABELS, statusLabel } from '@/lib/status';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const ALL_STATUSES = [...STATUS_ORDER, 'rejected'];

export default async function SubmissionDetail({ params }) {
  const s = await getSubmissionById(params.id);
  if (!s) notFound();
  let figUrls = [];
  try { figUrls = JSON.parse(s.figures_urls || '[]'); } catch { figUrls = []; }
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <Link href="/admin/submissions" style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--teal-d)' }}>← Göndərmələr</Link>
      </div>
      <h1 className="adm-h1">{s.title}</h1>
      <div className="adm-sec">
        <div style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--ink-2)' }}>
          <div><b>Əlaqələndirici:</b> {s.author_name} · {s.email}</div>
          {s.coauthors && <div><b>Digər müəlliflər:</b> {s.coauthors}</div>}
          <div><b>Növ:</b> {TYPE_LABEL[s.type] || s.type} · <b>Dil:</b> {s.language}</div>
          {s.keywords && <div><b>Açar sözlər:</b> {s.keywords}</div>}
          {s.manuscript_file_url && <div><b>Əlyazma faylı:</b> <a href={s.manuscript_file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>yüklə / bax ↓</a></div>}
          {s.manuscript_url && <div><b>Əlyazma keçidi:</b> <a href={s.manuscript_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>{s.manuscript_url}</a></div>}
          {figUrls.length > 0 && <div><b>Şəkillər:</b> {figUrls.map((u, i) => <a key={i} href={u} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)', marginRight: 8 }}>#{i + 1}</a>)}</div>}
          <div><b>Təqdim:</b> {fmtDate(s.created_at)} · <b>Yenilənmə:</b> {fmtDate(s.updated_at)}</div>
          <div><b>İzləmə keçidi:</b> <a href={`/track/${s.token}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>{site}/track/{s.token}</a></div>
        </div>
        {s.abstract && <p style={{ marginTop: 12, fontSize: 14, color: '#111', lineHeight: 1.7, background: 'var(--mist)', borderRadius: 8, padding: '10px 12px' }}>{s.abstract}</p>}
      </div>

      <div className="adm-sec">
        <h2>Statusu yenilə</h2>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: -4 }}>Status dəyişdikdə müəllifə avtomatik e-poçt bildirişi göndərilir (RESEND_API_KEY təyin edilibsə).</p>
        <form action={updateSubmissionStatus} className="adm-form">
          <input type="hidden" name="id" value={s.id} />
          <div className="adm-field"><label>Status</label>
            <select name="status" defaultValue={s.status}>
              {ALL_STATUSES.map((st) => <option key={st} value={st}>{statusLabel(st, 'az')}</option>)}
            </select>
          </div>
          <div className="adm-field full"><label>Müəllifə qeyd (e-poçta daxil edilir)</label><textarea name="note" defaultValue={s.note ?? ''} placeholder="Resenziya nəticəsi, düzəliş tələbləri və s." /></div>
          <div className="adm-actions"><button className="adm-btn" type="submit">Yenilə və bildir</button></div>
        </form>
      </div>

      <div className="adm-sec">
        <h2 style={{ color: '#b3261e' }}>Təhlükəli zona</h2>
        <DeleteButton action={deleteSubmission} id={s.id} />
      </div>
    </div>
  );
}
