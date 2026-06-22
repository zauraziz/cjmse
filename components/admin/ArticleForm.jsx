'use client';
import { useState } from 'react';

const TYPES = [
  ['research', 'Tədqiqat məqaləsi'], ['review', 'İcmal məqaləsi'],
  ['technical', 'Texniki məqalə'], ['short', 'Qısa məlumat'], ['editorial', 'Redaksiya məqaləsi'],
];

export default function ArticleForm({ action, subjects, issues, allAuthors, article }) {
  const [rows, setRows] = useState(
    (article?.authorLinks || []).map((l) => ({ authorId: l.author_id, isCorresponding: l.is_corresponding }))
  );
  const addRow = () => setRows((r) => [...r, { authorId: allAuthors[0]?.id || '', isCorresponding: r.length === 0 }]);
  const update = (i, patch) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const remove = (i) => setRows((r) => r.filter((_, j) => j !== i));
  const move = (i, d) => setRows((r) => { const a = [...r]; const j = i + d; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; });

  return (
    <form action={action} className="adm-form">
      {article && <input type="hidden" name="id" value={article.id} />}
      <input type="hidden" name="authors" value={JSON.stringify(rows)} />

      <div className="adm-field full"><label>Başlıq *</label><input name="title" required defaultValue={article?.title ?? ''} /></div>
      <div className="adm-field full"><label>Xülasə (abstract)</label><textarea name="abstract" defaultValue={article?.abstract ?? ''} /></div>

      <div className="adm-field"><label>Növ</label>
        <select name="type" defaultValue={article?.type ?? 'research'}>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </div>
      <div className="adm-field"><label>Dil</label><input name="language" defaultValue={article?.language ?? 'az'} /></div>

      <div className="adm-field"><label>Sahə</label>
        <select name="subject_id" defaultValue={article?.subject_id ?? ''}>
          <option value="">— seçin —</option>
          {subjects.map((s) => <option key={s.slug} value={s.id}>{s.name_az}</option>)}
        </select>
      </div>
      <div className="adm-field"><label>Nömrə</label>
        <select name="issue_id" defaultValue={article?.issue_id ?? ''}>
          <option value="">— seçin —</option>
          {issues.map((i) => <option key={i.id} value={i.id}>{i.title || `Cild ${i.volume}, № ${i.number} (${i.year})`}</option>)}
        </select>
      </div>

      <div className="adm-field"><label>Səhifələr</label><input name="pages" defaultValue={article?.pages ?? ''} placeholder="15–32" /></div>
      <div className="adm-field"><label>DOI</label><input name="doi" defaultValue={article?.doi ?? ''} placeholder="10.xxxxx/dn.2026.027" /></div>

      <div className="adm-field"><label>PDF URL</label><input name="pdf_url" defaultValue={article?.pdf_url ?? ''} placeholder="/pdf/..." /></div>
      <div className="adm-field"><label>Data URL</label><input name="data_url" defaultValue={article?.data_url ?? ''} /></div>

      <div className="adm-field"><label>Nəşr tarixi</label><input name="published_at" type="date" defaultValue={article?.published_at ? String(article.published_at).slice(0, 10) : ''} /></div>
      <div className="adm-field"><label>Açar sözlər (vergüllə)</label><input name="keywords" defaultValue={(article?.keywords || []).join(', ')} placeholder="naviqasiya, GPS" /></div>

      <div className="adm-field"><label>Oxunma</label><input name="views" type="number" defaultValue={article?.views ?? 0} /></div>
      <div className="adm-field"><label>İstinad</label><input name="citations" type="number" defaultValue={article?.citations ?? 0} /></div>

      <div className="adm-field full">
        <label>Müəlliflər (sıra ilə · ✉ = əlaqələndirici müəllif)</label>
        {rows.length === 0 && <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0' }}>Hələ müəllif əlavə olunmayıb.</p>}
        {rows.map((row, i) => (
          <div className="adm-au-row" key={i}>
            <select value={row.authorId} onChange={(e) => update(i, { authorId: e.target.value })}>
              {allAuthors.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
            </select>
            <label className="corr"><input type="checkbox" checked={!!row.isCorresponding} onChange={(e) => update(i, { isCorresponding: e.target.checked })} /> ✉</label>
            <button type="button" className="adm-mini" onClick={() => move(i, -1)} title="Yuxarı">↑</button>
            <button type="button" className="adm-mini" onClick={() => remove(i)} title="Sil">×</button>
          </div>
        ))}
        <div style={{ marginTop: 6 }}><button type="button" className="adm-btn adm-btn--ghost" onClick={addRow} disabled={!allAuthors.length}>+ Müəllif əlavə et</button></div>
        {!allAuthors.length && <p style={{ fontSize: 12.5, color: '#b3261e', marginTop: 6 }}>Əvvəlcə "Müəlliflər" bölməsində müəllif yaradın.</p>}
      </div>

      <div className="adm-actions">
        <button className="adm-btn" type="submit">{article ? 'Yadda saxla' : 'Məqalə əlavə et'}</button>
        <a className="adm-btn adm-btn--ghost" href="/admin/articles">Ləğv et</a>
      </div>
    </form>
  );
}
