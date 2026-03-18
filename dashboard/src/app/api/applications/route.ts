import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      company,
      role,
      source = "other",
      job_post_slug,
      job_post_url,
      documents = [],
    } = body as {
      company: string
      role: string
      source?: string
      job_post_slug?: string
      job_post_url?: string
      documents?: Array<{
        type: "resume" | "cover_letter" | "proposal"
        file_name: string
        content: string
      }>
    }

    if (!company || !role) {
      return NextResponse.json(
        { error: "company and role are required" },
        { status: 400 }
      )
    }

    let companyRecord = await prisma.company.findFirst({
      where: { name: { equals: company.trim(), mode: "insensitive" } },
    })

    if (!companyRecord) {
      companyRecord = await prisma.company.create({
        data: { name: company.trim() },
      })
    }

    const appliedDate = new Date()
    const app = await prisma.application.create({
      data: {
        companyId: companyRecord.id,
        role: role.trim(),
        status: "applied",
        source: source || null,
        jobPostSlug: job_post_slug || null,
        jobPostUrl: job_post_url || null,
        appliedDate,
      },
    })

    for (const doc of documents) {
      if (!doc.type || !doc.file_name || doc.content == null) continue
      const validType =
        doc.type === "resume" ||
        doc.type === "cover_letter" ||
        doc.type === "proposal"
      if (!validType) continue

      await prisma.applicationDocument.create({
        data: {
          applicationId: app.id,
          docType: doc.type,
          fileName: doc.file_name,
          contentMd: doc.content,
        },
      })
    }

    return NextResponse.json({
      id: app.id,
      company_id: companyRecord.id,
      message: "Application created",
    })
  } catch (err) {
    console.error("Create application error:", err)
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: { company: { select: { name: true } } },
      orderBy: { appliedDate: "desc" },
    })
    const data = applications.map((a) => ({
      id: a.id,
      company_id: a.companyId,
      role: a.role,
      status: a.status,
      source: a.source,
      job_post_url: a.jobPostUrl,
      applied_date: a.appliedDate?.toISOString() ?? null,
      follow_up_date: a.followUpDate?.toISOString() ?? null,
      notes: a.notes,
      companies: { name: a.company.name },
    }))
    return NextResponse.json(data)
  } catch (err) {
    console.error("List applications error:", err)
    return NextResponse.json(
      { error: "Failed to list applications" },
      { status: 500 }
    )
  }
}
