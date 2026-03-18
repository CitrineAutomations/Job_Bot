import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, notes } = body as { status?: string; notes?: string }

    const data: { status?: string; notes?: string | null; lastActivity?: Date } =
      {}
    if (status !== undefined) {
      data.status = status
      data.lastActivity = new Date()
    }
    if (notes !== undefined) data.notes = notes || null

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "status or notes is required" },
        { status: 400 }
      )
    }

    await prisma.application.update({
      where: { id },
      data,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Update application error:", err)
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    )
  }
}
