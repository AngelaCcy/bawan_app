# CLAUDE.md — bawan_app

Taiwan-facing beauty e-commerce app. Next.js 15 App Router + NextAuth v5 + Prisma + Neon (PostgreSQL) + Vercel.

---

## Workflow (always follow this order)

1. `/plan-feature` → write `plan-<feature>.md` at repo root, get approval
2. Create GitHub issues for each task (`gh issue create`)
3. Create feature branch: `feature/<name>` or `fix/<name>`
4. Implement → build passes → e2e tests pass
5. Commit with conventional commits (see below)
6. `/pr-prepare` → open PR → AI code review → merge with `--squash --delete-branch`
7. Update `CHANGELOG.md`

**Never push directly to `main`.** Always branch → PR → squash merge.

---

## Branch naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/<kebab-name>` | `feature/landing-page` |
| Bug fix | `fix/<issue-description>` | `fix/order-image-path` |
| Integration | `myAccount`, etc. | pre-existing integration branches |

---

## Commit style (Conventional Commits)

```
feat(scope): short description
fix(scope): short description
chore(deps): what changed and why
test(scope): what tests added
```

- Scope = area of code: `account`, `landing`, `auth`, `schema`, `security`, `deps`
- Body: explain WHY if non-obvious
- Always end with `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` when AI-authored

---

## GitHub issues

- Create an issue **any time a bug is discovered**, even mid-feature — don't silently fix without tracking
- Create an issue for **deferred work** (things explicitly decided to do later)
- Use `--label "bug"` or `--label "enhancement"`
- Reference issue in commit: `Closes #XX`

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router |
| Auth | NextAuth v5 (Auth.js) — Google, LINE, Nodemailer |
| DB | Prisma + Neon PostgreSQL |
| ORM env vars | `POSTGRES_PRISMA_URL` (pooled), `POSTGRES_URL_NON_POOLING` (direct) |
| Payments | Stripe — Customer Portal, never store raw card data |
| Avatar storage | Vercel Blob — `avatars/{userId}.{ext}` |
| Deployment | Vercel — auto-deploy on push to `main` |
| Styling | Tailwind CSS v4 |
| UI components | Radix UI primitives via shadcn pattern |
| Forms | react-hook-form + zod |
| Carousel | Swiper |
| Scroll animation | AOS (animate on scroll) |
| Toast | react-hot-toast |
| State | Zustand |
| E2E tests | Playwright |
| Package manager | pnpm (Vercel), npm (local dev) |

---

## Design system

```
Background:   #EDEDE9  (warm off-white)
Navbar:       #D6CCC2  (warm taupe)
Button:       #9E7C59  (warm brown)
Button hover: #8A6A4A
Accent/gold:  #B08866  (used for labels, tags, highlights)
Warm section: #F5EEE0  (for flash sale, newsletter, CTA sections)
```

- Font: `Noto Sans TC` (Traditional Chinese), loaded via `next/font/google`
- UI text: **Traditional Chinese (繁體中文)**
- Code: English identifiers, English comments

### Image paths
- Local product images: `/img/${brand}/${filename}` — brands are subdirectories under `public/img/`
- Hero/lifestyle images: `/img/${filename}` — directly under `public/img/`
- Vercel Blob avatars: full URL returned from `PUT` (stored in `User.image`)
- Always use `next/image`. For external images, add hostname to `next.config.ts` `remotePatterns`

---

## Code patterns

### Server Components (default)
Use for pages that fetch data. Call Prisma/actions directly, no `useEffect`.
```tsx
// app/account/page.tsx pattern
export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  const data = await getSomeAction();
  return <ClientComponent data={data} />;
}
```

### Server Actions (`app/utils/actions.ts`)
- All actions in one file for now (split if it exceeds ~500 lines)
- Always call `const session = await auth()` first
- Always check `session?.user?.id` before any DB write
- Admin gates: `if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")`
- Ownership checks on all mutations: verify `existing.userId === session.user.id` before update/delete

### Client Components
- Add `"use client"` at top
- Use `useEffect` + server actions for data fetching (not API routes unless file upload/Stripe redirect)
- Toast on success/error: `toast.success("...")` / `toast.error("...")`

### Rate limiting (API routes only)
```ts
const { ok } = checkRateLimit(`key:${ip}`, limit, 60_000);
if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
```

### Forms
- Always zod schema → react-hook-form → `zodResolver`
- Validate at the form level, not in the server action (server action assumes valid input from trusted callers)

---

## Security rules

- **Never store raw card data** — Stripe IDs only (`stripeCustomerId`, `paymentMethodId`)
- **Double-gate admin features** — check role in both UI (hide component) AND server action (throw)
- **Ownership check** on every mutating action that takes an `id` — verify the record belongs to the session user
- **Rate limit** all public API routes that call external services (Stripe, Blob)
- **No `as any`** unless documented with a comment explaining why (PrismaAdapter next-auth@beta exception is the only existing case)

---

## Stripe conventions

- Do NOT pass explicit `apiVersion` to `new Stripe()` — causes type mismatch as SDK updates
- Always check `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_PORTAL_RETURN_URL` in Vercel env vars before deploying

---

## Prisma conventions

- Use `npx prisma db push` (not `migrate dev`) — no migration history was set up initially
- Seed: `npx prisma db seed` — upserts admin, seeds fake orders
- Build script: `"prisma generate && next build"` — required for Vercel to regenerate client
- Schema changes: additive only — never remove columns in production without a rollback plan

---

## Testing (Playwright)

- E2E tests live in `e2e/<feature>/` mirroring `app/` structure
- Tests **gracefully skip** when not authenticated (check `page.url().includes('/signin')`, then `test.skip()`)
- Use `data-testid` attributes on key interactive elements
- Run before every PR: `npm run test:e2e`
- At least 3 tests per feature: 1 happy path + 2 edge/error cases

---

## Files not to touch without discussion

- `auth.ts` — session shape affects every authenticated route
- `prisma/schema.prisma` — any removal is potentially destructive in prod
- `app/api/**` — external interface, security-sensitive
- `components/ui/**` — shared Radix/shadcn components, used everywhere

---

## Plan files

- One plan per feature: `doc/plan-<feature>.md`
- Completed plans stay in `/doc/` (archived, not deleted)
- Active plan is whatever is currently being worked on

---

## Changelog

- Add a new file in `/changelog/` after every merged PR
- Filename: `YYYY-MM-DD-<slug>.md` (e.g. `2026-06-26-landing-page.md`)
- Format: `# YYYY-MM-DD — Feature Name` → `## Added / Fixed / Changed`

---

## Docs layout

```
/changelog/   — one .md per change, named YYYY-MM-DD-<slug>.md
/doc/         — plan files (plan-<feature>.md) and other design docs
CLAUDE.md     — stays at repo root (required for Claude Code auto-load)
components/CLAUDE.md — stays in components/ (required for Claude Code auto-load)
```
