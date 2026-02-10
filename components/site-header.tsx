import Link from "next/link"
import { BookOpen } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground no-underline"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold leading-tight">
              School Feedback
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              Report &amp; Track Issues
            </span>
          </div>
        </Link>
      </div>
    </header>
  )
}
