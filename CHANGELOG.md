# Changelog

All notable changes to bawan_app are documented here.
Format: `[version/date] — type — description`. Most recent first.

---

## [2026-06-26] — feature/landing-page (open PR)

### Added
- `components/landing/HeroSection.tsx` — full-viewport hero, `doson2.png` background, Diptyque product overlay, CTA → `/products`
- `components/landing/TopTenCarousel.tsx` — Swiper carousel, newest 10 products from DB, brand + price per slide
- `components/landing/FlashSale.tsx` — live `HH:MM:SS` countdown client component, falls back to +24h if no active sale
- `components/landing/AuthenticBadge.tsx` — 專櫃正品代購 split layout with lifestyle image
- `components/landing/NewArrival.tsx` — dark moody section, newest product from DB, dark overlay background
- `components/landing/BrandSpotlight.tsx` — ESSENSORIE brand feature block, DB-driven product image
- `components/landing/MemberCTA.tsx` — 加入會員 / Instagram / LINE 三顆按鈕 (script text deferred to issue #44)
- `components/landing/CategoryShowcase.tsx` — BEAUTY / BODY / HAIR arch-shaped tiles → `/products?category=X`
- `components/landing/TrustSignals.tsx` — 4 icon row: 專櫃正品 / 免運 / 品質保證 / 低價
- `app/utils/actions.ts` — `getTopProducts`, `getSaleEndTime`, `getNewestProduct`, `getEssensorieProducts`
- `e2e/landing/landing.spec.ts` — 3 e2e tests (hero CTA, TOP 10 products, category tiles)
- `plan-landing.md` — Figma-matched landing page plan
- `plan-user-profile.md` — archived user profile plan (renamed from `plan.md`)

### Issues
- #44 open — "Beauty begins with you" script text for MemberCTA (deferred)

---

## [2026-06-26] — fix/order-image-path (PR #43, open)

### Fixed
- `components/account/OrderHistory.tsx` — order item images showed alt text only. Products store bare filenames (`SKII1.png`); all other components prepend `/img/${brand}/`. Added conditional: if `item.image` is not already an absolute URL or root-relative path, prepend `/img/${item.brand}/`

### Issues
- #42 created and closed — documents root cause

---

## [2026-06-26] — main (PR #41, merged)

Full app merged from `myAccount` branch into `main`. Includes all PRs below.

---

## [2026-06-26] — feature/user-profile-complete (PR #39, merged into myAccount)

### Added — Schema
- `prisma/schema.prisma` — `Address`, `Order`, `OrderItem` models; `role Role @default(USER)` and `stripeCustomerId String?` on `User`; `Role` and `OrderStatus` enums
- `prisma/seed.ts` — upserts `angela910914@gmail.com` as ADMIN, seeds 5 fake orders

### Added — Auth
- `auth.ts` — extended NextAuth v5 session with `user.id` and `user.role`; type augmentation for `next-auth` module; Google, LINE, Nodemailer providers

### Added — Payments & Storage
- `lib/stripe.ts` — singleton Stripe client (no explicit `apiVersion` — avoids type mismatch)
- `lib/blob.ts` — `uploadAvatar(file, userId)` → Vercel Blob `avatars/{userId}.{ext}`
- `app/api/stripe/portal/route.ts` — POST: creates/retrieves Stripe Customer, returns portal session URL
- `app/api/stripe/payment-methods/route.ts` — GET: lists cards, DELETE: detaches card
- `app/api/avatar/route.ts` — POST: uploads to Vercel Blob, returns URL

### Added — Security
- `lib/rate-limit.ts` — in-memory per-IP rate limiter (module-level Map, per-serverless-instance)
  - Stripe portal: 5 req/min, payment methods GET: 20/min, DELETE: 10/min, avatar: 10/min
- `app/utils/actions.ts` — `setDefaultAddress` IDOR fix: ownership check added (same pattern as `updateAddress`/`deleteAddress`)

### Added — Server Actions (`app/utils/actions.ts`)
- `getUserAddresses`, `createAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress`
- `getUserOrders`
- `getAllUsers`, `updateUserRole` (ADMIN-gated)
- `updateUserAvatar`

### Added — UI Components
- `components/account/UserProfile.tsx` — avatar click-to-upload (hover overlay, Camera icon, max 4MB)
- `components/account/MyAccountTabs.tsx` — 會員中心 / 訂單追蹤 / 送貨資料 / 付款方式 / 管理員 (role-gated)
- `components/account/ShippingAddress.tsx` — CRUD + set-default, inline form toggle
- `components/account/OrderHistory.tsx` — order list with status badges
- `components/account/PaymentMethod.tsx` — card list + Stripe Customer Portal redirect
- `components/account/AdminPanel.tsx` — user list with promote/demote (ADMIN only, double-gated)
- `components/form/address-form.tsx` — react-hook-form + zod `AddressValidation`
- `app/account/page.tsx` — async Server Component, redirects unauthenticated, passes `role` prop

### Added — Tests
- `e2e/account/profile.spec.ts` — order history tab, avatar file input tests
- `e2e/account/shipping-address.spec.ts` — 4 tests: display, add form, unauthenticated redirect, set default
- `e2e/account/admin.spec.ts` — 3 tests: tab visibility, user list, panel absent for non-admin
- `e2e/fixtures/page-objects.ts` — `addressTab`, `paymentTab`, `adminTab` locators

### Fixed
- `app/favorites/page.tsx` — removed unused `useEffect`, `favoriteIds`, `favoriteProducts`, `setFavoriteProducts` (blocked Vercel build)
- `auth.ts` — PrismaAdapter cast `as any` (known next-auth@beta type conflict)
- `lib/rate-limit.ts` — removed `as any` cast on `req.headers.get()` (ESLint `no-explicit-any`)
- `package.json` — `"build": "prisma generate && next build"` (fixes Vercel Prisma client regeneration)

### Changed
- Next.js `15.2.1` → `15.5.19` (Vercel blocked deployment: vulnerable version)
- `prisma/schema.prisma` datasource: `url = env("POSTGRES_PRISMA_URL")`, `directUrl = env("POSTGRES_URL_NON_POOLING")`

### Dependencies added
- `stripe`, `@vercel/blob`, `tsx`

---

## [2025-05-23] — feature/animateOnScroll (PR #30, merged)

### Added
- AOS (animate on scroll) on allProduct and searchResult pages
- `components/AOSInitializer.tsx`

---

## [2025-05-23] — feature/infiniteScroll (PR #29, merged)

### Added
- Infinite scroll on allProduct and searchResult pages
- `ProductCard` reusable in `SearchOverlay`

---

## [Pre-2026] — Earlier PRs (#23–#28)

- LINE login via server action
- Product review section + Review table
- Product detail: image carousel, info panel, size selector, cart drawer
- CartDrawer, `useCartStore`
- Favorites: HeartButton, `useFavorite`
- Product filter bar, sort, search
- Sign up form + User DB table
- Google OAuth login
