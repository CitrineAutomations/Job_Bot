import { NextResponse } from "next/server"

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000)
}

function inferSource(url: string): string {
  if (url.includes("linkedin.com")) return "linkedin"
  if (url.includes("indeed.com")) return "indeed"
  if (url.includes("upwork.com")) return "upwork"
  if (
    url.includes("lever.co") ||
    url.includes("greenhouse.io") ||
    url.includes("workable.com")
  )
    return "direct"
  return "other"
}

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as { url: string }

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured" },
        { status: 503 }
      )
    }

    // Fetch the job page
    let pageText: string
    try {
      const pageRes = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(10000),
      })
      const html = await pageRes.text()
      pageText = htmlToText(html)
    } catch {
      return NextResponse.json(
        {
          error:
            "Failed to fetch the job URL. Check if it is publicly accessible.",
        },
        { status: 422 }
      )
    }

    const model = process.env.OPENROUTER_MODEL ?? "anthropic/claude-3-5-haiku"

    const prompt = `Extract job listing details from the following web page text and return a JSON object only, with no extra explanation.

Return this exact structure:
{
  "company": "Company name (string)",
  "role": "Job title (string)",
  "location": "Location or Remote (string, empty string if unknown)",
  "salary": "Salary range if mentioned (string, empty string if not mentioned)",
  "description": "2-3 sentence summary of the role (string)",
  "requirements": "Comma-separated list of 5-8 key requirements or skills (string)"
}

Page text:
${pageText}`

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0,
      }),
    })

    if (!aiRes.ok) {
      const err = await aiRes.text()
      console.error("OpenRouter error:", err)
      return NextResponse.json(
        { error: "AI extraction failed. Check your OPENROUTER_API_KEY." },
        { status: 502 }
      )
    }

    const aiJson = await aiRes.json()
    const content = aiJson.choices?.[0]?.message?.content ?? "{}"

    let extracted: {
      company?: string
      role?: string
      location?: string
      salary?: string
      description?: string
      requirements?: string
    }

    try {
      extracted = JSON.parse(content)
    } catch {
      return NextResponse.json(
        { error: "Failed to parse extracted job data" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      company: extracted.company ?? "",
      role: extracted.role ?? "",
      location: extracted.location ?? "",
      salary: extracted.salary ?? "",
      description: extracted.description ?? "",
      requirements: extracted.requirements ?? "",
      source: inferSource(url),
      jobPostUrl: url,
    })
  } catch (err) {
    console.error("Job ingest error:", err)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
