import { google } from "googleapis"

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
]

export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required")
  }
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    process.env.GOOGLE_REDIRECT_URI ??
      "http://localhost:3000/api/auth/gmail/callback"
  )
}

export function getAuthUrl() {
  const oauth2 = getOAuth2Client()
  return oauth2.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  })
}

export async function getGmailClient(refreshToken: string) {
  const oauth2 = getOAuth2Client()
  oauth2.setCredentials({ refresh_token: refreshToken })
  const gmail = google.gmail({ version: "v1", auth: oauth2 })
  return gmail
}
