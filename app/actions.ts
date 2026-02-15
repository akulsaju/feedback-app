"use server"

import { getDb, saveDb } from "@/lib/db"
import { randomUUID } from "crypto"

function generateCaseNumber(): string {
  const prefix = "CASE"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

interface CaseRow {
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

function rowsToObjects(result: { columns: string[]; values: unknown[][] }[]): CaseRow[] {
  if (!result || result.length === 0 || result[0].values.length === 0) return []
  const columns = result[0].columns
  return result[0].values.map((row) => {
    const obj: Record<string, unknown> = {}
    columns.forEach((col, i) => {
      obj[col] = row[i]
    })
    return obj as unknown as CaseRow
  })
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
    const db = await getDb()
    const id = randomUUID()
    const caseNumber = generateCaseNumber()
    const now = new Date().toISOString()

    db.run(
      `INSERT INTO cases (id, case_number, reporter_type, reporter_id, reporter_name, category, subject, description, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)`,
      [
        id,
        caseNumber,
        reporterType,
        reporterId.trim(),
        reporterName.trim(),
        category,
        subject.trim(),
        description.trim(),
        now,
        now,
      ]
    )

    saveDb()
    return { success: true, caseNumber }
  } catch (err) {
    console.error("submitCase error:", err)
    return { error: "Failed to submit your case. Please try again." }
  }
}

export async function fetchAllCases(statusFilter?: string) {
  try {
    const db = await getDb()

    let result
    if (statusFilter && statusFilter !== "all") {
      result = db.exec(
        "SELECT * FROM cases WHERE status = ? ORDER BY created_at DESC",
        [statusFilter]
      )
    } else {
      result = db.exec("SELECT * FROM cases ORDER BY created_at DESC")
    }

    return { cases: rowsToObjects(result) }
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
    const db = await getDb()
    const now = new Date().toISOString()

    if (adminResponse !== undefined) {
      db.run(
        "UPDATE cases SET status = ?, admin_response = ?, updated_at = ? WHERE id = ?",
        [status, adminResponse, now, caseId]
      )
    } else {
      db.run(
        "UPDATE cases SET status = ?, updated_at = ? WHERE id = ?",
        [status, now, caseId]
      )
    }

    saveDb()
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
    const db = await getDb()

    const result = db.exec(
      "SELECT * FROM cases WHERE reporter_id = ? OR case_number = ? ORDER BY created_at DESC",
      [trimmed, trimmed]
    )

    const rows = rowsToObjects(result)

    if (rows.length === 0) {
      return { error: "No cases found for this ID or case number." }
    }

    return { cases: rows }
  } catch (err) {
    console.error("lookupCases error:", err)
    return { error: "Failed to look up cases. Please try again." }
  }
}
