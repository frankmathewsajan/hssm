"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AcademicTab({ candidate }: { candidate: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid gap-2">
        <Label htmlFor="board">Previous Board of Study <span className="text-red-500">*</span></Label>
        <Select defaultValue="kerala">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="kerala">Kerala State Board (SSLC)</SelectItem>
            <SelectItem value="cbse">CBSE</SelectItem>
            <SelectItem value="icse">ICSE</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="prev_school">Previous School Name <span className="text-red-500">*</span></Label>
        <Input id="prev_school" placeholder="e.g. Govt HSS Karimannoor" />
      </div>
      <div className="grid gap-2 col-span-1 md:col-span-2">
        <Label>10th Register Number</Label>
        <Input disabled value={candidate?.reg_num || ""} className="bg-muted text-lg tracking-widest font-mono" />
      </div>
    </div>
  )
}