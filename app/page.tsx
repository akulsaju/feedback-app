import Link from "next/link"
import { PlusCircle, Search, GraduationCap } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-8">
        {/* Hero Card */}
        <div className="flex flex-col items-center rounded-xl bg-primary px-6 py-8 text-center shadow-sm">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <GraduationCap className="h-6 w-6 text-accent-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-wide text-primary-foreground sm:text-2xl text-balance">
            Abu Dhabi Indian School
          </h1>
          <p className="mt-1 text-xs font-medium tracking-widest text-primary-foreground/70 uppercase">
            Al Wathba - Feedback Portal
          </p>
          <p className="mt-3 max-w-xs text-xs text-primary-foreground/80 text-pretty leading-relaxed">
            Submit a new issue or query, or check the status of an existing
            case. No login required.
          </p>
        </div>

        {/* Action Cards */}
        <Link
          href="/report"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left no-underline shadow-sm transition-all hover:shadow-md hover:border-accent"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
            <PlusCircle className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-card-foreground">
              Report New Issue
            </span>
            <span className="mt-0.5 text-xs text-muted-foreground">
              Submit a query, complaint, or suggestion
            </span>
          </div>
        </Link>

        <Link
          href="/status"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left no-underline shadow-sm transition-all hover:shadow-md hover:border-accent"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <Search className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-card-foreground">
              Check Case Status
            </span>
            <span className="mt-0.5 text-xs text-muted-foreground">
              Look up your existing case using your ID
            </span>
          </div>
        </Link>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-5 text-center">
        <p className="text-[11px] font-medium text-muted-foreground">
          Abu Dhabi Indian School, Branch 1, Al Wathba, U.A.E.
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground/70">
          P.O. Box 79803 | Affiliated to CBSE (Aff. No. 6630083)
        </p>
      </footer>
    </div>
  )
}
