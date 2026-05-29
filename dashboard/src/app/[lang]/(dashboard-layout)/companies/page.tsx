import Link from "next/link"
import { Building2 } from "lucide-react"

import type { Metadata } from "next"

import { supabase } from "@/lib/supabase"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Companies",
  description: "Companies you are tracking applications and contacts for",
}

async function getCompanies() {
  const { data } = await supabase
    .from("Company")
    .select(
      "id, name, applications:Application(status, updatedAt, appliedDate), contacts:CompanyContact(id)"
    )
    .order("name", { ascending: true })

  return (data ?? []).map((c) => {
    const applications = [...(c.applications ?? [])].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    return {
      id: c.id,
      name: c.name,
      applicationCount: c.applications?.length ?? 0,
      contactCount: c.contacts?.length ?? 0,
      latestStatus: applications[0]?.status ?? null,
      lastActivity:
        applications[0]?.updatedAt ?? applications[0]?.appliedDate ?? null,
    }
  })
}

export default async function CompaniesPage() {
  const companies = await getCompanies()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Companies</h1>
        <p className="text-muted-foreground">
          Every company you are tracking, with applications and contacts.
        </p>
      </div>

      {companies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-12 text-center">
            <Building2 className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              No companies yet. Add an application and its company appears here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {companies.map((c) => (
                <Link
                  key={c.id}
                  href={`/companies/${c.id}`}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-tight">{c.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.applicationCount}{" "}
                      {c.applicationCount === 1
                        ? "application"
                        : "applications"}
                      {c.contactCount > 0 &&
                        ` · ${c.contactCount} ${
                          c.contactCount === 1 ? "contact" : "contacts"
                        }`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {c.lastActivity && (
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {new Date(c.lastActivity).toLocaleDateString()}
                      </span>
                    )}
                    {c.latestStatus && (
                      <Badge variant="secondary">{c.latestStatus}</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
