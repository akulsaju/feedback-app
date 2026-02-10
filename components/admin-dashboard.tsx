"use client"

import React from "react"

import { useCallback, useEffect, useState } from "react"
import { fetchAllCases, updateCaseStatus } from "@/app/actions"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Loader2,
  RefreshCw,
  CircleDot,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  User,
  GraduationCap,
  Briefcase,
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
    className: "bg-muted text-muted-foreground border-border",
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

export function AdminDashboard() {
  const [cases, setCases] = useState<CaseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [adminResponse, setAdminResponse] = useState("")
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState("")

  const loadCases = useCallback(async () => {
    setLoading(true)
    const result = await fetchAllCases(filter)
    if (result.cases) {
      setCases(result.cases as CaseRecord[])
    }
    setLoading(false)
  }, [filter])

  useEffect(() => {
    loadCases()
  }, [loadCases])

  function openCaseDialog(c: CaseRecord) {
    setSelectedCase(c)
    setNewStatus(c.status)
    setAdminResponse(c.admin_response ?? "")
    setUpdateError("")
    setDialogOpen(true)
  }

  async function handleUpdate() {
    if (!selectedCase) return
    setUpdating(true)
    setUpdateError("")

    const result = await updateCaseStatus(
      selectedCase.id,
      newStatus,
      adminResponse || undefined
    )

    if (result.error) {
      setUpdateError(result.error)
      setUpdating(false)
      return
    }

    setDialogOpen(false)
    setUpdating(false)
    loadCases()
  }

  const counts = {
    all: cases.length,
    open: cases.filter((c) => c.status === "open").length,
    in_progress: cases.filter((c) => c.status === "in_progress").length,
    resolved: cases.filter((c) => c.status === "resolved").length,
    closed: cases.filter((c) => c.status === "closed").length,
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => setFilter("open")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(210,70%,45%)]/10">
              <CircleDot className="h-5 w-5 text-[hsl(210,70%,45%)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{counts.open}</p>
              <p className="text-xs text-muted-foreground">Open</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => setFilter("in_progress")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(38,92%,50%)]/10">
              <Clock className="h-5 w-5 text-[hsl(38,80%,40%)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {counts.in_progress}
              </p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => setFilter("resolved")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(142,71%,45%)]/10">
              <CheckCircle2 className="h-5 w-5 text-[hsl(142,71%,35%)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {counts.resolved}
              </p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => setFilter("closed")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <XCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {counts.closed}
              </p>
              <p className="text-xs text-muted-foreground">Closed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter + Refresh bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cases</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {cases.length} case{cases.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadCases}
          disabled={loading}
          className="bg-transparent"
        >
          <RefreshCw
            className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Cases list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : cases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CircleDot className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No cases found for this filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {cases.map((c) => {
            const status = statusConfig[c.status] || statusConfig.open
            const StatusIcon = status.icon
            const ReporterIcon =
              c.reporter_type === "teacher" ? Briefcase : GraduationCap
            return (
              <Card
                key={c.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => openCaseDialog(c)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {c.subject}
                      </CardTitle>
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
                <CardContent className="flex flex-col gap-2 pt-0">
                  <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ReporterIcon className="h-3 w-3" />
                      {c.reporter_name} ({c.reporter_id})
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {c.reporter_type === "teacher" ? "Teacher" : "Student"}
                    </span>
                    <span>
                      {categoryLabels[c.category] || c.category}
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(c.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {c.admin_response && (
                      <span className="flex items-center gap-1 text-[hsl(142,71%,35%)]">
                        <MessageSquare className="h-3 w-3" />
                        Responded
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Case Detail / Update Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle className="text-balance">{selectedCase.subject}</DialogTitle>
                <DialogDescription className="font-mono">
                  {selectedCase.case_number}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                {/* Case details */}
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedCase.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Reporter</p>
                    <p className="font-medium text-foreground">
                      {selectedCase.reporter_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ID</p>
                    <p className="font-medium text-foreground">
                      {selectedCase.reporter_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium capitalize text-foreground">
                      {selectedCase.reporter_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium text-foreground">
                      {categoryLabels[selectedCase.category] ||
                        selectedCase.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="font-medium text-foreground">
                      {formatDistanceToNow(new Date(selectedCase.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="font-medium text-foreground">
                      {formatDistanceToNow(new Date(selectedCase.updated_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                {/* Update status */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="status-select"
                    className="text-sm font-medium text-foreground"
                  >
                    Update Status
                  </label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger id="status-select" className="bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Admin response */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="admin-response"
                    className="text-sm font-medium text-foreground"
                  >
                    Admin Response
                  </label>
                  <Textarea
                    id="admin-response"
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Write a response visible to the reporter..."
                    rows={3}
                    className="bg-card"
                  />
                </div>

                {updateError && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {updateError}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="bg-transparent"
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={updating}>
                  {updating && (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
