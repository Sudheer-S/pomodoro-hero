import type React from "react"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Pomodoro Hero Blog | Master the Pomodoro Technique & Boost Productivity",
  description:
    "Explore actionable productivity tips, time management strategies, and Pomodoro techniques designed to help you focus better and achieve more.",
  keywords: [
    "Pomodoro Technique",
    "productivity tips",
    "time management",
    "focus strategies",
    "deep work",
    "Pomodoro Hero blog",
  ],
  verification: {
    google: 'Cu1t59ZR1meWcXiSLx-ehUR95h9bnC31fqm7dIehS5o',
  },
  openGraph: {
    title: "Pomodoro Hero Blog | Productivity, Focus & Time Mastery",
    description:
      "Level up your productivity with expert Pomodoro techniques, focus hacks, and time management tips on the Pomodoro Hero Blog.",
    url: "https://pomodorohero.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro Hero Blog | Master Focus & Productivity",
    description:
      "Discover proven strategies to stay productive, focused, and energized using the Pomodoro method and beyond.",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <main
        className="flex-1 px-4 py-10 md:py-14 lg:py-16 container mx-auto max-w-4xl"
        role="main"
        itemScope
        itemType="https://schema.org/Blog"
      >
        {children}
      </main>

      <Footer />
    </div>
  )
}
