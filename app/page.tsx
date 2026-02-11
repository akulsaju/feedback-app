import Link from "next/link"
import { PlusCircle, Search, GraduationCap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Header */}
      <header className="relative w-full bg-primary px-4 pb-16 pt-10">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent shadow-lg">
            <GraduationCap className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-primary-foreground sm:text-3xl">
            Abu Dhabi Indian School
          </h1>
          <p className="mt-1 text-sm font-medium tracking-widest text-primary-foreground/70 uppercase">
            Al Wathba - Feedback Portal
          </p>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/80 text-pretty leading-relaxed">
            Submit a new issue or query, or check the status of an existing
            case. No login required.
          </p>
        </div>
      </header>

      {/* Action Cards */}
      <main className="mx-auto -mt-8 w-full max-w-lg flex-1 px-4 pb-12">
        <div className="flex flex-col gap-4">
          <Link
            href="/report"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left no-underline shadow-md transition-all hover:shadow-lg hover:border-accent"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent">
              <PlusCircle className="h-6 w-6 text-accent-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-card-foreground">
                Report New Issue
              </span>
              <span className="mt-0.5 text-sm text-muted-foreground">
                Submit a query, complaint, or suggestion
              </span>
            </div>
          </Link>

          <Link
            href="/status"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left no-underline shadow-md transition-all hover:shadow-lg hover:border-accent"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Search className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-card-foreground">
                Check Case Status
              </span>
              <span className="mt-0.5 text-sm text-muted-foreground">
                Look up your existing case using your ID
              </span>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 text-center">
        <p className="text-xs font-medium text-muted-foreground">
          Abu Dhabi Indian School, Branch 1, Al Wathba, U.A.E.
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground/70">
          P.O. Box 79803 | Affiliated to CBSE (Aff. No. 6630083)
        </p>
      </footer>
    </div>
  )
}
