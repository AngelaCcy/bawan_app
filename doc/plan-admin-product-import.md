# Plan: Admin Product Import from Vendor Excel (feature/admin-product-import)

## Context

Vendors send monthly quote files as **.xlsx** (sample: `doc/sample_csv/vandor_sample_march.xlsx`, 6.7MB). Admin needs to upload these, review/adjust the parsed products, and add them to the product list. Verified facts about the sample file:

- **Sheet1** (555 rows) = 現貨 in-stock: `品號 | 國際條碼 | 品名 | 圖片 | 市場價 | 1p | 20p | 數量` (數量 in col I)
- **Sheet2** (67 rows) = 預購 pre-order: same + `到貨日` (fuzzy text like "3月上旬"), 市價 instead of 市場價, 數量 in col H
- **圖片 column holds images embedded in the Excel file** (611 in xl/media) — not filenames or URLs
- 品名 combines country+brand+title+size in one cell (`日本 ALBION 健康化妝水N 330ml`); many brands per file
- No product-create server action exists today; no admin route; no xlsx parser installed

## User decisions (locked)

1. **Images**: extract embedded images → upload to **Vercel Blob**; product stores Blob URL. ProductCard + next.config updated to render URL images alongside local `/img/<brand>/` ones.
2. **Price**: default selling price = **1p** column, **editable per-row in preview** before import.
3. **Sheets**: preview shows **both sheets**, grouped — 現貨 section and 預購 section. In-stock marked 現貨; pre-orders marked with arrival month (e.g. 3月).
4. Columns vary per vendor → keep a lightweight **auto-detected column mapping** step the admin confirms/overrides.
5. New dedicated admin page; admin vs normal account distinguished (admins see admin features; users never do).

## Architecture

**Parse client-side with ExcelJS** (dynamic import on the admin page only). Rationale: Vercel API routes cap request bodies at 4.5MB — the 6.7MB sample can't be uploaded to a server route at all. In the browser: `workbook.xlsx.load(arrayBuffer)` for rows, `worksheet.getImages()` + `workbook.model.media` to pull each embedded image with its row anchor. Images upload **directly from browser to Blob** via `@vercel/blob/client` (`upload()` + a `handleUpload` token route, ADMIN-gated) — file bytes never pass through a serverless function. Product JSON goes to server actions in batches of 50.

**One vendor row = one Product** with a single nested PriceItem (rows carry unique 品號/barcode; shades like `#03` are separate SKUs). No fragile title-grouping. Size extracted from 品名 by regex (`330ml`, `200g`…), fallback `"標準"`, editable.

**Duplicate detection by `sku` (品號)**: existing sku → row badged 已存在, default-deselected, server skips on import (idempotent re-runs of monthly files).

### Wizard flow (`/admin/products/import`)

```
上傳 (.xlsx drag-drop, ExcelJS parse, per-sheet row counts)
  → 欄位對應 (auto-detect 品號/品名/圖片/1p/數量/到貨日 per sheet; confirm/override; sheet = 現貨 or 預購 toggle)
  → 預覽 (two sections: 現貨 / 預購; per row: image thumbnail, extracted brand/title/size (inline-editable),
          price default=1p (inline-editable), stock, arrival note; validation badges 有效/錯誤/已存在; checkboxes)
  → 匯入 (upload images to Blob with limited concurrency → importProducts in batches of 50, progress bar)
  → 結果 (created / skipped / failed counts + lists)
```

**Brand/title extraction heuristic** (pure function, unit-testable): strip leading country token (日本/韓國/法國/美國…); brand = leading Latin-word run (handles `SHU UEMURA`) or match against a small known Chinese brand list (黛珂, 植村秀…); remainder = title; trailing size token → size. Always editable in preview, so heuristic misses are recoverable.

## Schema changes (additive only — `prisma/schema.prisma`, protected file, this plan is the discussion)

```prisma
model Product {
  // ... existing fields unchanged
  sku         String?  @unique   // vendor 品號 — duplicate detection, idempotent re-import
  barcode     String?             // 國際條碼
  isPreorder  Boolean  @default(false)
  arrivalNote String?             // e.g. "3月上旬" — shown for pre-order products
}
```
Apply with `npx prisma db push`. `image String[]` already accepts full Blob URLs — no change needed there.

## Files

### New
| Path | Purpose |
|---|---|
| `app/admin/layout.tsx` | Server gate for all `/admin/*`: `auth()` → redirect `/signin` if no user, redirect `/` if not ADMIN |
| `app/admin/products/import/page.tsx` | Server Component: title 「商品批次匯入」, renders `<ImportWizard />` |
| `components/admin/import/ImportWizard.tsx` | Client; owns step state: `{ sheets, mapping, parsedRows, edits, selection, result }` |
| `components/admin/import/UploadStep.tsx` | File input (`accept=".xlsx"`, `data-testid="xlsx-file-input"`), ExcelJS parse |
| `components/admin/import/MappingStep.tsx` | Per-sheet field→column selects (auto-suggested), 現貨/預購 designation |
| `components/admin/import/PreviewStep.tsx` | Two-section table (現貨/預購), thumbnails, inline edit for brand/title/size/price, checkboxes, `data-testid="preview-row"`, confirm `data-testid="import-confirm"` |
| `components/admin/import/ResultStep.tsx` | Summary + 「再匯入一批」 reset |
| `components/ui/table.tsx` | `npx shadcn@latest add table` |
| `lib/xlsx-import.ts` | Pure logic: `parseWorkbook`, `suggestMapping(headers)`, `applyMapping`, `parseProductName(品名) → {brand,title,size}`, `cleanPrice` (strip NT$/commas), `validateRows` |
| `lib/validations/product-import.ts` | zod: `importProductSchema` — `{ sku?, barcode?, brand, title, description:"", category, image: string[], isPreorder, arrivalNote?, priceItems: [{size, price: int>0, stock: int≥0}] }`; server re-parses `z.array(...).max(50)` |
| `app/types/product-import.ts` | `ProductField`, `ColumnMapping`, `ParsedRow`, `ImportResult` types |
| `app/utils/admin-actions.ts` | `"use server"` — new file (`actions.ts` is at 447/500 lines): `findExistingSkus(skus: string[])`, `importProducts(products: ImportProductInput[]): ImportResult` — both gated `if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")`; nested `prisma.product.create({ data: {..., priceItems: { create } } })` inside `$transaction`; `totalStock` = sum of priceItem stock; `revalidatePath("/products")` + `/` |
| `app/api/admin/blob-upload/route.ts` | `handleUpload` from `@vercel/blob/client`: session ADMIN check in `onBeforeGenerateToken`, path `products/<sku>-<n>.<ext>`, `checkRateLimit` from `lib/rate-limit.ts` |
| `e2e/admin-import/import.spec.ts` + `e2e/fixtures/files/sample-products.xlsx` | Small fixture: 2 sheets, 3 products incl. 1 invalid row |
| `doc/plan-admin-product-import.md` | This plan, per repo convention |
| `changelog/2026-07-XX-admin-product-import.md` | After merge |

### Modified
- `prisma/schema.prisma` — additive fields above
- `components/products/ProductCard.tsx` — image src helper: starts with `http` → use as-is, else `/img/${brand}/${filename}`; show 預購 badge + arrivalNote when `isPreorder` (accent #B08866)
- `next.config.ts` — add Blob hostname (`*.public.blob.vercel-storage.com`) to `remotePatterns`
- `components/account/AdminPanel.tsx` — 「商品管理」 section with Link to `/admin/products/import`, `data-testid="admin-import-link"`
- `components/user-nav.tsx` — 商品匯入 menu item when `role === "ADMIN"`
- `package.json` — `npm i exceljs @vercel/blob` (blob already present), `npm i -D` nothing extra needed

## Implementation order (→ GitHub issues, one per step)

1. **feat(schema)**: additive Product fields + `db push` *(do first; everything depends on it)*
2. **feat(admin)**: `/admin` layout gate + import page shell + entry points (AdminPanel link, user-nav item)
3. **feat(import)**: `lib/xlsx-import.ts` parsing core + name-extraction heuristic + zod schemas + types (add exceljs)
4. **feat(import)**: Upload + Mapping steps in wizard
5. **feat(import)**: Preview step — shadcn table, 現貨/預購 sections, inline editing, duplicate badges via `findExistingSkus`
6. **feat(import)**: Blob upload route + image extraction/upload, `importProducts` action, batching + Result step
7. **feat(products)**: ProductCard URL-image support + 預購 badge, next.config remotePatterns
8. **test(e2e)**: specs + fixture
9. **docs**: plan doc copy to `doc/`, changelog after merge

Branch `feature/admin-product-import` off `main` (current checkout is `feature/landing-page` — switch first). Conventional commits, PR → squash merge per CLAUDE.md.

## Verification

1. `npm run build` passes (ExcelJS must be dynamically imported so it stays out of shopper bundles)
2. Manual e2e with the real file: sign in as admin (`angela910914@gmail.com` seeded as ADMIN) → `/account` → 管理員 tab → 批次匯入商品 → upload `vandor_sample_march.xlsx` → both sheets detected (555 + 67 rows) → mapping auto-detected → preview shows 現貨/預購 sections with thumbnails → edit one price → import a small selection (e.g. 5 products) → verify on `/products`: new products render with Blob images, 預購 badge on sheet2 items
3. Re-upload same file → previously imported rows show 已存在 and are skipped (idempotency)
4. Non-admin user: `/admin/products/import` redirects to `/`; no 管理員 tab, no nav item
5. `npm run test:e2e` — new specs: (a) route gating, (b) entry-point visibility, (c) upload→mapping→preview flow with fixture, (d) invalid row disabled + selection count updates; specs `test.skip()` when unauthenticated per repo convention

## Deferred (create issues, don't build now)

- Update-existing-product mode (sync stock/price from monthly file) — v1 skips duplicates only
- Storing vendor cost prices (1p/20p) for margin reporting
- Shared mapping presets in DB (v1: localStorage per header-signature)
