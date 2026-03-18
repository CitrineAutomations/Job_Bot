# Job Bot Dashboard

Next.js dashboard for tracking job applications. Built on [Shadboard](https://github.com/Qualiora/shadboard).

## Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Create Supabase project**

   - Go to [supabase.com](https://supabase.com) and create a project
   - Run the migration: copy contents of `../supabase/migrations/001_full_schema.sql` into the Supabase SQL editor and execute

3. **Configure environment**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase URL and anon key.

4. **Run the app**

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) and go to **Applications** in the sidebar.

## MVP Features

- **Applications Kanban** – Track applications by stage (Applied, Interview, Offer, Rejected, Done)
- **New Application** – Add applications manually with company, role, source
- **Drag to update** – Drag cards between columns to update status

## Composio Integration (Phase 2+)

Connect Gmail, Google Calendar, Google Drive, Supabase, and LinkedIn via [Composio MCP](https://docs.composio.dev). See `../COMPOSIO.md`.
