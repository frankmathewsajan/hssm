import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { BadgeCheck, Building2, KeyRound, LogOut, ShieldCheck } from "lucide-react"

import { logoutAction } from "@/actions/auth"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Dashboard | HSS Manager",
  description: "Signed-in HSS Manager dashboard.",
}

function getTokenPreview(token?: string) {
  if (!token) {
    return "No token in session"
  }

  if (token.length <= 24) {
    return token
  }

  return `${token.slice(0, 12)}...${token.slice(-8)}`
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = session.user
  const sessionRows = [
    { label: "Name", value: user.name ?? "Unknown" },
    { label: "Role", value: user.role },
    { label: "School code", value: user.school_code },
    { label: "JWT token", value: getTokenPreview(user.token), mono: true },
  ]

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-950 text-white shadow-sm">
              <Building2 className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">HSS Manager</p>
              <h1 className="text-2xl font-semibold tracking-normal">
                Dashboard
              </h1>
            </div>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="lg">
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </Button>
          </form>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-lg bg-white shadow-sm">
            <CardHeader>
              <ShieldCheck className="mb-2 size-5 text-emerald-800" aria-hidden="true" />
              <CardTitle>Authenticated</CardTitle>
              <CardDescription>Auth.js session is active.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-lg bg-white shadow-sm">
            <CardHeader>
              <BadgeCheck className="mb-2 size-5 text-emerald-800" aria-hidden="true" />
              <CardTitle>{user.role}</CardTitle>
              <CardDescription>Role returned by Django.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-lg bg-white shadow-sm">
            <CardHeader>
              <KeyRound className="mb-2 size-5 text-emerald-800" aria-hidden="true" />
              <CardTitle>{user.school_code}</CardTitle>
              <CardDescription>School tenant code.</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Card className="rounded-lg bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Login Session</CardTitle>
            <CardDescription>
              Values stored from the Django login response.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              {sessionRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <dt className="text-xs font-medium uppercase text-slate-500">
                    {row.label}
                  </dt>
                  <dd
                    className={
                      row.mono
                        ? "mt-2 break-all font-mono text-sm text-slate-900"
                        : "mt-2 text-base font-medium text-slate-950"
                    }
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
