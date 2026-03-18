"use client"

import Link from "next/link"
import { Draggable } from "@hello-pangea/dnd"

import type { Application } from "./applications-board"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ApplicationCardProps {
  application: Application
  index: number
}

export function ApplicationCard({ application, index }: ApplicationCardProps) {
  const companyName = application.companies?.name ?? "Unknown"
  const appliedDate = application.applied_date
    ? new Date(application.applied_date).toLocaleDateString()
    : null

  return (
    <Draggable draggableId={application.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="cursor-grab active:cursor-grabbing"
        >
          <CardContent className="p-3">
            <Link
              href={`/applications/${application.id}`}
              className="block hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-medium">{companyName}</p>
              <p className="text-sm text-muted-foreground">
                {application.role}
              </p>
            </Link>
            {appliedDate && (
              <p className="mt-1 text-xs text-muted-foreground">
                Applied {appliedDate}
              </p>
            )}
            {application.source && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {application.source}
              </Badge>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}
