"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AcademicTab({ candidate, formData, setFormData }: any) {
  const currentPrevBoard = formData?.prev_board || "kerala"
  const currentPrevSchool = formData?.prev_school || ""

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
      <div className="grid gap-2">
        <Label htmlFor="board" className="text-sm font-semibold text-slate-900">
          Qualifying Examination Board <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={currentPrevBoard} 
          onValueChange={(val) => setFormData((prev: any) => ({ ...prev, prev_board: val }))}
        >
          <SelectTrigger className="h-11 border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kerala">Kerala State Board (SSLC)</SelectItem>
            <SelectItem value="cbse">CBSE</SelectItem>
            <SelectItem value="icse">ICSE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="prev_school" className="text-sm font-semibold text-slate-900">
          Institution Last Attended <span className="text-red-500">*</span>
        </Label>
        <Input 
          id="prev_school" 
          placeholder="e.g. Government High School" 
          value={currentPrevSchool} 
          onChange={(e) => setFormData((prev: any) => ({ ...prev, prev_school: e.target.value }))}
          className="h-11 border-slate-200"
        />
      </div>

      <div className="grid gap-2 col-span-1 md:col-span-2">
        <Label className="text-sm font-semibold text-slate-500">10th Standard Registration Number</Label>
        <Input 
          disabled 
          value={candidate?.reg_num || "Unavailable"} 
          className="h-11 bg-slate-50 font-mono tracking-widest text-slate-700 border-slate-200" 
        />
      </div>
    </div>
  )
}