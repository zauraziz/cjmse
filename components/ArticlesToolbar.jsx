'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ArticlesToolbar({ subjects, issues = [] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const q = sp.get('q') || '';
  const subject = sp.get('subject') || 'all';
  const issue = sp.get('issue') || 'all';
  const sort = sp.get('sort') || 'date';

  function update(next) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v || v === 'all' || (k === 'sort' && v === 'date') || (k === 'q' && v === '')) params.delete(k);
      else params.set(k, v);
    }
    const qs = params.toString();
    router.push('/articles' + (qs ? '?' + qs : ''));
  }

  return (
    <div className="toolbar">
      <label className="search" style={{ flex: 1, minWidth: 220 }}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input type="search" defaultValue={q} placeholder="Başlıq və ya müəllif üzrə axtar…"
               onKeyDown={(e) => { if (e.key === 'Enter') update({ q: e.currentTarget.value }); }} />
      </label>
      <select value={subject} onChange={(e) => update({ subject: e.target.value })} aria-label="Sahə filtri">
        <option value="all">Bütün sahələr</option>
        {subjects.map((s) => <option key={s.slug} value={s.slug}>{s.name_az}</option>)}
      </select>
      <select value={issue} onChange={(e) => update({ issue: e.target.value })} aria-label="Nömrə filtri">
        <option value="all">Bütün nömrələr</option>
        {issues.map((i) => <option key={i.id} value={i.id}>{i.title || `Cild ${i.volume}, № ${i.number} (${i.year})`}</option>)}
      </select>
      <div className="toolbar__sort">
        <select value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sıralama">
          <option value="date">Ən yeni</option>
          <option value="views">Ən çox oxunan</option>
          <option value="cites">Ən çox istinad</option>
        </select>
      </div>
    </div>
  );
}
