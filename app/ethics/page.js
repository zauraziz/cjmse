export const metadata = { title: 'Nəşr etikası' };

export default function EthicsPage() {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <h1 className="sec-title">Nəşr etikası və siyasətlər</h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          Jurnal COPE (Committee on Publication Ethics) prinsiplərini əsas götürür. Bütün iştirakçılar — müəlliflər,
          rəyçilər və redaktorlar — aşağıdakı standartlara əməl edir.
        </p>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>Resenziya</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          Hər əlyazma ən azı iki müstəqil ekspert tərəfindən ikili kor (double-blind) prinsipi ilə qiymətləndirilir.
          Maraqlar toqquşması olan rəyçi prosesdən kənarlaşdırılır.
        </p>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>Müəlliflik və CRediT</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          Müəlliflik töhfələri CRediT taksonomiyası ilə açıqlanır. Hədiyyə və ya kölgə müəllifliyə yol verilmir;
          bütün müəlliflər son versiyanı təsdiqləməlidir.
        </p>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>Oxşarlıq və süni intellekt</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          Bütün təqdimatlar oxşarlıq (plagiat) yoxlanışından keçir. Generativ süni intellektdən istifadə (məs. dil
          redaktəsi) məqalədə açıqlanmalıdır; süni intellekt müəllif kimi göstərilə bilməz — elmi məsuliyyət tamamilə
          müəlliflərin üzərindədir.
        </p>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>Düzəlişlər və geri çəkilmə</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          Kiçik səhvlər corrigendum/erratum ilə düzəldilir; ciddi pozuntular COPE qaydalarına uyğun geri çəkilmə
          (retraction) və ya narahatlıq ifadəsi (expression of concern) ilə nəticələnə bilər.
        </p>

        <h2 className="sec-title" style={{ fontSize: '1.1rem' }}>Açıq giriş, lisenziya və arxivləşdirmə</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          Diamond Open Access (ödənişsiz). Məqalələr CC BY 4.0 lisenziyası ilə dərc olunur. Metadata maşın oxunaqlı
          (JATS XML) formatındadır; daimi mühafizə PKP Preservation Network vasitəsilə təmin olunur.
        </p>
      </div>
    </section>
  );
}
