
import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Productivity & Focus Blog | Expert Tips & Strategies",
  description: "Free productivity tips, time management techniques, and focus strategies. Learn how to boost your efficiency, study better, and achieve work-life balance.",
  keywords: [
    "productivity tips", "time management blog", "focus techniques",
    "study strategies", "work efficiency", "pomodoro method",
    "productivity blog", "student productivity", "work from home tips",
    "concentration techniques", "time blocking guide", "focus improvement"
  ],
  alternates: {
    canonical: "https://pomodoro-clock-hero.vercel.app/blog"
  }
}

export default function BlogPage() {
  const blogPosts = [
    {
      slug: "benefits-of-pomodoro",
      title: "The Science-Backed Benefits of the Pomodoro Technique",
      excerpt: "Explore the psychological and neuroscience-backed benefits of the Pomodoro Technique. Learn how it enhances focus, reduces burnout, and boosts overall productivity.",
      date: "April 24, 2023",
      readTime: "5 min read",
    },
    {
      slug: "productivity-tips",
      title: "10 Game-Changing Productivity Hacks for Pomodoro Success",
      excerpt: "Unlock your peak performance with 10 actionable productivity tips. Supercharge your Pomodoro sessions, stay in flow, and achieve more with less stress.",
      date: "March 15, 2023",
      readTime: "7 min read",
    },
    {
      slug: "focus-techniques",
      title: "Focus Like a Pro: Techniques That Go Beyond Pomodoro",
      excerpt: "Discover next-level focus strategies to pair with the Pomodoro method. From time-blocking to deep work rituals, build a productivity system that lasts.",
      date: "February 2, 2023",
      readTime: "6 min read",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 animate-fadeIn">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          Pomodoro Hero Blog
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Fuel your productivity with expert strategies, proven techniques, and
          powerful insights to help you win every work session.
        </p>
      </div>

      <div className="grid gap-8">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="card-hover-effect border border-border/50">
            <CardHeader>
              <CardTitle>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-2xl font-bold hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <span>{post.date}</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
