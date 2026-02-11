import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "ADIS Wathba - Feedback Portal",
  description:
    "Abu Dhabi Indian School, Al Wathba - Report issues, queries, and feedback. Track case status easily.",
}

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
