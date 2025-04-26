import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Getting Started with Pomodoro Hero - Your Guide to Focused Productivity",
  description: "Learn how to use Pomodoro Hero to boost your productivity, manage time effectively, and achieve your goals with our simple getting started guide.",
  openGraph: {
    title: "Getting Started with Pomodoro Hero - Your Guide to Focused Productivity",
    description: "Learn how to use Pomodoro Hero to boost your productivity, manage time effectively, and achieve your goals with our simple getting started guide.",
    type: "article",
    publishedTime: "2023-04-25T00:00:00Z",
    authors: ["Pomodoro Hero Team"],
  },
}

export default function GettingStartedPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Getting Started with Pomodoro Hero - Your Guide to Focused Productivity",
    description: "Learn how to use Pomodoro Hero to boost your productivity, manage time effectively, and achieve your goals with our simple getting started guide.",
    image: "https://pomodoro-clock-hero.vercel.app/og-image.png",
    datePublished: "2023-04-25T00:00:00Z",
    dateModified: "2023-04-25T00:00:00Z",
    author: {
      "@type": "Organization",
      name: "Pomodoro Hero Team",
      url: "https://pomodoro-clock-hero.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Pomodoro Hero",
      logo: {
        "@type": "ImageObject",
        url: "https://pomodoro-clock-hero.vercel.app/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://pomodoro-clock-hero.vercel.app/blog/getting-started",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-3xl mx-auto px-4 py-8 bg-background">
        <Link href="/blog">
          <Button variant="ghost" className="mb-4 hover:bg-accent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-foreground/95">Getting Started with Pomodoro Hero</h1>
          <div className="flex items-center text-sm text-muted-foreground/90">
            <span>April 25, 2023</span>
            <span className="mx-2">•</span>
            <span>3 min read</span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          // ... existing code ...
        </div>
      </article>
    </>
  )
}