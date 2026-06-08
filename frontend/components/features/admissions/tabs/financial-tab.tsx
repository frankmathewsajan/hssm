"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FinancialTab({ formData, setFormData, lookups }: any) {
  const currentAdmissionType = formData?.admission_type || "permanent"
  const currentQuotaId = formData?.quota_id || ""

  return (
    <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 mb-4 animate-in fade-in duration-150">
      <div className="grid gap-6 md:grid-cols-2">
        
        <div className="grid gap-2">
          <Label className="text-slate-900 font-bold text-sm">Admission Status <span className="text-red-500">*</span></Label>
          <Select 
            value={currentAdmissionType} 
            onValueChange={(val) => setFormData((prev: any) => ({ ...prev, admission_type: val }))}
          >
            <SelectTrigger className="h-11 border-slate-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanent">Permanent (Taking Seat)</SelectItem>
              <SelectItem value="temporary">Temporary (Awaiting Higher Option)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label className="text-slate-900 font-bold text-sm">Allotted Quota / Fee Category <span className="text-red-500">*</span></Label>
          <Select 
            value={currentQuotaId} 
            onValueChange={(val) => setFormData((prev: any) => ({ ...prev, quota_id: val }))}
          >
            <SelectTrigger className="h-11 border-slate-200 bg-white">
              <SelectValue placeholder="Select Allocation Quota" />
            </SelectTrigger>
            <SelectContent>
              {lookups?.quotas?.map((quota: any) => (
                <SelectItem key={quota.id} value={quota.id.toString()}>
                  {quota.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  )
}