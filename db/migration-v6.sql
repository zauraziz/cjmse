-- ============================================================
-- CJMSE — Migrasiya v6 (DÜZƏLİŞ EDİLMİŞ)
--  • article_type enum -> text (yeni növlər: keys-stadi və s.)
--  • Köhnə avtomatik nömrə başlıqlarını təmizlə (#9)
--  • Köhnə (istifadəsiz) submissions/submission_events cədvəllərini
--    yeni göndərmə + izləmə strukturu ilə əvəz et
--  • Əlyazma (Word/LaTeX) və şəkil fayllarının saxlanması üçün cədvəl
-- Neon SQL Editor-də bir dəfə işə salın. Təkrar təhlükəsizdir.
-- ============================================================

-- 1) article_type enum -> text
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_name='articles' and column_name='type' and udt_name='article_type') then
    alter table articles alter column type drop default;
    alter table articles alter column type type text using type::text;
    alter table articles alter column type set default 'research';
  end if;
end $$;

-- 2) Köhnə avtomatik başlıqları NULL et (cild/nömrə/ildən hesablanır)
update issues set title = null
 where title is not null and title ~ '^Cild [0-9]+, № [0-9]+ \([0-9]+\)$';

-- 3) Köhnə editorial submissions strukturunu sil və yenisini yarat.
--    (Köhnə "submissions"-də code NOT NULL idi və yeni sistemlə uyğun deyil;
--     real təqdimat datası yox idi — təhlükəsizdir.)
drop table if exists submission_events cascade;
drop table if exists submissions cascade;

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
  status              text not null default 'submitted',
  note                text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
create index idx_submissions_status on submissions(status);
create index idx_submissions_email  on submissions(lower(email));

-- 4) Yüklənmiş fayllar (Blob aktiv deyilsə, bazada saxlama üçün)
create table if not exists submission_files (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade,
  kind          text,                 -- 'manuscript' | 'figure'
  filename      text,
  mime          text,
  data          text,                 -- base64
  created_at    timestamptz default now()
);
create index if not exists idx_subfiles_sub on submission_files(submission_id);
