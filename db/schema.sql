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
  research_group text,
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
  type          text not null default 'research',
  subject_id    uuid references subjects(id) on delete set null,
  issue_id      uuid references issues(id)   on delete set null,
  pages         text,                       -- "15–32"
  doi           text unique,
  udc           text,
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
  email       text,
  orcid       text,
  affiliation text,
  expertise   text,
  created_at  timestamptz default now()
);

create table review_assignments (
  id                 uuid primary key default gen_random_uuid(),
  submission_id      uuid references submissions(id) on delete cascade,
  reviewer_id        uuid references reviewers(id)   on delete set null,
  reviewer_name      text,
  reviewer_email     text,
  token              text unique not null,
  round              int  default 1,
  status             text not null default 'invited',
  recommendation     text,
  comments_to_editor text,
  comments_to_author text,
  due_date           date,
  created_at         timestamptz default now(),
  submitted_at       timestamptz
);
create index idx_ra_sub on review_assignments(submission_id);

-- ---------- Təqdimatlar (submissions) + izləmə ----------
create table submissions (
  id                  uuid primary key default gen_random_uuid(),
  token               text unique not null,
  title               text not null,
  author_name         text not null,
  email               text not null,
  coauthors           text,
  type                text default 'research',
  language            text default 'az',
  subject_id          uuid references subjects(id) on delete set null,
  abstract            text,
  keywords            text,
  manuscript_url      text,
  manuscript_file_url text,
  figures_urls        text,
  doi                 text,
  round               int default 1,
  article_id          uuid references articles(id) on delete set null,
  status              text not null default 'submitted',
  note                text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
create index idx_submissions_status on submissions(status);

create table submission_files (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade,
  kind          text,
  filename      text,
  mime          text,
  data          text,
  created_at    timestamptz default now()
);
create index idx_subfiles_sub on submission_files(submission_id);

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
