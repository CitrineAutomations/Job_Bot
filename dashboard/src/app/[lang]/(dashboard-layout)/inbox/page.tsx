import type { Metadata } from "next"

import { createClient } from "@/lib/supabase"

import { InboxClient } from "./_components/inbox-client"

export const metadata: Metadata = {
  title: "Recruiter Inbox",
}

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001"

async function getEmails() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("emails")
    .select(
      "id, from_address, subject, body_text, body_html, direction, received_at, is_read, application_id, thread_id, applications(companies(name), role)"
    )
    .order("received_at", { ascending: false })
    .limit(100)

  if (error) return []
  return data ?? []
}

async function getGmailConnected() {
  const supabase = createClient()
  const { data } = await supabase
    .from("settings")
    .select("gmail_refresh_token")
    .eq("id", SETTINGS_ID)
    .single()
  return !!data?.gmail_refresh_token
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
