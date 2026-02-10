"use server"

import { createClient } from "@/lib/supabase/server"

function generateCaseNumber(): string {
  const prefix = "CASE"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export async function submitCase(formData: FormData) {
  const supabase = await createClient()

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

  const caseNumber = generateCaseNumber()

  const { data, error } = await supabase
    .from("cases")
    .insert({
      case_number: caseNumber,
      reporter_type: reporterType,
      reporter_id: reporterId.trim(),
      reporter_name: reporterName.trim(),
      category,
      subject: subject.trim(),
      description: description.trim(),
      status: "open",
    })
    .select()
    .single()

  if (error) {
    return { error: "Failed to submit your case. Please try again." }
  }

  return { success: true, caseNumber: data.case_number }
}

export async function lookupCases(identifier: string) {
  const supabase = await createClient()

  const trimmed = identifier.trim()

  if (!trimmed) {
    return { error: "Please enter your GR Number or Employee ID." }
  }

  // Look up by reporter_id OR case_number
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .or(`reporter_id.eq.${trimmed},case_number.eq.${trimmed}`)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: "Failed to look up cases. Please try again." }
  }

  if (!data || data.length === 0) {
    return { error: "No cases found for this ID or case number." }
  }

  return { cases: data }
}
