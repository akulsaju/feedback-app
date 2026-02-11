"use client"

import React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ShieldCheck, Lock, LogOut, Eye, EyeOff } from "lucide-react"

const ADMIN_PASSWORD = "Adis@2025"

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  function handleLogout() {
    setAuthenticated(false)
    setPassword("")
    setError("")
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-4 py-8">
          <Card className="w-full">
            <CardHeader className="items-center text-center">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                <Lock className="h-7 w-7 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl">ADIS Admin Login</CardTitle>
              <CardDescription>
                Enter the admin password to access the ADIS Wathba dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    className="pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button type="submit" className="w-full">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Access Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <ShieldCheck className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground text-balance">
                ADIS Wathba - Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground">
                View, manage, and respond to all reported cases.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-transparent gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
        <AdminDashboard />
      </main>
    </div>
  )
}
