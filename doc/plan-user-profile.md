# Plan: Complete User Profile Page

## Goal

Complete the `/account` page for bawan_app (a Taiwan-facing beauty e-commerce store). End-users can view and edit their profile, manage shipping addresses, view saved payment methods, and track orders. Admins see the same page with an additional admin-only panel (user role management) that is invisible to regular users. The foundation (auth, Prisma, sign-in/sign-up) is already in place on the `myAccount` branch — this plan picks up from there.

---

## What's already done (do not re-implement)

- NextAuth v5 with Google, LINE, Nodemailer providers → `auth.ts`
- Prisma + Supabase schema for User, Product, Review, Account, Session → `prisma/schema.prisma`
- `/account` page with sidebar tabs (會員中心, 心願清單, 訂單追蹤) → `components/account/MyAccountTabs.tsx`
- Profile view + edit form (name, gender, birthday, email, phone) → `components/account/UserProfile.tsx`, `components/form/profile-form.tsx`
- `useCurrentUser` Zustand store → `hooks/useCurrentUser.tsx`
- Server actions: `getCurrentUser`, `updateUserProfileById` → `app/utils/actions.ts`
- Playwright e2e tests for profile → `e2e/account/profile.spec.ts`

---

## Architecture / flow

```mermaid
flowchart TD
    subgraph Account Page — app/account/
        Page[page.tsx\nServer Component]
        Tabs[MyAccountTabs.tsx\nclient tab switcher]
        UP[UserProfile.tsx\n✅ already built]
        SA[ShippingAddress.tsx\n🆕 new]
        PM[PaymentMethod.tsx\n🆕 new]
        OH[OrderHistory.tsx\n🆕 new]
        AP[AdminPanel.tsx\n🆕 new — admin only]
    end

    subgraph Schema additions — prisma/schema.prisma
        UA[Address model\n🆕 structured shipping]
        UO[Order + OrderItem models\n🆕]
        UR[role: Role on User\n🆕 USER / ADMIN]
        US[stripeCustomerId on User\n🆕]
    end

    subgraph Server Actions — app/utils/actions.ts
        AS[addAddress / updateAddress / deleteAddress\n🆕]
        AO[getUserOrders\n🆕]
        ADM[updateUserRole — admin only\n🆕]
    end

    Page --> Tabs
    Tabs --> UP & SA & PM & OH
    Page --> AP
    SA --> AS
    OH --> AO
    AP --> ADM
    AS --> UA
    AO --> UO
    ADM --> UR

    style SA fill:#dff0d8,stroke:#3c763d
    style PM fill:#dff0d8,stroke:#3c763d
    style OH fill:#dff0d8,stroke:#3c763d
    style AP fill:#dff0d8,stroke:#3c763d
    style UA fill:#dff0d8,stroke:#3c763d
    style UO fill:#dff0d8,stroke:#3c763d
    style UR fill:#dff0d8,stroke:#3c763d
    style US fill:#dff0d8,stroke:#3c763d
    style AS fill:#dff0d8,stroke:#3c763d
    style AO fill:#dff0d8,stroke:#3c763d
    style ADM fill:#dff0d8,stroke:#3c763d
```

---

## Scope

### May modify
- `prisma/schema.prisma` — add Address, Order, OrderItem models; add `role` + `stripeCustomerId` to User
- `app/utils/actions.ts` — add address CRUD, getUserOrders, updateUserRole
- `app/account/page.tsx` — pass session role to tabs
- `components/account/MyAccountTabs.tsx` — wire Orders tab content + admin tab
- `components/account/UserProfile.tsx` — add avatar upload section
- `components/account/ShippingAddress.tsx` — new
- `components/account/PaymentMethod.tsx` — new
- `components/account/OrderHistory.tsx` — new
- `components/account/AdminPanel.tsx` — new
- `components/form/address-form.tsx` — new
- `app/types/product.ts` — add Address, Order, OrderItem types
- `e2e/account/profile.spec.ts` — extend for new sections
- `prisma/seed.ts` — new: fake orders + set angela910914@gmail.com as ADMIN
- `lib/stripe.ts` — new: Stripe client singleton
- `lib/blob.ts` — new: Vercel Blob avatar upload helper
- `app/api/stripe/portal/route.ts` — new: create Stripe Customer Portal session
- `app/api/stripe/payment-methods/route.ts` — new: list + detach payment methods

### Must not modify
- `auth.ts`, `auth.config.ts` — auth is working, don't touch
- `components/ui/` — only add new shadcn components via `npx shadcn@latest add <component>`
- `components/form/profile-form.tsx` — already works
- `hooks/useCurrentUser.tsx` — only extend if needed for avatar
- `app/(auth)/` — sign-in/sign-up already done

### Core vs leaf
- **Core (human review needed):** `prisma/schema.prisma` (schema migrations are irreversible in prod), `AdminPanel.tsx` + `updateUserRole` (permission-sensitive)
- **Leaf (AI can own):** all other new components and server actions

---

## Schema additions

```prisma
// Add to User model:
role             Role      @default(USER)
stripeCustomerId String?
addresses        Address[]
orders           Order[]

enum Role {
  USER
  ADMIN
}

// New models:
model Address {
  id         String  @id @default(cuid())
  userId     String
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  label      String  @default("Home")   // e.g. "Home", "Office"
  recipient  String
  phone      String
  street     String
  district   String
  city       String
  postalCode String
  country    String  @default("TW")
  isDefault  Boolean @default(false)
  createdAt  DateTime @default(now())
}

model Order {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  status      OrderStatus @default(PENDING)
  total       Decimal
  createdAt   DateTime    @default(now())
  items       OrderItem[]
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId Int
  name      String
  brand     String
  size      String
  qty       Int
  price     Decimal
  image     String
}
```

> **Production note:** The existing `address: String?` field on User can be kept temporarily for backward compat but the new `Address` model should be the source of truth going forward.

---

## Payment method approach

Use **Stripe** (supports TWD, credit cards, international):
- Store only `stripeCustomerId` on the User model — never raw card data
- On first visit to the payment tab, create a Stripe Customer and save the ID to `User.stripeCustomerId`
- Display saved cards fetched server-side via `stripe.paymentMethods.list({ customer })`
- Add card: redirect to **Stripe Customer Portal** (simplest PCI-safe path, no Stripe Elements needed for v1)
- Remove card: call `stripe.paymentMethods.detach(id)` via server action

**Packages to add:**
```bash
npm install stripe @stripe/stripe-js @vercel/blob
```

**Env vars needed:**
```
STRIPE_SECRET_KEY=sk_test_...        # from Stripe dashboard (test mode first)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...      # for future order webhooks
STRIPE_PORTAL_RETURN_URL=https://yourdomain.com/account
BLOB_READ_WRITE_TOKEN=...            # auto-added by Vercel when you link Blob store
```

> **Setup steps before coding:**
> 1. Create a Stripe account at stripe.com → get test mode keys from Dashboard → Developers → API keys
> 2. In Vercel dashboard → Storage → Create Blob store → it auto-populates `BLOB_READ_WRITE_TOKEN` in your project env vars

---

## Admin panel

The admin panel is conditionally rendered based on `session.user.role === "ADMIN"`:

```tsx
// app/account/page.tsx (server component)
const session = await auth();
const isAdmin = session?.user?.role === "ADMIN";

// Pass isAdmin down to MyAccountTabs
```

Admin panel features:
- View current user's role
- Promote/demote user role (ADMIN only action — also validated server-side in `updateUserRole`)

> **First admin:** A seed script (`prisma/seed.ts`) will upsert `angela910914@gmail.com` with `role: ADMIN`. Run once with `npx prisma db seed`. Never expose a "become admin" UI endpoint.

---

## Existing patterns to follow
- Server Component fetches data → passes to Client Component (see `app/products/[id]/page.tsx`)  
- Server actions in `app/utils/actions.ts` — always validate session before DB write
- Zod validation in `lib/validations/auth.tsx` — add address schema there
- Zustand for client-side state (`hooks/useCurrentUser.tsx` as reference)
- Tabs pattern already in `MyAccountTabs.tsx` — extend, don't replace

---

## Verification

Three end-to-end tests:

1. **Happy path — add shipping address:** Sign in → Account → 送貨資料 → Add new address → Fill form → Save → Address appears in list with "預設" badge
2. **Error case — unauthenticated access:** Visit `/account` without session → redirected to `/signin`
3. **Error case — admin gate:** Sign in as USER role → inspect DOM → AdminPanel component does not render; call `updateUserRole` server action directly as USER → throws `Unauthorized` error

Manual verification:
- Orders tab shows real orders for the signed-in user (or empty state if none)
- Admin tab only appears when signed in as ADMIN

---

## Done definition

- [ ] Shipping address: add, edit, delete, set default — working end-to-end
- [ ] Order history: renders order list with status badges and item details
- [ ] Payment method: shows Stripe-linked saved cards; add card via Customer Portal; remove card via server action
- [ ] Admin panel: only visible to ADMIN role (UI + server action both enforce)
- [ ] Avatar upload: user can change avatar (stored in Supabase Storage, URL saved to `User.image`)
- [ ] `prisma/schema.prisma` migration applied without errors
- [ ] No changes outside the "may modify" list
- [ ] E2e tests updated to cover shipping address flow

---

## Risks & rollback

- **Risk:** Adding columns/models to Prisma schema requires a migration — run `prisma migrate dev` locally first and review the SQL before running on production Supabase
- **Risk:** Removing `address: String?` from User would be a breaking migration if any existing rows have data — keep the field and deprecate gradually
- **Risk:** Role-based access is only as strong as the server action checks — always re-check `session.user.role` server-side, never trust client
- **Rollback:** All new features are additive (new components, new models) — can be reverted by dropping new tables and deleting new files with no impact on existing auth/product features

---

## Decisions (resolved)

| Question | Decision |
|---|---|
| Avatar storage | **Vercel Blob** — upload to Vercel Blob store, save public URL to `User.image` |
| Payment integration | **Stripe now** — full integration with Customer Portal for card management |
| Seed data | **Yes** — `prisma/seed.ts` creates fake orders for testing; real orders populated from checkout flow in future |
| First admin | **`angela910914@gmail.com`** set to `role: ADMIN` via seed script |
