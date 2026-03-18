# CLAUDE.md

## Project
Local markdown knowledgebase (vault) that an AI agent can use to generate:
- Tailored resume (per job)
- Tailored cover letter (per job)
- Upwork proposal responses (per posting)

Primary interface: an AI CLI agent (e.g. Claude Code, Cursor, or similar) reading files from a local vault.

## Onboarding

Complete these steps to go from zero to your first generated document.

### Step 1: Create the vault and folder structure

Create one root folder for the vault (e.g. `Vault/`). It can live inside this repo or anywhere on your machine. Inside it, create these subfolders:

- `00-Profile/` -- Who you are: identity, master resume, services, skills, positioning. Loaded on every request.
- `01-Experience/` -- One markdown file per project or role. The agent searches here by keywords from the job post to find relevant proof.
- `02-Case-Studies/` -- Deeper proof: problem, solution, tools, outcome. Optional but improves proposal and cover letter quality.
- `03-Templates/` -- Structure and format for each output type (proposal, resume, cover letter). The agent fills these in.
- `04-Guidelines/` -- Writing style, tone, and rules. Applied to every generated text.
- `05-Job-Posts/` -- Inputs: one file per job or Upwork post. The agent reads these to tailor outputs.
- `06-Generated/` -- Outputs: all drafts go here. You review and use them; do not store final applications in the vault unless you choose to.

### Step 2: Create required core files

Create the following files. They can start as stubs; content comes in Step 3.

**In `00-Profile/`:**
- `bio.md` -- Short professional summary: who you are, what you do, how you position yourself.
- `resume-master.md` -- Your full, unabridged resume: every role, project, tool, stack, and metric. This is the single source of truth; tailored resumes are subsets of this.
- `services.md` -- What you offer, typical deliverables, and what you do not do.
- `skills.md` -- Skills, technologies, and domains.

**In `04-Guidelines/`:**
- `writing-style.md` -- Rules the agent must follow: tone, sentence length, formatting (e.g. "no em dashes, use commas"), proposal length targets, and anything to avoid.

**In `03-Templates/`:**
- `upwork-proposal-template.md` -- Structure for an Upwork proposal: opening (problem understanding), proof points, approach (3 to 6 steps), CTA, 1 to 2 clarifying questions.
- `cover-letter-template.md` -- Structure for a cover letter: greeting, hook, 1 to 2 achievements, why you fit, closing.
- `resume-template.md` -- Structure for a resume: sections and how bullets should be formatted. The agent will reorder and filter content from `resume-master.md` to match each job.

All eight file names must match exactly. The agent will fail cleanly if a required file is missing.

### Step 3: Populate profile and proof

**Profile (required for any output):**
- `resume-master.md`: Add your real work history, projects, tools, and outcomes. Even 2 to 3 roles and 5 to 10 bullet points are enough to start.
- `services.md`: One short paragraph or bullet list of what you offer and what you don't.
- `writing-style.md`: At minimum: "No em dashes, use commas. Short sentences. No hype or buzzwords. Use concrete tools and outcomes." Add any personal rules.
- `bio.md` and `skills.md`: A few lines each.

**Experience (required for good proposals and tailored resumes):**
- In `01-Experience/`, create at least 2 to 4 project files. Each file = one project or major role.
- Per file include: project name, client or context, problem, solution, stack and tools, scope, results (metrics if possible), and 8 to 15 keywords that appear in job posts you target (e.g. CRM, API, automation, React, lead gen).
- Use consistent headings so the agent can parse them (e.g. Problem, Solution, Stack, Results, Keywords).

**Case studies (optional but recommended):**
- In `02-Case-Studies/`, add 1 to 3 documents with: summary, problem, constraints, implementation, result, lessons.

**Templates:**
- Open each template in `03-Templates/` and add section headers or a short outline. The agent fills them in; you can refine templates later.

### Step 4: Run the workflow once

1. Paste a real job post into `05-Job-Posts/<slug>.md`. Use a short slug (e.g. `acme-senior-dev`). Optionally add at the top: company, role, date, link, pay range.
2. Ask the agent: "Generate an Upwork proposal for the job in `05-Job-Posts/<slug>.md`" (or resume, or cover letter).
3. The agent loads your profile and guidelines, searches experience and case studies by keywords, applies the right template, and writes a draft to `06-Generated/`.
4. Open the draft, edit if needed, and use it.

After this you can repeat with new job posts and any combination of proposal, resume, and cover letter.

For a deeper walkthrough of vault setup and the full workflow, see `context.md`.

### What the workflow generates

**Upwork proposal:** A short proposal (typically 120 to 220 words) that opens with a clear understanding of the client's problem, cites 1 to 2 relevant proof points from your experience, outlines your approach in 3 to 6 steps, and ends with a CTA and clarifying questions. Saved to `06-Generated/<date>-<client>-upwork-proposal.md`.

**Tailored resume:** A resume using only content from your `resume-master.md`, reordered and filtered to match the job requirements. Irrelevant experience is dropped. Saved to `06-Generated/<date>-<company>-<role>-resume.md`.

**Tailored cover letter:** A role-specific cover letter with 1 to 2 achievements aligned to the job, following your template and writing-style rules. Saved to `06-Generated/<date>-<company>-<role>-cover-letter.md`.

All outputs are drafts. You review, edit, then submit.

---

## Operating principles
- The vault is the source of truth.
- Prefer explicit files over "remembering" in chat.
- Always load context by reading files first, then write outputs.
- Do not write directly into the vault unless explicitly instructed, draft outputs to `/06-Generated/` first.
- Keep content human-authored or human-approved, avoid polluting the vault with low-quality AI text.

## Vault conventions
Paths referenced below assume a vault root called `Vault/`.

### Required directories
- `Vault/00-Profile/`
- `Vault/01-Experience/`
- `Vault/02-Case-Studies/`
- `Vault/03-Templates/`
- `Vault/04-Guidelines/`
- `Vault/05-Job-Posts/`
- `Vault/06-Generated/`

### Required core files
- `Vault/00-Profile/bio.md`
- `Vault/00-Profile/resume-master.md`
- `Vault/00-Profile/services.md`
- `Vault/00-Profile/skills.md`
- `Vault/04-Guidelines/writing-style.md`
- `Vault/03-Templates/upwork-proposal-template.md`
- `Vault/03-Templates/cover-letter-template.md`
- `Vault/03-Templates/resume-template.md`

## Default retrieval rules
When given a job post or Upwork post, retrieve in this order:

1. Identity and positioning
- `Vault/00-Profile/bio.md`
- `Vault/00-Profile/resume-master.md`
- `Vault/00-Profile/services.md`
- `Vault/00-Profile/skills.md`

2. Output constraints and style
- `Vault/04-Guidelines/writing-style.md`
- Any "things-to-avoid" or "positioning" docs if present

3. Relevant proof
- Extract tools, stacks, and role-related terms from the job post (e.g. CRM, automation, APIs, React, Python, or whatever matches your domain).
- Search `Vault/01-Experience/` and `Vault/02-Case-Studies/` for files whose keywords match.
- Pull 2 to 4 most relevant files and cite concrete outcomes from them.

4. Template
- Use the matching template in `Vault/03-Templates/` depending on requested output.

## Required behavior per request type

### A) Upwork proposal response
Output must:
- Start with a short problem understanding
- Include 1 to 2 relevant proof points (specific project, stack, result)
- Provide a clear approach in 3 to 6 steps
- End with one call to action and 1 to 2 quick clarifying questions

Length guideline:
- 120 to 220 words unless the post implies long form

### B) Resume generation
Output must:
- Produce a clean resume in plain text or markdown
- Reorder bullets to match the job requirements
- Only include projects that match the role
- Avoid irrelevant domains unless clearly beneficial

### C) Cover letter
Output must:
- Be role-specific, no generic fluff
- Mention 1 to 2 aligned achievements
- Align with tone rules in `writing-style.md`

## Style constraints
- No em dashes, use commas instead.
- Prefer short sentences.
- Avoid hype, buzzwords, and vague claims like "gamechanging".
- Use concrete tools, actions, and outcomes.

## Output locations
Draft outputs to:
- `Vault/06-Generated/<date>-<company>-<role>-resume.md`
- `Vault/06-Generated/<date>-<company>-<role>-cover-letter.md`
- `Vault/06-Generated/<date>-<client>-upwork-proposal.md`

## Safety and privacy
- Assume the vault can contain sensitive personal info.
- Never print private info unless it is necessary for the application.
- Prefer summarizing sensitive notes rather than quoting them verbatim.

## Interaction pattern
When user provides a job post:
1. Save it to `Vault/05-Job-Posts/<slug>.md`
2. Retrieve files using Default retrieval rules
3. Generate requested assets into `Vault/06-Generated/`
4. Provide final outputs in the chat, plus the file paths created

## Company enrichment (optional, before cover letter)

When generating a cover letter or proposal, enrich the company first to personalize the output. Use your available tools (browser, fetch) to gather context. No separate API required.

**Sources, in order:**
1. **Official company website** -- About, mission, products, team, culture. Visit the company URL from the job post.
2. **Company LinkedIn page** -- Company description, recent posts, employee count, industry.
3. **Google search for news** -- Search "[company name] news". Prioritize high-authority sources (Reuters, WSJ, Bloomberg, TechCrunch, industry trade press). Avoid gossip, Twitter, forums.

**Use enrichment to:**
- Open with a specific reference to the company (product, mission, recent news)
- Align your pitch to their stated goals or culture
- Avoid generic "I'm excited about this opportunity" filler

If the dashboard is running and has stored enrichment for this company, you can load it from there. Otherwise, fetch it in this session and summarize for the user.

## Contact discovery (optional)

When possible, find the hiring manager or job poster for personalization and follow-up.

**Where to look:**
- Job posting: "Posted by", "Hiring manager", recruiter name
- Company LinkedIn: People, leadership, recruiters
- Company website: Team, About

**Store:** Name, role/title, LinkedIn URL, source. If the dashboard is running, add to the company's Contacts. Otherwise, include in your summary.

**Use in cover letter:** When you have a name, address the letter to them ("Dear [Name]") instead of "Dear Hiring Manager".

## Dashboard integration (when available)

If the Job Bot dashboard is running, after generating documents call the tracking API to create a tracked application:

**Endpoint:** `POST <dashboard_url>/api/applications`

**Body (JSON):**
```json
{
  "company": "Company Name",
  "role": "Job Title",
  "source": "upwork",
  "job_post_slug": "acme-senior-dev",
  "job_post_url": "https://...",
  "documents": [
    {
      "type": "resume",
      "file_name": "2025-02-25-acme-senior-dev-resume.md",
      "content": "<full file content>"
    },
    {
      "type": "cover_letter",
      "file_name": "2025-02-25-acme-senior-dev-cover-letter.md",
      "content": "<full file content>"
    }
  ]
}
```

- `company` and `role` are required. `source` can be upwork, linkedin, indeed, direct, or other.
- `documents`: For each generated file, read its content and include `type` (resume, cover_letter, or proposal), `file_name`, and `content`.
- This creates a tracked application on the Kanban board with attached documents.
- Enrichment and contacts can be stored in the company's CRM for reuse across applications.

## Quality checks before finalizing
- Does each claim have a supporting project or experience file?
- Does the proposal address the specific requirements in the post?
- Are tools and stacks consistent with the vault?
- Is tone aligned with `writing-style.md`?
- No em dashes
