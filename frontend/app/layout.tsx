import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import AnimatedParticlesBg from "@/shared/components/animated-bg"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Keyword Tracker",
  description: "Real-time search analytics and trending topics dashboard",
  icons: {
    icon: [
      {
        url: "/globe.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/globe.svg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/globe.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/globe.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased relative min-h-screen`}
        suppressHydrationWarning
      >
        <AnimatedParticlesBg />
        {children}
      </body>
    </html>
  )
}
