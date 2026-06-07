"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SmartUpload } from "../smart-upload"

// Ensure we accept the 'candidate' prop
export function KycTab({ candidate }: { candidate: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-5 border rounded-xl bg-muted/5 space-y-4">
        <h3 className="font-semibold text-sm text-foreground border-b pb-2">
          Transfer Certificate (TC) Surrender
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tc_num">TC Number <span className="text-red-500">*</span></Label>
            <Input id="tc_num" placeholder="e.g. 452/2026" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tc_date">TC Date <span className="text-red-500">*</span></Label>
            <Input id="tc_date" type="date" />
          </div>
        </div>
        
        {/* Pass the ID and docType here! */}
        <SmartUpload 
           id="tc_file" 
           label="Digitize Original TC" 
           candidateId={candidate.id} 
           docType="tc" 
           onUploadSuccess={(url) => console.log("TC Uploaded:", url)}
        />
      </div>

      <div className="space-y-5 p-5 border rounded-xl bg-muted/5">
        <div className="grid gap-2">
          <Label htmlFor="aadhaar">Aadhaar Number (UID)</Label>
          <Input id="aadhaar" placeholder="12-digit UID" maxLength={12} />
        </div>
        
        <div className="grid gap-2 pt-2">
          <Label htmlFor="conduct">Conduct Status <span className="text-red-500">*</span></Label>
          <Select defaultValue="good">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pass the ID and docType here! */}
        <SmartUpload 
           id="conduct_file" 
           label="Digitize Conduct Certificate" 
           candidateId={candidate.id} 
           docType="conduct" 
           onUploadSuccess={(url) => console.log("Conduct Uploaded:", url)}
        />
      </div>
    </div>
  )
}