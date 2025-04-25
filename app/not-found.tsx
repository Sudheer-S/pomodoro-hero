import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="mb-6 text-6xl font-bold text-red-500">404</div>
      <h1 className="mb-4 text-3xl font-bold">Page Not Found</h1>
      <p className="mb-8 text-muted-foreground max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
