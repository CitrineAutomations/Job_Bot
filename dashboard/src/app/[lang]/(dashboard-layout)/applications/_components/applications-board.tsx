"use client"

import { useEffect, useState } from "react"
import { DragDropContext } from "@hello-pangea/dnd"

import type { DropResult } from "@hello-pangea/dnd"

import { ApplicationCard } from "./application-card"
import { ApplicationColumn } from "./application-column"
import { IngestJobDialog } from "./ingest-job-dialog"
import { NewApplicationDialog } from "./new-application-dialog"

const COLUMNS = [
  { id: "saved", title: "Saved" },
  { id: "applied", title: "Applied" },
  { id: "interview", title: "Interview" },
  { id: "offer", title: "Offer" },
  { id: "rejected", title: "Rejected" },
  { id: "done", title: "Done" },
] as const

export type ApplicationStatus = (typeof COLUMNS)[number]["id"]

export interface Application {
  id: string
  company_id: string
  role: string
  status: string
  source: string | null
  job_post_url: string | null
  applied_date: string | null
  follow_up_date: string | null
  notes: string | null
  companies: { name: string } | null
}

export function ApplicationsBoard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications")
      if (!res.ok) {
        setApplications([])
        return
      }
      const data = await res.json()
      setApplications(data || [])
    } catch {
      setApplications([])
    }
  }

  useEffect(() => {
    fetchApplications().finally(() => setLoading(false))
  }, [])

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const applicationId = result.draggableId
    const newStatus = destination.droppableId as ApplicationStatus

    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    )

    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    if (!res.ok) fetchApplications()
  }

  const getApplicationsByStatus = (status: string) =>
    applications.filter((app) => app.status === status)

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading applications...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <IngestJobDialog onSuccess={fetchApplications} />
        <NewApplicationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={fetchApplications}
        />
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <ApplicationColumn
              key={col.id}
              id={col.id}
              title={col.title}
              count={getApplicationsByStatus(col.id).length}
            >
              {getApplicationsByStatus(col.id).map((app, index) => (
                <ApplicationCard key={app.id} application={app} index={index} />
              ))}
            </ApplicationColumn>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
