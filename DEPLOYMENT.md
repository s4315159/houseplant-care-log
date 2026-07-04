# Deployment guide — Supabase, GitHub & Vercel

This guide walks you through the three accounts/services you need to set up. All
three have free tiers that are more than enough for this project. Do them in
order.

---

## Part 1 — Supabase (authentication + database)

1. Go to <https://supabase.com> and sign in (you can use your GitHub account).
2. Click **New project**.
   - **Name:** `houseplant-care-log`
   - **Database password:** choose a strong one and save it somewhere.
   - **Region:** pick the one closest to you (e.g. *West EU (London)*).
3. Wait ~2 minutes for the project to finish provisioning.
4. **Create the database table:** in the left sidebar open **SQL Editor** →
   **New query**, paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql),
   then click **Run**. You should see "Success. No rows returned".
5. **(Recommended for the demo)** Turn off email confirmation so you can log in
   instantly: **Authentication → Sign In / Providers → Email**, and disable
   **Confirm email**. (In a real product you would leave this on.)
6. **Get your keys:** **Project Settings → API**. Copy:
   - **Project URL** (looks like `https://abcd1234.supabase.co`)
   - **anon public** key (a long string)

---

## Part 2 — Connect the app to Supabase

1. In the project folder, copy the example env file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and paste your two values:
   ```
   VITE_SUPABASE_URL=https://abcd1234.supabase.co
   VITE_SUPABASE_ANON_KEY=your-long-anon-key
   ```
3. Run the app locally to confirm it works:
   ```bash
   npm install
   npm run dev
   ```
   Open <http://localhost:5173>, sign up, log in, and add a plant. 🎉

> The `.env` file is git-ignored so your keys never get committed. The anon key
> is designed to be public (it is safe in a frontend build) because the database
> is protected by Row Level Security — but keeping it out of git is still good
> practice.

---

## Part 3 — GitHub (version control)

1. Create a new **empty** repository at <https://github.com/new>
   (name it `houseplant-care-log`, do **not** add a README/licence — the project
   already has one).
2. In the project folder, push the existing commit history:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/houseplant-care-log.git
   git branch -M main
   git push -u origin main
   ```
3. Refresh the GitHub page — you should see all the files and the commit history.

---

## Part 4 — Vercel (hosting)

1. Go to <https://vercel.com> and sign up **with your GitHub account**.
2. Click **Add New… → Project**, then **Import** your `houseplant-care-log` repo.
3. Vercel auto-detects Vite. Before deploying, expand **Environment Variables**
   and add the same two values from your `.env`:
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | your Project URL |
   | `VITE_SUPABASE_ANON_KEY` | your anon key |
4. Click **Deploy**. After ~1 minute you get a live URL like
   `https://houseplant-care-log.vercel.app`.
5. **Important — allow the live URL in Supabase:** back in Supabase go to
   **Authentication → URL Configuration** and add your Vercel URL to the
   **Site URL** / **Redirect URLs**. This lets auth work on the deployed site.

Every future `git push` to `main` will automatically redeploy. Put the live URL
in your report and README.
