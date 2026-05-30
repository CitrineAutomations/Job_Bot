import { JetBrains_Mono } from "next/font/google"

import { cn } from "@/lib/utils"

import "../globals.css"

import { Providers } from "@/providers"

import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: {
    template: "%s | Shadboard",
    default: "Shadboard",
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "[&:lang(en)]:font-jetbrains-mono",
          "bg-background text-foreground antialiased overscroll-none",
          jetbrainsMonoFont.variable
        )}
      >
        <Providers locale="en" direction="ltr">
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
