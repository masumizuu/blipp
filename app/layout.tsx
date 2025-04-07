import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "blipp | a messaging platform",
  description: "Ping. Chat. Repeat. Blipp is your new favorite place to talk. © 2025 Blipp — made with love & pings by Masumizuu.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/blipp.svg" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'