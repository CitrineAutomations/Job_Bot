"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ApplicationDetailClientProps {
  applicationId: string
  initialNotes: string | null
}

export function ApplicationDetailClient({
  applicationId,
  initialNotes,
}: ApplicationDetailClientProps) {
  const [notes, setNotes] = useState(initialNotes ?? "")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    })
    setSaving(false)
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes..."
        className="min-h-[120px]"
      />
      <Button size="sm" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save notes"}
      </Button>
    </div>
  )
}
