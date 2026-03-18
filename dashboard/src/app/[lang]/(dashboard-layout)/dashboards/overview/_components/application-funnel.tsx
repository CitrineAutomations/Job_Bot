"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsRtl } from "@/hooks/use-is-rtl"
import { ChartContainer } from "@/components/ui/chart"
import { DashboardCard } from "@/components/dashboards/dashboard-card"

interface FunnelStep {
  name: string
  value: number
}

interface ApplicationFunnelProps {
  funnelSteps: FunnelStep[]
}

function FunnelList({ data }: { data: FunnelStep[] }) {
  return (
    <ul
      style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}
      className="flex w-full flex-wrap gap-x-4 gap-y-2 px-6 sm:flex-nowrap sm:grid"
    >
      {data.map((stage) => (
        <li key={stage.name} className="flex flex-col items-center text-center">
          <p className="text-xl font-semibold sm:text-2xl">
            {stage.value.toLocaleString()}
          </p>
          <h3 className="text-sm text-muted-foreground">{stage.name}</h3>
        </li>
      ))}
    </ul>
  )
}

export function ApplicationFunnel({ funnelSteps }: ApplicationFunnelProps) {
  const isRtl = useIsRtl()

  return (
    <DashboardCard
      title="Application Funnel"
      period="By stage"
      className="overflow-hidden"
      contentClassName="p-0"
      size="sm"
    >
      <FunnelList data={funnelSteps} />
      <ChartContainer config={{}} className="aspect-video h-40 w-full">
        <AreaChart
          accessibilityLayer
          data={funnelSteps}
          margin={{ left: 0, right: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis reversed={isRtl} dataKey="name" hide />
          <Area
            dataKey="value"
            type="bump"
            activeDot={false}
            fill="hsl(var(--chart-2))"
            fillOpacity={0.4}
            stroke="hsl(var(--chart-2))"
          />
        </AreaChart>
      </ChartContainer>
    </DashboardCard>
  )
}
