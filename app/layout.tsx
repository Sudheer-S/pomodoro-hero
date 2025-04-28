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
  metadataBase: new URL("https://pomodoro-clock-hero.vercel.app"),
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
    'google-adsense-account': 'AQ3iiUzzJwNzXMgKRANMbAB4aeSjfyZciHmR1bYLqhY'
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pomodoro-clock-hero.vercel.app",
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
    google: "Cu1t59ZR1meWcXiSLx-ehUR95h9bnC31fqm7dIehS5o", // You'll need to add your actual verification code
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
          {/* 1. First render the actual app content */}
          {children}

          {/* 2. Then show the paragraph BELOW the timer */}
          <section className="max-w-3xl mx-auto mt-10 mb-10 px-2 text-center">
            <h2 className="text-2xl font-bold mb-4">Pomodoro Clock Hero - Boost Your Productivity</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Pomodoro Clock Hero is a simple and powerful tool designed to help you stay focused and manage your time effectively. 
              Using the Pomodoro Technique, you can work in focused sessions and take short breaks to maximize productivity and avoid burnout. 
              Start a session, track your time, and take control of your workflow — one Pomodoro at a time!
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Learn more about the{" "}
              <a
                href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 dark:text-red-400 underline"
              >
                Pomodoro Technique
              </a>.
            </p>
          </section>
        </ThemeProvider>
      </body>
    </html>
  )
}
