import type { Metadata } from "next"

import { TasksSection } from "@/components/tasks/tasks-section"

export const metadata: Metadata = {
  title: "Tasks",
  description: "Follow-up reminders and to-do tasks",
}

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-muted-foreground">
          Track follow-up reminders and to-dos. Link a task to an application or
          keep it standalone.
        </p>
      </div>
      <TasksSection />
    </div>
  )
}
