import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase.from("Company").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Delete company error:", err)
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 }
    )
  }
}
