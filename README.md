# QR Review Platform

This app lets a business owner:
- create businesses and services
- generate stable per-service QR slugs (`/r/[qr_slug]`)
- rotate review text lines with least-recently-used logic
- send customers to Google review pages after copy

## Setup

1. Install dependencies:
   - `npm install`
2. Create local env:
   - `cp .env.example .env.local`
3. Start Convex dev backend:
   - `npx convex dev`
4. Copy `NEXT_PUBLIC_CONVEX_URL` into `.env.local`
5. Run dev server:
   - `npm run dev`

## Current routes

- `/` home
- `/dashboard` business list
- `/dashboard/business/new` create business
- `/dashboard/business/[id]` business details + services
- `/dashboard/business/[id]/service/new` create service
- `/r/[qr_slug]` customer-facing review page

## Notes

- Current scaffold uses `DEMO_OWNER_ID` for ownership before auth is wired.
- Convex schema/functions are in `convex/`.
- CSV upload is on `/dashboard/service/[id]` (one `text` column per row).
- QR PNG/SVG download is on `/dashboard/service/[id]`. Set `NEXT_PUBLIC_APP_URL` in production so QR links point to your live domain.
