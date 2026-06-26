# 2026-06-26 — Landing Page

**Branch**: `feature/landing-page` | **Status**: open PR

## Added

### Components
- `components/landing/HeroSection.tsx` — full-viewport hero, `doson2.png` background, Diptyque product overlay, CTA → `/products`
- `components/landing/TopTenCarousel.tsx` — Swiper carousel, newest 10 products from DB, brand + price per slide
- `components/landing/FlashSale.tsx` — live `HH:MM:SS` countdown client component, falls back to +24h if no active sale
- `components/landing/AuthenticBadge.tsx` — 專櫃正品代購 split layout with lifestyle image
- `components/landing/NewArrival.tsx` — dark moody section, newest product from DB, dark overlay background
- `components/landing/BrandSpotlight.tsx` — ESSENSORIE brand feature block, DB-driven product image
- `components/landing/MemberCTA.tsx` — 加入會員 / Instagram / LINE 三顆按鈕 (script text deferred to issue #44)
- `components/landing/CategoryShowcase.tsx` — BEAUTY / BODY / HAIR arch-shaped tiles → `/products?category=X`
- `components/landing/TrustSignals.tsx` — 4 icon row: 專櫃正品 / 免運 / 品質保證 / 低價

### Server Actions (`app/utils/actions.ts`)
- `getTopProducts` — newest 10 products with priceItems + salePrices
- `getSaleEndTime` — finds nearest `SalePrice.endsAt` for countdown
- `getNewestProduct` — single latest product for NewArrival section
- `getEssensorieProducts` — brand-filtered list for BrandSpotlight

### Tests
- `e2e/landing/landing.spec.ts` — 3 e2e tests (hero CTA, TOP 10 products, category tiles) — all passed

### Docs
- `doc/plan-landing.md` — Figma-matched 9-section landing page plan
- `CHANGELOG.md` and `CLAUDE.md` added (restructured to `/changelog/` + `/doc/`)

## Issues
- **#44** open — "Beauty begins with you" script text for MemberCTA (deferred)
