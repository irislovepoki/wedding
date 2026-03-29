# RSVP Database Setup

This project now supports two RSVP storage modes:

- local JSON fallback during development
- Supabase for production / hosted deployments

## How it works

- If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set, RSVP submissions are stored in Supabase.
- If those env vars are missing, submissions continue to write to `data/rsvp-submissions.json`.

## 1. Create the table

In your Supabase SQL editor, run:

`supabase/rsvp-schema.sql`

## 2. Add env vars

Copy `.env.example` to `.env.local` and fill in:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- optional: `SUPABASE_RSVP_TABLE`

## 3. Deploy

When you host the site, add the same environment variables to your hosting platform.

## 4. View submissions

After the env vars are set, the built-in viewer page will read from Supabase:

- `/rsvp-view`

The page will also show the current storage source at the top.
