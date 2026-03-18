# Job Bot Roadmap

Phased development plan. Dashboard first, then features layered on top.

---

## Phase 1: Dashboard Foundation (Priority)

**Goal:** Working dashboard to track job applications and companies.

- [ ] Clone Shadboard full-kit, strip unused apps
- [ ] Configure Supabase (auth, database)
- [ ] Create core tables: `companies`, `applications`, `application_documents`
- [ ] Kanban board for application stages (Applied, Interview, Offer, Rejected, Done)
- [ ] Overview dashboard with stat cards and basic charts
- [ ] Manual "New Application" and "New Company" forms
- [ ] Application detail page (timeline, notes, linked documents)
- [ ] Company detail page (profile, linked applications)

**Deliverable:** You can add companies and applications manually, track status on a Kanban board, and view stats.

---

## Phase 2: Email Integration

**Goal:** Auto-track applications via dedicated job-application email. Uses Composio MCP for Gmail (see [COMPOSIO.md](COMPOSIO.md)).

- [ ] Connect Gmail via Composio OAuth
- [ ] Email sync (polling) via Composio Gmail tools
- [ ] Inbox view: read recruiter emails in dashboard
- [ ] Reply to recruiters from dashboard (via Composio Gmail tools)
- [ ] Auto-match incoming emails to applications (by company/sender)
- [ ] Auto-status suggestions from email content (interview, offer, rejection keywords)
- [ ] Follow-up reminders (overdue, upcoming)

**Deliverable:** Connect your job email, see recruiter replies in one inbox, reply from the app, and get follow-up reminders.

---

## Phase 3: Vault Integration

**Goal:** Generated documents from the vault auto-create tracked applications.

- [ ] API endpoint: `POST /api/applications` (company, role, source, job post slug, file paths)
- [ ] Upload generated files to Supabase Storage
- [ ] Auto-create application + company record when agent generates docs
- [ ] Update CLAUDE.md agent instructions to call API after generation
- [ ] Link documents to application in dashboard

**Deliverable:** When you generate a resume/cover letter via the agent, it appears as a tracked application with attached documents.

---

## Phase 4: Company Enrichment

**Goal:** Scrape company context to personalize cover letters. No separate API; the same agent does enrichment.

- [ ] Add `company_enrichment` table (website, linkedin, news, contacts)
- [ ] Agent instruction: before generating cover letter, fetch company website (about, products)
- [ ] Agent instruction: fetch company LinkedIn page
- [ ] Agent instruction: Google search for company news (prioritize Reuters, WSJ, Bloomberg, TechCrunch)
- [ ] Store enrichment in dashboard (separate tab per company)
- [ ] Cover letter generation uses enrichment context

**Deliverable:** Agent visits company site + LinkedIn + news, stores enrichment, uses it to personalize cover letters.

---

## Phase 5: Contact Discovery

**Goal:** Find hiring manager and job poster for direct outreach.

- [ ] Add `company_contacts` table
- [ ] Agent instruction: extract "Posted by" / hiring manager from job listing
- [ ] Agent instruction: search company LinkedIn for recruiter, hiring manager, team lead
- [ ] Agent instruction: check company website Team/About for relevant contacts
- [ ] Store contacts in Company CRM (Contacts tab)
- [ ] Use contact name in cover letter when available ("Dear [Name]")
- [ ] Enable follow-up outreach to contacts directly

**Deliverable:** Each company has a Contacts tab with hiring manager, recruiter, LinkedIn URLs. Cover letters can be addressed by name.

---

## Phase 6: Job Board Ingestion

**Goal:** Pull jobs directly into the dashboard from LinkedIn and Indeed.

- [ ] Apify integration: LinkedIn Jobs Scraper, Indeed Scraper
- [ ] Dashboard UI: search params (title, location, source)
- [ ] API routes to run Apify Actors, store results in `job_listings` table
- [ ] Jobs feed / Discover view in dashboard
- [ ] "Save & generate" action: save job to vault, trigger agent, create application

**Deliverable:** Search jobs from LinkedIn/Indeed in the dashboard, save to vault, generate docs, and track in one flow.

---

## Phase 7: Polish and Extras

- [ ] Application insights (response rate, time to reply)
- [ ] Export (CSV, PDF)
- [ ] Calendar view for interview dates
- [ ] Deploy (Vercel + Supabase)

---

## Summary

| Phase | Focus | Key output |
|-------|-------|------------|
| 1 | Dashboard | Kanban, company CRM, manual tracking |
| 2 | Email | Inbox, auto-tracking, follow-ups |
| 3 | Vault | Generated docs → tracked applications |
| 4 | Enrichment | Company website, LinkedIn, news → personalized cover letters |
| 5 | Contacts | Hiring manager, recruiter → direct outreach |
| 6 | Job boards | LinkedIn/Indeed scrape → jobs feed → save & generate |
| 7 | Polish | Analytics, export, deploy |
