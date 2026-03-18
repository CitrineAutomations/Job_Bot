import type { Metadata } from "next"

import { prisma } from "@/lib/db"

import { ApplicationFunnel } from "./_components/application-funnel"
import { FollowUpReminders } from "./_components/follow-up-reminders"
import { OverviewStats } from "./_components/overview-stats"
import { RecentActivity } from "./_components/recent-activity"

export const metadata: Metadata = {
  title: "Job Search Overview",
}

async function getDashboardData() {
  const [applications, followUps] = await Promise.all([
    prisma.application.findMany({
      select: {
        id: true,
        status: true,
        role: true,
        appliedDate: true,
        lastActivity: true,
        updatedAt: true,
        company: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.application.findMany({
      where: { followUpDate: { not: null } },
      select: {
        id: true,
        role: true,
        followUpDate: true,
        company: { select: { name: true } },
      },
      orderBy: { followUpDate: "asc" },
      take: 10,
    }),
  ])

  const total = applications.length
  const applied = applications.filter((a) => a.status === "applied").length
  const interview = applications.filter((a) => a.status === "interview").length
  const offer = applications.filter((a) => a.status === "offer").length
  const rejected = applications.filter((a) => a.status === "rejected").length
  const done = applications.filter((a) => a.status === "done").length

  const responded = interview + offer + rejected + done
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0

  let avgDaysToResponse = 0
  const withResponse = applications.filter(
    (a) =>
      a.status !== "applied" &&
      a.appliedDate &&
      a.lastActivity &&
      a.lastActivity.getTime() !== a.appliedDate.getTime()
  )
  if (withResponse.length > 0) {
    const totalDays = withResponse.reduce((sum, a) => {
      const appliedTime = a.appliedDate!.getTime()
      const activityTime = a.lastActivity!.getTime()
      return sum + (activityTime - appliedTime) / (1000 * 60 * 60 * 24)
    }, 0)
    avgDaysToResponse = Math.round(totalDays / withResponse.length)
  }

  const funnelSteps = [
    { name: "Applied", value: applied },
    { name: "Interview", value: interview },
    { name: "Offer", value: offer },
    { name: "Rejected", value: rejected },
    { name: "Done", value: done },
  ]

  const recentActivity = applications.slice(0, 10).map((a) => ({
    id: a.id,
    type: "status" as const,
    title: `${a.company.name} - ${a.role}`,
    description: `Status: ${a.status}`,
    date: String(a.updatedAt ?? a.lastActivity ?? a.appliedDate ?? ""),
  }))

  const normalizedFollowUps = followUps.map((f) => ({
    id: f.id,
    role: f.role,
    follow_up_date: f.followUpDate?.toISOString() ?? null,
    companies: { name: f.company.name },
  }))

  return {
    stats: {
      total,
      interview,
      offer,
      responseRate,
      avgDaysToResponse,
    },
    funnelSteps,
    recentActivity,
    followUps: normalizedFollowUps,
  }
}

export default async function OverviewPage() {
  const data = await getDashboardData()

  return (
    <section className="container grid gap-4 p-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <h1 className="mb-2 text-2xl font-bold">Job Search Overview</h1>
        <p className="text-muted-foreground">
          Track your applications, response rates, and follow-ups.
        </p>
      </div>
      <OverviewStats stats={data.stats} />
      <div className="md:col-span-2">
        <ApplicationFunnel funnelSteps={data.funnelSteps} />
      </div>
      <RecentActivity activities={data.recentActivity} />
      <FollowUpReminders applications={data.followUps} />
    </section>
  )
}
