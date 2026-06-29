-- ============================================================
-- CJMSE — Migrasiya v4
--  • Rus dili sahələri (title_ru, abstract_ru, keywords_ru)
--  • Yalnız 4 rəsmi fənn sahəsi
--  • Müəllif təkrarlanmasının aradan qaldırılması + unikallıq
-- Neon SQL Editor-də bir dəfə işə salın. Təkrar təhlükəsizdir.
-- ============================================================

-- Rus dili məzmun sütunları
alter table articles add column if not exists title_ru    text;
alter table articles add column if not exists abstract_ru text;
alter table articles add column if not exists keywords_ru text;

-- Fənn sahələrinin rusca adı
alter table subjects add column if not exists name_ru text;

-- Yalnız 4 rəsmi fənn sahəsi qalır
delete from subjects where slug not in ('shipbuilding','operation','equipment','natural-science');
insert into subjects (slug, name_az, name_en, name_ru, sort_order) values
 ('shipbuilding',  'Gəmiqayırma və gəmi təmiri texnologiyası', 'Shipbuilding and Ship Repair Technology',   'Технология судостроения и судоремонта',         1),
 ('operation',     'Gəmiçilik və su nəqliyyatının istismarı',  'Shipping and Water Transport Operation',    'Судоходство и эксплуатация водного транспорта', 2),
 ('equipment',     'Gəmiçilik texnikası',                      'Shipping Equipment',                        'Судовая техника',                              3),
 ('natural-science','Gəmiçilikdə təbiət elmləri problemləri',  'Natural Science Problems in Shipping',      'Проблемы естественных наук в судоходстве',     4)
on conflict (slug) do update
  set name_az = excluded.name_az, name_en = excluded.name_en,
      name_ru = excluded.name_ru, sort_order = excluded.sort_order;

-- Müəllif təkrarlanmasını təmizlə (normallaşdırılmış ada görə ən kiçik id saxlanır)
update article_authors aa
   set author_id = c.keep_id
  from (select id, min(id) over (partition by lower(trim(full_name))) as keep_id from authors) c
 where aa.author_id = c.id and c.id <> c.keep_id
   and not exists (select 1 from article_authors x
                    where x.article_id = aa.article_id and x.author_id = c.keep_id);
delete from article_authors aa
 using (select id, min(id) over (partition by lower(trim(full_name))) as keep_id from authors) c
 where aa.author_id = c.id and c.id <> c.keep_id;
delete from authors a
 using (select id, min(id) over (partition by lower(trim(full_name))) as keep_id from authors) c
 where a.id = c.id and c.id <> c.keep_id;
create unique index if not exists uniq_authors_fullname on authors (lower(trim(full_name)));
