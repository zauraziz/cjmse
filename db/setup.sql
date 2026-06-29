-- ============================================================
-- CJMSE — TAM QURAŞDIRMA (təkrar işə salmaq təhlükəsizdir)
-- ============================================================
DROP TABLE IF EXISTS article_pdfs, article_keywords, article_authors, reviews, submission_events, submissions, reviewers, keywords, articles, authors, issues, subjects, users, faqs CASCADE;
DROP TYPE IF EXISTS recommendation, submission_status, user_role, article_type CASCADE;

-- STRUKTUR
-- =====================================================================
--  CJMSE / Elmi Əsərləri — Neon (PostgreSQL) verilənlər bazası sxemi
--  PG 15+ (Neon). gen_random_uuid() core-dadır (əlavə extension lazım deyil).
--  İşə salmaq: Neon SQL Editor / psql:  \i schema.sql
-- =====================================================================

-- ---------- ENUM tipləri ----------
create type article_type     as enum ('research','review','technical','short','editorial');
create type submission_status as enum ('submitted','technical_check','under_review','revision','accepted','published','rejected');
create type user_role        as enum ('author','editor','section_editor','reviewer','managing_editor','admin');
create type recommendation   as enum ('accept','minor','major','reject');

-- ---------- Tədqiqat sahələri ----------
create table subjects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_az     text not null,
  name_en     text not null,
  name_ru     text,
  sort_order  int  default 0
);

-- ---------- Nömrələr (issues) ----------
create table issues (
  id            uuid primary key default gen_random_uuid(),
  volume        int  not null,
  number        int  not null,
  year          int  not null,
  title         text,
  cover_url     text,
  is_current    boolean default false,
  published_at  date,
  created_at    timestamptz default now(),
  unique (volume, number, year)
);

-- ---------- Müəlliflər ----------
create table authors (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  orcid        text,                       -- 0000-0000-0000-0000
  affiliation  text,
  email        text,
  created_at   timestamptz default now()
);

-- ---------- Məqalələr ----------
create table articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  title_en      text,
  abstract      text,
  abstract_en   text,
  keywords      text,
  keywords_en   text,
  title_ru      text,
  abstract_ru   text,
  keywords_ru   text,
  type          article_type not null default 'research',
  subject_id    uuid references subjects(id) on delete set null,
  issue_id      uuid references issues(id)   on delete set null,
  pages         text,                       -- "15–32"
  doi           text unique,
  license       text default 'CC BY 4.0',
  language      text default 'az',
  pdf_url       text,
  data_url      text,                       -- research data (DOI/link)
  views         int  default 0,
  citations     int  default 0,
  published_at  date,
  created_at    timestamptz default now()
);
create index idx_articles_subject on articles(subject_id);
create index idx_articles_issue   on articles(issue_id);
create index idx_articles_pub     on articles(published_at desc);

-- ---------- Məqalə ⇄ Müəllif (sıra + CRediT) ----------
create table article_authors (
  article_id       uuid references articles(id) on delete cascade,
  author_id        uuid references authors(id)  on delete cascade,
  author_position  int  not null default 1,
  is_corresponding boolean default false,
  credit_roles     text[],                  -- CRediT taksonomiyası
  primary key (article_id, author_id)
);

-- ---------- Açar sözlər ----------
create table keywords (
  id    uuid primary key default gen_random_uuid(),
  term  text unique not null
);
create table article_keywords (
  article_id uuid references articles(id) on delete cascade,
  keyword_id uuid references keywords(id) on delete cascade,
  primary key (article_id, keyword_id)
);

-- ---------- İstifadəçilər / rollar (auth) ----------
create table users (
  id             uuid primary key default gen_random_uuid(),
  email          text unique not null,
  password_hash  text,                      -- və ya xarici OAuth/ORCID
  full_name      text,
  orcid          text,
  role           user_role not null default 'author',
  created_at     timestamptz default now()
);

-- ---------- Rəyçilər ----------
create table reviewers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete set null,
  full_name   text not null,
  orcid       text,
  affiliation text,
  expertise   text[]
);

-- ---------- Təqdimatlar (manuscript submissions) ----------
create table submissions (
  id                  uuid primary key default gen_random_uuid(),
  code                text unique not null,        -- DN-2026-0142
  title               text not null,
  abstract            text,
  subject_id          uuid references subjects(id) on delete set null,
  corresponding_user  uuid references users(id)    on delete set null,
  status              submission_status not null default 'submitted',
  current_stage       int default 0,               -- 0..5 (stepper)
  manuscript_url      text,
  submitted_at        timestamptz default now(),
  decided_at          timestamptz
);
create index idx_sub_status on submissions(status);
create index idx_sub_code    on submissions(code);

-- ---------- Status hadisələri (izləyici jurnalı) ----------
create table submission_events (
  id             uuid primary key default gen_random_uuid(),
  submission_id  uuid references submissions(id) on delete cascade,
  stage_label    text not null,               -- "Resenziyada"
  note           text,
  created_at     timestamptz default now()
);
create index idx_events_sub on submission_events(submission_id, created_at);

-- ---------- Resenziyalar ----------
create table reviews (
  id              uuid primary key default gen_random_uuid(),
  submission_id   uuid references submissions(id) on delete cascade,
  reviewer_id     uuid references reviewers(id)   on delete set null,
  round           int  default 1,
  recommendation  recommendation,
  comments        text,                        -- redaktor üçün
  comments_author text,                        -- müəllif üçün
  submitted_at    timestamptz
);

-- ---------- FAQ ----------
create table faqs (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  question    text not null,
  answer      text not null,
  sort_order  int default 0
);

-- =====================================================================
--  SEED — prototip məlumatları (nümunə)
-- =====================================================================

create table if not exists article_pdfs (
  article_id uuid primary key references articles(id) on delete cascade,
  data       text not null,
  created_at timestamptz not null default now()
);

-- DATA (seed)
-- CJMSE seed data (generated). Run AFTER schema.sql.
-- ============ subjects ============
insert into subjects (slug,name_az,name_en,name_ru,sort_order) values
 ('shipbuilding','Gəmiqayırma və gəmi təmiri texnologiyası','Shipbuilding and Ship Repair Technology','Технология судостроения и судоремонта',1),
 ('operation','Gəmiçilik və su nəqliyyatının istismarı','Shipping and Water Transport Operation','Судоходство и эксплуатация водного транспорта',2),
 ('equipment','Gəmiçilik texnikası','Shipping Equipment','Судовая техника',3),
 ('natural-science','Gəmiçilikdə təbiət elmləri problemləri','Natural Science Problems in Shipping','Проблемы естественных наук в судоходстве',4)
on conflict (slug) do nothing;

-- ============ issues ============
insert into issues (volume,number,year,title,is_current,published_at) values
 (27,2,2026,'Cild 27, № 2 (2026)',true,'2026-05-01'),
 (27,1,2026,'Cild 27, № 1 (2026)',false,'2026-01-01'),
 (26,4,2025,'Cild 26, № 4 (2025)',false,'2025-04-01'),
 (26,3,2025,'Cild 26, № 3 (2025)',false,'2025-03-01')
on conflict (volume,number,year) do nothing;

-- ============ authors ============
insert into authors (full_name) values
 ('R. Quliyev'),
 ('A. Məmmədova'),
 ('T. Hüseynov'),
 ('N. Əliyev'),
 ('S. Rəhimli'),
 ('M. Əliyev'),
 ('N. Həsənova'),
 ('L. Quliyeva'),
 ('F. Babayev'),
 ('E. Qədirov'),
 ('K. Səfərova'),
 ('V. İsmayılov'),
 ('G. Tağıyeva'),
 ('S. Hüseynova'),
 ('R. Əhmədov'),
 ('C. Nağıyev'),
 ('P. Allahverdiyeva'),
 ('A. Kərimov'),
 ('N. Vəliyeva'),
 ('İ. Bağırov'),
 ('M. Əhmədova'),
 ('T. Süleymanov'),
 ('R. Qasımova'),
 ('F. Məmmədov'),
 ('S. Əliyeva'),
 ('K. Hacıyev'),
 ('R. Orucov'),
 ('L. Babayeva')
on conflict do nothing;

-- ============ articles ============
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2026-027','Avtonom gəmilərdə süni intellekt əsaslı toqquşmadan yayınma alqoritmi','Avtonom gəmilərdə süni intellekt əsaslı toqquşmadan yayınma alqoritmi mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','research',
  (select id from subjects where slug='digital'),
  (select id from issues where volume=27 and number=2 and year=2026),
  '15–32','10.xxxxx/dn.2026.027','az','/pdf/dn-2026-027.pdf','/data/dn-2026-027',2150,12,'2026-05-18')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2026-028','Rəqəmsal əkiz (digital twin) texnologiyasının gəmi istismarında tətbiqi','Rəqəmsal əkiz (digital twin) texnologiyasının gəmi istismarında tətbiqi mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','research',
  (select id from subjects where slug='digital'),
  (select id from issues where volume=27 and number=2 and year=2026),
  '33–49','10.xxxxx/dn.2026.028','az','/pdf/dn-2026-028.pdf','/data/dn-2026-028',1890,10,'2026-05-15')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2026-026','Xəzər dəniz dəhlizində konteyner daşımalarının marşrut optimizasiyası','Xəzər dəniz dəhlizində konteyner daşımalarının marşrut optimizasiyası mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','research',
  (select id from subjects where slug='transport'),
  (select id from issues where volume=27 and number=2 and year=2026),
  '5–14','10.xxxxx/dn.2026.026','az','/pdf/dn-2026-026.pdf','/data/dn-2026-026',1240,7,'2026-05-12')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2026-029','Qısa dəniz daşımalarının dayanıqlı inkişaf modeli','Qısa dəniz daşımalarının dayanıqlı inkişaf modeli mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','research',
  (select id from subjects where slug='transport'),
  (select id from issues where volume=27 and number=2 and year=2026),
  '50–66','10.xxxxx/dn.2026.029','az','/pdf/dn-2026-029.pdf',null,1180,6,'2026-05-10')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2026-030','Gəmi dizel mühərriklərində yanacaq sərfiyyatının hibrid sistemlə azaldılması','Gəmi dizel mühərriklərində yanacaq sərfiyyatının hibrid sistemlə azaldılması mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','research',
  (select id from subjects where slug='power'),
  (select id from issues where volume=27 and number=2 and year=2026),
  '67–80','10.xxxxx/dn.2026.030','az','/pdf/dn-2026-030.pdf','/data/dn-2026-030',980,5,'2026-05-08')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2026-031','Liman akvatoriyalarında neft çirklənməsinin sensor şəbəkəsi ilə monitorinqi','Liman akvatoriyalarında neft çirklənməsinin sensor şəbəkəsi ilə monitorinqi mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','technical',
  (select id from subjects where slug='ecology'),
  (select id from issues where volume=27 and number=2 and year=2026),
  '81–92','10.xxxxx/dn.2026.031','az','/pdf/dn-2026-031.pdf',null,760,3,'2026-05-05')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2025-018','Ballast sularının idarə olunması və invaziv növlərin nəzarəti','Ballast sularının idarə olunması və invaziv növlərin nəzarəti mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','review',
  (select id from subjects where slug='ecology'),
  (select id from issues where volume=26 and number=3 and year=2025),
  '112–134','10.xxxxx/dn.2025.018','az','/pdf/dn-2025-018.pdf','/data/dn-2025-018',1010,21,'2025-08-20')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2026-015','Gəmi elektrik şəbəkələrində harmonik təhriflərin azaldılması','Gəmi elektrik şəbəkələrində harmonik təhriflərin azaldılması mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','review',
  (select id from subjects where slug='electro'),
  (select id from issues where volume=27 and number=1 and year=2026),
  '88–110','10.xxxxx/dn.2026.015','az','/pdf/dn-2026-015.pdf',null,1450,18,'2026-02-22')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2025-024','Dəniz IoT sistemlərində verilənlərin təhlükəsizliyi','Dəniz IoT sistemlərində verilənlərin təhlükəsizliyi mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','review',
  (select id from subjects where slug='digital'),
  (select id from issues where volume=26 and number=4 and year=2025),
  '40–62','10.xxxxx/dn.2025.024','az','/pdf/dn-2025-024.pdf','/data/dn-2025-024',1320,15,'2025-11-15')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2026-011','Dalğaqıran konstruksiyalarının yük altında davamlılığının modelləşdirilməsi','Dalğaqıran konstruksiyalarının yük altında davamlılığının modelləşdirilməsi mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','research',
  (select id from subjects where slug='hydro'),
  (select id from issues where volume=27 and number=1 and year=2026),
  '5–22','10.xxxxx/dn.2026.011','az','/pdf/dn-2026-011.pdf','/data/dn-2026-011',1130,9,'2026-02-18')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2025-022','Kompozit materialların gəmi korpusunda tətbiqi: möhkəmlik təhlili','Kompozit materialların gəmi korpusunda tətbiqi: möhkəmlik təhlili mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','research',
  (select id from subjects where slug='shipbuild'),
  (select id from issues where volume=26 and number=4 and year=2025),
  '15–34','10.xxxxx/dn.2025.022','az','/pdf/dn-2025-022.pdf',null,820,11,'2025-11-10')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2026-013','Liman terminallarında konteyner yerləşdirməsinin riyazi modeli','Liman terminallarında konteyner yerləşdirməsinin riyazi modeli mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','research',
  (select id from subjects where slug='logistics'),
  (select id from issues where volume=27 and number=1 and year=2026),
  '46–60','10.xxxxx/dn.2026.013','az','/pdf/dn-2026-013.pdf','/data/dn-2026-013',690,4,'2026-02-12')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2025-026','GNSS siqnallarının dəqiqliyinin Xəzər regionunda qiymətləndirilməsi','GNSS siqnallarının dəqiqliyinin Xəzər regionunda qiymətləndirilməsi mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','short',
  (select id from subjects where slug='transport'),
  (select id from issues where volume=26 and number=4 and year=2025),
  '90–98','10.xxxxx/dn.2025.026','az','/pdf/dn-2025-026.pdf',null,540,2,'2025-11-05')
on conflict (slug) do nothing;
insert into articles (slug,title,abstract,type,subject_id,issue_id,pages,doi,language,pdf_url,data_url,views,citations,published_at) values
 ('dn-2025-016','Gəmi soyutma sistemlərinin energetik səmərəliliyinin artırılması','Gəmi soyutma sistemlərinin energetik səmərəliliyinin artırılması mövzusunda aparılmış tədqiqatın metodologiyası, nəticələri və dənizçilik praktikası üçün əhəmiyyəti təqdim olunur.','technical',
  (select id from subjects where slug='power'),
  (select id from issues where volume=26 and number=3 and year=2025),
  '70–84','10.xxxxx/dn.2025.016','az','/pdf/dn-2025-016.pdf',null,470,3,'2025-08-12')
on conflict (slug) do nothing;

-- ============ article_authors ============
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-027'),(select id from authors where full_name='R. Quliyev'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-027'),(select id from authors where full_name='A. Məmmədova'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-027'),(select id from authors where full_name='T. Hüseynov'),3,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-028'),(select id from authors where full_name='N. Əliyev'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-028'),(select id from authors where full_name='S. Rəhimli'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-026'),(select id from authors where full_name='M. Əliyev'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-026'),(select id from authors where full_name='N. Həsənova'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-029'),(select id from authors where full_name='L. Quliyeva'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-029'),(select id from authors where full_name='F. Babayev'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-030'),(select id from authors where full_name='E. Qədirov'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-030'),(select id from authors where full_name='K. Səfərova'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-031'),(select id from authors where full_name='V. İsmayılov'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-031'),(select id from authors where full_name='G. Tağıyeva'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2025-018'),(select id from authors where full_name='S. Hüseynova'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2025-018'),(select id from authors where full_name='R. Əhmədov'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-015'),(select id from authors where full_name='C. Nağıyev'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-015'),(select id from authors where full_name='P. Allahverdiyeva'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2025-024'),(select id from authors where full_name='A. Kərimov'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2025-024'),(select id from authors where full_name='N. Vəliyeva'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-011'),(select id from authors where full_name='İ. Bağırov'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-011'),(select id from authors where full_name='M. Əhmədova'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2025-022'),(select id from authors where full_name='T. Süleymanov'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2025-022'),(select id from authors where full_name='R. Qasımova'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-013'),(select id from authors where full_name='F. Məmmədov'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2026-013'),(select id from authors where full_name='S. Əliyeva'),2,false) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2025-026'),(select id from authors where full_name='K. Hacıyev'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2025-016'),(select id from authors where full_name='R. Orucov'),1,true) on conflict do nothing;
insert into article_authors (article_id,author_id,author_position,is_corresponding) values ((select id from articles where slug='dn-2025-016'),(select id from authors where full_name='L. Babayeva'),2,false) on conflict do nothing;

-- ============ faqs ============
insert into faqs (category,question,answer,sort_order) values
 ('Təqdimat','Məqaləni necə göndərə bilərəm?','Müəllif təlimatına uyğun əlyazma və metadata hazırlayıb portal vasitəsilə yükləyirsiniz. Sistem dərhal unikal əlyazma ID-si verir və proses başlayır.',1),
 ('Təqdimat','Hansı məqalə növləri qəbul olunur?','Orijinal tədqiqat məqalələri, icmal məqalələri, texniki məqalələr və qısa məlumatlar (short communication) qəbul edilir.',2),
 ('Təqdimat','Eyni vaxtda başqa jurnala göndərə bilərəmmi?','Xeyr. Eyni əlyazmanın eyni vaxtda bir neçə jurnala təqdim edilməsi (ikiqat təqdimat) nəşr etikasına ziddir və qadağandır.',3),
 ('Təqdimat','Hansı dillərdə yazmaq olar?','Məqalələr Azərbaycan, ingilis və ya rus dilində qəbul edilir. Bütün məqalələr üçün ingilis dilində abstrakt və açar sözlər tələb olunur.',4),
 ('Resenziya','Resenziya nə qədər çəkir?','İlk qərara qədər orta müddət təxminən 10 həftədir (hədəf ≤ 12 həftə). Müddət sahədən və rəyçilərin cavab sürətindən asılı dəyişə bilər.',5),
 ('Resenziya','Neçə rəyçi məqaləni qiymətləndirir?','Hər əlyazma ən azı iki müstəqil ekspert tərəfindən ikili kor (double-blind) prinsipi ilə qiymətləndirilir — müəllif və rəyçi qarşılıqlı anonimdir.',6),
 ('Resenziya','Məqalənin statusunu necə izləyə bilərəm?','Yuxarıdakı «Status izlə» bölməsində əlyazma ID-nizi daxil edərək hər mərhələni (təqdimat, yoxlanış, resenziya, düzəliş, qəbul, nəşr) real vaxtda görə bilərsiniz.',7),
 ('Açıq giriş və ödənişlər','Dərc üçün ödəniş varmı?','Xeyr. Jurnal Diamond Open Access modelində işləyir — nə müəllif, nə də oxucu heç bir ödəniş etmir (0 ₼).',8),
 ('Açıq giriş və ödənişlər','Müəlliflik hüququ kimdə qalır?','Müəlliflik hüququ müəllifdə qalır. Məqalələr CC BY 4.0 lisenziyası ilə dərc olunur — istinad şərti ilə sərbəst paylaşıla və istifadə edilə bilər.',9),
 ('Açıq giriş və ödənişlər','Məqaləni harada paylaşa bilərəm?','CC BY 4.0 lisenziyası məqaləni istənilən platformada (repozitoriya, şəxsi sayt, sosial şəbəkə) müvafiq istinadla paylaşmağa imkan verir.',10),
 ('Nəşrdən sonra','DOI nə vaxt verilir?','Hər məqaləyə nəşr zamanı CrossRef vasitəsilə daimi rəqəmsal identifikator (DOI) təyin edilir.',11),
 ('Nəşrdən sonra','Məqalə hansı bazalarda görünür?','Məqalələr DOAJ, CrossRef və axtarış motorlarında indeksləşir; metadata maşın oxunaqlı formatdadır. Scopus və Web of Science üzrə müraciət hazırlığı davam edir.',12),
 ('Nəşrdən sonra','Səhv aşkar olunarsa nə olur?','Kiçik səhvlər corrigendum/erratum ilə düzəldilir; ciddi pozuntular geri çəkilmə (retraction) və ya narahatlıq ifadəsi ilə nəticələnə bilər.',13),
 ('Etika','Plagiat necə yoxlanılır?','Bütün təqdimatlar avtomatik oxşarlıq yoxlanışından və AI skrininqdən keçir. Nəticələr redaktora məsləhət xarakteri daşıyır; yekun qərarı redaksiya verir.',14),
 ('Etika','Generativ süni intellektdən istifadə etmək olar?','AI istifadəsi (məs. dil redaktəsi) məqalədə açıqlanmalıdır. Süni intellekt müəllif kimi göstərilə bilməz — elmi məsuliyyət tamamilə müəlliflərin üzərindədir.',15),
 ('Texniki','Faylı hansı formatda yükləməliyəm?','Mətn Word (.docx) və ya LaTeX formatında, şəkillər və cədvəllər isə ayrıca yüksək keyfiyyətli fayllar kimi yüklənməlidir.',16),
 ('Texniki','Məqaləni hansı formatlarda oxuya bilərəm?','Hər məqalə interaktiv HTML, PDF və mümkün olduqda əlavə research data formatında təqdim olunur.',17);
