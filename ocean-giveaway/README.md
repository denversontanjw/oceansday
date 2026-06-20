# Ocean's Day Giveaway

Mobile-first QR gift redemption app, built with Next.js (App Router), Supabase, and Tailwind CSS.

## What this is

- **Public page (`/`)** — a single page where attendees type their email prefix, the
  app appends `@acra.gov.sg`, looks the participant up in Supabase, and atomically
  marks their pre-assigned gift as collected.
- **Admin (`/admin`, behind `/admin/login`)** — collection-progress stats, a
  searchable/editable participant table, and CSV export.

## Architecture decisions (confirmed with you before building)

1. **Gifts are pre-assigned** in the Supabase table already (via your CSV import).
   The app only ever *reads and displays* the `gift` column — it never assigns
   or randomizes a gift itself.
2. **All Supabase access happens server-side**, via Next.js Route Handlers using
   the **service role key**. The browser never talks to Supabase directly and
   never sees that key. This also means the table's Row Level Security (it's
   enabled with no policies, which I verified) is bypassed correctly. Verified.
3. **You already created the table** (`Ocean's Day Giveaway Table`, 628 rows) —
   I did not run any migrations or modify your schema. I only read it to confirm
   column names (`id, email, gift, collected, collected_at`) and that `collected`
   starts as `NULL` (the redeem logic treats `NULL` the same as `false`).

## One thing worth your explicit attention: admin login security

You asked for the admin login to default to username/password `SWB` / `SWB`
with no database involved — that's exactly what's implemented. But a couple of
choices were made to avoid the riskiest version of that idea:

- The credential check happens **server-side** (an API route), not in client
  JS — so it's not sitting in plain text in the browser bundle for anyone to
  read via devtools.
- After login, the browser gets a **signed, expiring, HttpOnly cookie**
  (12-hour session) rather than just remembering "logged in = true" in a way
  that could be faked from the console.
- You can override the defaults any time by setting `ADMIN_USERNAME` /
  `ADMIN_PASSWORD` env vars — same simplicity, real credentials.

This is still a shared single password for the whole SWB Committee, which is
fine for a one-day internal event tool, but isn't meant to be load-bearing
security. If this admin panel needs to outlive the event or hold sensitive
data longer-term, swap it for Supabase Auth later.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `SUPABASE_URL` | Already filled in: `https://awicmaluhjmwzxmalvyv.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → `service_role` key. **Keep this secret** — it bypasses RLS entirely. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Defaults to `SWB` / `SWB` if unset |
| `ADMIN_SESSION_SECRET` | Any long random string, e.g. `openssl rand -base64 32` |

```bash
npm run dev
```

## Deploying to Vercel

1. Push this repo to GitHub (or `vercel` CLI deploy directly).
2. Import into Vercel.
3. Add the four env vars above in Project Settings → Environment Variables.
4. Deploy.

## Validation & edge cases implemented

- Email prefix: letters, numbers, underscore only — enforced both client-side
  (as-you-type) and server-side (the only one that actually matters for
  security; the client check is just UX).
- Case-insensitive, whitespace-trimmed email matching.
- **Atomic redemption**: the "mark as collected" step is a single conditional
  `UPDATE ... WHERE email = ? AND collected IS NOT TRUE`, so two simultaneous
  scans of the same email can't both succeed (no double-redemption race).
- Distinct messages for not-found / already-collected / success / invalid
  format / Supabase-unavailable.
- Submit button disabled during the request and permanently after a
  successful redemption; re-enabled for retry on errors.
- Admin CSV export pages through the table in batches of 1000 rows, so it
  won't choke as the participant list grows.
- Search matches by partial email or prefix, case-insensitively.

## File structure

```
app/
  page.tsx                       Public redemption page
  layout.tsx                     Fonts (Space Grotesk + Inter) and metadata
  admin/login/page.tsx           Admin login
  admin/page.tsx                 Admin dashboard (renders components/admin/Dashboard)
  api/redeem/route.ts            Public lookup + atomic redemption
  api/admin/login/route.ts       Credential check + session cookie issuance
  api/admin/logout/route.ts
  api/admin/stats/route.ts       Collection progress counts
  api/admin/participants/route.ts        List + search (paginated)
  api/admin/participants/[id]/route.ts   Edit a row
  api/admin/export/route.ts      CSV export
components/
  ocean/                         Public-page UI (form, icons, wave background)
  admin/Dashboard.tsx            Admin table/stats UI
lib/
  constants.ts                   Table name + shared types (single source of truth)
  supabase-admin.ts              Server-only Supabase client (service role key)
  session.ts                     Signed session cookie (Web Crypto HMAC)
  validate.ts                    Prefix validation + LIKE-pattern escaping
middleware.ts                    Protects /admin and /api/admin/*
```

## A note on the table name

Your Supabase table is literally named `Ocean's Day Giveaway Table` (with the
apostrophe and spaces). That's referenced everywhere through one constant in
`lib/constants.ts` — if you ever rename it, that's the only line to change.
