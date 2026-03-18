-- Job Bot: Full Supabase schema
-- Run this migration to create all tables for the complete project scope.
-- Phases 1-6 are supported; tables for later phases can be created but left unused until implemented.

-- =============================================================================
-- COMPANIES (CRM)
-- One record per company you apply to. Central entity for enrichment and contacts.
-- =============================================================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website_url TEXT,
  linkedin_url TEXT,
  industry TEXT,
  size TEXT,
  location TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- COMPANY ENRICHMENT
-- Scraped/gathered context: website, LinkedIn, news. Used to personalize cover letters.
-- =============================================================================
CREATE TABLE IF NOT EXISTS company_enrichment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  source TEXT NOT NULL, -- 'website', 'linkedin', 'news'
  content_json JSONB, -- structured content from that source
  raw_text TEXT,
  source_url TEXT,
  source_rank INTEGER, -- for news: 1=high authority (Reuters, WSJ), 2=medium, 3=lower
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, source)
);

CREATE INDEX idx_company_enrichment_company ON company_enrichment(company_id);

-- =============================================================================
-- COMPANY CONTACTS
-- Hiring manager, recruiter, job poster. For direct outreach.
-- =============================================================================
CREATE TABLE IF NOT EXISTS company_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role_title TEXT,
  linkedin_url TEXT,
  email TEXT,
  source TEXT, -- 'job_posting', 'company_page', 'linkedin_search'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_contacts_company ON company_contacts(company_id);

-- =============================================================================
-- APPLICATIONS
-- Individual job applications. Linked to a company.
-- =============================================================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied', -- applied, interview, offer, rejected, done
  source TEXT, -- linkedin, indeed, upwork, direct, other
  job_post_url TEXT,
  job_post_slug TEXT, -- matches 05-Job-Posts/<slug>.md
  salary_range TEXT,
  notes TEXT,
  applied_date TIMESTAMPTZ,
  follow_up_date TIMESTAMPTZ,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_applications_company ON applications(company_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_follow_up ON applications(follow_up_date);

-- =============================================================================
-- APPLICATION DOCUMENTS
-- Generated resume, cover letter, proposal. Linked to application.
-- =============================================================================
CREATE TABLE IF NOT EXISTS application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- resume, cover_letter, proposal
  file_name TEXT,
  storage_path TEXT, -- Supabase Storage path
  content_md TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_application_documents_app ON application_documents(application_id);

-- =============================================================================
-- EMAILS
-- Recruiter emails. Linked to application when matched.
-- =============================================================================
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  gmail_message_id TEXT UNIQUE,
  thread_id TEXT,
  from_address TEXT,
  to_address TEXT,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  direction TEXT NOT NULL, -- inbound, outbound
  received_at TIMESTAMPTZ,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emails_application ON emails(application_id);
CREATE INDEX idx_emails_received ON emails(received_at);

-- =============================================================================
-- JOB LISTINGS (Phase 6: Apify ingestion)
-- Jobs pulled from LinkedIn/Indeed before you apply.
-- =============================================================================
CREATE TABLE IF NOT EXISTS job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- linkedin, indeed
  external_id TEXT,
  title TEXT NOT NULL,
  company_name TEXT,
  company_url TEXT,
  job_url TEXT NOT NULL,
  location TEXT,
  description_text TEXT,
  salary_text TEXT,
  posted_at TIMESTAMPTZ,
  raw_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source, external_id)
);

CREATE INDEX idx_job_listings_source ON job_listings(source);
CREATE INDEX idx_job_listings_company ON job_listings(company_name);

-- =============================================================================
-- SETTINGS
-- Single-user config: email connection, preferences.
-- =============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gmail_email TEXT,
  gmail_refresh_token TEXT,
  follow_up_days INTEGER DEFAULT 7,
  vault_path TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row (run once)
INSERT INTO settings (id, follow_up_days) 
VALUES ('00000000-0000-0000-0000-000000000001', 7)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- STORAGE BUCKET (create via Supabase Dashboard or API)
-- Bucket: application-docs
-- Path pattern: {application_id}/{doc_type}-{timestamp}.md
-- =============================================================================
-- Run in Supabase SQL or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('application-docs', 'application-docs', false);
