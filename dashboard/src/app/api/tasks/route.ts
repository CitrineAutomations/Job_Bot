import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get("applicationId")

    let query = supabase
      .from("Task")
      .select("*, application:Application(role, company:Company(name))")
      .order("done", { ascending: true })
      .order("dueDate", { ascending: true, nullsFirst: false })
      .order("createdAt", { ascending: true })

    if (applicationId) query = query.eq("applicationId", applicationId)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error("List tasks error:", err)
    return NextResponse.json({ error: "Failed to list tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, dueDate, notes, applicationId } = body as {
      title: string
      dueDate?: string | null
      notes?: string
      applicationId?: string | null
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("Task")
      .insert({
        title: title.trim(),
        notes: notes?.trim() || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        applicationId: applicationId || null,
      })
      .select()
      .single()
    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error("Create task error:", err)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}
