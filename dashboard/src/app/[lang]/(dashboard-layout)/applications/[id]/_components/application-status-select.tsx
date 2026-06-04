"use client"

import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STAGES = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "done", label: "Done" },
] as const

interface ApplicationStatusSelectProps {
  applicationId: string
  initialStatus: string
}

export function ApplicationStatusSelect({
  applicationId,
  initialStatus,
}: ApplicationStatusSelectProps) {
  const [status, setStatus] = useState(initialStatus)
  const [saving, setSaving] = useState(false)

  const handleChange = async (newStatus: string) => {
    const previous = status
    setStatus(newStatus)
    setSaving(true)

    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    setSaving(false)
    if (!res.ok) setStatus(previous)
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={saving}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STAGES.map((stage) => (
          <SelectItem key={stage.value} value={stage.value}>
            {stage.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
