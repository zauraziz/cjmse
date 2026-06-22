'use client';
export default function IssueForm({ action, issue }) {
  return (
    <form action={action} className="adm-form">
      {issue && <input type="hidden" name="id" value={issue.id} />}
      <div className="adm-field"><label>Cild (volume) *</label><input name="volume" type="number" required defaultValue={issue?.volume ?? ''} /></div>
      <div className="adm-field"><label>Nömrə (number) *</label><input name="number" type="number" required defaultValue={issue?.number ?? ''} /></div>
      <div className="adm-field"><label>İl (year) *</label><input name="year" type="number" required defaultValue={issue?.year ?? ''} /></div>
      <div className="adm-field"><label>Başlıq (boş = avtomatik)</label><input name="title" defaultValue={issue?.title ?? ''} placeholder="Cild 27, № 2 (2026)" /></div>
      <div className="adm-field"><label>Nəşr tarixi</label><input name="published_at" type="date" defaultValue={issue?.published_at ? String(issue.published_at).slice(0, 10) : ''} /></div>
      <div className="adm-field adm-check"><input type="checkbox" id="iscur" name="is_current" defaultChecked={!!issue?.is_current} /><label htmlFor="iscur">Cari nömrə kimi təyin et</label></div>
      <div className="adm-actions"><button className="adm-btn" type="submit">{issue ? 'Yadda saxla' : 'Nömrə əlavə et'}</button></div>
    </form>
  );
}
