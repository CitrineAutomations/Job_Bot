import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { is_read } = body as { is_read?: boolean }

    if (is_read === undefined) {
      return NextResponse.json(
        { error: "is_read is required" },
        { status: 400 }
      )
    }

    await prisma.email.update({
      where: { id },
      data: { isRead: is_read },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Update email error:", err)
    return NextResponse.json(
      { error: "Failed to update email" },
      { status: 500 }
    )
  }
}
