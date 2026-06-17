import Link from 'next/link';

const OJS = process.env.NEXT_PUBLIC_OJS_URL || '#';
export const metadata = { title: 'Müəlliflər üçün' };

export default function ForAuthorsPage() {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <h1 className="sec-title">Müəlliflər üçün</h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          «Elmi Əsərləri» (CJMSE) dənizçilik, nəqliyyat və mühəndislik elmləri üzrə orijinal tədqiqat, icmal, texniki
          məqalə və qısa məlumatları qəbul edir. Bütün təqdimatlar ikili kor (double-blind) resenziyadan keçir.
        </p>

        <div style={{ margin: '22px 0' }}>
          <a className="btn btn--gold" href={OJS} target="_blank" rel="noopener noreferrer">Əlyazma göndər (redaksiya sistemi)</a>
        </div>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>Təqdimat tələbləri</h2>
        <ul style={{ fontSize: 15.5, lineHeight: 1.9, color: 'var(--ink-2)', paddingLeft: 20 }}>
          <li>Mətn Word (.docx) və ya LaTeX formatında; şəkil və cədvəllər ayrıca yüksək keyfiyyətli fayllarda.</li>
          <li>Bütün məqalələr üçün ingilis dilində xülasə (abstract) və açar sözlər tələb olunur (mətn AZ/EN/RU ola bilər).</li>
          <li>Hər müəllif üçün ORCID identifikatoru və müəlliflik töhfəsi CRediT taksonomiyası ilə göstərilməlidir.</li>
          <li>İstinadlar vahid stildə, DOI-lərlə birlikdə verilməlidir.</li>
          <li>İkiqat təqdimat (eyni əlyazmanın başqa jurnala paralel göndərilməsi) qadağandır.</li>
        </ul>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>Proses</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          Təqdimat → texniki yoxlanış və oxşarlıq (plagiat) skrininqi → ən azı iki müstəqil rəyçi → redaktor qərarı →
          düzəliş → qəbul → nəşr və CrossRef DOI təyini. İlk qərara qədər orta müddət ≤ 10 həftədir.
        </p>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>Açıq giriş və hüquqlar</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          Jurnal Diamond Open Access modelindədir — nə müəllif, nə oxucu ödəniş etmir. Müəlliflik hüququ müəllifdə qalır;
          məqalələr CC BY 4.0 lisenziyası ilə dərc olunur. Ətraflı: <Link href="/ethics">nəşr etikası və siyasətlər</Link>.
        </p>
      </div>
    </section>
  );
}
