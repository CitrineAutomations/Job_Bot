# Job Bot

Local markdown knowledgebase and agent instructions to generate tailored resumes, cover letters, and Upwork proposals from job posts.

## How it works

You maintain a vault of markdown files (profile, experience, case studies, templates, writing guidelines). An AI CLI agent reads those files plus a job post and generates tailored application documents. No backend or database required.

```
You provide a job post
        |
        v
Agent reads your vault (profile, experience, templates, guidelines)
        |
        v
Agent generates tailored resume, cover letter, and/or proposal
        |
        v
Drafts saved to Vault/06-Generated/
```

## What you can generate

- **Upwork proposals** -- Short, proof-backed responses tailored to each posting.
- **Tailored resumes** -- Subsets of your master resume reordered to match the job.
- **Cover letters** -- Role-specific letters citing real achievements from your vault.

All outputs are drafts. You review, edit, and submit.

## What's in this repo

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Agent instructions, onboarding guide, retrieval rules, and output specs |
| `context.md` | Step-by-step vault-building and workflow guide |
| `prd.md` | Product requirements document |

The vault itself is created by you during onboarding. It is git-ignored by default since it contains personal data.

## Quick start

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

## Privacy

Your vault stays local. The `.gitignore` excludes `Vault/` so personal data is never committed. If your vault lives outside this repo, no action needed.

## License

MIT
