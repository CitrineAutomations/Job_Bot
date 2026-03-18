import type { Metadata } from "next"

import { prisma } from "@/lib/db"

import { InboxClient } from "./_components/inbox-client"

export const metadata: Metadata = {
  title: "Recruiter Inbox",
}

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001"

async function getEmails() {
  const emails = await prisma.email.findMany({
    select: {
      id: true,
      fromAddress: true,
      subject: true,
      bodyText: true,
      bodyHtml: true,
      direction: true,
      receivedAt: true,
      isRead: true,
      applicationId: true,
      threadId: true,
      application: {
        select: {
          company: { select: { name: true } },
          role: true,
        },
      },
    },
    orderBy: { receivedAt: "desc" },
    take: 100,
  })
  return emails.map((e) => ({
    id: e.id,
    from_address: e.fromAddress,
    subject: e.subject,
    body_text: e.bodyText,
    body_html: e.bodyHtml,
    direction: e.direction,
    received_at: e.receivedAt?.toISOString() ?? null,
    is_read: e.isRead,
    application_id: e.applicationId,
    thread_id: e.threadId,
    applications: e.application
      ? {
          companies: { name: e.application.company.name },
          role: e.application.role,
        }
      : null,
  }))
}

async function getGmailConnected() {
  const settings = await prisma.settings.findUnique({
    where: { id: SETTINGS_ID },
    select: { gmailRefreshToken: true },
  })
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
