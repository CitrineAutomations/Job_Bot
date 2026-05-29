import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

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

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(applicationId !== undefined && {
          applicationId: applicationId || null,
        }),
        ...(done !== undefined && {
          done,
          completedAt: done ? new Date() : null,
        }),
      },
    })

    return NextResponse.json(task)
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
    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Delete task error:", err)
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}
