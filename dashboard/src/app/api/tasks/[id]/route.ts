import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, notes, dueDate, applicationId, done } = body as {
      title?: string
      notes?: string
      dueDate?: string | null
      applicationId?: string | null
      done?: boolean
    }

    if (title !== undefined && !title.trim()) {
      return NextResponse.json(
        { error: "title cannot be empty" },
        { status: 400 }
      )
    }

    const updates: Record<string, unknown> = {}
    if (title !== undefined) updates.title = title.trim()
    if (notes !== undefined) updates.notes = notes?.trim() || null
    if (dueDate !== undefined)
      updates.dueDate = dueDate ? new Date(dueDate).toISOString() : null
    if (applicationId !== undefined)
      updates.applicationId = applicationId || null
    if (done !== undefined) {
      updates.done = done
      updates.completedAt = done ? new Date().toISOString() : null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: true })
    }

    const { data, error } = await supabase
      .from("Task")
      .update(updates)
      .eq("id", id)
      .select()
      .single()
    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error("Update task error:", err)
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase.from("Task").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Delete task error:", err)
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}
