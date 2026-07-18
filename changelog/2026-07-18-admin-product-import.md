# 2026-07-18 — Admin Product Import (vendor xlsx)

## Added
- `/admin/products/import`: 4-step wizard for importing vendor quote files (.xlsx) — upload → column mapping (auto-suggested per sheet, 現貨/預購 designation) → preview (inline edit of brand/title/size/price, validation + 已存在 duplicate badges, row selection) → result summary
- Client-side ExcelJS parsing with embedded-image extraction; images upload directly from the browser to Vercel Blob via an ADMIN-gated token route (`/api/admin/blob-upload`)
- 品名 heuristic that splits combined vendor names (`日本 ALBION 健康化妝水N 330ml`) into brand / title / size
- Server actions `findExistingSkus` / `importProducts` (ADMIN-gated, zod re-validated, batched ×50, `$transaction` nested priceItems, sku-based duplicate skip → idempotent monthly re-imports)
- Product schema (additive): `sku` (unique), `barcode`, `isPreorder`, `arrivalNote`
- 預購 badge with arrival note on product cards; `productImageSrc` helper so product images can be Vercel Blob URLs or local `/img/<brand>/` filenames; placeholder image for products without photos
- Admin entry points: 商品管理 section in the account admin tab, 商品匯入 item in the user nav (ADMIN only)
- E2E specs (`e2e/admin-import/`) with a 2-sheet fixture xlsx

## Changed
- `next.config.ts`: allow `*.public.blob.vercel-storage.com` images
