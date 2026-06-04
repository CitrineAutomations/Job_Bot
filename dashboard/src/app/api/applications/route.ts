import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      company,
      role,
      status,
      source = "other",
      job_post_slug,
      job_post_url,
      documents = [],
    } = body as {
      company: string
      role: string
      status?: string
      source?: string
      job_post_slug?: string
      job_post_url?: string
      documents?: Array<{
        type: "resume" | "cover_letter" | "proposal"
        file_name: string
        content: string
      }>
    }

    const VALID_STATUSES = [
      "saved",
      "applied",
      "interview",
      "offer",
      "rejected",
      "done",
    ]
    const resolvedStatus =
      status && VALID_STATUSES.includes(status) ? status : "saved"

    if (!company || !role) {
      return NextResponse.json(
        { error: "company and role are required" },
        { status: 400 }
      )
    }

    const { data: existingCompany, error: findErr } = await supabase
      .from("Company")
      .select("id")
      .eq("name", company.trim())
      .limit(1)
      .maybeSingle()
    if (findErr) throw findErr

    let companyId = existingCompany?.id

    if (!companyId) {
      const { data: created, error: createErr } = await supabase
        .from("Company")
        .insert({ name: company.trim() })
        .select("id")
        .single()
      if (createErr) throw createErr
      companyId = created!.id
    }

    const appliedDate = new Date().toISOString()
    const { data: app, error: appErr } = await supabase
      .from("Application")
      .insert({
        companyId: companyId,
        role: role.trim(),
        status: resolvedStatus,
        source: source || null,
        jobPostSlug: job_post_slug || null,
        jobPostUrl: job_post_url || null,
        appliedDate,
      })
      .select("id")
      .single()
    if (appErr) throw appErr

    const docRows = documents
      .filter((doc) => {
        if (!doc.type || !doc.file_name || doc.content == null) return false
        return (
          doc.type === "resume" ||
          doc.type === "cover_letter" ||
          doc.type === "proposal"
        )
      })
      .map((doc) => ({
        applicationId: app.id,
        docType: doc.type,
        fileName: doc.file_name,
        contentMd: doc.content,
      }))

    if (docRows.length > 0) {
      const { error: docErr } = await supabase
        .from("ApplicationDocument")
        .insert(docRows)
      if (docErr) throw docErr
    }

    return NextResponse.json({
      id: app.id,
      company_id: companyId,
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
    const { data, error } = await supabase
      .from("Application")
      .select("*, company:Company(name)")
      .order("appliedDate", { ascending: false })
    if (error) throw error

    const mapped = (data ?? []).map((a) => ({
      id: a.id,
      company_id: a.companyId,
      role: a.role,
      status: a.status,
      source: a.source,
      job_post_url: a.jobPostUrl,
      applied_date: a.appliedDate ?? null,
      follow_up_date: a.followUpDate ?? null,
      notes: a.notes,
      companies: { name: a.company?.name ?? "" },
    }))
    return NextResponse.json(mapped)
  } catch (err) {
    console.error("List applications error:", err)
    return NextResponse.json(
      { error: "Failed to list applications" },
      { status: 500 }
    )
  }
}
