// frontend/lib/validations/student.ts
import * as z from "zod"

export const studentAdmissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  dob: z.string().min(1, "Date of birth is required").regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.string().min(1, "Gender selection is required"),
  religion: z.string().min(1, "Religion selection is required"),
  caste: z.string().min(1, "Caste selection is required"),
  ad_date: z.string().min(1, "Admission date is required"),
  ad_year: z.string().min(1, "Admission year is required"), // e.g., "2026-27"
  ad_quota: z.string().min(1, "Quota selection is required"),
  ad_class: z.string().min(1, "Admission class selection is required"),
  class_now: z.string().min(1, "Current class assignment is required"),
  study_status: z.string().min(1, "Status selection is required"),
})

export type StudentAdmissionFormValues = z.infer<typeof studentAdmissionSchema>

export interface LookupItem { id: number; name: string }
export interface AdmissionLookups {
  classes: LookupItem[]; genders: LookupItem[]; religions: LookupItem[];
  castes: LookupItem[]; quotas: LookupItem[]; statuses: LookupItem[];
}