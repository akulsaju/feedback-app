import { SiteHeader } from "@/components/site-header"
import { StatusLookup } from "@/components/status-lookup"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function StatusPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col px-4 py-8">
        <div className="mx-auto w-full max-w-lg">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <StatusLookup />
        </div>
      </main>
    </div>
  )
}
