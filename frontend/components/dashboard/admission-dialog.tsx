// frontend/components/dashboard/admission-dialog.tsx
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { UserPlus, Loader2 } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { useActionState, useTransition, useCallback, useEffect, useState } from "react"
import { admitStudentAction, type StudentActionState } from "@/actions/student"
import { studentAdmissionSchema, type StudentAdmissionFormValues, type AdmissionLookups } from "@/lib/validations/student"
import { LookupSelect } from "@/components/forms/lookup-select"

const initialState: StudentActionState = { success: false, message: "" }

interface AdmissionDialogProps {
  onStudentAdded?: (student: { name: string }) => void
}

export function AdmissionDialog({ onStudentAdded }: AdmissionDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [state, dispatch] = useActionState(admitStudentAction, initialState)

  const [lookups, setLookups] = useState<AdmissionLookups>({
    classes: [], genders: [], religions: [], castes: [], quotas: [], statuses: []
  })

  const form = useForm<StudentAdmissionFormValues>({
    resolver: zodResolver(studentAdmissionSchema),
    defaultValues: {
      name: "",
      dob: "",
      ad_date: new Date().toISOString().split('T')[0],
      ad_year: `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
      gender: "", religion: "", caste: "", ad_quota: "", ad_class: "", class_now: "", study_status: ""
    },
  })

  const loadMetadata = useCallback(async () => {
    try {
      const sessionResp = await fetch("/api/auth/session")
      const sessionData = await sessionResp.json()
      const token = sessionData?.user?.token

      if (!token) return

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/meta/lookups`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setLookups(await res.json())
    } catch (e) {
      console.error("Failed to load metadata", e)
    }
  }, [])

  useEffect(() => {
    if (open) loadMetadata()
  }, [open, loadMetadata])

  const adClass = form.watch("ad_class")
  useEffect(() => {
    if (adClass) form.setValue("class_now", adClass)
  }, [adClass, form])

  useEffect(() => {
    if (lookups.statuses.length > 0 && !form.getValues("study_status")) {
      const studying = lookups.statuses.find(s => s.name.toLowerCase() === "studying") || lookups.statuses[0]
      if (studying) form.setValue("study_status", String(studying.id))
    }
  }, [lookups.statuses, form])

  const onSubmit = (values: StudentAdmissionFormValues, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault()

    startTransition(async () => {
      const dataToSend = new FormData()
      Object.entries(values).forEach(([key, val]) => dataToSend.append(key, val))
      dispatch(dataToSend)
    })
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      setOpen(false)
      form.reset()
    }
  }, [state.success, state.message, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-slate-950 text-white rounded-xl shadow-md h-11">
          <UserPlus className="size-4" /> Quick Admit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Student Admission</DialogTitle>
          <DialogDescription>Fill in the core identity details.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...form.register("ad_date")} />

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-700">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter student's full name" {...field} className="h-11 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-700">Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-11 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LookupSelect name="gender" label="Gender" items={lookups.genders} form={form} />
              <LookupSelect name="religion" label="Religion" items={lookups.religions} form={form} />
              <LookupSelect name="caste" label="Caste" items={lookups.castes} form={form} />
              <LookupSelect name="ad_quota" label="Admission Quota" items={lookups.quotas} form={form} />
              <LookupSelect name="ad_class" label="Admission Class" items={lookups.classes} form={form} />
              <LookupSelect name="class_now" label="Current Class" items={lookups.classes} form={form} />

              <FormField
                control={form.control}
                name="ad_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-700">Academic Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2026-27" {...field} readOnly className="h-11 rounded-xl bg-slate-50 opacity-70 cursor-not-allowed" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LookupSelect name="study_status" label="Status" items={lookups.statuses} form={form} />
            </div>

            {state.message && !state.success && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
                {state.message}
              </div>
            )}

            <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl bg-slate-950 font-bold tracking-tight shadow-lg text-base">
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin size-5" />
                  <span>Processing Admission...</span>
                </div>
              ) : (
                "Complete Admission"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}