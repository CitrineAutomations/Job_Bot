import { NextResponse } from "next/server"

import { getAuthUrl } from "@/lib/gmail"

export async function GET() {
  try {
    const authUrl = getAuthUrl()
    return NextResponse.json({ redirectUrl: authUrl })
  } catch (err) {
    console.error("Gmail connect error:", err)
    return NextResponse.json(
      {
        error:
          "Gmail OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
      },
      { status: 503 }
    )
  }
}
