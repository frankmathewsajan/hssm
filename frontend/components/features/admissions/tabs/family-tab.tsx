"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FamilyTab({ candidate }: { candidate: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid gap-2">
        <Label htmlFor="guardian">Guardian Name <span className="text-red-500">*</span></Label>
        <Input id="guardian" placeholder="Primary contact name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="relation">Relationship to Student <span className="text-red-500">*</span></Label>
        <Select defaultValue="father">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="father">Father</SelectItem>
            <SelectItem value="mother">Mother</SelectItem>
            <SelectItem value="relative">Other Relative</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Primary Mobile Number <span className="text-red-500">*</span></Label>
        <Input id="phone" type="tel" placeholder="10-digit mobile" className="text-lg tracking-widest font-mono" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="income">Annual Family Income (₹) <span className="text-red-500">*</span></Label>
        <Input id="income" type="number" placeholder="e.g. 120000" />
      </div>
    </div>
  )
}