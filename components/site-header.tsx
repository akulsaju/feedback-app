import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-primary">
      <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-primary-foreground no-underline"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <GraduationCap className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight tracking-wide text-primary-foreground">
              ADIS Wathba
            </span>
            <span className="text-[11px] leading-tight text-primary-foreground/70">
              Feedback Portal
            </span>
          </div>
        </Link>
      </div>
    </header>
  )
}
