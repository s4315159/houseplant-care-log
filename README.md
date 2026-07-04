# 🪴 Houseplant Care & Watering Log

A minimal, easy-to-use web app for individuals to track their indoor plants —
their watering status, room location and care notes. It is a simple digital
replacement for a physical notebook or spreadsheet, focusing on clarity, speed
and usability.

Built with **React + Vite** on the frontend, **Supabase** for authentication and
database, and deployed on **Vercel**.

---

## Features

**Core**
- 🔐 Secure sign-up, log-in and log-out — each user has a private plant log
- ➕ Add a plant (name/species, room location, status, optional notes)
- 📋 View all plants in a table (name, location, status, date added, notes)
- 🔄 Update a plant's status in place
- 🗑️ Delete a plant (with confirmation)
- 🔍 Search by name/location and filter by status

**Extras**
- ↕️ Sort by name or date added
- 📝 Care notes per plant
- 📊 Summary dashboard (totals per status)
- 🎨 Colour-coded status badges and icons
- 📱 Responsive layout (table collapses to cards on mobile)

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| UI library | React 18 |
| Build tool / dev server | Vite 5 |
| Auth & database | Supabase (PostgreSQL + Row Level Security) |
| Hosting | Vercel |
| Language | JavaScript (JSX) |

---

## Running locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Supabase project** and run the SQL in [`supabase/schema.sql`](supabase/schema.sql)
   (Supabase dashboard → SQL Editor). See [DEPLOYMENT.md](DEPLOYMENT.md) for full steps.

3. **Add your environment variables** — copy `.env.example` to `.env` and paste
   your Supabase Project URL and anon key:
   ```bash
   cp .env.example .env
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

---

## Project structure

```
houseplant-care-log/
├─ public/
│  └─ leaf.svg                 # favicon
├─ src/
│  ├─ components/
│  │  ├─ Auth.jsx              # sign-up / log-in screen
│  │  ├─ Dashboard.jsx         # summary totals + status metadata
│  │  ├─ PlantForm.jsx         # add-a-plant form
│  │  ├─ Toolbar.jsx           # search / filter / sort controls
│  │  └─ PlantTable.jsx        # plant table with inline update + delete
│  ├─ contexts/
│  │  └─ AuthContext.jsx       # session state + auth actions
│  ├─ lib/
│  │  └─ plants.js             # data-access layer (Supabase queries)
│  ├─ App.jsx                  # root component / state orchestration
│  ├─ main.jsx                 # entry point
│  ├─ supabaseClient.js        # configured Supabase client
│  └─ index.css                # styles
├─ supabase/
│  └─ schema.sql               # table + Row Level Security policies
├─ .env.example
├─ DEPLOYMENT.md               # Supabase + GitHub + Vercel setup guide
└─ package.json
```

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step Supabase, GitHub and Vercel
setup.
