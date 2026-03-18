"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { Mail, Search } from "lucide-react"


import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface InboxEmail {
  id: string
  from_address: string | null
  subject: string | null
  body_text: string | null
  body_html: string | null
  direction: string
  received_at: string | null
  is_read: boolean
  application_id: string | null
  thread_id?: string | null
  applications?: {
    companies?: { name: string } | { name: string }[] | null
    role?: string | null
  } | null
}

function getCompanyName(app: InboxEmail["applications"]): string | null {
  const companies = app?.companies
  if (!companies) return null
  if (Array.isArray(companies)) return companies[0]?.name ?? null
  return companies.name ?? null
}

interface InboxClientProps {
  initialEmails: InboxEmail[] | Record<string, unknown>[]
  gmailConnected?: boolean
}

export function InboxClient({
  initialEmails,
  gmailConnected = false,
}: InboxClientProps) {
  const [emails, setEmails] = useState<InboxEmail[]>(
    initialEmails as InboxEmail[]
  )
  const [selectedEmail, setSelectedEmail] = useState<InboxEmail | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [replyBody, setReplyBody] = useState("")
  const [sending, setSending] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const filteredEmails = searchTerm
    ? emails.filter(
        (e) =>
          (e.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false) ||
          (e.from_address?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false)
      )
    : emails

  const handleSelectEmail = async (email: InboxEmail) => {
    setSelectedEmail(email)
    setReplyBody("")
    if (!email.is_read) {
      await fetch(`/api/emails/${email.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      })
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, is_read: true } : e))
      )
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch("/api/emails/sync", { method: "POST" })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast.success(`Synced ${data.synced ?? 0} emails`)
        window.location.reload()
      } else {
        toast.error(data.error ?? "Failed to sync")
      }
    } catch {
      toast.error("Failed to sync")
    } finally {
      setSyncing(false)
    }
  }

  const handleConnectGmail = async () => {
    try {
      const res = await fetch("/api/auth/gmail/connect")
      const data = await res.json().catch(() => ({}))
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        toast.error(data.error ?? "Failed to get connection link")
      }
    } catch {
      toast.error("Failed to connect")
    }
  }

  const handleSendReply = async () => {
    if (!selectedEmail || !replyBody.trim()) return
    setSending(true)
    try {
      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailId: selectedEmail.id,
          body: replyBody.trim(),
          threadId: selectedEmail.thread_id,
          toAddress: selectedEmail.from_address,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setReplyBody("")
        toast.success("Reply sent")
      } else {
        toast.error(data.error ?? "Failed to send reply")
      }
    } catch {
      toast.error("Failed to send reply")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-4">
      <div className="flex w-80 flex-shrink-0 flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Card className="flex flex-1 flex-col overflow-hidden">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Recruiter Inbox</h2>
                <p className="text-sm text-muted-foreground">
                  {emails.length} email{emails.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                {gmailConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSync}
                    disabled={syncing}
                  >
                    {syncing ? "Syncing..." : "Sync"}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleConnectGmail}
                  >
                    Connect Gmail
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
                  <Mail className="h-12 w-12" />
                  <p className="text-sm">
                    {searchTerm
                      ? "No emails match your search."
                      : "No emails yet."}
                  </p>
                  <p className="text-xs">
                    Connect Gmail in Settings to sync emails.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredEmails.map((email) => (
                    <button
                      key={email.id}
                      type="button"
                      onClick={() => handleSelectEmail(email)}
                      className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                        selectedEmail?.id === email.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">
                          {email.from_address ?? "Unknown"}
                        </span>
                        {!email.is_read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {email.subject ?? "(No subject)"}
                      </p>
                      {getCompanyName(email.applications) && (
                        <Badge variant="secondary" className="w-fit text-xs">
                          {getCompanyName(email.applications)}
                        </Badge>
                      )}
                      {email.received_at && (
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(email.received_at), {
                            addSuffix: true,
                          })}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="min-w-0 flex-1">
        <Card className="flex h-full flex-col overflow-hidden">
          {selectedEmail ? (
            <>
              <CardHeader className="flex-shrink-0 border-b">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{selectedEmail.from_address}</p>
                    <p className="text-lg font-semibold">
                      {selectedEmail.subject ?? "(No subject)"}
                    </p>
                    {selectedEmail.applications &&
                      selectedEmail.application_id &&
                      getCompanyName(selectedEmail.applications) && (
                        <div className="mt-2 flex gap-2">
                          <Link
                            href={`/applications/${selectedEmail.application_id}`}
                            className="text-sm text-primary hover:underline"
                          >
                            View application:{" "}
                            {getCompanyName(selectedEmail.applications)} -{" "}
                            {selectedEmail.applications.role}
                          </Link>
                        </div>
                      )}
                  </div>
                  {selectedEmail.received_at && (
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(
                        new Date(selectedEmail.received_at),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
                <div className="flex-1 overflow-auto rounded-md border bg-muted/30 p-4">
                  {selectedEmail.body_html ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedEmail.body_html,
                      }}
                      className="prose prose-sm dark:prose-invert max-w-none"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {selectedEmail.body_text ?? "No content"}
                    </pre>
                  )}
                </div>
                {selectedEmail.direction === "inbound" && (
                  <div className="flex flex-shrink-0 flex-col gap-2">
                    <label className="text-sm font-medium">Reply</label>
                    <textarea
                      className="min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                      placeholder="Type your reply..."
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={sending || !replyBody.trim()}
                    >
                      {sending ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
              <Mail className="h-16 w-16" />
              <p>Select an email to read and reply</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
