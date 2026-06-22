# CJMSE — İctimai Portal (Next.js + Neon)

«Elmi Əsərləri» / Caspian Journal of Maritime Science & Engineering (ADDA) jurnalının
**ictimai üzü**. Hibrid arxitekturanın ön tərəfidir:

- **Bu tətbiq (Next.js + Neon)** — oxunan ictimai portal: ana səhifə, məqalələr, axtarış/filtr,
  məqalə səhifələri (Google Scholar + Dublin Core metadata), nömrələr, etika/müəllif səhifələri.
- **OJS (ayrıca host)** — redaksiya mühərriki: göndərmə, resenziya, rollar, DOI/CrossRef, DOAJ eksportu.
  *(Bu repo OJS-i ehtiva etmir.)*
- **Körpü (sonra)** — OJS-də dərc olunan məqalələrin metadata-sı Neon-a sinxronlaşır; portal yansıdır.
  «Məqalə göndər» düyməsi `NEXT_PUBLIC_OJS_URL`-ə yönləndirir.

## Texnologiya
- Next.js 14 (App Router) · React 18
- Neon (Serverless PostgreSQL) — `@neondatabase/serverless`
- Bütün məlumat səhifələri `force-dynamic` (sorğu vaxtı render; build üçün canlı DB lazım deyil)

---

## 1) Lokal işə salma
```bash
npm install
cp .env.example .env          # DATABASE_URL-i öz Neon sətrinizlə doldurun
npm run dev                   # http://localhost:3000
```

## 2) Verilənlər bazası (Neon)
Neon SQL Editor-də ardıcıllıqla işə salın:
```
db/schema.sql      -- struktur (cədvəllər, enumlar, indekslər)
db/seed.sql        -- nümunə məlumat (8 sahə, 4 nömrə, 14 məqalə, müəlliflər, FAQ)
```
> Seed `on conflict do nothing` istifadə edir — təkrar işə salmaq təhlükəsizdir.

## 3) Vercel-ə yerləşdirmə
1. Bu layihəni GitHub repoya yükləyin (`github.com/zauraziz/cjmse` və ya yeni repo).
2. Vercel layihəni **Next.js** kimi avtomatik tanıyır (`package.json`-a görə).
   - Mövcud `cjmse` layihəsi statik idi — ilk Next.js deploy-dan sonra framework Next.js-ə keçəcək.
   - **Root Directory** = `package.json`-un olduğu qovluq.
3. **Environment Variables** (Settings → Environment Variables):

| Dəyişən | Nümunə | Təyinat |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | Neon bağlantısı (məcburi) |
| `NEXT_PUBLIC_OJS_URL` | `https://ojs.cjmse.adda.edu.az` | «Məqalə göndər» / OJS keçidləri |
| `NEXT_PUBLIC_SITE_URL` | `https://cjmse.adda.edu.az` | Kanonik URL, sitemap, metadata |

4. Deploy → Vercel `next build` icra edir.

---

## Struktur
```
app/
  layout.js            -- şriftlər, başlıq/altlıq, qlobal metadata
  page.js              -- ana səhifə (hero, sahələr, son məqalələr, FAQ)
  articles/            -- siyahı + axtarış/filtr/sıralama
  article/[slug]/      -- məqalə səhifəsi + Scholar/Dublin Core meta
  issues/              -- nömrələr arxivi
  about / for-authors / ethics
  sitemap.js / robots.js / not-found.js
components/             -- Header, Footer, Cover, ArticleCard, SubjectTile, TopPanel, FaqAccordion, ArticlesToolbar
lib/                   -- db.js (Neon), queries.js (SQL), format.js, icons.js
db/                    -- schema.sql, seed.sql
```

## İndeksləşmə xüsusiyyətləri
- Hər məqalə səhifəsində `citation_*` (Google Scholar) və `DC.*` (Dublin Core) meta-teqləri.
- `/sitemap.xml` (məqalələr daxil) və `/robots.txt`.
- Kanonik URL-lər, `lang="az"`, semantik başlıqlar.

## Real dəyərlərlə əvəz olunmalı
ISSN (`XXXX-XXXX`), CrossRef DOI prefiksi (`10.xxxxx`), redaksiya heyətinin adları/ORCID-ləri,
məqalə PDF-ləri (`/pdf/<slug>.pdf` — OJS-dən gələcək), real xülasələr.

## Qeyd (təhlükəsizlik)
Next 14.2.35-ə bağlıdır. Vaxtaşırı `npm i next@14.2` ilə ən son yamağa yeniləyin.

## Admin paneli (/admin)
Nömrələri, müəllifləri və məqalələri əlavə/redaktə/silmək üçün parolla qorunan panel.

- Giriş: `https://cjmse.adda.edu.az/admin` → `/admin/login`.
- **Tələb olunan env dəyişənləri** (Vercel → Settings → Environment Variables):
  - `ADMIN_PASSWORD` — giriş parolu (boş olsa giriş mümkün deyil).
  - `ADMIN_SESSION_SECRET` — sessiya imzası üçün uzun təsadüfi sətir.
- Bütün yazma əməliyyatları server action-larla aparılır, sessiya httpOnly cookie ilə qorunur.
- Dəyişikliklər `revalidatePath` ilə public səhifələrdə dərhal əks olunur.
- Admin DB (Neon) ilə işləyir — `DATABASE_URL` təyin olunmalı və baza qurulmalıdır (`db/setup.sql`).
