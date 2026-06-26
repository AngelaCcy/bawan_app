# CLAUDE.md — components/

Component conventions for bawan_app.

## Directory structure

```
components/
  account/      — /account page tabs (UserProfile, ShippingAddress, OrderHistory, PaymentMethod, AdminPanel)
  landing/      — Landing page sections (HeroSection, TopTenCarousel, FlashSale, …)
  products/     — Product display (ProductCard, ProductImageCarousel, FilterBar, …)
  form/         — Reusable form components (address-form, profile-form, signin-form, signup-form)
  cart/         — Cart drawer and items
  ui/           — Radix/shadcn primitives — DO NOT modify without care; used everywhere
  *.tsx         — Shared layout components (navbar, footer, banner, etc.)
```

## Rules

### Client vs Server
- Default to **Server Component** (no directive) — can fetch data directly
- Add `"use client"` only when you need: `useState`, `useEffect`, event handlers, browser APIs
- Never mix `"use server"` into a component file — server actions live in `app/utils/actions.ts`

### Naming
- PascalCase filenames matching the exported component: `ShippingAddress.tsx` exports `ShippingAddress`
- One component per file (except tiny helper sub-components used only in that file)

### Props
- Prefer explicit prop interfaces over `React.FC<Props>` — just `function Foo({ bar }: Props)`
- Data props come from the parent Server Component — components don't fetch their own data unless they're a client component that needs real-time updates

### Images
- Always `next/image`, never `<img>`
- Local product images: `src={\`/img/${brand}/${filename}\`}`
- External images: must be in `next.config.ts` `remotePatterns` first

### Styling
- Tailwind utility classes only — no inline `style={}` except for dynamic CSS properties (e.g. `border-radius` arch shapes)
- Brand colours as hex literals or CSS vars: `bg-[#9e7c59]`, `text-[#B08866]`
- Warm section background: `bg-[#F5EEE0]`
- Page background: `bg-[#EDEDE9]` (set on `body`, usually not needed in components)

### AOS animations
- Add `data-aos="fade-up"` to each section's outer `<section>` tag
- `AOSInitializer` must be rendered once in the page — already in `app/page.tsx` and product pages
- Don't add AOS to components that are already inside an AOS-animated parent

### Swiper
- Import modules explicitly: `import { Navigation, Autoplay } from "swiper/modules"`
- Always import required CSS: `import "swiper/css"`, `import "swiper/css/navigation"` etc.
- Use `breakpoints` for responsive `slidesPerView`

### account/ components
- All are Client Components (they call server actions directly)
- Pattern: `useEffect(() => { load(); }, [])` to fetch on mount, `load()` called again after mutations
- Always show a loading state and an empty state
- Toast on every mutation success and error

### landing/ components
- Sections are mostly Server Components (receive data as props from `app/page.tsx`)
- `FlashSale` and `HeroSection` are Client Components (countdown timer, AOS init)
- Each section is a `<section>` tag with `data-aos="fade-up"` and a `py-16` (or similar) vertical rhythm
- Graceful: if a section's data prop is null/empty, return `null` (don't render the section)
