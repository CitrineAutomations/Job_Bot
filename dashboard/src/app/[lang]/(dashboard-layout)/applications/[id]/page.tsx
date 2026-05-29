import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import type { Metadata } from "next"

import { supabase } from "@/lib/supabase"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ApplicationDetailClient } from "./_components/application-detail-client"
import { DeleteApplicationButton } from "./_components/delete-application-button"
import { ContactsSection } from "@/components/contacts/contacts-section"
import { TasksSection } from "@/components/tasks/tasks-section"

export const metadata: Metadata = {
  title: "Application Detail",
  description: "View and edit application details",
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: application } = await supabase
    .from("Application")
    .select("*, company:Company(*)")
    .eq("id", id)
    .maybeSingle()

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-muted-foreground">Application not found</p>
        <Button asChild variant="outline">
          <Link href="/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Link>
        </Button>
      </div>
    )
  }

  const companyName = application.company.name

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/applications">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{companyName}</h1>
          <p className="text-muted-foreground">{application.role}</p>
        </div>
        <DeleteApplicationButton applicationId={application.id} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Details</h2>
              <Badge variant="secondary">{application.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Applied</p>
              <p>
                {application.appliedDate
                  ? new Date(application.appliedDate).toLocaleDateString()
                  : "—"}
              </p>
            </div>
            {application.source && (
              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <p>{application.source}</p>
              </div>
            )}
            {application.jobPostUrl && (
              <div>
                <p className="text-sm text-muted-foreground">Job Post</p>
                <a
                  href={application.jobPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  View posting
                </a>
              </div>
            )}
            {application.followUpDate && (
              <div>
                <p className="text-sm text-muted-foreground">Follow-up</p>
                <p>{new Date(application.followUpDate).toLocaleDateString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Notes</h2>
          </CardHeader>
          <CardContent>
            <ApplicationDetailClient
              applicationId={application.id}
              initialNotes={application.notes}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ContactsSection companyId={application.companyId} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <TasksSection applicationId={application.id} />
        </CardContent>
      </Card>
    </div>
  )
}
