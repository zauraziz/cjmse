export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getReviewAssignmentByToken } from '@/lib/queries';
import { submitReview } from '@/app/admin/actions';
import { fmtDate, TYPE_LABEL } from '@/lib/format';

export const metadata = { title: 'Resenziya', robots: { index: false, follow: false } };

const RECS = [
  ['accept', 'Qəbul (düzəlişsiz)'],
  ['minor', 'Kiçik düzəlişlərlə qəbul'],
  ['major', 'Əsaslı düzəlişlər tələb olunur'],
  ['reject', 'İmtina'],
];

export default async function ReviewPage({ params, searchParams }) {
  const ra = await getReviewAssignmentByToken(params.token);
  if (!ra) notFound();
  const done = searchParams?.done || ra.status === 'submitted';
  let figs = [];
  try { figs = JSON.parse(ra.figures_urls || '[]'); } catch { figs = []; }

  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>
          CJMSE · Resenziya (raund {ra.round})
        </div>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', margin: '0 0 4px' }}>{ra.sub_title}</h1>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--muted)', marginBottom: 16 }}>{TYPE_LABEL[ra.sub_type] || ra.sub_type}</div>

        <div style={{ background: 'var(--mist)', borderRadius: 10, padding: '14px 16px', fontSize: 14, lineHeight: 1.7, color: 'var(--ink-2)' }}>
          {ra.sub_keywords && <div style={{ marginBottom: 8 }}><b>Açar sözlər:</b> {ra.sub_keywords}</div>}
          {(ra.manuscript_file_url || ra.manuscript_url) && (
            <div><b>Əlyazma:</b> {ra.manuscript_file_url && <a href={ra.manuscript_file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)', marginRight: 10 }}>fayl ↓</a>}{ra.manuscript_url && <a href={ra.manuscript_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>keçid ↗</a>}</div>
          )}
          {figs.length > 0 && <div style={{ marginTop: 6 }}><b>Şəkillər:</b> {figs.map((u, i) => <a key={i} href={u} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)', marginRight: 8 }}>#{i + 1}</a>)}</div>}
        </div>
        {ra.sub_abstract && (<><h2 className="abs-h" style={{ marginTop: 18 }}>Xülasə</h2><p className="abs-t">{ra.sub_abstract}</p></>)}

        {done ? (
          <div style={{ background: '#e7f6ec', color: '#1a7f37', border: '1px solid #acdcb8', borderRadius: 10, padding: '14px 16px', marginTop: 22 }}>
            <b>Rəyiniz qeydə alındı. Təşəkkür edirik.</b>
            {ra.recommendation && <div style={{ marginTop: 6, fontSize: 14 }}>Tövsiyə: {(RECS.find(([v]) => v === ra.recommendation) || [])[1] || ra.recommendation}</div>}
            {ra.submitted_at && <div style={{ fontSize: 12.5, color: '#2c6e3f', marginTop: 4 }}>{fmtDate(ra.submitted_at)}</div>}
          </div>
        ) : (
          <form action={submitReview} className="adm-form" style={{ marginTop: 22 }}>
            <input type="hidden" name="token" value={params.token} />
            <div className="adm-field full"><label>Tövsiyə *</label>
              <select name="recommendation" defaultValue="">
                <option value="" disabled>— seçin —</option>
                {RECS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="adm-field full"><label>Redaksiya üçün qeydlər (məxfi)</label>
              <textarea name="comments_to_editor" placeholder="Yalnız redaksiyaya görünür" /></div>
            <div className="adm-field full"><label>Müəllif üçün qeydlər</label>
              <textarea name="comments_to_author" placeholder="Redaksiya təsdiqlədikdən sonra müəllifə çatdırıla bilər" /></div>
            <div className="adm-actions"><button className="adm-btn" type="submit">Rəyi təqdim et</button></div>
          </form>
        )}
      </div>
    </section>
  );
}
