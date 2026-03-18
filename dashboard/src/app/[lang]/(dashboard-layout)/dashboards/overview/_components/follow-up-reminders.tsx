import Link from "next/link"
import { format, isPast } from "date-fns"
import { Calendar } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DashboardCard } from "@/components/dashboards/dashboard-card"

interface FollowUpApp {
  id: string
  role: string
  follow_up_date: string | null
  companies: { name: string } | null
}

interface FollowUpRemindersProps {
  applications: FollowUpApp[]
}

export function FollowUpReminders({ applications }: FollowUpRemindersProps) {
  return (
    <DashboardCard
      title="Follow-up Reminders"
      size="lg"
      contentClassName="pb-0"
    >
      {applications.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No follow-ups scheduled. Set follow-up dates on your applications.
        </p>
      ) : (
        <ul className="divide-y">
          {applications.map((app) => {
            const date = app.follow_up_date
              ? new Date(app.follow_up_date)
              : null
            const overdue = date ? isPast(date) : false
            const companyName = app.companies?.name ?? "Unknown"

            return (
              <li key={app.id}>
                <Link
                  href={`/applications/${app.id}`}
                  className="flex items-start gap-3 px-2 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="rounded-md bg-muted p-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{companyName}</p>
                      {overdue && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{app.role}</p>
                    {date && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {format(date, "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </DashboardCard>
  )
}
