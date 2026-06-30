-- ============================================================
-- CJMSE — Migrasiya v6
--  • Məqalə növü sütununu mətnə çevir (yeni növlər: keys-stadi və s.)
--  • Köhnə avtomatik nömrə başlıqlarını təmizlə (redaktə xətası #9)
--  • Göndərmə (submission) və izləmə sistemi üçün cədvəl
-- Neon SQL Editor-də bir dəfə işə salın. Təkrar təhlükəsizdir.
-- ============================================================

-- 1) article_type enum -> text (yeni növlər üçün rahatlıq)
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_name='articles' and column_name='type' and udt_name='article_type') then
    alter table articles alter column type drop default;
    alter table articles alter column type type text using type::text;
    alter table articles alter column type set default 'research';
  end if;
end $$;

-- 2) Köhnə avtomatik başlıqları NULL et — artıq cild/nömrə/ildən hesablanır
update issues set title = null
 where title is not null and title ~ '^Cild [0-9]+, № [0-9]+ \([0-9]+\)$';

-- 3) Göndərmə cədvəli (passwordless izləmə üçün token ilə)
create table if not exists submissions (
  id             uuid primary key default gen_random_uuid(),
  token          text unique not null,
  title          text not null,
  author_name    text not null,
  email          text not null,
  coauthors      text,
  type           text default 'research',
  language       text default 'az',
  subject_id     uuid references subjects(id) on delete set null,
  abstract       text,
  keywords       text,
  manuscript_url text,
  status         text not null default 'submitted',
  note           text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
create index if not exists idx_submissions_status on submissions(status);
create index if not exists idx_submissions_email  on submissions(lower(email));
