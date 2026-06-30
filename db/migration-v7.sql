-- ============================================================
-- CJMSE — Migrasiya v7
--  • Müəllifə "tədqiqat qrupu / şöbə" sahəsi (#1)
--  • Redaksiya axını: resenzentlər + təyinatlar (OJS məntiqi, #2)
--  • Göndərmələrə DOI, raund və nəşr olunmuş məqalə bağlantısı
-- Neon SQL Editor-də bir dəfə işə salın. Təkrar təhlükəsizdir.
-- ============================================================

-- 1) Müəllif tədqiqat qrupu / şöbə
alter table authors add column if not exists research_group text;

-- 2) Resenzentlər hovuzu (köhnə cədvəl varsa email sütununu əlavə et)
create table if not exists reviewers (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text,
  orcid       text,
  affiliation text,
  expertise   text,
  created_at  timestamptz default now()
);
alter table reviewers add column if not exists email      text;
alter table reviewers add column if not exists created_at timestamptz default now();

-- 3) Resenziya təyinatları (şifrəsiz resenzent girişi token ilə)
create table if not exists review_assignments (
  id                 uuid primary key default gen_random_uuid(),
  submission_id      uuid references submissions(id) on delete cascade,
  reviewer_id        uuid references reviewers(id)   on delete set null,
  reviewer_name      text,
  reviewer_email     text,
  token              text unique not null,
  round              int  default 1,
  status             text not null default 'invited',   -- invited | submitted | declined
  recommendation     text,                              -- accept | minor | major | reject
  comments_to_editor text,
  comments_to_author text,
  due_date           date,
  created_at         timestamptz default now(),
  submitted_at       timestamptz
);
create index if not exists idx_ra_sub      on review_assignments(submission_id);
create index if not exists idx_ra_reviewer on review_assignments(reviewer_id);

-- 4) Göndərmələrə redaksiya sahələri
alter table submissions add column if not exists doi        text;
alter table submissions add column if not exists round      int default 1;
alter table submissions add column if not exists article_id uuid references articles(id) on delete set null;
