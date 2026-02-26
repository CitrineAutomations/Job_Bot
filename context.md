# context.md

## Purpose
This file condenses the two videos into a step-by-step process for building:
1) A local Obsidian vault as a knowledgebase for your work
2) A Claude Code workflow that reads those files to generate tailored resumes, cover letters, and Upwork proposals

The core method is: write context once into files, then reuse those files in every new agent session.

---

## Part A, Build the vault (your local knowledgebase)

### Step 1, Create an Obsidian vault
- Install Obsidian
- Create a new vault called `Vault`
- Confirm it is just a folder of markdown files

### Step 2, Create the folder structure
Create these folders:

- `00-Profile/`
- `01-Experience/`
- `02-Case-Studies/`
- `03-Templates/`
- `04-Guidelines/`
- `05-Job-Posts/`
- `06-Generated/`
- Optional: `Daily/` and `Meetings/`

### Step 3, Create three “always load” files
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
- formatting rules, include “no em dashes, use commas”
- proposal length expectations
- what to avoid, generic filler, hype, vague claims

### Step 4, Create one file per project
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
- GoHighLevel, GHL, n8n, CRM migration, AI agent, scraping, Supabase, dashboards, lead gen, WordPress, SEO

### Step 5, Create case studies for your strongest proof
In `02-Case-Studies/`, create 3 to 8 high quality proof docs.

Format:
- One paragraph summary
- Problem
- Constraints
- Implementation
- Result
- What you would do again, what you would change

### Step 6, Create templates for outputs
In `03-Templates/`, create:

- `upwork-proposal-template.md`
- `resume-template.md`
- `cover-letter-template.md`

Keep them structured, so the agent can follow them.

### Step 7, Link notes in Obsidian
Use links to create relationships.

Examples:
- In a project note, link to tools and concepts:
  - `Uses [[n8n]] and [[GoHighLevel]]`
- In a case study, link to the project file:
  - `Based on [[escape-room-dashboard]]`

This is how the vault becomes more than a folder.
It becomes a relationship graph.

---

## Part B, Use Claude Code with files (the key workflow)

### Step 8, Stop re-explaining projects
Instead of long prompts, store the explanation in a file.
Then in new sessions, tell the agent to read the file.

This solves the repeated context problem.

### Step 9, Standard “load context” sequence
For any new job post, always load:

- `00-Profile/resume-master.md`
- `00-Profile/services.md`
- `00-Profile/skills.md` if you have it
- `04-Guidelines/writing-style.md`
- The job post you saved in `05-Job-Posts/`

Then retrieve 2 to 6 matching experience or case study files.

### Step 10, Save the job post as a file
When you receive a job posting or Upwork post:
- Create `05-Job-Posts/<slug>.md`
- Paste the posting in full
- Optionally add a header at the top:
  - company
  - role
  - date
  - link
  - pay range if present

### Step 11, Retrieval method (simple)
Extract keywords from the job post, then search your vault for matches.

Keywords to look for:
- tools: GHL, n8n, Zapier, Supabase, WordPress, Next.js
- tasks: migration, automations, pipelines, dashboards, scraping
- outcomes: lead gen, conversion, appointment booking, retention

Pick the 2 to 4 most relevant projects, plus 1 to 2 case studies.

### Step 12, Generate outputs
Ask Claude Code to produce requested assets:

- Upwork proposal
- Resume variant
- Cover letter

Use the templates in `03-Templates/` and the tone rules in `04-Guidelines/`.

Save drafts into:
- `06-Generated/`

---

## Part C, Add commands to speed up the workflow (from the videos)

This is the “commands” layer shown in the demos.
The idea is to turn repeated workflows into reusable commands.

### Step 13, Create a context loader command
Goal:
- In one command, preload your baseline context and recent notes.

Inputs:
- profile docs
- guidelines
- active projects
- optional: last 7 daily notes

Output:
- a short “current state” summary

### Step 14, Create a “today plan” command (optional)
Goal:
- produce priorities using calendar, tasks, messages, and recent notes
- compare actual commitments vs what you have been writing about

### Step 15, Create a “trace” command (optional)
Goal:
- track how an idea or project evolved across time
- useful for preparing interviews, writing posts, and extracting narratives

### Step 16, Create a “graduate” command (optional)
Goal:
- scan daily notes and promote good ideas into standalone notes or case studies
- keeps the vault structured, instead of everything living in daily notes

---

## Part D, Guardrails from the videos

### Step 17, Keep the vault clean
Recommended rule:
- AI drafts do not write directly into permanent notes
- AI drafts go to `06-Generated/`
- you manually promote approved content into `00-Profile/`, `01-Experience/`, `02-Case-Studies/`

Reason:
- prevents the vault from becoming AI noise
- ensures the vault reflects what you actually did and believe

### Step 18, Privacy
If your vault includes personal notes:
- create a separate work vault, or
- ensure your command only loads work folders
- never display sensitive notes in outputs

---

## Part E, End-to-end workflow for your specific goal

### Workflow, Upwork proposal
1) Paste the job post into `05-Job-Posts/<slug>.md`
2) Load baseline context files
3) Retrieve 2 to 4 matching projects and 1 to 2 case studies
4) Generate proposal using `03-Templates/upwork-proposal-template.md`
5) Save to `06-Generated/<date>-<client>-proposal.md`

### Workflow, Resume and cover letter
1) Paste the job post into `05-Job-Posts/<slug>.md`
2) Load baseline context files
3) Retrieve matching projects
4) Generate resume variant using `03-Templates/resume-template.md`
5) Generate cover letter using `03-Templates/cover-letter-template.md`
6) Save to `06-Generated/`

---

## Minimum viable setup
If you want to start fast, do only this:

- Create vault folders
- Create:
  - `00-Profile/resume-master.md`
  - `04-Guidelines/writing-style.md`
  - 5 project files in `01-Experience/`
  - 1 proposal template in `03-Templates/`
- Use Claude Code to read those files and generate proposals

Everything else can be added later.