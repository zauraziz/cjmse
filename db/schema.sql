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
