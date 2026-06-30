import Link from 'next/link';

const OJS = process.env.NEXT_PUBLIC_OJS_URL || '#';
export const metadata = {
  title: 'Müəlliflər üçün qaydalar',
  description: 'CJMSE — Caspian Journal of Maritime Science & Engineering jurnalına məqalə təqdim etmək üçün ətraflı müəllif qaydaları: struktur, formatlaşdırma, UDC, istinad stili, resenziya və etika.',
};

const h2 = { fontSize: '1.18rem', marginTop: 34 };
const h3 = { fontFamily: 'var(--f-display)', fontSize: '1.02rem', color: 'var(--ink)', margin: '20px 0 8px' };
const p = { fontSize: 15.5, lineHeight: 1.85, color: 'var(--ink-2)', margin: '10px 0' };
const ul = { fontSize: 15.5, lineHeight: 1.85, color: 'var(--ink-2)', paddingLeft: 22, margin: '10px 0' };
const note = { fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.7 };
const refBox = { background: 'var(--mist)', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px', fontSize: 14, lineHeight: 1.7, color: 'var(--ink)', margin: '8px 0' };

export default function ForAuthorsPage() {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 860 }}>
        <h1 className="sec-title">Müəlliflər üçün qaydalar</h1>
        <p style={{ ...p, fontSize: 16 }}>
          <b>Caspian Journal of Maritime Science &amp; Engineering (CJMSE)</b> — Azərbaycan Dövlət Dəniz Akademiyasının
          resenziyalı, açıq girişli (Diamond Open Access) elmi jurnalıdır. Jurnal dənizçilik elmləri, su nəqliyyatı və
          dəniz mühəndisliyi sahələrində orijinal tədqiqat, icmal, texniki məqalə və qısa məlumatları dərc edir.
          Aşağıdakı qaydalar əlyazmanın hazırlanması, təqdimi və resenziya prosesini əhatə edir; onlara tam riayət
          edilməsi məqalənin baxılma müddətini qısaldır.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '20px 0 6px' }}>
          <Link className="btn btn--gold" href="/submit">Əlyazma göndər</Link>
          <Link className="btn btn--ghost" href="/ethics">Nəşr etikası →</Link>
        </div>

        {/* 1 */}
        <h2 className="sec-title" style={h2}>1. Nəşr prinsipləri və əhatə dairəsi</h2>
        <p style={p}>
          CJMSE-də müvafiq sahədə mövcud elmi boşluğu dolduran, orijinal nəticələr təqdim edən və ya əvvəlki
          tədqiqatları yenidən qiymətləndirərək diqqətəlayiq elmi yanaşma ortaya qoyan yazılara üstünlük verilir.
          Jurnalın tematik istiqamətləri:
        </p>
        <ul style={ul}>
          <li>Gəmiqayırma və gəmi təmiri texnologiyası;</li>
          <li>Gəmiçilik və su nəqliyyatının istismarı;</li>
          <li>Gəmiçilik texnikası;</li>
          <li>Gəmiçilikdə təbiət elmləri problemləri.</li>
        </ul>
        <p style={p}>
          Təqdim olunan əlyazma əvvəllər başqa yerdə dərc edilməməli və paralel olaraq başqa jurnalın baxışında
          olmamalıdır. Elmi konfransda təqdim edilmiş məruzələr — bu fakt açıq göstərilmək şərtilə — qəbul edilə bilər.
          Jurnal rübdə bir dəfə, ildə dörd dəfə nəşr olunur. Yalnız resenziyadan keçərək tövsiyə edilmiş yazılar dərc edilir.
        </p>

        {/* 2 */}
        <h2 className="sec-title" style={h2}>2. Resenziya prosesi (double-blind)</h2>
        <p style={p}>
          Təqdim olunan əlyazma əvvəlcə redaksiya tərəfindən əhatə dairəsi, formal tələblər və oxşarlıq (plagiat)
          baxımından yoxlanılır. Tələblərə uyğun olmayan yazılar düzəliş üçün müəllifə qaytarıla və ya baxışdan kənar edilə bilər.
        </p>
        <ul style={ul}>
          <li>Hər əlyazma <b>ikili kor (double-blind)</b> prinsipi ilə müvafiq sahə üzrə <b>ən azı iki müstəqil resenzentə</b> göndərilir.</li>
          <li>Resenzentlərin və müəlliflərin kimliyi qarşılıqlı olaraq məxfi saxlanılır; rəylər redaksiyada <b>beş il</b> qorunur.</li>
          <li>Rəylər ziddiyyətli olduqda yazı üçüncü resenzentə göndərilir və ya redaksiya yekun qərar verir.</li>
          <li>Müəlliflər rəyləri nəzərə almalı, razılaşmadıqları məqamlara isə əsaslandırılmış cavab vermək hüququna malikdir.</li>
          <li>İlk redaksiya qərarına qədər orta müddət ≤ 10 həftədir. Qəbul edilməyən əlyazmalar geri qaytarılmır.</li>
        </ul>

        {/* 3 */}
        <h2 className="sec-title" style={h2}>3. Dil siyasəti</h2>
        <p style={p}>
          Məqalələr Azərbaycan, ingilis və ya rus dillərində qəbul edilir. Dildən asılı olmayaraq hər məqalənin
          <b> Azərbaycan və ingilis dillərində xülasəsi</b> olmalıdır; rus dilində xülasə (Аннотация) tövsiyə olunur və
          jurnal saytında ayrıca blok kimi göstərilir. Başlıq, açar sözlər və müəllif məlumatları da müvafiq dillərdə təqdim edilməlidir.
        </p>

        {/* 4 */}
        <h2 className="sec-title" style={h2}>4. Əlyazmanın strukturu</h2>
        <p style={p}>
          Əlyazma ardıcıl olaraq aşağıdakı hissələrdən ibarət olmalı və <b>80 000 simvoldan və ya 30 səhifədən</b> çox olmamalıdır:
        </p>
        <ol style={ul}>
          <li><b>UDC (УДК) kodu</b> — sol yuxarı küncdə;</li>
          <li><b>Başlıq</b> — məzmunu dəqiq əks etdirən, 10–12 sözdən çox olmayan, qalın şriftlə;</li>
          <li><b>Müəllif(lər)in adı və soyadı</b> — qalın şriftlə; hər müəllif üçün təşkilat (affiliation) və ORCID;</li>
          <li><b>Xülasə</b> — 150–250 söz (aşağıdakı 5-ci bəndə bax);</li>
          <li><b>Açar sözlər</b> — 5–8 söz/ifadə;</li>
          <li><b>Giriş</b> (Introduction) — problem, məqsəd, ədəbiyyat icmalı;</li>
          <li><b>Metodologiya</b> (Materials &amp; Methods) — eksperiment, modelləşdirmə və ya analiz metodları;</li>
          <li><b>Nəticələr</b> (Results) — alınan nəticələr, cədvəl və şəkillərlə;</li>
          <li><b>Müzakirə</b> (Discussion) — nəticələrin şərhi və müqayisəsi;</li>
          <li><b>Nəticə</b> (Conclusion) — əsas elmi nəticələr ümumiləşdirilmiş şəkildə;</li>
          <li><b>Mənbələr</b> (References) — 7-ci bəndə uyğun.</li>
        </ol>
        <p style={note}>
          Q1 səviyyəli jurnallarda tövsiyə olunan IMRaD strukturu (Introduction–Methods–Results–Discussion) tədqiqat
          məqalələri üçün tələb olunur. İcmal və texniki məqalələrdə struktur mövzuya uyğun tənzimlənə bilər.
        </p>

        {/* 5 */}
        <h2 className="sec-title" style={h2}>5. Xülasə</h2>
        <p style={p}>
          Xülasə <b>150–250 söz</b> həcmində, bir abzasda və istinadsız yazılır. O, oxucuya tam mətnə müraciət etmədən
          tədqiqatı qiymətləndirmək imkanı verməli və aşağıdakıları əks etdirməlidir: tədqiqatın <b>məqsədi</b>,
          <b> metodikası</b>, <b>əsas nəticələri</b>, <b>məhdudiyyətləri</b>, <b>orijinallığı/elmi yeniliyi</b> və
          <b> praktiki əhəmiyyəti</b>.
        </p>

        {/* 6 */}
        <h2 className="sec-title" style={h2}>6. UDC (УДК) kodu</h2>
        <p style={p}>
          Hər məqalə Universal Onluq Təsnifat (UDC / УДК) koduna malik olmalıdır. Kod məqalənin elmi sahəsini beynəlxalq
          təsnifat sisteminə uyğun müəyyən edir (məsələn, gəmiqayırma və dəniz texnikası üçün <b>629.5</b> qrupu).
          Düzgün kod kitabxana məsləhəti və ya rəsmi UDC cədvəlləri (udcsummary.info) əsasında seçilməlidir. Kod
          redaksiya sistemində ayrıca sahə kimi daxil edilir və məqalə səhifəsində göstərilir.
        </p>

        {/* 7 */}
        <h2 className="sec-title" style={h2}>7. Formatlaşdırma</h2>
        <ul style={ul}>
          <li>Format: <b>A4 (29,7 × 21 sm)</b>, MS Word (.docx) və ya LaTeX;</li>
          <li>Şrift: <b>Times New Roman 12</b>, sətirarası interval <b>1,5</b>;</li>
          <li>Səhifə kənarlarından <b>2 sm</b> məsafə; səhifələr nömrələnir;</li>
          <li>Yarımbaşlıqlar yeni sətirdən, ilk hərfi böyük, qalın şriftlə verilir;</li>
          <li>Şəkil və cədvəllər ayrıca yüksək keyfiyyətli fayllarla da təqdim edilir.</li>
        </ul>

        {/* 8 */}
        <h2 className="sec-title" style={h2}>8. Mənbələr və istinadlar</h2>
        <p style={p}>
          Mənbələr yazının sonunda müəlliflərin soyadına görə əlifba sırası ilə düzülür (soyad öncə). Kitab və jurnal
          adları kursivlə, məqalə və kitab bölmələri dırnaq içində verilir; jurnal və kitab bölmələrində səhifə aralığı
          mütləq göstərilir. Mövcud olduqda <b>DOI</b> əlavə edilməlidir. Mətndə istinad edilməyən mənbələr siyahıya daxil edilmir.
        </p>
        <h3 style={h3}>Nümunələr</h3>
        <div style={refBox}>Kitab: Tupper E.C. (2013). <i>Introduction to Naval Architecture</i>. 5th Edition. Butterworth-Heinemann.</div>
        <div style={refBox}>Jurnal məqaləsi: Məmmədov A., Hüseynov R. (2022). “Gəmi korpusunun hidrodinamik müqavimətinin optimallaşdırılması”. <i>Ocean Engineering</i>, Vol. 250, pp. 110–125. https://doi.org/10.xxxx/xxxxx</div>
        <div style={refBox}>Standart/sənəd: IMO (2020). <i>MARPOL Annex VI: Prevention of Air Pollution from Ships</i>. International Maritime Organization, London.</div>
        <div style={refBox}>İnternet mənbəyi: Azərbaycan Dövlət Dəniz Akademiyası. <i>Elmi nəşrlər</i>. https://adda.edu.az (daxilolma tarixi: 10.06.2026)</div>
        <p style={p}>
          Üçdən çox müəllif olduqda birinci müəllifin soyadı və adından sonra “və b.” yazılır. Eyni müəllifin eyni tarixli
          əsərləri (a, b, c) ilə fərqləndirilir.
        </p>
        <h3 style={h3}>Mətndaxili istinadlar</h3>
        <ul style={ul}>
          <li>Birbaşa sitat dırnaq içində verilir; istinad mötərizədə: <b>(Tupper 2013:45)</b>;</li>
          <li>Çoxmüəllifli əsər: <b>(Məmmədov və b. 2022:118)</b>;</li>
          <li>Müəllifin soyadı mətndə keçirsə: <b>Tupper (2013:45) qeyd edir ki…</b>;</li>
          <li>İkinci mənbədən istinad: <b>(Fisher 1990, Tupper 2013-dən)</b>;</li>
          <li>İnternet ünvanları üçün daxilolma tarixi göstərilir və mənbələrə daxil edilir.</li>
        </ul>
        <p style={p}>
          <b>İstinadları avtomatik formatlayın:</b> mənbələrinizi Zotero/Mendeley-dən BibTeX və ya CSL-JSON kimi ixrac edib{' '}
          <Link href="/for-authors/references" style={{ color: 'var(--teal-d)' }}>istinad formatlayıcısı</Link> ilə seçilmiş stildə hazır siyahıya çevirə bilərsiniz.
        </p>

        {/* 9 */}
        <h2 className="sec-title" style={h2}>9. Cədvəl və şəkillər</h2>
        <p style={p}>
          Bütün cədvəl və şəkillərin nömrəsi və başlığı olmalı, mətndə ilk istinad edildiyi yerdən sonra yerləşdirilməlidir.
          Cədvəl və şəkillər yazının ümumi həcminin üçdə birindən (ən çox 10 səhifə) çox olmamalıdır. Qrafiklər vektor və ya
          yüksək ayırdetmə (≥300 dpi) formatında təqdim edilir.
        </p>

        {/* 10 */}
        <h2 className="sec-title" style={h2}>10. Nəşr etikası</h2>
        <ul style={ul}>
          <li><b>Orijinallıq:</b> bütün əlyazmalar oxşarlıq (plagiat) yoxlamasından keçir; uyğunsuzluq baxışdan imtinaya səbəb olur.</li>
          <li><b>Müəlliflik:</b> müəllif töhfələri CRediT taksonomiyası ilə göstərilir; bütün müəlliflər son variantı təsdiqləməlidir.</li>
          <li><b>ORCID:</b> hər müəllif üçün ORCID identifikatoru tövsiyə olunur.</li>
          <li><b>Maraqlar toqquşması</b> və <b>maliyyə mənbələri</b> açıq bildirilməlidir.</li>
          <li><b>Data əlçatanlığı:</b> mümkün olduqda tədqiqat datasına keçid (repozitar/DOI) verilir.</li>
          <li><b>Süni intellekt:</b> generativ alətlərdən istifadə olunubsa, bu, metod hissəsində açıqlanmalıdır.</li>
        </ul>
        <p style={p}>
          Qəbul edilmiş məqalələr <b>CC BY 4.0</b> lisenziyası ilə dərc olunur; müəlliflik hüququ müəllifdə qalır. Ətraflı:{' '}
          <Link href="/ethics" style={{ color: 'var(--teal-d)' }}>nəşr etikası və siyasətlər</Link>.
        </p>

        {/* 11 */}
        <h2 className="sec-title" style={h2}>11. Təqdimat prosesi</h2>
        <p style={p}>
          Əlyazma redaksiya sistemi vasitəsilə (yuxarıdakı “Əlyazma göndər” düyməsi) və ya jurnalın rəsmi e-poçtu ilə
          təqdim edilir. Əlyazma ilə birlikdə doldurulmuş <b>müəllif anketi</b> də göndərilməlidir. Müəlliflərlə redaksiya
          arasında bütün ünsiyyət jurnalın rəsmi kanalları üzərindən aparılır.
        </p>

        {/* checklist */}
        <div className="panel" style={{ marginTop: 24, padding: '18px 20px' }}>
          <h3 style={{ ...h3, marginTop: 0 }}>Təqdimdən əvvəl yoxlama siyahısı</h3>
          <ul style={{ ...ul, margin: '6px 0 0' }}>
            <li>UDC kodu, 10–12 sözlük başlıq və açar sözlər (5–8) daxil edilib;</li>
            <li>Xülasə 150–250 söz, AZ və EN dillərində (RU tövsiyə olunur);</li>
            <li>Struktur IMRaD-a uyğundur; həcm ≤ 30 səhifə / 80 000 simvol;</li>
            <li>Format: A4, Times New Roman 12, 1,5 interval, 2 sm kənar;</li>
            <li>Mənbələr əlifba sırası ilə, DOI-lərlə; mətndaxili istinadlar uyğundur;</li>
            <li>Hər müəllif üçün təşkilat və ORCID; əlaqələndirici müəllif qeyd olunub;</li>
            <li>Maraqlar toqquşması, maliyyələşmə və data əlçatanlığı bildirilib;</li>
            <li>Əlyazma əvvəllər dərc edilməyib və paralel baxışda deyil.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
