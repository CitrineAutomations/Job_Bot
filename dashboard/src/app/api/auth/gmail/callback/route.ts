import { NextResponse } from "next/server"

import { getOAuth2Client } from "@/lib/gmail"
import { supabase } from "@/lib/supabase"

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    new URL(request.url).origin.replace("/api/auth/gmail/callback", "")

  if (error || !code) {
    return NextResponse.redirect(
      `${baseUrl}/en/inbox?gmail=error&reason=${error ?? "missing_code"}`
    )
  }

  try {
    const oauth2 = getOAuth2Client()
    const { tokens } = await oauth2.getToken(code)
    const refreshToken = tokens.refresh_token

    if (!refreshToken) {
      return NextResponse.redirect(
        `${baseUrl}/en/inbox?gmail=error&reason=no_refresh_token`
      )
    }

    const { error: upsertErr } = await supabase
      .from("Settings")
      .upsert({ id: SETTINGS_ID, gmailRefreshToken: refreshToken })
    if (upsertErr) throw upsertErr

    return NextResponse.redirect(`${baseUrl}/en/inbox?gmail=connected`)
  } catch (err) {
    console.error("Gmail callback error:", err)
    return NextResponse.redirect(`${baseUrl}/en/inbox?gmail=error`)
  }
}
