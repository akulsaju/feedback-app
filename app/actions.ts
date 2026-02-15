"use server"

import { getDb } from "@/lib/db"
import { randomUUID } from "crypto"

function generateCaseNumber(): string {
  const prefix = "CASE"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export async function submitCase(formData: FormData) {
  const reporterType = formData.get("reporterType") as string
  const reporterId = formData.get("reporterId") as string
  const reporterName = formData.get("reporterName") as string
  const category = formData.get("category") as string
  const subject = formData.get("subject") as string
  const description = formData.get("description") as string

  if (
    !reporterType ||
    !reporterId ||
    !reporterName ||
    !category ||
    !subject ||
    !description
  ) {
    return { error: "All fields are required." }
  }

  try {
    const db = getDb()
    const id = randomUUID()
    const caseNumber = generateCaseNumber()
    const now = new Date().toISOString()

    db.prepare(
      `INSERT INTO cases (id, case_number, reporter_type, reporter_id, reporter_name, category, subject, description, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)`
    ).run(
      id,
      caseNumber,
      reporterType,
      reporterId.trim(),
      reporterName.trim(),
      category,
      subject.trim(),
      description.trim(),
      now,
      now
    )

    return { success: true, caseNumber }
  } catch (err) {
    console.error("submitCase error:", err)
    return { error: "Failed to submit your case. Please try again." }
  }
}

export async function fetchAllCases(statusFilter?: string) {
  try {
    const db = getDb()

    if (statusFilter && statusFilter !== "all") {
      const rows = db
        .prepare("SELECT * FROM cases WHERE status = ? ORDER BY created_at DESC")
        .all(statusFilter)
      return { cases: rows }
    }

    const rows = db
      .prepare("SELECT * FROM cases ORDER BY created_at DESC")
      .all()
    return { cases: rows }
  } catch (err) {
    console.error("fetchAllCases error:", err)
    return { error: "Failed to fetch cases." }
  }
}

export async function updateCaseStatus(
  caseId: string,
  status: string,
  adminResponse?: string
) {
  try {
    const db = getDb()
    const now = new Date().toISOString()

    if (adminResponse !== undefined) {
      db.prepare(
        "UPDATE cases SET status = ?, admin_response = ?, updated_at = ? WHERE id = ?"
      ).run(status, adminResponse, now, caseId)
    } else {
      db.prepare(
        "UPDATE cases SET status = ?, updated_at = ? WHERE id = ?"
      ).run(status, now, caseId)
    }

    return { success: true }
  } catch (err) {
    console.error("updateCaseStatus error:", err)
    return { error: "Failed to update case." }
  }
}

export async function lookupCases(identifier: string) {
  const trimmed = identifier.trim()

  if (!trimmed) {
    return { error: "Please enter your GR Number or Employee ID." }
  }

  try {
    const db = getDb()

    const rows = db
      .prepare(
        "SELECT * FROM cases WHERE reporter_id = ? OR case_number = ? ORDER BY created_at DESC"
      )
      .all(trimmed, trimmed)

    if (!rows || rows.length === 0) {
      return { error: "No cases found for this ID or case number." }
    }

    return { cases: rows }
  } catch (err) {
    console.error("lookupCases error:", err)
    return { error: "Failed to look up cases. Please try again." }
  }
}
