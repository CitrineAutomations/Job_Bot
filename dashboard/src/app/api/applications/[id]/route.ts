import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase.from("Application").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Delete application error:", err)
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, notes } = body as { status?: string; notes?: string }

    const updates: Record<string, unknown> = {}
    if (status !== undefined) {
      updates.status = status
      updates.lastActivity = new Date().toISOString()
      // Stamp the applied date the first time an application reaches "applied".
      if (status === "applied") {
        const { data: current } = await supabase
          .from("Application")
          .select("appliedDate")
          .eq("id", id)
          .maybeSingle()
        if (current && !current.appliedDate) {
          updates.appliedDate = new Date().toISOString()
        }
      }
    }
    if (notes !== undefined) updates.notes = notes || null

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "status or notes is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("Application")
      .update(updates)
      .eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Update application error:", err)
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    )
  }
}
