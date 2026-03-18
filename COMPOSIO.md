# Composio MCP Integration

Job Bot uses [Composio](https://composio.dev) for MCP to connect external services. One OAuth flow per app, then the agent and dashboard use Composio tools.

## Connected toolkits (MVP)

| Toolkit | Use case |
|---------|----------|
| **Gmail** | Read/send recruiter emails, search, manage labels. Email tracking and inbox. |
| **Google Calendar** | Create interview events, list upcoming interviews, sync with application status. |
| **Google Drive** | Store resumes, cover letters, proposals. Central folder for generated docs. |
| **Supabase** | Dashboard data (companies, applications, enrichment). CRUD via Composio tools. |
| **LinkedIn** | Contact discovery, company page lookup. Hiring manager and recruiter search. |

## Setup

1. Add Composio MCP server in Cursor (or your IDE)
2. Connect each app via OAuth when prompted
3. Use `session.mcp.url` and `session.mcp.headers` with your MCP client

See [Composio Quickstart](https://docs.composio.dev/docs/quickstart) and [Toolkits](https://docs.composio.dev/toolkits).

## Considered but not included (for now)

These were evaluated but excluded from the MVP. Can be added later if needed.

| Toolkit | Potential use | Reason not included |
|---------|--------------|---------------------|
| Google Meet | Extract Meet links from calendar | Covered by Calendar event details |
| Google Tasks | Follow-up reminders | Dashboard has its own follow-up logic |
| Notion | Sync notes, job posts | Vault is markdown-based; Notion adds complexity |
| Slack | Recruiter messages | Less common for job applications |
| Apify | Job scraping (LinkedIn, Indeed) | Phase 6; separate integration planned |
