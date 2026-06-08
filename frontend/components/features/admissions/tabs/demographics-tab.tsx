"use client"

import { useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DemographicsTab({ formData, setFormData, lookups }: any) {
  
  // Safe defensive guard if parent loop delays state delivery
  const currentCasteId = formData?.caste_id || ""
  const currentReligionId = formData?.religion_id || ""
  const currentCommunityId = formData?.community_id || ""
  const currentBloodGroup = formData?.blood_group || ""

  useEffect(() => {
    if (!currentCasteId || !lookups?.castes) return

    const selectedCaste = lookups.castes.find(
      (c: any) => c.id.toString() === currentCasteId
    )
    
    if (selectedCaste?.community_id) {
      setFormData((prev: any) => ({
        ...prev,
        community_id: selectedCaste.community_id.toString(),
      }))
    }
  }, [currentCasteId, lookups?.castes, setFormData])

  const detectedCommunityName = lookups?.communities?.find(
    (c: any) => c.id.toString() === currentCommunityId
  )?.name || "Not Resolved"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
      <div className="grid gap-2">
        <Label className="text-sm font-semibold text-slate-900">Religion <span className="text-red-500">*</span></Label>
        <Select
          value={currentReligionId}
          onValueChange={(val) => setFormData((prev: any) => ({ ...prev, religion_id: val }))}
        >
          <SelectTrigger className="h-11 border-slate-200">
            <SelectValue placeholder="Select Religion" />
          </SelectTrigger>
          <SelectContent>
            {lookups?.religions?.map((item: any) => (
              <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label className="text-sm font-semibold text-slate-900">Caste <span className="text-red-500">*</span></Label>
        <Select
          value={currentCasteId}
          onValueChange={(val) => setFormData((prev: any) => ({ ...prev, caste_id: val }))}
        >
          <SelectTrigger className="h-11 border-slate-200">
            <SelectValue placeholder="Select Caste" />
          </SelectTrigger>
          <SelectContent>
            {lookups?.castes?.map((item: any) => (
              <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label className="text-sm font-semibold text-slate-700">Resolved Community Category</Label>
        <div className="h-11 flex items-center px-3 rounded-lg border border-slate-200 bg-slate-50 font-mono text-sm font-bold text-slate-800">
          {detectedCommunityName}
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-sm font-semibold text-slate-900">Blood Group</Label>
        <Select
          value={currentBloodGroup}
          onValueChange={(val) => setFormData((prev: any) => ({ ...prev, blood_group: val }))}
        >
          <SelectTrigger className="h-11 border-slate-200">
            <SelectValue placeholder="Select Blood Group" />
          </SelectTrigger>
          <SelectContent>
            {["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"].map((bg) => (
              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}