"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

import { FullscreenToggle } from "@/components/layout/full-screen-toggle"
import { NotificationDropdown } from "@/components/layout/notification-dropdown"
import { ToggleMobileSidebar } from "../toggle-mobile-sidebar"

export function BottomBarHeader({
  dictionary,
}: {
  dictionary: DictionaryType
}) {
  const params = useParams()
  const locale = params.lang as LocaleType

  return (
    <div className="container flex h-14 justify-between items-center gap-4">
      <ToggleMobileSidebar />
      <Link
        href={ensureLocalizedPathname("/", locale)}
        className="hidden text-foreground font-black lg:flex"
      >
        <span>Job Tracker</span>
      </Link>
      <div className="flex gap-2">
        <NotificationDropdown dictionary={dictionary} />
        <FullscreenToggle />
      </div>
    </div>
  )
}
