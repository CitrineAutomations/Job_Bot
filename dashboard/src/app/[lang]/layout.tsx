import { Cairo, JetBrains_Mono } from "next/font/google"

import { i18n } from "@/configs/i18n"
import { cn } from "@/lib/utils"

import "../globals.css"

import { Providers } from "@/providers"

import type { LocaleType } from "@/types"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: {
    template: "%s | Job Bot",
    default: "Job Bot",
  },
  description: "",
  metadataBase: new URL(process.env.BASE_URL || "http://localhost:3000"),
}

const jetbrainsMonoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-jetbrains-mono",
})
const cairoFont = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-cairo",
})

export default async function RootLayout(props: {
  children: ReactNode
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const { children } = props
  const direction = i18n.localeDirection[params.lang]

  return (
    <html lang={params.lang} dir={direction} suppressHydrationWarning>
      <body
        className={cn(
          "[&:lang(en)]:font-jetbrains-mono [&:lang(ar)]:font-cairo",
          "bg-background text-foreground antialiased overscroll-none",
          jetbrainsMonoFont.variable,
          cairoFont.variable
        )}
      >
        <Providers locale={params.lang} direction={direction}>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
