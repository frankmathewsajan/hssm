import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/config/auth"

import { StudentDataTable } from "./data-table"
import type { StudentRow } from "./columns"

export const metadata: Metadata = {
  title: "Students | HSS Manager",
  description: "Student list.",
}

async function getStudents(token: string): Promise<StudentRow[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/roster/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  if (!response.ok) {
    return []
  }

  return response.json()
}

export default async function StudentsPage() {
  const session = await auth()

  if (!session?.user?.token) {
    redirect("/")
  }

  const students = await getStudents(session.user.token)

  return (
    <div className="flex flex-col">
      <StudentDataTable data={students} />
    </div>
  )
}