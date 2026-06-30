export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLang } from '@/lib/serverLang';

const C = {
  readers: {
    title: { az: 'Oxucular üçün', en: 'For Readers', ru: 'Для читателей' },
    body: {
      az: [
        'CJMSE Diamond Open Access modelindədir: bütün məqalələr pulsuz oxunur, yüklənir və CC BY 4.0 lisenziyası ilə yenidən istifadəyə açıqdır. Heç bir abunə və ya ödəniş tələb olunmur.',
        'Hər məqalə CrossRef DOI ilə daimi olaraq əlçatandır və DOAJ, Google Scholar, ORCID kimi sistemlərdə indekslənir. Bu, məqalələrin asanlıqla tapılmasını və düzgün istinad edilməsini təmin edir.',
        'Yeni nömrələrdən və məqalələrdən xəbərdar olmaq üçün RSS lentimizə abunə ola bilərsiniz.',
      ],
      en: [
        'CJMSE is a Diamond Open Access journal: every article is free to read, download and reuse under the CC BY 4.0 licence. No subscription or fee is required.',
        'Each article is permanently available via a CrossRef DOI and is indexed in DOAJ, Google Scholar and ORCID, ensuring discoverability and correct citation.',
        'To stay informed about new issues and articles, you can subscribe to our RSS feed.',
      ],
      ru: [
        'CJMSE — журнал модели Diamond Open Access: все статьи доступны бесплатно для чтения, скачивания и повторного использования по лицензии CC BY 4.0. Подписка или плата не требуются.',
        'Каждая статья постоянно доступна через CrossRef DOI и индексируется в DOAJ, Google Scholar и ORCID.',
        'Чтобы быть в курсе новых выпусков, подпишитесь на нашу RSS-ленту.',
      ],
    },
    links: [['/feed.xml', { az: 'RSS lenti', en: 'RSS feed', ru: 'RSS-лента' }], ['/articles', { az: 'Məqalələri oxu', en: 'Browse articles', ru: 'Читать статьи' }]],
  },
  authors: {
    title: { az: 'Müəlliflər üçün', en: 'For Authors', ru: 'Для авторов' },
    body: {
      az: [
        'Məqalə təqdim etmək istəyirsiniz? Əvvəlcə jurnalın əhatə dairəsi, struktur, formatlaşdırma və istinad tələblərini əhatə edən müəllif qaydaları ilə tanış olun.',
        'Bütün təqdimatlar ikili kor (double-blind) resenziyadan keçir. Təqdimatdan sonra e-poçtunuza şəxsi izləmə keçidi göndərilir — məqalənizin statusunu şifrə daxil etmədən, istənilən vaxt izləyə bilərsiniz.',
        'Jurnal Diamond Open Access modelindədir: nəşr üçün müəllifdən ödəniş alınmır, müəlliflik hüququ müəllifdə qalır.',
      ],
      en: [
        'Interested in submitting? First read the author guidelines covering scope, structure, formatting and referencing requirements.',
        'All submissions undergo double-blind peer review. After submission you receive a private tracking link by email — you can follow your manuscript’s status at any time without a password.',
        'The journal is Diamond Open Access: there are no author charges and copyright remains with the authors.',
      ],
      ru: [
        'Хотите подать статью? Сначала ознакомьтесь с руководством для авторов.',
        'Все материалы проходят двойное слепое рецензирование. После подачи вы получаете персональную ссылку для отслеживания по электронной почте — без пароля.',
        'Журнал Diamond Open Access: плата с авторов не взимается, авторские права остаются за авторами.',
      ],
    },
    links: [['/for-authors', { az: 'Müəllif qaydaları', en: 'Author guidelines', ru: 'Руководство для авторов' }], ['/submit', { az: 'Məqalə göndər', en: 'Submit article', ru: 'Подать статью' }]],
  },
  librarians: {
    title: { az: 'Kitabxanaçılar üçün', en: 'For Librarians', ru: 'Для библиотекарей' },
    body: {
      az: [
        'Kitabxanaçıları CJMSE-ni elektron jurnal kolleksiyalarına daxil etməyə dəvət edirik. Jurnal tam açıq girişlidir — abunə, lisenziya haqqı və ya giriş məhdudiyyəti yoxdur.',
        'Bütün məqalələr CrossRef DOI, davamlı URL-lər və standart metadata (Dublin Core, Google Scholar etiketləri) ilə təchiz olunub; bu, kataloqlaşdırma və avtomatik yığımı asanlaşdırır.',
        'İndeksləşmə və arxivləşmə: DOAJ, CrossRef, Google Scholar, ORCID. Rəqəmsal qoruma üçün standart protokollar nəzərdə tutulur.',
      ],
      en: [
        'We invite librarians to include CJMSE in their electronic journal collections. The journal is fully open access — no subscription, licence fee or access barrier.',
        'All articles carry CrossRef DOIs, persistent URLs and standard metadata (Dublin Core, Google Scholar tags), simplifying cataloguing and automated harvesting.',
        'Indexing and archiving: DOAJ, CrossRef, Google Scholar, ORCID.',
      ],
      ru: [
        'Мы приглашаем библиотекарей включить CJMSE в электронные коллекции журналов. Журнал полностью открытого доступа — без подписки и барьеров.',
        'Все статьи снабжены CrossRef DOI, постоянными URL и стандартными метаданными (Dublin Core, теги Google Scholar).',
        'Индексация и архивирование: DOAJ, CrossRef, Google Scholar, ORCID.',
      ],
    },
    links: [['/about', { az: 'Jurnal haqqında', en: 'About the journal', ru: 'О журнале' }]],
  },
};

export function generateMetadata({ params }) {
  const c = C[params.topic];
  return { title: c ? c.title.az : 'Məlumat' };
}

export default function InfoPage({ params }) {
  const c = C[params.topic];
  if (!c) notFound();
  const lang = getLang();
  const title = c.title[lang] || c.title.az;
  const body = c.body[lang] || c.body.az;
  const lbl = (m) => m[lang] || m.az;
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>
          {lang === 'en' ? 'Additional Information' : lang === 'ru' ? 'Дополнительная информация' : 'Əlavə məlumat'}
        </div>
        <h1 className="sec-title">{title}</h1>
        {body.map((para, i) => <p key={i} style={{ fontSize: 15.5, lineHeight: 1.85, color: 'var(--ink-2)', margin: '12px 0' }}>{para}</p>)}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
          {c.links.map(([href, m], i) => (
            <Link key={i} className={i === 0 ? 'btn btn--primary' : 'btn btn--ghost'} href={href}>{lbl(m)}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
