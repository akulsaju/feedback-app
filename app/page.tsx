import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            How can we help you today?
          </h1>
          <p className="mt-3 text-base text-muted-foreground text-pretty">
            Submit a new issue or query, or check the status of an existing
            case.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <Link
              href="/report"
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left no-underline shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                <PlusCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-foreground">
                  Report New Issue
                </span>
                <span className="mt-0.5 text-sm text-muted-foreground">
                  Submit a query, complaint, or suggestion
                </span>
              </div>
            </Link>

            <Link
              href="/status"
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left no-underline shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Search className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-foreground">
                  Check Case Status
                </span>
                <span className="mt-0.5 text-sm text-muted-foreground">
                  Look up your existing case using your ID
                </span>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        School Feedback Portal
      </footer>
    </div>
  )
}
