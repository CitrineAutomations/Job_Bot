import { Briefcase, CalendarCheck, Mail, Percent, Trophy } from "lucide-react"

import { DashboardOverviewCard } from "@/components/dashboards/dashboard-card"

interface OverviewStatsProps {
  stats: {
    total: number
    interview: number
    offer: number
    responseRate: number
    avgDaysToResponse: number
  }
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2 md:grid-cols-5">
      <DashboardOverviewCard
        data={{ value: stats.total, percentageChange: 0 }}
        title="Total Applications"
        period="All time"
        icon={Briefcase}
      />
      <DashboardOverviewCard
        data={{ value: stats.interview, percentageChange: 0 }}
        title="Interviews"
        period="Scheduled"
        icon={CalendarCheck}
      />
      <DashboardOverviewCard
        data={{ value: stats.offer, percentageChange: 0 }}
        title="Offers"
        period="Received"
        icon={Trophy}
      />
      <DashboardOverviewCard
        data={{ value: stats.responseRate / 100, percentageChange: 0 }}
        title="Response Rate"
        period="%"
        icon={Percent}
        formatStyle="percent"
      />
      <DashboardOverviewCard
        data={{ value: stats.avgDaysToResponse, percentageChange: 0 }}
        title="Avg Days to Response"
        period="Days"
        icon={Mail}
      />
    </div>
  )
}
