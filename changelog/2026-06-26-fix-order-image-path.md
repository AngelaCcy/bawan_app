# 2026-06-26 — Fix: Order History Image Path

**Branch**: `fix/order-image-path` | **PR**: #43 | **Status**: open

## Fixed

- `components/account/OrderHistory.tsx` — order item images showed alt text only
  - Root cause: products store bare filenames (`SKII1.png`) in the DB, but `<Image src>` was using the value directly
  - Fix: added conditional path construction — if `item.image` is not already an absolute URL or root-relative path, prepend `/img/${item.brand}/`
  - Pattern matches how `ProductCard` and other components handle local product images

## Issues
- **#42** created and closed — documents root cause for reference
