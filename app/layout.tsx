import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: '#ef4444',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://pomodoro-hero.vercel.app"),
  title: {
    default: "Pomodoro Hero - Best Free Focus Timer & Productivity App",
    template: "%s | Pomodoro Hero"
  },
  description: "Transform your productivity with Pomodoro Hero - The #1 free Pomodoro timer app with task tracking, focus statistics, and achievement system. Perfect for students, professionals, and remote workers.",
  keywords: [
    "pomodoro timer", "productivity app", "focus timer", "time management", 
    "study timer", "work timer", "pomodoro technique", "time blocking",
    "productivity tools", "focus app", "task management", "time tracking",
    "student productivity", "work from home", "remote work", "concentration app",
    "free pomodoro", "study method", "focus technique", "productivity hack"
  ],
  authors: [{ name: "Pomodoro Hero Team" }],
  creator: "Pomodoro Hero Team",
  other: {
    'google-adsense-account': 'ca-pub-3922114990800886'
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pomodoro-hero.vercel.app",
    title: "Pomodoro Hero - Focus Timer for Enhanced Productivity",
    description: "Boost your productivity with Pomodoro Hero - A modern, customizable Pomodoro timer that helps you stay focused and achieve more.",
    siteName: "Pomodoro Hero",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Pomodoro Hero - Focus Timer"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro Hero - Focus Timer for Enhanced Productivity",
    description: "Boost your productivity with Pomodoro Hero - A modern, customizable Pomodoro timer that helps you stay focused and achieve more.",
    images: ["/og-image.png"],
    creator: "@pomodoroHero"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code", // You'll need to add your actual verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
