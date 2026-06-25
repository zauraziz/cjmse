-- ============================================================
-- CJMSE — Migrasiya v3: PDF faylların bazada saxlanması
-- Neon SQL Editor-də bir dəfə işə salın. Təkrar təhlükəsizdir.
-- ============================================================
create table if not exists article_pdfs (
  article_id uuid primary key references articles(id) on delete cascade,
  data       text not null,           -- base64 PDF
  created_at timestamptz not null default now()
);
