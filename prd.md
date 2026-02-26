# prd.md

## Title
Local Obsidian Knowledgebase for Agent-Assisted Job Applications

## Summary
Build a local markdown knowledgebase, managed in Obsidian, that a CLI agent (Claude Code) can read to generate tailored resumes, cover letters, and Upwork proposals from a job posting. The system relies on explicit, reusable context files instead of chat memory.

## Problem
Job applications and Upwork proposals require tailored messaging. Manually rewriting resumes and cover letters wastes time and often results in generic outputs. Chat-based “memory” is opaque, inconsistent, and hard to control.

## Goals
- Convert job posts into tailored outputs quickly
- Reuse project context without re-explaining it
- Maintain a single source of truth for experience, services, proof, and writing style
- Keep data local and user-controlled
- Produce consistent outputs across sessions

## Non-goals
- Fully autonomous job applying
- Auto-submitting applications
- Replacing human review
- Heavy vector database infrastructure, embeddings are optional and not required for v1

## Users
Primary user:
- Freelancer or job seeker with multiple projects and services who needs fast tailored applications

Secondary users:
- Contractors managing multiple verticals and client work
- Agency owners responding to RFPs or proposals

## Core use cases
1. Upwork proposal generation
- Input: job post text
- Output: proposal response in a consistent template, includes relevant proof

2. Resume tailoring
- Input: job post text
- Output: resume variant emphasizing relevant projects and skills

3. Cover letter generation
- Input: job post text
- Output: cover letter aligned to role and tone guidelines

## Key concept
Local file-based retrieval:
- The “knowledgebase” is a curated Obsidian vault of markdown files
- Retrieval is driven by structure, tags/links, and keyword matching
- Generation uses retrieved files as context

## Information architecture (vault structure)
- `00-Profile/` identity, master resume, services, skills, positioning
- `01-Experience/` role and project writeups, one per project or job
- `02-Case-Studies/` formatted proof, problem, solution, tools, outcome
- `03-Templates/` proposal, resume, cover letter templates
- `04-Guidelines/` writing style, tone, rules, do not use em dashes
- `05-Job-Posts/` inputs, one per posting
- `06-Generated/` outputs, drafts, finalized versions

## Functional requirements

### FR1: Store job post
- User can paste a job post
- Agent saves it into `05-Job-Posts/` with a slug filename

### FR2: Retrieve relevant context
- Agent reads core profile docs every time
- Agent selects 2 to 6 relevant experience and case study docs based on keywords and role requirements
- If the vault uses links/backlinks, agent can follow them for additional context

### FR3: Generate tailored outputs
- Agent produces:
  - Upwork proposal, or
  - Resume, or
  - Cover letter, or
  - All three
- Outputs follow template files and style guidelines

### FR4: Traceable proof usage
- Outputs should include concrete proof points pulled from relevant project files
- Avoid unsupported claims

### FR5: Safe writing workflow
- Default behavior is draft output to `06-Generated/`
- Human can later promote and refine content back into profile or case study docs

## Optional enhancements (later)
- Obsidian CLI integration to access link graph metadata
- Automatic “idea promotion” from daily notes into case studies
- A “skills index” file auto-generated from projects
- A lightweight local search index (ripgrep) to speed retrieval
- Embedding-based retrieval only if keyword retrieval is insufficient

## Output templates
- `03-Templates/upwork-proposal-template.md`
- `03-Templates/resume-template.md`
- `03-Templates/cover-letter-template.md`

Templates define:
- structure
- max length targets
- mandatory proof sections
- final CTA and clarifying questions

## Quality bar and acceptance criteria
- Given a job post, the agent generates an Upwork proposal that:
  - references at least one relevant project file
  - includes a clear approach in steps
  - uses the writing style rules, including no em dashes
  - avoids generic filler

- Given a job post, the agent generates a resume variant that:
  - reorders and edits bullet points to match the job requirements
  - removes irrelevant experience
  - keeps tools and claims consistent with the vault

- Given a job post, the agent generates a cover letter that:
  - is role-specific
  - includes 1 to 2 proof points
  - stays under a reasonable length unless a long letter is requested

## Risks and mitigations
- Risk: Vault becomes noisy with AI generated content
  - Mitigation: keep AI drafts in `06-Generated/`, human promotes only approved content

- Risk: Privacy, sensitive info exposed in outputs
  - Mitigation: never quote private notes directly, summarize if needed

- Risk: Retrieval misses best projects
  - Mitigation: maintain consistent tags, use a “project keywords” section per project, optionally add CLI graph retrieval later

## v1 scope
- Vault structure
- Core profile docs
- Project docs and case study docs
- Keyword-based retrieval and file loading
- Generation of resume, cover letter, and Upwork proposals into `06-Generated/`

## Success metrics
- Time to first draft, under 10 minutes from paste to outputs
- Reduced repeated prompting, user rarely needs to re-explain projects
- Higher relevance, outputs mention correct tools and aligned experience