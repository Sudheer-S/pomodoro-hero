import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Pomodoro Hero. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/blog/benefits-of-pomodoro" className="text-sm text-muted-foreground hover:text-primary">
              Benefits of Pomodoro
            </Link>
            <Link href="/blog/productivity-tips" className="text-sm text-muted-foreground hover:text-primary">
              Productivity Tips
            </Link>
            <Link href="/blog/focus-techniques" className="text-sm text-muted-foreground hover:text-primary">
              Focus Techniques
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
