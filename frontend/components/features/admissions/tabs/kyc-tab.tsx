// frontend/components/features/admissions/tabs/kyc-tab.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SmartUpload } from "../smart-upload"

export function KycTab({ candidate, formData, setFormData }: any) {
  
  // Defensive guard for when the dialog is animating closed
  if (!candidate) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/30 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Transfer Certificate (TC)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tc_num">TC Number <span className="text-red-500">*</span></Label>
            <Input 
              id="tc_num" 
              placeholder="e.g. 452/2026" 
              value={formData.tc_num} 
              onChange={(e) => setFormData((prev: any) => ({ ...prev, tc_num: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tc_date">TC Date <span className="text-red-500">*</span></Label>
            <Input 
              id="tc_date" 
              type="date" 
              value={formData.tc_date} 
              onChange={(e) => setFormData((prev: any) => ({ ...prev, tc_date: e.target.value }))}
            />
          </div>
        </div>
        <SmartUpload 
           id="tc_file" 
           label="Digitize Original TC File" 
           candidateId={candidate.id} 
           docType="tc" 
           value={formData.tc_file_url} 
           onUploadSuccess={(url: string) => setFormData((prev: any) => ({ ...prev, tc_file_url: url }))}
        />
      </div>

      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/30 space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="aadhaar">Aadhaar Number</Label>
          <Input 
            id="aadhaar" 
            placeholder="12-digit UID" 
            maxLength={12} 
            value={formData.aadhaar_number} 
            onChange={(e) => setFormData((prev: any) => ({ ...prev, aadhaar_number: e.target.value }))}
            className="tracking-wider font-mono" 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="conduct">Conduct Status <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.conduct_status} 
            onValueChange={(val) => setFormData((prev: any) => ({ ...prev, conduct_status: val }))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="satisfactory">Satisfactory</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SmartUpload 
           id="conduct_file" 
           label="Digitize Conduct Certificate" 
           candidateId={candidate.id} 
           docType="conduct" 
           value={formData.conduct_file_url} 
           onUploadSuccess={(url: string) => setFormData((prev: any) => ({ ...prev, conduct_file_url: url }))}
        />
      </div>
    </div>
  )
}