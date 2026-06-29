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
    foot_indexing: 'İndeksləşmə və standartlar',
    foot_disclaimer: 'Məzmun nümunə xarakterlidir; ISSN, DOI, redaksiya adları və metrikalar real dəyərlərlə əvəz olunmalıdır.',
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
    foot_indexing: 'Indexing & Standards',
    foot_disclaimer: 'Content is illustrative; ISSN, DOI, editorial names and metrics must be replaced with real values.',
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
    foot_indexing: 'Индексация и стандарты',
    foot_disclaimer: 'Содержание носит иллюстративный характер; ISSN, DOI, имена редакции и метрики должны быть заменены реальными значениями.',
  },
};

export function getDict(lang) { return dict[lang] || dict.az; }
