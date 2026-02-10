import { SiteHeader } from "@/components/site-header"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ShieldCheck } from "lucide-react"

export const metadata = {
  title: "Admin Panel - School Feedback Portal",
  description: "Manage and respond to reported cases.",
}

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground text-balance">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground">
              View, manage, and respond to all reported cases.
            </p>
          </div>
        </div>
        <AdminDashboard />
      </main>
    </div>
  )
}
