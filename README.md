# Heywall

A Facebook-style public wall built with Next.js, React and Supabase. Type a message, attach an optional photo, hit Share, and the feed updates live for everyone with no page reload. Posts are saved in Supabase, so they survive a refresh, and the layout adapts to desktop, tablet and mobile.

## Features

- Post a message of up to 280 characters, with a live character counter
- Attach an optional image (JPG, PNG or GIF, up to 5MB)
- Feed of the latest 50 posts, newest first
- Realtime updates through Supabase Realtime, with no reload needed
- Posts persist in Supabase Postgres, and images are stored in Supabase Storage
- First 50 posts are fetched on the server for a fast first load
- Responsive layout: desktop (profile, feed, ads), tablet (profile moves into the header) and mobile (no ads)
- No login required, since posts use a fixed name

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) and React
- TypeScript
- [Supabase](https://supabase.com/) (Postgres, Realtime, Storage)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Phosphor Icons](https://phosphoricons.com/)
- [Vite+](https://viteplus.dev/) for the toolchain (formatting, linting, type checks, package management)
- pnpm
- Deployed on [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

Install the global `vp` CLI from [Vite+](https://viteplus.dev/) once:

```bash
# macOS / Linux
curl -fsSL https://vite.plus | bash

# Windows (PowerShell)
irm https://vite.plus/ps1 | iex
```

Open a new terminal, then check that it works:

```bash
vp --version
```

During install, Vite+ asks whether it should manage your global Node.js runtime. If you already use nvm, fnm or asdf, you can decline and it will use your system Node.js. You can switch this later with `vp env on` or `vp env off`.

You also need a free [Supabase](https://supabase.com/) account (see step 2 below).

### 1. Install dependencies

```bash
vp install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com/).
2. In the **SQL Editor**, run the script below.
3. Go to **Project Settings → API** and copy the **Project URL** and the **anon / public key**.

```sql
-- Posts table
create table posts (
  id uuid primary key default gen_random_uuid(),
  author text not null default 'Anonymous',
  message text not null check (char_length(message) <= 280),
  image_url text,
  created_at timestamptz not null default now()
);

-- Row level security
alter table posts enable row level security;
create policy "Anyone can read posts" on posts for select using (true);
create policy "Anyone can insert posts" on posts for insert with check (true);

-- Table privileges for the public (anon) role
grant usage on schema public to anon;
grant select, insert on public.posts to anon;

-- Realtime
alter publication supabase_realtime add table posts;

-- Image uploads
insert into storage.buckets (id, name, public) values ('post-images', 'post-images', true);
create policy "Anyone can view images" on storage.objects for select using (bucket_id = 'post-images');
create policy "Anyone can upload images" on storage.objects for insert with check (bucket_id = 'post-images');
```

### 3. Add environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Never commit this file, and never use the `service_role` key in the front end.

### 4. Run the app

```bash
vp run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other commands:

```bash
vp check        # format, lint, and type check
vp check --fix  # auto-fix what it can
vp run build    # production build
```

### Testing on your phone

If you open the dev server from another device (for example `http://192.168.1.5:3000`), add that address to `next.config.ts` and restart the dev server:

```ts
const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.5"],
};
```

Otherwise Next.js blocks its dev scripts, and the page loads but doesn't respond to taps.

## How to Use

1. Type a message of up to 280 characters. The counter shows how many you have left.
2. Optionally attach a photo (JPG, PNG or GIF, up to 5MB).
3. Click **Share**. Your post appears at the top of the feed.
4. Open the site in a second tab or device. New posts show up there live, without a reload.

## Project Structure

```
app/                  layout, page, global styles
components/           header, profile card, ads column, wall, wall loader, post form, post card
lib/profile.ts        fixed profile data used for the author and sidebar
lib/types.ts          Post type
lib/utils/supabase/   browser and server Supabase clients
lib/utils/time-ago.ts "now", "9m", "9h" timestamp helper
public/               logos and avatar
```

The first 50 posts are fetched in a server component (`wall-loader.tsx`) and passed to a client component (`wall.tsx`), which owns the feed state and the Supabase Realtime subscription.

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import the repo on [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Click **Deploy**.
