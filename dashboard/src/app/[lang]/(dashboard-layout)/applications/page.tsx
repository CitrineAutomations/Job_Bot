import type { Metadata } from "next"

import { ApplicationsBoard } from "./_components/applications-board"

export const metadata: Metadata = {
  title: "Applications",
  description: "Track your job applications",
}

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Job Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your job applications. Drag cards to update status.
        </p>
      </div>
      <ApplicationsBoard />
    </div>
  )
}
