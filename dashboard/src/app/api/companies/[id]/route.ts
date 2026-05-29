import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.company.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Delete company error:", err)
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 }
    )
  }
}
