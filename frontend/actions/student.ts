// frontend/actions/student.ts
"use server"

import { auth } from "@/config/auth"
import { unstable_rethrow } from "next/navigation"
import { studentAdmissionSchema } from "@/lib/validations/student"

export type StudentActionState = { success: boolean; message: string; errors?: Record<string, string[]> }

type SchemaError = { loc?: unknown; msg?: string }

// ----------------------------------------------------------------------
// 1. STANDARD SINGLE ADMISSION
// ----------------------------------------------------------------------
export async function admitStudentAction(prevState: StudentActionState, formData: FormData): Promise<StudentActionState> {
  try {
    const session = await auth()
    const token = session?.user?.token
    if (!token) return { success: false, message: "Your active session has expired. Please log in again." }

    const rawFormValues = {
      name: formData.get("name")?.toString() || "",
      dob: formData.get("dob")?.toString() || "",
      gender: formData.get("gender")?.toString() || "",
      religion: formData.get("religion")?.toString() || "",
      caste: formData.get("caste")?.toString() || "",
      ad_date: formData.get("ad_date")?.toString() || "",
      ad_year: formData.get("ad_year")?.toString() || "",
      ad_quota: formData.get("ad_quota")?.toString() || "",
      ad_class: formData.get("ad_class")?.toString() || "",
      class_now: formData.get("class_now")?.toString() || "",
      study_status: formData.get("study_status")?.toString() || "",
    }

    const clientValidation = studentAdmissionSchema.safeParse(rawFormValues)
    if (!clientValidation.success) {
      return {
        success: false,
        message: "Frontend validation failed. Check input fields.",
        errors: clientValidation.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    // Map the UI strings directly to Django's native database keys and integers
    const cleanPayload = {
      name: clientValidation.data.name,
      dob: clientValidation.data.dob,
      ad_date: clientValidation.data.ad_date,
      ad_year: clientValidation.data.ad_year, // Leaves "2026-27" as a string for models.CharField
      gender_id: Number(clientValidation.data.gender),
      religion_id: Number(clientValidation.data.religion),
      caste_id: Number(clientValidation.data.caste),
      ad_quota_id: Number(clientValidation.data.ad_quota),
      ad_class_id: Number(clientValidation.data.ad_class),
      class_now_id: Number(clientValidation.data.class_now),
      study_status_id: Number(clientValidation.data.study_status),
    }

    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(cleanPayload),
    })

    const data = await resp.json().catch(() => ({}))

    if (resp.ok) return { success: true, message: `Successfully admitted ${cleanPayload.name}.` }

    if (resp.status === 422 && Array.isArray(data.detail)) {
      const detailedErrors = data.detail.map((err: SchemaError) => {
        const fieldKey = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : "Field"
        return `${fieldKey.toUpperCase()}: ${err.msg}`
      })
      return { success: false, message: `Server schema check failed -> ${detailedErrors.join(" | ")}` }
    }

    return { success: false, message: data.message || "Admission rejected by server rules." }

  } catch (error) {
    unstable_rethrow(error)
    return { success: false, message: "Communication error with backend services." }
  }
}

// ----------------------------------------------------------------------
// 2. HSCAP SMART ONBOARDING API CALLS
// ----------------------------------------------------------------------

export async function parseHscapPdf(formData: FormData) {
  try {
    const session = await auth()
    const token = session?.user?.token
    if (!token) throw new Error("Your active session has expired. Please log in again.")

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/onboard/parse`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Note: Do NOT set Content-Type here; browser sets multipart boundary automatically for FormData
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || "Failed to parse PDF document.")
    }

    return await response.json()
  } catch (error) {
    unstable_rethrow(error)
    throw error
  }
}

export async function confirmHscapBatch(payload: any) {
  try {
    const session = await auth()
    const token = session?.user?.token
    if (!token) throw new Error("Your active session has expired. Please log in again.")

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/onboard/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || "Failed to commit student batch to the database.")
    }

    return await response.json()
  } catch (error) {
    unstable_rethrow(error)
    throw error
  }
}

export async function getAdmissionLookups() {
  try {
    const session = await auth()
    const token = session?.user?.token
    if (!token) return null

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/meta/lookups`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
    
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    unstable_rethrow(error)
    return null
  }
}


export async function getStagedCandidates() {
  try {
    const session = await auth()
    const token = session?.user?.token
    if (!token) return []

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/staging-queue`, {
      headers: { "Authorization": `Bearer ${token}` },
      cache: 'no-store' // Ensure we always get fresh queue data
    })
    
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    unstable_rethrow(error)
    return []
  }
}

export async function admitStagedCandidate(candidateId: number, isPermanent: boolean) {
  try {
    const session = await auth()
    const token = session?.user?.token
    if (!token) throw new Error("Session expired.")

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/admit-candidate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        candidate_id: candidateId,
        is_permanent: isPermanent 
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || "Admission failed.")
    }

    return await response.json()
  } catch (error) {
    unstable_rethrow(error)
    throw error
  }
}