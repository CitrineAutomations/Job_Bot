import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

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

    const contact = await prisma.companyContact.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(roleTitle !== undefined && { roleTitle: roleTitle.trim() || null }),
        ...(linkedinUrl !== undefined && {
          linkedinUrl: linkedinUrl.trim() || null,
        }),
        ...(email !== undefined && { email: email.trim() || null }),
        ...(notes !== undefined && { notes: notes.trim() || null }),
      },
    })

    return NextResponse.json(contact)
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
    await prisma.companyContact.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Delete contact error:", err)
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    )
  }
}
