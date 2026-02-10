"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitCase } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, CheckCircle2 } from "lucide-react"

export function ReportForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError("")
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const result = await submitCase(formData)

    if (result.error) {
      setError(result.error)
      setPending(false)
      return
    }

    if (result.success && result.caseNumber) {
      setSuccess(result.caseNumber)
      setPending(false)
    }
  }

  if (success) {
    return (
      <Card className="mx-auto w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--success))]">
            <CheckCircle2 className="h-7 w-7 text-[hsl(var(--success-foreground))]" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Case Submitted Successfully
          </h2>
          <p className="text-sm text-muted-foreground">
            Your case number is:
          </p>
          <div className="rounded-lg bg-muted px-6 py-3">
            <span className="font-mono text-lg font-bold text-foreground">
              {success}
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-pretty">
            Save this case number to check your case status later.
          </p>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" onClick={() => router.push("/")}>
              Go Home
            </Button>
            <Button onClick={() => router.push("/status")}>
              Check Status
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-xl">Report an Issue</CardTitle>
        <CardDescription>
          Fill in the details below. All fields are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Reporter Type */}
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-foreground">
              I am a
            </legend>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-input px-4 py-2.5 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="reporterType"
                  value="student"
                  defaultChecked
                  className="accent-[hsl(var(--primary))]"
                />
                Student
              </label>
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-input px-4 py-2.5 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="reporterType"
                  value="teacher"
                  className="accent-[hsl(var(--primary))]"
                />
                Teacher
              </label>
            </div>
          </fieldset>

          {/* Reporter ID */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reporterId"
              className="text-sm font-medium text-foreground"
            >
              GR Number / Employee ID
            </label>
            <input
              id="reporterId"
              name="reporterId"
              type="text"
              required
              placeholder="e.g. GR-12345 or EMP-001"
              className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Reporter Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reporterName"
              className="text-sm font-medium text-foreground"
            >
              Full Name
            </label>
            <input
              id="reporterName"
              name="reporterName"
              type="text"
              required
              placeholder="Enter your full name"
              className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="category"
              className="text-sm font-medium text-foreground"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a category</option>
              <option value="academic">Academic</option>
              <option value="facility">Facility / Infrastructure</option>
              <option value="technology">Technology / IT</option>
              <option value="safety">Safety / Security</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="subject"
              className="text-sm font-medium text-foreground"
            >
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              placeholder="Brief summary of the issue"
              className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Describe the issue in detail..."
              className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="h-11">
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
