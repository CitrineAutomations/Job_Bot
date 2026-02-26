# Job Bot

Local markdown knowledgebase and agent instructions to generate tailored resumes, cover letters, and Upwork proposals. With an optional dashboard to track applications, manage a company CRM, and enrich applications with company research.

## How it works

**Core (Vault + Agent):** You maintain a vault of markdown files (profile, experience, case studies, templates, writing guidelines). An AI CLI agent reads those files plus a job post and generates tailored application documents. No backend required.

**Optional (Dashboard):** A Next.js dashboard tracks applications on a Kanban board, maintains a CRM of companies you apply to, stores company enrichment (website, LinkedIn, news), and finds hiring manager contacts for direct outreach.

```
Job post (manual or from job boards)
        |
        v
Agent enriches company (website, LinkedIn, news, contacts)
        |
        v
Agent reads vault + job post + enrichment
        |
        v
Generates tailored resume, cover letter, proposal
        |
        v
Drafts saved to Vault/06-Generated/ + tracked in dashboard
```

## What you can generate

- **Upwork proposals** -- Short, proof-backed responses tailored to each posting.
- **Tailored resumes** -- Subsets of your master resume reordered to match the job.
- **Cover letters** -- Role-specific letters citing achievements and personalized with company research (mission, products, news, hiring manager name when available).

All outputs are drafts. You review, edit, then submit.

## Full project scope

| Component | Description |
|-----------|-------------|
| **Vault** | Local markdown knowledgebase (profile, experience, templates, guidelines) |
| **Agent** | AI in your IDE generates docs; can also enrich companies (website, LinkedIn, news) |
| **Dashboard** | Kanban board, company CRM, application tracking |
| **Email** | Connect job-application email; inbox, auto-tracking, reply from dashboard |
| **Enrichment** | Company website, LinkedIn, news (prioritized sources) stored per company |
| **Contacts** | Hiring manager, recruiter, job poster for direct outreach |
| **Job boards** | Pull jobs from LinkedIn/Indeed via Apify into dashboard |

See [ROADMAP.md](ROADMAP.md) for phased development plan.

## What's in this repo

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Agent instructions, onboarding, retrieval rules, enrichment workflow |
| `context.md` | Step-by-step vault-building and workflow guide |
| `prd.md` | Product requirements and full scope |
| `ROADMAP.md` | Phased development plan (dashboard first, then features) |
| `COMPOSIO.md` | Composio MCP toolkits (Gmail, Calendar, Drive, Supabase, LinkedIn) |
| `supabase/migrations/` | Database schema for dashboard (companies, applications, enrichment, contacts) |

The vault itself is created by you during onboarding. It is git-ignored by default since it contains personal data.

## Quick start (Vault only)

1. **Clone the repo**
   ```bash
   git clone https://github.com/CitrineAutomations/Job_Bot.git
   cd Job_Bot
   ```

2. **Follow onboarding in `CLAUDE.md`**
   - Create the `Vault/` folder and required subfolders
   - Create the 8 required core files (profile, guidelines, templates)
   - Populate with your real work history, skills, and writing rules
   - Add at least 2 to 4 project files in `01-Experience/`

3. **Generate your first document**
   - Save a job post to `Vault/05-Job-Posts/<slug>.md`
   - Open your AI CLI agent (e.g. Claude Code, Cursor) with `CLAUDE.md` as context
   - Ask: "Generate an Upwork proposal for the job in `05-Job-Posts/<slug>.md`"
   - Find the draft in `Vault/06-Generated/`

## Dashboard setup (optional)

1. Create a [Supabase](https://supabase.com) project
2. Run the migration: copy `supabase/migrations/001_full_schema.sql` into the Supabase SQL editor and execute
3. In the `dashboard/` folder:
   ```bash
   cd dashboard
   pnpm install
   cp .env.example .env.local
   ```
   Edit `.env.local` with your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run `pnpm dev` and open [http://localhost:3000/en/applications](http://localhost:3000/en/applications)

## Privacy

Your vault stays local. The `.gitignore` excludes `Vault/` so personal data is never committed. If your vault lives outside this repo, no action needed.

## Key aspects

1. **Vault as source of truth** -- Your experience, skills, and proof live in markdown files you control. No cloud lock-in for generation.
2. **Agent in your IDE** -- Uses Claude, Gemini, or whatever you already have. No separate API. Enrichment (website, LinkedIn, news) is done by the same agent.
3. **Cold-lead style personalization** -- Treat each job like a prospect: research the company, find the hiring manager, personalize the pitch.
4. **Company CRM** -- One record per company with enrichment and contacts. Applications and assets hang off it.
5. **Dashboard-first roadmap** -- Build the tracking board first, then layer on email, vault integration, enrichment, contacts, job boards.
6. **Self-hosted** -- Can run fully private. Vault stays local; dashboard can be self-hosted.

## Does something like this already exist?

**Similar tools:** [Enhancv](https://enhancv.com/features/job-application-tracker/), [JobLoom.AI](https://www.jobloom.ai/job-tracker/), [Huntr](https://app.huntr.co/), [Teal](https://www.tealhq.com/tool/job-search-crm), [Careerflow AI](https://chromewebstore.google.com/detail/careerflow-ai-job-applica/iadokddofjgcgjpjlfhngclhpmaelnli) offer AI resume builders, job trackers, and CRMs.

**What Job Bot does differently:**
- **Local vault** -- Your knowledge lives in markdown files you control. No cloud dependency for generation.
- **Agent in your IDE** -- Uses whatever AI you already have (Claude, Gemini, etc.). No separate API.
- **Company enrichment** -- Website, LinkedIn, news (prioritized sources) to personalize cover letters like cold outreach.
- **Contact discovery** -- Hiring manager, recruiter from job posting and company research for direct follow-up.
- **Company CRM** -- Company-centric view with enrichment and contacts, not just application-centric tracking.
- **Self-hosted / open** -- Can be fully private. No vendor lock-in.

## License

MIT
