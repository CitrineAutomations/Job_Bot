import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get("applicationId")

    const tasks = await prisma.task.findMany({
      where: applicationId ? { applicationId } : undefined,
      include: {
        application: {
          select: { role: true, company: { select: { name: true } } },
        },
      },
      orderBy: [
        { done: "asc" },
        { dueDate: { sort: "asc", nulls: "last" } },
        { createdAt: "asc" },
      ],
    })

    return NextResponse.json(tasks)
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

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        notes: notes?.trim() || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        applicationId: applicationId || null,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (err) {
    console.error("Create task error:", err)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}
