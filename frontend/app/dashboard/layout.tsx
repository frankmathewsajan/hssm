import { redirect } from "next/navigation"

import { auth } from "@/config/auth"
import { DashboardShell } from "./dashboard-shell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        image: session.user.image,
        role: session.user.role,
        school_code: session.user.school_code,
      }}
    >
      {children}
    </DashboardShell>
  )
}