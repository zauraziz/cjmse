export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getSubmissionByToken } from '@/lib/queries';
import { updateSubmissionByToken } from '@/app/admin/actions';
import { fmtDate } from '@/lib/format';
import { getLang, getT } from '@/lib/serverLang';
import { STATUS_ORDER, statusLabel } from '@/lib/status';
import { typeLabel } from '@/lib/i18n';

export const metadata = { title: 'Təqdimatın izlənməsi', robots: { index: false, follow: false } };

export default async function TrackPage({ params, searchParams }) {
  const sub = await getSubmissionByToken(params.token);
  if (!sub) notFound();
  const lang = getLang();
  const t = getT();
  const isNew = searchParams?.new;
  const updated = searchParams?.updated;
  const rejected = sub.status === 'rejected';
  const currentStep = STATUS_ORDER.indexOf(sub.status);
  let figUrls = [];
  try { figUrls = JSON.parse(sub.figures_urls || '[]'); } catch { figUrls = []; }

  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 760 }}>
        {isNew && (
          <div style={{ background: '#e7f6ec', color: '#1a7f37', border: '1px solid #acdcb8', borderRadius: 10, padding: '12px 14px', fontSize: 14, marginBottom: 18 }}>
            ✓ Məqaləniz təqdim edildi. İzləmə keçidi e-poçtunuza göndərildi — bu səhifəni yadda saxlaya (bookmark) bilərsiniz.
          </div>
        )}
        {updated && (
          <div style={{ background: '#e7f6ec', color: '#1a7f37', border: '1px solid #acdcb8', borderRadius: 10, padding: '12px 14px', fontSize: 14, marginBottom: 18 }}>
            ✓ Yeniləməniz qeydə alındı və redaksiyaya bildirildi.
          </div>
        )}
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '1.7rem', margin: '0 0 6px' }}>{sub.title}</h1>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 18 }}>
          <div>{typeLabel(t, sub.type)} · {sub.author_name}</div>
          <div>Təqdim: {fmtDate(sub.created_at)} · Son yenilənmə: {fmtDate(sub.updated_at)}</div>
        </div>

        <div className="panel" style={{ padding: '18px 20px' }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Cari status</div>
          <div style={{ fontSize: '1.3rem', fontFamily: 'var(--f-display)', color: rejected ? '#b3261e' : 'var(--teal-d)', margin: '4px 0 16px' }}>{statusLabel(sub.status, lang)}</div>
          {!rejected && (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {STATUS_ORDER.map((st, i) => (
                <div key={st} style={{ flex: '1 1 90px', textAlign: 'center' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', margin: '0 auto 6px', background: i <= currentStep ? 'var(--teal)' : 'var(--mist-2)', boxShadow: i === currentStep ? '0 0 0 3px var(--teal-d)' : 'none' }} />
                  <div style={{ fontSize: 11, color: i <= currentStep ? 'var(--ink)' : 'var(--muted)', lineHeight: 1.3 }}>{statusLabel(st, lang)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {sub.note && (
          <div style={{ background: 'var(--mist)', borderRadius: 10, padding: '14px 16px', marginTop: 16 }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase' }}>Redaksiyanın qeydi</div>
            <p style={{ margin: '6px 0 0', fontSize: 14.5, color: '#111', lineHeight: 1.7 }}>{sub.note}</p>
          </div>
        )}

        <h2 className="abs-h" style={{ marginTop: 24 }}>Təqdimat məlumatları</h2>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.9 }}>
          {sub.coauthors && <div><b>Digər müəlliflər:</b> {sub.coauthors}</div>}
          {sub.subject_az && <div><b>Sahə:</b> {sub.subject_az}</div>}
          {sub.keywords && <div><b>Açar sözlər:</b> {sub.keywords}</div>}
          {sub.manuscript_file_url && <div><b>Əlyazma faylı:</b> <a href={sub.manuscript_file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>yüklə ↓</a></div>}
          {sub.manuscript_url && <div><b>Əlyazma keçidi:</b> <a href={sub.manuscript_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)' }}>keçid ↗</a></div>}
          {figUrls.length > 0 && <div><b>Şəkillər:</b> {figUrls.map((u, i) => <a key={i} href={u} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-d)', marginRight: 8 }}>#{i + 1}</a>)}</div>}
        </div>
        {sub.abstract && (<><h2 className="abs-h" style={{ marginTop: 20 }}>Xülasə</h2><p className="abs-t">{sub.abstract}</p></>)}

        <details style={{ marginTop: 26, border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px', background: '#fff' }}>
          <summary style={{ cursor: 'pointer', fontFamily: 'var(--f-display)', fontSize: '1.05rem', color: 'var(--ink)' }}>
            Məlumatları yenilə / düzəliş yüklə
          </summary>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '10px 0' }}>
            Redaksiya düzəliş tələb edibsə, yenilənmiş əlyazmanı buradan yükləyə və məlumatları redaktə edə bilərsiniz. Dəyişiklik avtomatik olaraq redaksiyaya bildirilir.
          </p>
          <form action={updateSubmissionByToken} className="adm-form">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} aria-hidden="true" />
            <input type="hidden" name="token" value={params.token} />
            <div className="adm-field full"><label>Başlıq</label><input name="title" defaultValue={sub.title ?? ''} /></div>
            <div className="adm-field full"><label>Digər müəlliflər</label><textarea name="coauthors" defaultValue={sub.coauthors ?? ''} /></div>
            <div className="adm-field full"><label>Açar sözlər</label><input name="keywords" defaultValue={sub.keywords ?? ''} /></div>
            <div className="adm-field full"><label>Xülasə</label><textarea name="abstract" defaultValue={sub.abstract ?? ''} /></div>
            <div className="adm-field full"><label>Yenilənmiş əlyazma (Word / LaTeX / PDF)</label><input type="file" name="manuscript_file" accept=".doc,.docx,.tex,.pdf,.zip" /></div>
            <div className="adm-field full"><label>və ya əlyazma keçidi (URL)</label><input name="manuscript_url" defaultValue={sub.manuscript_url ?? ''} /></div>
            <div className="adm-field full"><label>Əlavə şəkillər</label><input type="file" name="figures" multiple accept="image/*,.zip,.eps,.tif,.tiff" /></div>
            <div className="adm-actions"><button className="adm-btn" type="submit">Yenilə və göndər</button></div>
          </form>
        </details>
      </div>
    </section>
  );
}
