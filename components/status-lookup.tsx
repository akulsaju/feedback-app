"use client"

import React from "react"

import { useState } from "react"
import { lookupCases } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Search,
  Clock,
  CircleDot,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type CaseRecord = {
  id: string
  case_number: string
  reporter_type: string
  reporter_id: string
  reporter_name: string
  category: string
  subject: string
  description: string
  status: string
  admin_response: string | null
  created_at: string
  updated_at: string
}

const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  open: {
    label: "Open",
    className:
      "bg-[hsl(210,70%,45%)]/10 text-[hsl(210,70%,45%)] border-[hsl(210,70%,45%)]/20",
    icon: CircleDot,
  },
  in_progress: {
    label: "In Progress",
    className:
      "bg-[hsl(38,92%,50%)]/10 text-[hsl(38,80%,40%)] border-[hsl(38,92%,50%)]/20",
    icon: Clock,
  },
  resolved: {
    label: "Resolved",
    className:
      "bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,35%)] border-[hsl(142,71%,45%)]/20",
    icon: CheckCircle2,
  },
  closed: {
    label: "Closed",
    className:
      "bg-muted text-muted-foreground border-border",
    icon: XCircle,
  },
}

const categoryLabels: Record<string, string> = {
  academic: "Academic",
  facility: "Facility / Infrastructure",
  technology: "Technology / IT",
  safety: "Safety / Security",
  other: "Other",
}

export function StatusLookup() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [cases, setCases] = useState<CaseRecord[] | null>(null)
  const [searchValue, setSearchValue] = useState("")

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError("")
    setCases(null)

    const result = await lookupCases(searchValue)

    if (result.error) {
      setError(result.error)
      setPending(false)
      return
    }

    if (result.cases) {
      setCases(result.cases as CaseRecord[])
    }
    setPending(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search Form */}
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">Check Case Status</CardTitle>
          <CardDescription>
            Enter your GR Number, Employee ID, or Case Number to look up your
            cases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                required
                placeholder="e.g. GR-12345 or CASE-..."
                className="h-10 flex-1 rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" disabled={pending} className="h-10">
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="sr-only">Search</span>
              </Button>
            </div>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {cases && cases.length > 0 && (
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Found {cases.length} case{cases.length !== 1 ? "s" : ""}
          </p>
          {cases.map((c) => {
            const status = statusConfig[c.status] || statusConfig.open
            const StatusIcon = status.icon
            return (
              <Card key={c.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-base">{c.subject}</CardTitle>
                      <CardDescription className="font-mono text-xs">
                        {c.case_number}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 gap-1 ${status.className}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      Category:{" "}
                      <span className="text-foreground">
                        {categoryLabels[c.category] || c.category}
                      </span>
                    </span>
                    <span>
                      Reported by:{" "}
                      <span className="text-foreground">
                        {c.reporter_name} ({c.reporter_id})
                      </span>
                    </span>
                    <span>
                      Submitted:{" "}
                      <span className="text-foreground">
                        {formatDistanceToNow(new Date(c.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </span>
                  </div>

                  {c.admin_response && (
                    <div className="rounded-lg border border-border bg-muted p-3">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                        Admin Response
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {c.admin_response}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
