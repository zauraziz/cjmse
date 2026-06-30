import { getSubmissionById, getReviewAssignmentsForSubmission, getReviewers } from '@/lib/queries';
import { updateSubmissionStatus, deleteSubmission, assignReviewer, publishSubmission } from '../../../actions';
import DeleteButton from '@/components/admin/DeleteButton';
import { fmtDate, TYPE_LABEL } from '@/lib/format';
import { STATUS_ORDER, statusLabel } from '@/lib/status';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
const ALL_STATUSES = [...STATUS_ORDER, 'rejected'];
const REC = { accept: 'Qəbul (düzəlişsiz)', minor: 'Kiçik düzəlişlər', major: 'Əsaslı düzəlişlər', reject: 'İmtina' };

export default async function SubmissionDetail({ params }) {
  const s = await getSubmissionById(params.id);
  if (!s) notFound();
  const [assignments, reviewers] = await Promise.all([
    getReviewAssignmentsForSubmission(params.id),
    getReviewers(),
  ]);
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
          <div><b>Növ:</b> {TYPE_LABEL[s.type] || s.type} · <b>Dil:</b> {s.language} · <b>Raund:</b> {s.round || 1} · <b>Status:</b> {statusLabel(s.status, 'az')}</div>
          {s.keywords && <div><b>Açar sözlər:</b> {s.keywords}</div>}
          {s.manuscript_file_url && <div><b>Əlyazma faylı:</b> <a href={s.manuscript_file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>yüklə / bax ↓</a></div>}
          {s.manuscript_url && <div><b>Əlyazma keçidi:</b> <a href={s.manuscript_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>{s.manuscript_url}</a></div>}
          {figUrls.length > 0 && <div><b>Şəkillər:</b> {figUrls.map((u, i) => <a key={i} href={u} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)', marginRight: 8 }}>#{i + 1}</a>)}</div>}
          <div><b>İzləmə keçidi:</b> <a href={`/track/${s.token}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>{site}/track/{s.token}</a></div>
        </div>
        {s.abstract && <p style={{ marginTop: 12, fontSize: 14, color: '#111', lineHeight: 1.7, background: 'var(--mist)', borderRadius: 8, padding: '10px 12px' }}>{s.abstract}</p>}
      </div>

      {/* ---- review assignments ---- */}
      <div className="adm-sec">
        <h2>Resenziyalar</h2>
        {assignments.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Hələ resenzent təyin edilməyib.</p>}
        {assignments.map((a) => (
          <div key={a.id} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <b>{a.reviewer_name || a.reviewer_full || 'Resenzent'}</b>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: a.status === 'submitted' ? 'var(--teal-d)' : 'var(--muted)' }}>
                Raund {a.round} · {a.status === 'submitted' ? 'Rəy daxil olub' : a.status === 'declined' ? 'İmtina etdi' : 'Gözlənilir'}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
              {a.reviewer_email} · {a.due_date ? `son tarix ${fmtDate(a.due_date)}` : ''} · resenzent keçidi: <a href={`/review/${a.token}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>açın ↗</a>
            </div>
            {a.status === 'submitted' && (
              <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.7 }}>
                <div><b>Tövsiyə:</b> {REC[a.recommendation] || a.recommendation || '—'}</div>
                {a.comments_to_editor && <div style={{ marginTop: 4 }}><b>Redaksiyaya:</b> {a.comments_to_editor}</div>}
                {a.comments_to_author && <div style={{ marginTop: 4, background: 'var(--mist)', borderRadius: 6, padding: '6px 8px' }}><b>Müəllifə:</b> {a.comments_to_author}</div>}
              </div>
            )}
          </div>
        ))}

        <form action={assignReviewer} className="adm-form" style={{ marginTop: 12, borderTop: '1px dashed var(--line)', paddingTop: 12 }}>
          <input type="hidden" name="submission_id" value={s.id} />
          <div className="adm-field"><label>Resenzent təyin et</label>
            <select name="reviewer_id" defaultValue="">
              <option value="" disabled>— seçin —</option>
              {reviewers.map((r) => <option key={r.id} value={r.id}>{r.full_name}{r.email ? ` (${r.email})` : ''}</option>)}
            </select>
          </div>
          <div className="adm-field"><label>Raund</label><input name="round" type="number" min="1" defaultValue={s.round || 1} /></div>
          <div className="adm-field"><label>Son tarix</label><input name="due_date" type="date" /></div>
          <div className="adm-actions"><button className="adm-btn" type="submit">Təyin et və dəvət göndər</button></div>
        </form>
        {reviewers.length === 0 && <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>Əvvəlcə <Link href="/admin/reviewers" style={{ color: 'var(--teal-d)' }}>resenzent əlavə edin</Link>.</p>}
      </div>

      {/* ---- decision to author ---- */}
      <div className="adm-sec">
        <h2>Qərar / müəllifə bildiriş</h2>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: -4 }}>Status dəyişdikdə müəllifə avtomatik e-poçt gedir. Resenzentlərin “müəllifə” qeydlərini aşağıdakı sahəyə köçürə bilərsiniz.</p>
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

      {/* ---- publish to journal ---- */}
      <div className="adm-sec">
        <h2>Nəşr — jurnal strukturuna çevir</h2>
        {s.article_id ? (
          <p style={{ fontSize: 14 }}>✓ Bu təqdimat artıq məqaləyə çevrilib. <Link href={`/admin/articles/${s.article_id}`} style={{ color: 'var(--teal-d)' }}>Məqaləni redaktə et →</Link></p>
        ) : (
          <>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: -4 }}>Qəbul mərhələsində: DOI təyin edin və təqdimatı jurnalın məqalə strukturuna çevirin. Sonra nömrə, səhifələr və yekun PDF redaktə səhifəsində tamamlanır.</p>
            <form action={publishSubmission} className="adm-form">
              <input type="hidden" name="id" value={s.id} />
              <div className="adm-field full"><label>DOI</label><input name="doi" defaultValue={s.doi ?? ''} placeholder="10.xxxxx/cjmse.2026.0XX" /></div>
              <div className="adm-actions"><button className="adm-btn" type="submit">Məqaləyə çevir və dərc et</button></div>
            </form>
          </>
        )}
      </div>

      <div className="adm-sec">
        <h2 style={{ color: '#b3261e' }}>Təhlükəli zona</h2>
        <DeleteButton action={deleteSubmission} id={s.id} />
      </div>
    </div>
  );
}
