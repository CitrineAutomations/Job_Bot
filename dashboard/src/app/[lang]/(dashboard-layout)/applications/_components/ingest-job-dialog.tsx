"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link2, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// ---- Step 1: URL input ----

const urlSchema = z.object({
  url: z.string().url("Must be a valid URL"),
})
type UrlValues = z.infer<typeof urlSchema>

// ---- Step 2: Preview/edit form ----

const previewSchema = z.object({
  company: z.string().min(1, "Required"),
  role: z.string().min(1, "Required"),
  location: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
})
type PreviewValues = z.infer<typeof previewSchema>

interface ExtractedJob extends PreviewValues {
  source: string
  jobPostUrl: string
}

interface IngestJobDialogProps {
  onSuccess: () => void
}

export function IngestJobDialog({ onSuccess }: IngestJobDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"url" | "preview">("url")
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string | null>(null)
  const [extracted, setExtracted] = useState<ExtractedJob | null>(null)
  const [saving, setSaving] = useState(false)

  const urlForm = useForm<UrlValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: { url: "" },
  })

  const previewForm = useForm<PreviewValues>({
    resolver: zodResolver(previewSchema),
    defaultValues: {
      company: "",
      role: "",
      location: "",
      salary: "",
      description: "",
      requirements: "",
    },
  })

  const handleExtract = async (values: UrlValues) => {
    setExtracting(true)
    setExtractError(null)
    try {
      const res = await fetch("/api/jobs/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: values.url }),
      })
      const data = await res.json()
      if (!res.ok) {
        setExtractError(data.error ?? "Extraction failed")
        return
      }
      setExtracted(data as ExtractedJob)
      previewForm.reset({
        company: data.company,
        role: data.role,
        location: data.location,
        salary: data.salary,
        description: data.description,
        requirements: data.requirements,
      })
      setStep("preview")
    } catch {
      setExtractError("Network error. Try again.")
    } finally {
      setExtracting(false)
    }
  }

  const handleConfirm = async (values: PreviewValues) => {
    if (!extracted) return
    setSaving(true)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: values.company,
          role: values.role,
          source: extracted.source,
          job_post_url: extracted.jobPostUrl,
          notes: [
            values.location && `Location: ${values.location}`,
            values.salary && `Salary: ${values.salary}`,
            values.description,
            values.requirements && `Requirements: ${values.requirements}`,
          ]
            .filter(Boolean)
            .join("\n\n"),
        }),
      })
      if (!res.ok) throw new Error("Failed to create")
      handleClose()
      onSuccess()
    } catch {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setStep("url")
    setExtractError(null)
    setExtracted(null)
    urlForm.reset()
    previewForm.reset()
    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link2 className="mr-2 h-4 w-4" />
          Import from URL
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        {step === "url" && (
          <>
            <DialogHeader>
              <DialogTitle>Import Job from URL</DialogTitle>
            </DialogHeader>
            <Form {...urlForm}>
              <form
                onSubmit={urlForm.handleSubmit(handleExtract)}
                className="space-y-4"
              >
                <FormField
                  control={urlForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job posting URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.linkedin.com/jobs/view/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {extractError && (
                  <p className="text-sm text-destructive">{extractError}</p>
                )}
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={extracting}>
                    {extracting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      "Extract"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {step === "preview" && (
          <>
            <DialogHeader>
              <DialogTitle>Review Extracted Details</DialogTitle>
            </DialogHeader>
            <Form {...previewForm}>
              <form
                onSubmit={previewForm.handleSubmit(handleConfirm)}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={previewForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={previewForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={previewForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Remote / City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={previewForm.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $80k–$100k" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={previewForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={previewForm.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Requirements</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("url")}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Track This Job"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
