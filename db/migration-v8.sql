-- ============================================================
-- CJMSE — Migrasiya v8
--  • Göndərmələrə "redaksiya üçün işarə" (müəllif yeniləyəndə bildiriş)
-- Neon SQL Editor-də bir dəfə işə salın. Təkrar təhlükəsizdir.
-- ============================================================
alter table submissions add column if not exists flag_for_editor boolean default false;
