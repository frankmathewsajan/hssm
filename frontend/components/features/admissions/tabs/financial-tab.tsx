"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FinancialTabProps {
  candidate: any
  admissionType: string
  setAdmissionType: (value: string) => void
}

export function FinancialTab({ candidate, admissionType, setAdmissionType }: FinancialTabProps) {
  return (
    <div className="p-6 border-2 rounded-xl bg-amber-500/5 border-amber-500/30 mb-4">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <Label className="text-amber-900 font-semibold text-base">
            Admission Status <span className="text-red-500">*</span>
          </Label>
          <Select value={admissionType} onValueChange={setAdmissionType}>
            <SelectTrigger className="border-amber-500/40 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanent">Permanent (Taking Seat)</SelectItem>
              <SelectItem value="temporary">Temporary (Awaiting Higher Option)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label className="text-amber-900 font-semibold text-base">
            Fee Category <span className="text-red-500">*</span>
          </Label>
          <Select defaultValue="general">
            <SelectTrigger className="border-amber-500/40 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Category (Full PTA Fee)</SelectItem>
              <SelectItem value="sc_st">SC/ST (Full Exemption)</SelectItem>
              <SelectItem value="oec">OEC (Full Exemption)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}