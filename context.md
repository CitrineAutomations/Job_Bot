# context.md

## Purpose

This file describes the full Job Bot system:
1. A local Obsidian vault as a knowledgebase for your work
2. An AI agent workflow that reads those files to generate tailored resumes, cover letters, and Upwork proposals
3. Optional: a dashboard to track applications, manage a company CRM, and store enrichment

The core method: write context once into files, then reuse those files in every new agent session.

---

## Part A: Build the vault (your local knowledgebase)

### Step 1: Create an Obsidian vault
- Install Obsidian
- Create a new vault called `Vault`
- Confirm it is just a folder of markdown files

### Step 2: Create the folder structure
Create these folders:

- `00-Profile/`
- `01-Experience/`
- `02-Case-Studies/`
- `03-Templates/`
- `04-Guidelines/`
- `05-Job-Posts/`
- `06-Generated/`
- Optional: `Daily/` and `Meetings/`

### Step 3: Create three "always load" files
These are the baseline context you want the agent to know every time.

1) `00-Profile/resume-master.md`
- full work history
- all projects
- tools and stacks
- outcomes and metrics

2) `00-Profile/services.md`
- what you offer
- typical deliverables
- what you do not do

3) `04-Guidelines/writing-style.md`
- your tone rules
- formatting rules, include "no em dashes, use commas"
- proposal length expectations
- what to avoid, generic filler, hype, vague claims

### Step 4: Create one file per project
In `01-Experience/`, create a file per project.

Use a consistent template:

- Project name
- Client or internal
- Problem
- Solution
- Stack
- Scope of work
- Results, metrics, outcomes
- Keywords, 8 to 15 tags or phrases that match job posts

Example keywords:
- CRM, automation, n8n, API, React, Python, dashboards, lead gen, WordPress, SEO

### Step 5: Create case studies for your strongest proof
In `02-Case-Studies/`, create 3 to 8 high quality proof docs.

Format:
- One paragraph summary
- Problem
- Constraints
- Implementation
- Result
- What you would do again, what you would change

### Step 6: Create templates for outputs
In `03-Templates/`, create:

- `upwork-proposal-template.md`
- `resume-template.md`
- `cover-letter-template.md`

Keep them structured, so the agent can follow them.

### Step 7: Link notes in Obsidian
Use links to create relationships.

Examples:
- In a project note, link to tools and concepts
- In a case study, link to the project file

This is how the vault becomes more than a folder. It becomes a relationship graph.

---

## Part B: Use the agent with files (the key workflow)

### Step 8: Stop re-explaining projects
Instead of long prompts, store the explanation in a file.
Then in new sessions, tell the agent to read the file.

This solves the repeated context problem.

### Step 9: Standard "load context" sequence
For any new job post, always load:

- `00-Profile/resume-master.md`
- `00-Profile/services.md`
- `00-Profile/skills.md` if you have it
- `04-Guidelines/writing-style.md`
- The job post you saved in `05-Job-Posts/`

Then retrieve 2 to 6 matching experience or case study files.

### Step 10: Save the job post as a file
When you receive a job posting or Upwork post:
- Create `05-Job-Posts/<slug>.md`
- Paste the posting in full
- Optionally add a header at the top:
  - company
  - role
  - date
  - link
  - pay range if present

### Step 11: Retrieval method (simple)
Extract keywords from the job post, then search your vault for matches.

Keywords to look for:
- tools: CRM, n8n, Zapier, Supabase, WordPress, Next.js
- tasks: migration, automations, pipelines, dashboards, scraping
- outcomes: lead gen, conversion, appointment booking, retention

Pick the 2 to 4 most relevant projects, plus 1 to 2 case studies.

### Step 12: Generate outputs
Ask the agent to produce requested assets:

- Upwork proposal
- Resume variant
- Cover letter

Use the templates in `03-Templates/` and the tone rules in `04-Guidelines/`.

Save drafts into:
- `06-Generated/`

---

## Part C: Company enrichment (personalized cover letters)

Treat each job like a cold lead: research the company, personalize the outreach.

### Step 13: Enrich before cover letter
Before generating a cover letter or proposal, the agent can:

1. **Visit the company website** -- About, mission, products, team
2. **Visit the company LinkedIn page** -- Description, recent posts
3. **Google search for news** -- Prioritize Reuters, WSJ, Bloomberg, TechCrunch over gossip or social media

Use this context to open with a specific reference to the company and align your pitch.

### Step 14: Find contacts
When possible, identify:
- Hiring manager (from job posting "Posted by")
- Recruiter or job poster
- Relevant team lead (from company page)

Store name, role, LinkedIn URL. Use "Dear [Name]" in the cover letter when available.

---

## Part D: Dashboard (optional)

When the Job Bot dashboard is running:

- **Kanban board** -- Track applications by stage (Applied, Interview, Offer, Rejected, Done)
- **Company CRM** -- One record per company with profile, enrichment tab, contacts tab
- **Inbox** -- Read and reply to recruiter emails from the dashboard
- **Job boards** -- Pull jobs from LinkedIn/Indeed, save and generate in one flow

Generated documents can auto-create tracked applications with attached files.

---

## Part E: Guardrails

### Step 17: Keep the vault clean
Recommended rule:
- AI drafts do not write directly into permanent notes
- AI drafts go to `06-Generated/`
- you manually promote approved content into `00-Profile/`, `01-Experience/`, `02-Case-Studies/`

Reason:
- prevents the vault from becoming AI noise
- ensures the vault reflects what you actually did and believe

### Step 18: Privacy
If your vault includes personal notes:
- create a separate work vault, or
- ensure your command only loads work folders
- never display sensitive notes in outputs

---

## End-to-end workflow

### Upwork proposal
1) Paste the job post into `05-Job-Posts/<slug>.md`
2) Load baseline context files
3) Retrieve 2 to 4 matching projects and 1 to 2 case studies
4) Generate proposal using `03-Templates/upwork-proposal-template.md`
5) Save to `06-Generated/<date>-<client>-proposal.md`

### Resume and cover letter (with enrichment)
1) Paste the job post into `05-Job-Posts/<slug>.md`
2) Load baseline context files
3) Enrich company (website, LinkedIn, news) and find contacts
4) Retrieve matching projects
5) Generate resume variant using `03-Templates/resume-template.md`
6) Generate cover letter using `03-Templates/cover-letter-template.md` (with enrichment and contact name)
7) Save to `06-Generated/`
8) If dashboard running: create application record with attached documents

---

## Minimum viable setup

If you want to start fast, do only this:

- Create vault folders
- Create:
  - `00-Profile/resume-master.md`
  - `04-Guidelines/writing-style.md`
  - 5 project files in `01-Experience/`
  - 1 proposal template in `03-Templates/`
- Use the agent to read those files and generate proposals

Everything else can be added later.
