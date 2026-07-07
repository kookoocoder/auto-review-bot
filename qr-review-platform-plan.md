# QR Review Platform — Build Plan (for Cursor)

## 1. What we're building

A web platform where a business owner can:
1. Create a **business profile** (name, Google Place ID / review link)
2. Create one or more **services** under that business (e.g. "Haircut", "Dental Cleaning", "Dine-in")
3. Upload a **review-text sheet** (CSV) per service — a pool of pre-written review variations
4. Generate **one static QR code per service** (or one per business, your choice — see §3.3)
5. When a customer scans the QR:
   - They land on a mobile web page
   - See a pre-written review pulled from that service's pool (least-recently-used logic)
   - Tap **"Copy & Continue"**
   - Text is copied to clipboard, page redirects to the business's Google review page
   - Customer pastes and submits on Google's own page

No LLM calls needed. No native app. QR stays constant forever — all logic lives server-side behind the redirect URL.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (React) + Tailwind | Single codebase for dashboard + public scan pages, easy deploy |
| Backend | Next.js API routes (or separate Express if you prefer) | No need for a separate server, keeps it simple |
| Database | Supabase (Postgres) | Free tier, built-in auth, easy file/CSV handling, instant REST |
| Auth | Supabase Auth (email/password or magic link) | Business owners log in to manage their dashboard |
| QR generation | `qrcode` npm package | Generates PNG/SVG from a URL string, no external API needed |
| CSV upload/parsing | `papaparse` (frontend) or `csv-parse` (backend) | Parse uploaded review sheets into DB rows |
| Hosting | Vercel | Native Next.js support, free tier fine to start |

---

## 3. Data model

### 3.1 Tables

**businesses**
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| owner_id | uuid | FK → auth.users |
| name | text | |
| google_place_id | text | used to build the review link |
| google_review_url | text | `https://search.google.com/local/writereview?placeid=<id>` — store precomputed |
| created_at | timestamp | |

**services**
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| business_id | uuid | FK → businesses |
| name | text | e.g. "Haircut", "Dine-in" |
| qr_slug | text, unique | short random string used in the redirect URL |
| created_at | timestamp | |

**review_texts**
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| service_id | uuid | FK → services |
| text | text | the review variation |
| used_count | int, default 0 | |
| last_used_at | timestamp, nullable | null = never used, prioritize these first |

**scan_logs** (optional but recommended)
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| service_id | uuid | |
| review_text_id | uuid | which variation was shown |
| scanned_at | timestamp | |

### 3.2 Why per-service QR, not per-business

If a business has multiple services (e.g. a salon with "Haircut" and "Coloring"), each service likely needs different-sounding reviews. A per-service QR lets you print a different QR at each service point, each pulling from its own relevant review pool. If the business only has one generic service ("Visit"), just create one service row and one QR — same system either way.

### 3.3 The redirect URL structure

```
https://yourapp.com/r/[qr_slug]
```

This is the URL encoded into the QR. It never changes once generated — `qr_slug` is a permanent random ID tied to that service row, so the QR image itself is generated once and can be printed/laminated/whatever.

---

## 4. Application pages

### Dashboard (auth-protected)

- `/dashboard` — list of the owner's businesses
- `/dashboard/business/new` — create business form (name, Google Place ID or full review URL)
- `/dashboard/business/[id]` — business detail: list of services, "Add Service" button
- `/dashboard/business/[id]/service/new` — create service (name), auto-generates `qr_slug`
- `/dashboard/service/[id]` —
  - Shows the QR code (downloadable PNG/SVG, printable)
  - CSV upload box for review texts
  - Table of currently uploaded review texts (editable/deletable)
  - Basic stats: total scans, most/least used review lines

### Public scan page (no auth)

- `/r/[qr_slug]` —
  - Server picks the least-recently-used review text for that service
  - Displays it in a text box
  - "Copy & Open Google Reviews" button
  - On click: `navigator.clipboard.writeText(text)` → then `window.location.href = google_review_url`
  - Logs the scan to `scan_logs`, updates `used_count` and `last_used_at` on that review row

---

## 5. Core logic: picking the review text

```
function getNextReviewText(service_id):
    rows = SELECT * FROM review_texts
            WHERE service_id = service_id
            ORDER BY last_used_at ASC NULLS FIRST
            LIMIT 1

    if rows is empty:
        return fallback_text  // handle "no reviews uploaded yet" case

    row = rows[0]
    UPDATE review_texts
        SET used_count = used_count + 1, last_used_at = NOW()
        WHERE id = row.id

    return row.text
```

This guarantees even rotation through the whole pool before any line repeats — the "least-recently-used" approach discussed earlier.

---

## 6. CSV upload format

Business owner uploads a simple one-column CSV per service:

```csv
text
"Great service, staff was really helpful and quick."
"Loved the ambience, food came out fast and hot."
"Really friendly team, will definitely come back."
```

Backend: parse with `papaparse`/`csv-parse`, insert each row into `review_texts` with `service_id`, `used_count = 0`, `last_used_at = null`.

Validate: strip empty rows, cap length (~200 chars), warn if fewer than ~15 rows uploaded (too small a pool repeats too fast and looks templated).

---

## 7. QR generation

```js
import QRCode from 'qrcode';

const url = `https://yourapp.com/r/${qr_slug}`;
const qrDataUrl = await QRCode.toDataURL(url, { width: 512, margin: 2 });
// store qrDataUrl or regenerate on demand — no need to persist the image,
// since it's fully deterministic from qr_slug
```

Offer both PNG (for printing) and SVG (for scaling on posters/table tents) download options on the service detail page.

---

## 8. Build order (recommended sequence for Cursor)

1. **Scaffold** — Next.js + Tailwind + Supabase project, set up env vars, connect DB
2. **Auth** — Supabase email/password login, protect `/dashboard/*` routes
3. **Schema** — create the 4 tables above via Supabase migration/SQL editor
4. **Business CRUD** — create/list/view businesses
5. **Service CRUD** — create/list services under a business, auto-generate `qr_slug` (use `nanoid`)
6. **QR generation** — service detail page renders + lets you download the QR
7. **CSV upload** — upload UI + parser + insert into `review_texts`
8. **Public scan page** `/r/[slug]` — the LRU-pick logic, copy-to-clipboard, redirect
9. **Scan logging + basic stats** — simple counts on the service dashboard
10. **Polish** — mobile styling on the scan page (this is the page real customers see, so it needs to load fast and look clean on a phone), error states (no reviews uploaded, invalid slug)

---

## 9. Things to double check before launch

- Confirm the business's actual Google review URL format works (Place ID lookup via [Google's Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id))
- `navigator.clipboard.writeText` requires HTTPS — fine on Vercel by default, just don't test on plain HTTP
- Some in-app browsers (Instagram/Facebook webview, if QR is scanned via a screenshot shared in-app) block clipboard write — add a manual "select and copy" fallback text box just in case
- Keep review pools per service reasonably large (15+ lines) and varied in tone/length, per the earlier discussion on avoiding Google's spam pattern detection

---

## 10. Nice-to-haves for later (not v1)

- Multi-business support for agencies managing several clients
- Analytics dashboard (scans over time, conversion estimate)
- Auto-generate suggested review lines from service description (LLM, optional, off by default)
- QR poster/table-tent template generator (auto-layout QR + business branding into a printable PDF)
