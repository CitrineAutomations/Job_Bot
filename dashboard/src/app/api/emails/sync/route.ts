import { NextResponse } from "next/server"

import { getGmailClient } from "@/lib/gmail"
import { prisma } from "@/lib/db"

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001"

function getHeader(
  headers: Array<{ name?: string | null; value?: string | null }> | undefined,
  name: string
): string | null {
  if (!headers) return null
  const h = headers.find((x) => x.name?.toLowerCase() === name.toLowerCase())
  return h?.value ?? null
}

function parseEmail(header: string | null): string | null {
  if (!header) return null
  const match = header.match(/<([^>]+)>/)
  return match ? match[1] : header.trim()
}

export async function POST() {
  const settings = await prisma.settings.findUnique({
    where: { id: SETTINGS_ID },
    select: { gmailRefreshToken: true },
  })

  if (!settings?.gmailRefreshToken) {
    return NextResponse.json(
      {
        error: "Gmail not connected. Connect your Gmail account first.",
      },
      { status: 503 }
    )
  }

  try {
    const gmail = await getGmailClient(settings.gmailRefreshToken)
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 50,
      labelIds: ["INBOX"],
    })

    const messages = listRes.data.messages ?? []
    let synced = 0

    for (const msg of messages) {
      const id = msg.id
      if (!id) continue

      const fullMsg = await gmail.users.messages.get({
        userId: "me",
        id,
        format: "full",
      })

      const payload = fullMsg.data.payload
      const headers = payload?.headers ?? []
      const from = parseEmail(getHeader(headers, "From"))
      const to = parseEmail(getHeader(headers, "To"))
      const subject = getHeader(headers, "Subject") ?? "(No subject)"
      const threadId = fullMsg.data.threadId ?? null

      let bodyText = ""
      let bodyHtml = ""

      const body = payload?.body
      const parts = payload?.parts ?? []

      if (body?.data) {
        bodyText = Buffer.from(body.data, "base64url").toString("utf-8")
        bodyHtml = bodyText
      } else if (parts.length > 0) {
        for (const part of parts) {
          if (part.body?.data) {
            const decoded = Buffer.from(part.body.data, "base64url").toString(
              "utf-8"
            )
            if (part.mimeType === "text/html") {
              bodyHtml = decoded
            } else {
              bodyText = decoded
            }
          }
        }
        if (!bodyHtml && bodyText) bodyHtml = bodyText
      }

      const internalDate = fullMsg.data.internalDate
      const receivedAt = internalDate
        ? new Date(parseInt(internalDate, 10))
        : null

      await prisma.email.upsert({
        where: { gmailMessageId: id },
        create: {
          gmailMessageId: id,
          threadId,
          fromAddress: from ?? "",
          toAddress: to,
          subject,
          bodyText: bodyText || null,
          bodyHtml: bodyHtml || null,
          direction: "inbound",
          receivedAt,
        },
        update: {
          threadId,
          fromAddress: from ?? "",
          toAddress: to,
          subject,
          bodyText: bodyText || null,
          bodyHtml: bodyHtml || null,
          receivedAt,
        },
      })
      synced++
    }

    return NextResponse.json({
      synced,
      total: messages.length,
    })
  } catch (err) {
    console.error("Email sync error:", err)
    return NextResponse.json(
      { error: "Failed to sync emails" },
      { status: 500 }
    )
  }
}
