import { NextResponse } from "next/server"

import { getGmailClient } from "@/lib/gmail"
import { supabase } from "@/lib/supabase"

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { emailId, body: replyBody, threadId, toAddress } = body

    if (!emailId || !replyBody || !toAddress) {
      return NextResponse.json(
        { error: "Missing emailId, body, or toAddress" },
        { status: 400 }
      )
    }

    const { data: settings } = await supabase
      .from("Settings")
      .select("gmailRefreshToken")
      .eq("id", SETTINGS_ID)
      .maybeSingle()

    if (!settings?.gmailRefreshToken) {
      return NextResponse.json(
        {
          error:
            "Gmail not connected. Connect your Gmail account in Settings to send replies.",
        },
        { status: 503 }
      )
    }

    if (!threadId) {
      return NextResponse.json(
        {
          error: "Cannot reply: no thread ID. Sync emails from Gmail first.",
        },
        { status: 400 }
      )
    }

    const gmail = await getGmailClient(settings.gmailRefreshToken)

    const { data: emailRow } = await supabase
      .from("Email")
      .select("subject")
      .eq("id", emailId)
      .maybeSingle()

    const subject = emailRow?.subject
      ? `Re: ${emailRow.subject.replace(/^Re:\s*/i, "")}`
      : "Re:"

    const message = [
      "Content-Type: text/plain; charset=utf-8",
      "MIME-Version: 1.0",
      `To: ${toAddress}`,
      `Subject: ${subject}`,
      "",
      replyBody,
    ].join("\n")

    const encoded = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encoded,
        threadId,
      },
    })

    const { error } = await supabase.from("Email").insert({
      gmailMessageId: `out-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      fromAddress: "",
      toAddress,
      subject,
      bodyText: replyBody,
      direction: "outbound",
      receivedAt: new Date().toISOString(),
    })
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Send email error:", err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
