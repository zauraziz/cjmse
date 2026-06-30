export const LANGS = ['az', 'en', 'ru'];
export const DEFAULT_LANG = 'az';

const dict = {
  az: {
    htmlLang: 'az', skip: 'Əsas məzmuna keç',
    topInfo: 'ISSN XXXX-XXXX (online) · Diamond Open Access · CC BY 4.0',
    nav_authors: 'Müəlliflər', nav_ethics: 'Etika', nav_about: 'Haqqında',
    nav_articles: 'Məqalələr', nav_issues: 'Nömrələr', nav_forAuthors: 'Müəlliflər üçün',
    submit: 'Məqalə göndər', searchPh: 'Məqalə, müəllif, açar söz…', menu: 'Menyu',
    foot_about: 'Azərbaycan Dövlət Dəniz Akademiyasının resenziyalı, açıq girişli elmi jurnalı — dənizçilik, nəqliyyat və mühəndislik elmləri üzrə.',
    foot_nav: 'Naviqasiya', foot_current: 'Cari nömrə', foot_allArticles: 'Bütün məqalələr',
    foot_subjects: 'Tədqiqat sahələri', foot_archive: 'Arxiv', foot_faq: 'Tez-tez verilən suallar',
    foot_forAuthors: 'Müəlliflər üçün', foot_submit: 'Məqalə göndər', foot_guide: 'Müəllif təlimatı',
    foot_reviewEthics: 'Resenziya və etika', foot_openAccess: 'Açıq giriş', foot_board: 'Redaksiya heyəti',
    foot_indexing: 'İndeksləşmə və standartlar', foot_info: 'Əlavə məlumat', foot_readers: 'Oxucular üçün', foot_authorsInfo: 'Müəlliflər üçün', foot_librarians: 'Kitabxanaçılar üçün',
    foot_disclaimer: 'Məzmun nümunə xarakterlidir; ISSN, DOI, redaksiya adları və metrikalar real dəyərlərlə əvəz olunmalıdır.',

    types: { research: 'Tədqiqat məqaləsi', review: 'İcmal məqaləsi', technical: 'Texniki məqalə', short: 'Qısa elmi hesabat (Tövsiyə)', editorial: 'Redaksiya məqaləsi', casestudy: 'Keys-stadi' },

    a_openAccess: 'Açıq giriş', a_backToArticles: '← Bütün məqalələr', a_backToArchive: '← Arxiv',
    a_pagesAbbr: 'səh.', a_reads: 'oxunma', a_cites: 'istinad',
    a_fullText: 'Tam mətn', a_pdfDownload: 'PDF yüklə', a_researchData: 'Tədqiqat datası',
    a_citeAs: 'İstinad', a_udc: 'UDC',
    a_kwAz: 'Açar sözlər', a_kwEn: 'Keywords', a_kwRu: 'Ключевые слова',
    a_original: 'Orijinal', a_corresponding: 'Əlaqələndirici müəllif',
    a_pdfNotShown: 'PDF görünmürsə,', a_openNew: 'yeni pəncərədə açın', a_orDownload: 'yükləyin',

    a_articlesTitle: 'Məqalələr', a_allSubjects: 'Bütün sahələr', a_allIssues: 'Bütün nömrələr',
    a_searchPh2: 'Başlıq və ya müəllif üzrə axtar…',
    a_sortNew: 'Ən yeni', a_sortRead: 'Ən çox oxunan', a_sortCite: 'Ən çox istinad',
    a_noMatch: 'Bu meyarlara uyğun məqalə tapılmadı. Filtri sıfırlayın və ya başqa açar söz yoxlayın.',
    a_count: 'məqalə', a_vol: 'Cild', a_group: 'Qrup',

    a_archiveTitle: 'Jurnalın arxivi', a_archiveIntro: 'Bütün nömrələr. İstənilən nömrəyə klikləyərək həmin nömrənin məqalələrinə baxın.',
    a_archiveCrossref: 'Arxiv tam mətnləri ilə birlikdə CrossRef DOI vasitəsilə daimi olaraq əlçatandır.',
    a_current: 'Cari', a_currentIssue: 'Cari nömrə', a_noIssues: 'Hələ nömrə yoxdur.',
    a_noArtInIssue: 'Bu nömrədə hələ məqalə yoxdur.',

    a_authorArticles: 'Müəllifin məqalələri', a_authorNoArticles: 'Bu müəllifin hələ məqaləsi yoxdur.',
    a_affiliation: 'Təşkilat', a_email: 'E-poçt', a_orcid: 'ORCID', a_authorBack: '← Geri',
  },
  en: {
    htmlLang: 'en', skip: 'Skip to main content',
    topInfo: 'ISSN XXXX-XXXX (online) · Diamond Open Access · CC BY 4.0',
    nav_authors: 'Authors', nav_ethics: 'Ethics', nav_about: 'About',
    nav_articles: 'Articles', nav_issues: 'Issues', nav_forAuthors: 'For Authors',
    submit: 'Submit Article', searchPh: 'Article, author, keyword…', menu: 'Menu',
    foot_about: 'A peer-reviewed, Diamond Open Access journal of the Azerbaijan State Marine Academy — in maritime, transport and engineering sciences.',
    foot_nav: 'Navigation', foot_current: 'Current Issue', foot_allArticles: 'All Articles',
    foot_subjects: 'Research Areas', foot_archive: 'Archive', foot_faq: 'FAQ',
    foot_forAuthors: 'For Authors', foot_submit: 'Submit Article', foot_guide: 'Author Guidelines',
    foot_reviewEthics: 'Peer Review & Ethics', foot_openAccess: 'Open Access', foot_board: 'Editorial Board',
    foot_indexing: 'Indexing & Standards', foot_info: 'Additional Information', foot_readers: 'For Readers', foot_authorsInfo: 'For Authors', foot_librarians: 'For Librarians',
    foot_disclaimer: 'Content is illustrative; ISSN, DOI, editorial names and metrics must be replaced with real values.',

    types: { research: 'Research Article', review: 'Review Article', technical: 'Technical Article', short: 'Short Report', editorial: 'Editorial', casestudy: 'Case Study' },

    a_openAccess: 'Open Access', a_backToArticles: '← All Articles', a_backToArchive: '← Archive',
    a_pagesAbbr: 'pp.', a_reads: 'views', a_cites: 'citations',
    a_fullText: 'Full Text', a_pdfDownload: 'Download PDF', a_researchData: 'Research Data',
    a_citeAs: 'Cite as', a_udc: 'UDC',
    a_kwAz: 'Açar sözlər', a_kwEn: 'Keywords', a_kwRu: 'Ключевые слова',
    a_original: 'Original', a_corresponding: 'Corresponding author',
    a_pdfNotShown: 'If the PDF does not display,', a_openNew: 'open in a new window', a_orDownload: 'download it',

    a_articlesTitle: 'Articles', a_allSubjects: 'All Areas', a_allIssues: 'All Issues',
    a_searchPh2: 'Search by title or author…',
    a_sortNew: 'Newest', a_sortRead: 'Most read', a_sortCite: 'Most cited',
    a_noMatch: 'No articles match these criteria. Reset the filter or try another keyword.',
    a_count: 'articles', a_vol: 'Vol.', a_group: 'Group',

    a_archiveTitle: 'Journal Archive', a_archiveIntro: 'All issues. Click any issue to view its articles.',
    a_archiveCrossref: 'The archive, with full texts, is permanently available via CrossRef DOI.',
    a_current: 'Current', a_currentIssue: 'Current Issue', a_noIssues: 'No issues yet.',
    a_noArtInIssue: 'No articles in this issue yet.',

    a_authorArticles: 'Author’s Articles', a_authorNoArticles: 'This author has no articles yet.',
    a_affiliation: 'Affiliation', a_email: 'Email', a_orcid: 'ORCID', a_authorBack: '← Back',
  },
  ru: {
    htmlLang: 'ru', skip: 'Перейти к содержанию',
    topInfo: 'ISSN XXXX-XXXX (online) · Diamond Open Access · CC BY 4.0',
    nav_authors: 'Авторам', nav_ethics: 'Этика', nav_about: 'О журнале',
    nav_articles: 'Статьи', nav_issues: 'Выпуски', nav_forAuthors: 'Авторам',
    submit: 'Подать статью', searchPh: 'Статья, автор, ключевое слово…', menu: 'Меню',
    foot_about: 'Рецензируемый научный журнал открытого доступа Азербайджанской Государственной Морской Академии — по морским, транспортным и инженерным наукам.',
    foot_nav: 'Навигация', foot_current: 'Текущий выпуск', foot_allArticles: 'Все статьи',
    foot_subjects: 'Области исследований', foot_archive: 'Архив', foot_faq: 'Вопросы и ответы',
    foot_forAuthors: 'Авторам', foot_submit: 'Подать статью', foot_guide: 'Руководство для авторов',
    foot_reviewEthics: 'Рецензирование и этика', foot_openAccess: 'Открытый доступ', foot_board: 'Редколлегия',
    foot_indexing: 'Индексация и стандарты', foot_info: 'Дополнительная информация', foot_readers: 'Для читателей', foot_authorsInfo: 'Для авторов', foot_librarians: 'Для библиотекарей',
    foot_disclaimer: 'Содержание носит иллюстративный характер; ISSN, DOI, имена редакции и метрики должны быть заменены реальными значениями.',

    types: { research: 'Научная статья', review: 'Обзорная статья', technical: 'Техническая статья', short: 'Краткий отчёт', editorial: 'Редакционная статья', casestudy: 'Кейс-стади' },

    a_openAccess: 'Открытый доступ', a_backToArticles: '← Все статьи', a_backToArchive: '← Архив',
    a_pagesAbbr: 'стр.', a_reads: 'просмотров', a_cites: 'цитирований',
    a_fullText: 'Полный текст', a_pdfDownload: 'Скачать PDF', a_researchData: 'Данные исследования',
    a_citeAs: 'Цитировать', a_udc: 'УДК',
    a_kwAz: 'Açar sözlər', a_kwEn: 'Keywords', a_kwRu: 'Ключевые слова',
    a_original: 'Оригинал', a_corresponding: 'Автор для корреспонденции',
    a_pdfNotShown: 'Если PDF не отображается,', a_openNew: 'откройте в новом окне', a_orDownload: 'скачайте',

    a_articlesTitle: 'Статьи', a_allSubjects: 'Все области', a_allIssues: 'Все выпуски',
    a_searchPh2: 'Поиск по названию или автору…',
    a_sortNew: 'Новейшие', a_sortRead: 'Читаемые', a_sortCite: 'Цитируемые',
    a_noMatch: 'Нет статей по этим критериям. Сбросьте фильтр или попробуйте другое ключевое слово.',
    a_count: 'статей', a_vol: 'Том', a_group: 'Группа',

    a_archiveTitle: 'Архив журнала', a_archiveIntro: 'Все выпуски. Нажмите на любой выпуск, чтобы увидеть его статьи.',
    a_archiveCrossref: 'Архив с полными текстами постоянно доступен через CrossRef DOI.',
    a_current: 'Текущий', a_currentIssue: 'Текущий выпуск', a_noIssues: 'Выпусков пока нет.',
    a_noArtInIssue: 'В этом выпуске пока нет статей.',

    a_authorArticles: 'Статьи автора', a_authorNoArticles: 'У этого автора пока нет статей.',
    a_affiliation: 'Организация', a_email: 'Эл. почта', a_orcid: 'ORCID', a_authorBack: '← Назад',
  },
};

export function getDict(lang) { return dict[lang] || dict.az; }
export function typeLabel(t, type) { return (t && t.types && t.types[type]) || type; }
