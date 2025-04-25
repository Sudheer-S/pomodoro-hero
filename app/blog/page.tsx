import type { Metadata } from "next"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Pomodoro Hero Blog - Productivity Hacks & Focus Strategies",
  description:
    "Unlock powerful productivity tips, Pomodoro hacks, and focus techniques to maximize your time, energy, and mental clarity. Learn how to work smarter with Pomodoro Hero.",
}

export default function BlogPage() {
  const blogPosts = [
    {
      slug: "benefits-of-pomodoro",
      title: "The Science-Backed Benefits of the Pomodoro Technique",
      excerpt:
        "Explore the psychological and neuroscience-backed benefits of the Pomodoro Technique. Learn how it enhances focus, reduces burnout, and boosts overall productivity.",
      date: "April 24, 2023",
      readTime: "5 min read",
    },
    {
      slug: "productivity-tips",
      title: "10 Game-Changing Productivity Hacks for Pomodoro Success",
      excerpt:
        "Unlock your peak performance with 10 actionable productivity tips. Supercharge your Pomodoro sessions, stay in flow, and achieve more with less stress.",
      date: "March 15, 2023",
      readTime: "7 min read",
    },
    {
      slug: "focus-techniques",
      title: "Focus Like a Pro: Techniques That Go Beyond Pomodoro",
      excerpt:
        "Discover next-level focus strategies to pair with the Pomodoro method. From time-blocking to deep work rituals, build a productivity system that lasts.",
      date: "February 2, 2023",
      readTime: "6 min read",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3">Pomodoro Hero Blog</h1>
        <p className="text-muted-foreground text-lg">
          Fuel your productivity with expert strategies, proven techniques, and
          powerful insights to help you win every work session.
        </p>
      </div>

      <div className="grid gap-6">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
