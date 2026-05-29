import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, roleTitle, linkedinUrl, email, notes } = body as {
      name?: string
      roleTitle?: string
      linkedinUrl?: string
      email?: string
      notes?: string
    }

    const updates: Record<string, unknown> = {}
    if (name !== undefined) updates.name = name.trim()
    if (roleTitle !== undefined) updates.roleTitle = roleTitle.trim() || null
    if (linkedinUrl !== undefined)
      updates.linkedinUrl = linkedinUrl.trim() || null
    if (email !== undefined) updates.email = email.trim() || null
    if (notes !== undefined) updates.notes = notes.trim() || null

    const { data, error } = await supabase
      .from("CompanyContact")
      .update(updates)
      .eq("id", id)
      .select()
      .single()
    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error("Update contact error:", err)
    return NextResponse.json(
      { error: "Failed to update contact" },
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
    const { error } = await supabase
      .from("CompanyContact")
      .delete()
      .eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Delete contact error:", err)
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    )
  }
}
