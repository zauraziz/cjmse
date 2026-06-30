'use client';
export default function AuthorForm({ action, author }) {
  return (
    <form action={action} className="adm-form">
      {author && <input type="hidden" name="id" value={author.id} />}
      <div className="adm-field full"><label>Tam ad *</label><input name="full_name" required defaultValue={author?.full_name ?? ''} placeholder="A.B. Soyadov" /></div>
      <div className="adm-field"><label>ORCID</label><input name="orcid" defaultValue={author?.orcid ?? ''} placeholder="0000-0000-0000-0000" /></div>
      <div className="adm-field"><label>E-poçt</label><input name="email" type="email" defaultValue={author?.email ?? ''} /></div>
      <div className="adm-field full"><label>Mənsubiyyət (affiliation)</label><input name="affiliation" defaultValue={author?.affiliation ?? ''} placeholder="ADDA · Dəniz nəqliyyatı" /></div>
      <div className="adm-field full"><label>Tədqiqat qrupu / şöbə</label><input name="research_group" defaultValue={author?.research_group ?? ''} placeholder="Gəmi mexanikası kafedrası / Hidrodinamika qrupu" /></div>
      <div className="adm-actions"><button className="adm-btn" type="submit">{author ? 'Yadda saxla' : 'Müəllif əlavə et'}</button></div>
    </form>
  );
}
