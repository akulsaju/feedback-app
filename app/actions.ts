"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey)
}

function generateCaseNumber(): string {
  const prefix = "CASE"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export async function submitCase(formData: FormData) {
  const supabase = getSupabase()

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
    console.log("[v0] submitCase error:", JSON.stringify(error))
    return { error: "Failed to submit your case. Please try again." }
  }

  return { success: true, caseNumber: data.case_number }
}

export async function fetchAllCases(statusFilter?: string) {
  const supabase = getSupabase()

  let query = supabase
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false })

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter)
  }

  const { data, error } = await query

  if (error) {
    console.log("[v0] fetchAllCases error:", JSON.stringify(error))
    return { error: "Failed to fetch cases." }
  }

  return { cases: data ?? [] }
}

export async function updateCaseStatus(
  caseId: string,
  status: string,
  adminResponse?: string
) {
  const supabase = getSupabase()

  const updateData: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (adminResponse !== undefined) {
    updateData.admin_response = adminResponse
  }

  const { error } = await supabase
    .from("cases")
    .update(updateData)
    .eq("id", caseId)

  if (error) {
    console.log("[v0] updateCaseStatus error:", JSON.stringify(error))
    return { error: "Failed to update case." }
  }

  return { success: true }
}

export async function lookupCases(identifier: string) {
  const supabase = getSupabase()

  const trimmed = identifier.trim()

  if (!trimmed) {
    return { error: "Please enter your GR Number or Employee ID." }
  }

  const { data: byId, error: errById } = await supabase
    .from("cases")
    .select("*")
    .eq("reporter_id", trimmed)
    .order("created_at", { ascending: false })

  const { data: byCase, error: errByCase } = await supabase
    .from("cases")
    .select("*")
    .eq("case_number", trimmed)
    .order("created_at", { ascending: false })

  if (errById && errByCase) {
    console.log("[v0] lookupCases errors:", JSON.stringify(errById), JSON.stringify(errByCase))
    return { error: "Failed to look up cases. Please try again." }
  }

  // Merge results and deduplicate by id
  const allResults = [...(byId ?? []), ...(byCase ?? [])]
  const seen = new Set<string>()
  const data = allResults.filter((c) => {
    if (seen.has(c.id)) return false
    seen.add(c.id)
    return true
  })

  if (!data || data.length === 0) {
    return { error: "No cases found for this ID or case number." }
  }

  return { cases: data }
}
