import Link from "next/link"
import { ArrowLeft, Briefcase } from "lucide-react"

import type { Metadata } from "next"

import { prisma } from "@/lib/db"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ContactsSection } from "@/components/contacts/contacts-section"
import { DeleteCompanyButton } from "./_components/delete-company-button"

export const metadata: Metadata = {
  title: "Company Detail",
  description: "View a company, its applications, and contacts",
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      applications: {
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          role: true,
          status: true,
          source: true,
          appliedDate: true,
        },
      },
    },
  })

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-muted-foreground">Company not found</p>
        <Button asChild variant="outline">
          <Link href="/companies">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/companies">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{company.name}</h1>
          <p className="text-muted-foreground">
            {company.applications.length}{" "}
            {company.applications.length === 1 ? "application" : "applications"}
          </p>
        </div>
        <DeleteCompanyButton
          companyId={company.id}
          applicationCount={company.applications.length}
        />
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Applications</h2>
        </CardHeader>
        <CardContent>
          {company.applications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No applications for this company yet.
              </p>
            </div>
          ) : (
            <div className="divide-y rounded-md border">
              {company.applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center justify-between gap-4 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-tight">{app.role}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.appliedDate
                        ? `Applied ${app.appliedDate.toLocaleDateString()}`
                        : "Not yet applied"}
                      {app.source && ` · ${app.source}`}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {app.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <ContactsSection companyId={company.id} />
        </CardContent>
      </Card>
    </div>
  )
}
