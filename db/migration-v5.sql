-- ============================================================
-- CJMSE — Migrasiya v5: УДК (UDC) kodu
-- Neon SQL Editor-də bir dəfə işə salın. Təkrar təhlükəsizdir.
-- ============================================================
alter table articles add column if not exists udc text;
