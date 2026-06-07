"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DemographicsTab({ candidate }: { candidate: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid gap-2">
        <Label>Religion <span className="text-red-500">*</span></Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="Select Religion" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hindu">Hindu</SelectItem>
            <SelectItem value="islam">Islam</SelectItem>
            <SelectItem value="christian">Christian</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Caste <span className="text-red-500">*</span></Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="Select Caste" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ezhava">Ezhava</SelectItem>
            <SelectItem value="nair">Nair</SelectItem>
            <SelectItem value="syrian_catholic">Syrian Catholic</SelectItem>
            <SelectItem value="latin_catholic">Latin Catholic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Blood Group</Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="e.g., O+" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}