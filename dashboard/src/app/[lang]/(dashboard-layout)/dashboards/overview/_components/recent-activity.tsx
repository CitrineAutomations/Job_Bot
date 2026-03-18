import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { FileText } from "lucide-react"

import { DashboardCard } from "@/components/dashboards/dashboard-card"

interface Activity {
  id: string
  type: string
  title: string
  description: string
  date: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <DashboardCard title="Recent Activity" size="lg" contentClassName="pb-0">
      {activities.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No applications yet. Add one from the Applications board.
        </p>
      ) : (
        <ul className="divide-y">
          {activities.map((activity) => (
            <li key={activity.id}>
              <Link
                href={`/applications/${activity.id}`}
                className="flex items-start gap-3 px-2 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="rounded-md bg-muted p-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.date
                      ? formatDistanceToNow(new Date(activity.date), {
                          addSuffix: true,
                        })
                      : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  )
}
