import type { NavigationType } from "@/types"

export const navigationsData: NavigationType[] = [
  {
    title: "Job Bot",
    items: [
      {
        title: "Overview",
        href: "/dashboards/overview",
        iconName: "LayoutDashboard",
      },
      {
        title: "Applications",
        href: "/applications",
        iconName: "Briefcase",
      },
      {
        title: "Inbox",
        href: "/inbox",
        iconName: "AtSign",
      },
      {
        title: "Companies",
        href: "/dashboards/crm",
        iconName: "Building2",
      },
    ],
  },
]
