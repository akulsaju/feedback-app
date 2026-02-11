import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight tracking-wide text-foreground">
              ADIS Wathba
            </span>
            <span className="text-[10px] leading-tight text-muted-foreground">
              Feedback Portal
            </span>
          </div>
        </Link>
      </div>
    </header>
  )
}
