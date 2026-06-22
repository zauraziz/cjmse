-- ============================================================
-- CJMSE — Migrasiya v2: 2 dilli sahələr (mövcud baza üçün)
-- Neon SQL Editor-də bir dəfə işə salın. Təkrar işə salmaq təhlükəsizdir.
-- ============================================================
alter table articles add column if not exists title_en    text;
alter table articles add column if not exists abstract_en  text;
alter table articles add column if not exists keywords     text;
alter table articles add column if not exists keywords_en  text;
