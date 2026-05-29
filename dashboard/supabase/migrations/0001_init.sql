-- Job Tracker schema for Supabase (Postgres)
-- Run this in the Supabase SQL Editor (or `supabase db push`).
--
-- Table and column names intentionally match the previous Prisma model names
-- (PascalCase tables, camelCase columns) so application code keeps the same
-- field shapes. Identifiers are quoted to preserve case.
--
-- Security: RLS is ENABLED on every table with NO policies. The publishable
-- (anon) key is shipped to the browser, so this denies it all access. The
-- server uses the service_role key, which bypasses RLS.

-- gen_random_uuid() is available in Postgres core on Supabase.

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- Company
-- ---------------------------------------------------------------------------
create table if not exists "Company" (
  "id"        uuid primary key default gen_random_uuid(),
  "name"      text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create trigger company_set_updated_at
  before update on "Company"
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- CompanyContact
-- ---------------------------------------------------------------------------
create table if not exists "CompanyContact" (
  "id"          uuid primary key default gen_random_uuid(),
  "name"        text not null,
  "roleTitle"   text,
  "linkedinUrl" text,
  "email"       text,
  "notes"       text,
  "companyId"   uuid not null references "Company"("id") on delete cascade,
  "createdAt"   timestamptz not null default now(),
  "updatedAt"   timestamptz not null default now()
);
create index if not exists "CompanyContact_companyId_idx" on "CompanyContact"("companyId");

create trigger contact_set_updated_at
  before update on "CompanyContact"
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Application
-- ---------------------------------------------------------------------------
create table if not exists "Application" (
  "id"           uuid primary key default gen_random_uuid(),
  "companyId"    uuid not null references "Company"("id") on delete cascade,
  "role"         text not null,
  "status"       text not null default 'applied',
  "source"       text,
  "jobPostSlug"  text,
  "jobPostUrl"   text,
  "appliedDate"  timestamptz,
  "followUpDate" timestamptz,
  "notes"        text,
  "lastActivity" timestamptz,
  "createdAt"    timestamptz not null default now(),
  "updatedAt"    timestamptz not null default now()
);
create index if not exists "Application_companyId_idx" on "Application"("companyId");
create index if not exists "Application_status_idx" on "Application"("status");

create trigger application_set_updated_at
  before update on "Application"
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- ApplicationDocument
-- ---------------------------------------------------------------------------
create table if not exists "ApplicationDocument" (
  "id"            uuid primary key default gen_random_uuid(),
  "applicationId" uuid not null references "Application"("id") on delete cascade,
  "docType"       text not null,
  "fileName"      text not null,
  "storagePath"   text,
  "contentMd"     text,
  "createdAt"     timestamptz not null default now()
);
create index if not exists "ApplicationDocument_applicationId_idx" on "ApplicationDocument"("applicationId");

-- ---------------------------------------------------------------------------
-- Task
-- ---------------------------------------------------------------------------
create table if not exists "Task" (
  "id"            uuid primary key default gen_random_uuid(),
  "title"         text not null,
  "notes"         text,
  "dueDate"       timestamptz,
  "done"          boolean not null default false,
  "completedAt"   timestamptz,
  "applicationId" uuid references "Application"("id") on delete cascade,
  "createdAt"     timestamptz not null default now(),
  "updatedAt"     timestamptz not null default now()
);
create index if not exists "Task_applicationId_idx" on "Task"("applicationId");
create index if not exists "Task_done_dueDate_idx" on "Task"("done", "dueDate");

create trigger task_set_updated_at
  before update on "Task"
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Email
-- ---------------------------------------------------------------------------
create table if not exists "Email" (
  "id"             uuid primary key default gen_random_uuid(),
  "applicationId"  uuid references "Application"("id") on delete set null,
  "gmailMessageId" text not null unique,
  "threadId"       text,
  "fromAddress"    text not null,
  "toAddress"      text,
  "subject"        text not null,
  "bodyText"       text,
  "bodyHtml"       text,
  "direction"      text not null default 'inbound',
  "receivedAt"     timestamptz,
  "isRead"         boolean not null default false,
  "createdAt"      timestamptz not null default now()
);
create index if not exists "Email_applicationId_idx" on "Email"("applicationId");

-- ---------------------------------------------------------------------------
-- Settings (single-row config; app uses a fixed id)
-- ---------------------------------------------------------------------------
create table if not exists "Settings" (
  "id"                uuid primary key default gen_random_uuid(),
  "gmailEmail"        text,
  "gmailRefreshToken" text,
  "followUpDays"      integer not null default 7,
  "vaultPath"         text,
  "updatedAt"         timestamptz not null default now()
);

create trigger settings_set_updated_at
  before update on "Settings"
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: enable on all tables, add no policies.
-- Denies the public anon key; the server's service_role key bypasses RLS.
-- ---------------------------------------------------------------------------
alter table "Company"             enable row level security;
alter table "CompanyContact"      enable row level security;
alter table "Application"         enable row level security;
alter table "ApplicationDocument" enable row level security;
alter table "Task"                enable row level security;
alter table "Email"               enable row level security;
alter table "Settings"            enable row level security;
