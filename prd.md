# Job Bot - Product Requirements Document

## Title

Job Bot: Local Knowledgebase, Agent-Generated Applications, and Company CRM

## Summary

A system that combines:
1. A local markdown vault as a knowledgebase for your work
2. An AI agent (in your IDE) that generates tailored resumes, cover letters, and Upwork proposals
3. Optional company enrichment (website, LinkedIn, news) and contact discovery (hiring manager, recruiter)
4. Optional dashboard: Kanban board, company CRM, email inbox, job board ingestion

The vault is the source of truth. The agent enriches companies and generates documents. The dashboard tracks applications and stores enrichment for reuse.

## Problem

Job applications require tailored messaging. Manually rewriting resumes and cover letters wastes time and often results in generic outputs. Existing tools are cloud-based, lock you into their AI, and rarely offer company-level research or contact discovery. Chat-based "memory" is opaque and inconsistent.

## Goals

- Convert job posts into tailored outputs quickly
- Personalize cover letters with real company research (like cold outreach)
- Find hiring manager and recruiter contacts for direct follow-up
- Reuse project context without re-explaining it
- Track applications and companies in one place
- Keep vault data local and user-controlled
- Use whatever AI you already have (Claude, Gemini, etc.)

## Non-goals

- Fully autonomous job applying
- Auto-submitting applications
- Replacing human review
- Requiring a separate enrichment API (agent does it)

## Users

Primary user: Freelancer or job seeker with multiple projects who needs fast, personalized applications and organized tracking.

Secondary users: Contractors managing multiple verticals, agency owners responding to RFPs.

## Full scope

### Core (Vault + Agent)
- Vault structure: profile, experience, case studies, templates, guidelines
- Agent generates: resume, cover letter, Upwork proposal
- Keyword-based retrieval from vault
- Output to `06-Generated/`

### Company enrichment
- Agent fetches: company website (about, products), company LinkedIn, news (prioritize Reuters, WSJ, Bloomberg, TechCrunch)
- Stored per company (in dashboard when available)
- Used to personalize cover letters (specific references, aligned pitch)

### Contact discovery
- Agent finds: hiring manager, job poster, recruiter from job posting, company page, LinkedIn
- Store: name, role, LinkedIn URL, source
- Use in cover letter: "Dear [Name]" when available
- Enable direct follow-up outreach

### Dashboard
- Kanban board: Applied, Interview, Offer, Rejected, Done
- Company CRM: one record per company, profile, enrichment tab, contacts tab
- Application detail: timeline, notes, linked documents
- Overview: stat cards, charts, follow-up reminders
- Inbox: read and reply to recruiter emails (Gmail API)
- Auto-tracking: incoming emails update application status
- Settings: Gmail connection, follow-up preferences

### Job board ingestion
- Apify: LinkedIn Jobs Scraper, Indeed Scraper
- Jobs feed in dashboard
- "Save & generate" flow: save job to vault, trigger agent, create application

## Information architecture

### Vault structure
- `00-Profile/` identity, master resume, services, skills
- `01-Experience/` project writeups, one per project
- `02-Case-Studies/` formatted proof
- `03-Templates/` proposal, resume, cover letter
- `04-Guidelines/` writing style, tone
- `05-Job-Posts/` inputs, one per posting
- `06-Generated/` outputs, drafts

### Database (Supabase)
- `companies` -- CRM, one per company applied to
- `company_enrichment` -- website, linkedin, news per company
- `company_contacts` -- hiring manager, recruiter per company
- `applications` -- job applications, linked to company
- `application_documents` -- resume, cover letter, proposal per application
- `emails` -- recruiter emails, linked to application
- `job_listings` -- jobs from Apify (LinkedIn, Indeed)
- `settings` -- Gmail, follow-up days, vault path

## Functional requirements

### FR1: Store job post
- User can paste a job post
- Agent saves it into `05-Job-Posts/` with a slug filename

### FR2: Retrieve relevant context
- Agent reads core profile docs every time
- Agent selects 2 to 6 relevant experience and case study docs based on keywords

### FR3: Enrich company (optional)
- Agent fetches company website, LinkedIn, news
- Prioritize high-authority news sources
- Store in dashboard when available

### FR4: Find contacts (optional)
- Agent extracts hiring manager, recruiter from job post and company research
- Store in company CRM
- Use in cover letter when available

### FR5: Generate tailored outputs
- Agent produces: Upwork proposal, resume, cover letter
- Outputs use enrichment and contact name when available
- Outputs follow template files and style guidelines

### FR6: Traceable proof usage
- Outputs include concrete proof points from project files
- Avoid unsupported claims

### FR7: Safe writing workflow
- Default: draft output to `06-Generated/`
- Human promotes approved content back into vault

### FR8: Dashboard tracking (optional)
- Manual or auto-create application when agent generates docs
- Attach generated files to application
- Kanban board, company CRM, inbox, follow-ups

## Output templates
- `03-Templates/upwork-proposal-template.md`
- `03-Templates/resume-template.md`
- `03-Templates/cover-letter-template.md`

## Quality bar

- Upwork proposal: references at least one project file, clear approach, writing style rules, no generic filler
- Resume: reorders to match job, removes irrelevant experience, consistent with vault
- Cover letter: role-specific, 1 to 2 proof points, personalized with company research, "Dear [Name]" when contact known

## Risks and mitigations

- Vault becomes noisy: keep AI drafts in `06-Generated/`, human promotes only approved content
- Privacy: never quote private notes directly, summarize if needed
- Retrieval misses projects: consistent keywords per project
- Enrichment fails: agent can skip and generate without it

## Roadmap

See [ROADMAP.md](ROADMAP.md). Priority: Dashboard first, then email, vault integration, enrichment, contacts, job boards.

## Success metrics

- Time to first draft under 10 minutes
- Reduced repeated prompting
- Cover letters mention specific company details (when enrichment used)
- Applications and companies organized in one place
