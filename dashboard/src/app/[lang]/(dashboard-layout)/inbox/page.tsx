import type { Metadata } from "next"

import { supabase } from "@/lib/supabase"

import { InboxClient } from "./_components/inbox-client"

export const metadata: Metadata = {
  title: "Recruiter Inbox",
}

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001"

type EmailRow = {
  id: string
  fromAddress: string
  subject: string
  bodyText: string | null
  bodyHtml: string | null
  direction: string
  receivedAt: string | null
  isRead: boolean
  applicationId: string | null
  threadId: string | null
  application: { role: string; company: { name: string } | null } | null
}

async function getEmails() {
  const { data } = await supabase
    .from("Email")
    .select(
      "id, fromAddress, subject, bodyText, bodyHtml, direction, receivedAt, isRead, applicationId, threadId, application:Application(role, company:Company(name))"
    )
    .order("receivedAt", { ascending: false })
    .limit(100)
    .returns<EmailRow[]>()

  return (data ?? []).map((e) => ({
    id: e.id,
    from_address: e.fromAddress,
    subject: e.subject,
    body_text: e.bodyText,
    body_html: e.bodyHtml,
    direction: e.direction,
    received_at: e.receivedAt ?? null,
    is_read: e.isRead,
    application_id: e.applicationId,
    thread_id: e.threadId,
    applications: e.application
      ? {
          companies: { name: e.application.company?.name ?? "" },
          role: e.application.role,
        }
      : null,
  }))
}

async function getGmailConnected() {
  const { data: settings } = await supabase
    .from("Settings")
    .select("gmailRefreshToken")
    .eq("id", SETTINGS_ID)
    .maybeSingle()
  return !!settings?.gmailRefreshToken
}

export default async function InboxPage() {
  const [emails, gmailConnected] = await Promise.all([
    getEmails(),
    getGmailConnected(),
  ])

  return (
    <section className="container flex h-full gap-4 p-4">
      <InboxClient initialEmails={emails} gmailConnected={gmailConnected} />
    </section>
  )
}
