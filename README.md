# GC SRM Lending Board

A peer-to-peer campus resource sharing board for SRM Kattankulathur students. Students regularly need items for short periods — a calculator for one exam, a textbook for a week, a charger, a lab coat — and this app gives them a quick, organised way to post and discover things to borrow from each other.

**Live demo:** _add link after deploying to Vercel_

---

## Features

- Public listing feed — no login required to browse
- Add-listing form with client-side + database-level validation
- Search listings by item name or description
- Filter by category
- Loading, empty, and error states
- Responsive — works on mobile and desktop

---

## Setup

### 1. Create the Supabase table

Run this SQL in your Supabase project's SQL editor:

```sql
create table listings (
  id uuid primary key default gen_random_uuid(),
  item_name text not null,
  description text not null,
  category text not null,
  lender_name text not null,
  contact_info text not null,
  created_at timestamptz not null default now(),

  constraint item_name_length
    check (char_length(trim(item_name)) between 2 and 100),
  constraint description_length
    check (char_length(trim(description)) between 5 and 500),
  constraint lender_name_length
    check (char_length(trim(lender_name)) between 2 and 60),
  constraint contact_length
    check (char_length(trim(contact_info)) between 3 and 150)
);

alter table listings enable row level security;

create policy "Public can view listings"
  on listings for select using (true);

create policy "Public can create listings"
  on listings for insert with check (true);
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project dashboard → Settings → API.

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables in the Vercel project settings.
4. Deploy.

---

## Known Limitations

- **No authentication.** There's no login system, so the app can't verify who posted what. Listing status (borrowed / available) is not tracked in-app — coordination happens directly between student and lender via the listed contact info. This is an intentional design trade-off.
- **Listings can't be edited or deleted** after creation, because there's no way to verify ownership without auth.
- **Contact info is publicly visible** on each listing card. This is acceptable for a college demo but would need obfuscation or an in-app relay for a production deployment.

---

## Demo video

_add link_
