"use client"

import { Droppable } from "@hello-pangea/dnd"

import type { ApplicationStatus } from "./applications-board"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ApplicationColumnProps {
  id: ApplicationStatus
  title: string
  count: number
  children: React.ReactNode
}

export function ApplicationColumn({
  id,
  title,
  count,
  children,
}: ApplicationColumnProps) {
  return (
    <Card className="min-w-[280px] flex-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-medium">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-sm">
          {count}
        </span>
      </CardHeader>
      <CardContent>
        <Droppable droppableId={id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="min-h-[200px] space-y-2"
            >
              {children}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )
}
