import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyId, name, roleTitle, linkedinUrl, email, notes } = body as {
      companyId: string
      name: string
      roleTitle?: string
      linkedinUrl?: string
      email?: string
      notes?: string
    }

    if (!companyId || !name) {
      return NextResponse.json(
        { error: "companyId and name are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("CompanyContact")
      .insert({
        companyId,
        name: name.trim(),
        roleTitle: roleTitle?.trim() || null,
        linkedinUrl: linkedinUrl?.trim() || null,
        email: email?.trim() || null,
        notes: notes?.trim() || null,
      })
      .select()
      .single()
    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error("Create contact error:", err)
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId query param is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("CompanyContact")
      .select("*")
      .eq("companyId", companyId)
      .order("createdAt", { ascending: true })
    if (error) throw error

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error("List contacts error:", err)
    return NextResponse.json(
      { error: "Failed to list contacts" },
      { status: 500 }
    )
  }
}
