import { auth } from "@/config/auth"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default async function DashboardPage() {
  const session = await auth()
  return (
    <section className="flex flex-col gap-6">
      <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription>Quick access to the student list.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/dashboard/students">Open Student List</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">School Snapshot</CardTitle>
          <CardDescription>Session-backed context from the authenticated user.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between gap-4">
            <span>Name</span>
            <span className="text-foreground">{session?.user?.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Role</span>
            <span className="text-foreground">{session?.user?.role}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}