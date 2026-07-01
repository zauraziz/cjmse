-- migration-v9: subscriber system + submission author ORCID/affiliation
-- idempotent; run in Neon SQL Editor after v8

alter table submissions add column if not exists author_orcid text;
alter table submissions add column if not exists author_affiliation text;

create table if not exists subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  token       text unique not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists idx_subscribers_active on subscribers(active) where active;
