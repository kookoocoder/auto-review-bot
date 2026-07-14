Run Convex locally:

1. `npx convex dev`
2. Copy the generated deployment URL into `.env.local` as `NEXT_PUBLIC_CONVEX_URL`

This project uses Convex functions:
- `businesses:list`, `businesses:create`, `businesses:getById`
- `services:listForBusiness`, `services:create`, `services:getBySlugWithBusiness`
- `reviews:pickNextReviewText`
