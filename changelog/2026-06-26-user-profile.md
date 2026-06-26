# 2026-06-26 — User Profile & Account Management

**Branch**: `feature/user-profile-complete` | **PR**: #39 | **Status**: merged into `myAccount`

## Added — Schema
- `prisma/schema.prisma` — `Address`, `Order`, `OrderItem` models; `role Role @default(USER)` and `stripeCustomerId String?` on `User`; `Role` and `OrderStatus` enums
- `prisma/seed.ts` — upserts `angela910914@gmail.com` as ADMIN, seeds 5 fake orders

## Added — Auth
- `auth.ts` — extended NextAuth v5 session with `user.id` and `user.role`; type augmentation for `next-auth` module; Google, LINE, Nodemailer providers

## Added — Payments & Storage
- `lib/stripe.ts` — singleton Stripe client (no explicit `apiVersion` — avoids type mismatch)
- `lib/blob.ts` — `uploadAvatar(file, userId)` → Vercel Blob `avatars/{userId}.{ext}`
- `app/api/stripe/portal/route.ts` — POST: creates/retrieves Stripe Customer, returns portal session URL
- `app/api/stripe/payment-methods/route.ts` — GET: lists cards, DELETE: detaches card
- `app/api/avatar/route.ts` — POST: uploads to Vercel Blob, returns URL

## Added — Security
- `lib/rate-limit.ts` — in-memory per-IP rate limiter (module-level Map, per-serverless-instance)
  - Stripe portal: 5 req/min, payment methods GET: 20/min, DELETE: 10/min, avatar: 10/min
- `app/utils/actions.ts` — `setDefaultAddress` IDOR fix: ownership check added

## Added — Server Actions (`app/utils/actions.ts`)
- `getUserAddresses`, `createAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress`
- `getUserOrders`
- `getAllUsers`, `updateUserRole` (ADMIN-gated)
- `updateUserAvatar`

## Added — UI Components
- `components/account/UserProfile.tsx` — avatar click-to-upload (hover overlay, Camera icon, max 4MB)
- `components/account/MyAccountTabs.tsx` — 會員中心 / 訂單追蹤 / 送貨資料 / 付款方式 / 管理員 (role-gated)
- `components/account/ShippingAddress.tsx` — CRUD + set-default, inline form toggle
- `components/account/OrderHistory.tsx` — order list with status badges
- `components/account/PaymentMethod.tsx` — card list + Stripe Customer Portal redirect
- `components/account/AdminPanel.tsx` — user list with promote/demote (ADMIN only, double-gated)
- `components/form/address-form.tsx` — react-hook-form + zod `AddressValidation`
- `app/account/page.tsx` — async Server Component, redirects unauthenticated, passes `role` prop

## Added — Tests
- `e2e/account/profile.spec.ts` — order history tab, avatar file input tests
- `e2e/account/shipping-address.spec.ts` — 4 tests: display, add form, unauthenticated redirect, set default
- `e2e/account/admin.spec.ts` — 3 tests: tab visibility, user list, panel absent for non-admin
- `e2e/fixtures/page-objects.ts` — `addressTab`, `paymentTab`, `adminTab` locators

## Fixed
- `app/favorites/page.tsx` — removed unused `useEffect`, `favoriteIds`, `favoriteProducts`, `setFavoriteProducts` (blocked Vercel build)
- `auth.ts` — PrismaAdapter cast `as any` (known next-auth@beta type conflict)
- `lib/rate-limit.ts` — removed `as any` cast on `req.headers.get()` (ESLint `no-explicit-any`)
- `package.json` — `"build": "prisma generate && next build"` (fixes Vercel Prisma client regeneration)

## Changed
- Next.js `15.2.1` → `15.5.19` (Vercel blocked deployment: vulnerable version)
- `prisma/schema.prisma` datasource: `url = env("POSTGRES_PRISMA_URL")`, `directUrl = env("POSTGRES_URL_NON_POOLING")`

## Dependencies Added
- `stripe`, `@vercel/blob`, `tsx`
