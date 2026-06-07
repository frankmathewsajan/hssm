// frontend/components/features/admissions/admission-dialog.tsx
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { admitStagedCandidate } from "@/actions/student"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdmissionDialogProps {
  candidate: any | null
  isPermanent: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AdmissionDialog({ candidate, isPermanent, onClose, onSuccess }: AdmissionDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  // Future: Add form state (e.g., react-hook-form) here to capture these inputs

  const handleSubmit = async () => {
    if (!candidate) return
    setIsProcessing(true)
    
    try {
      // Pass form payload here when backend schema is updated
      const response = await admitStagedCandidate(candidate.id, isPermanent)
      toast.success("Admission Complete!", { description: response.detail })
      onSuccess() // Trigger queue refresh in parent
      onClose()
    } catch (error: any) {
      toast.error("Admission Error", { description: error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={!!candidate} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] h-[85vh] sm:h-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isPermanent ? "Permanent Admit:" : "Temporary Admit:"} {candidate?.name}
          </DialogTitle>
        </DialogHeader>
        
        {/* Scrollable multi-tab form area */}
        <div className="flex-1 overflow-y-auto py-4">
          <Tabs defaultValue="kyc" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="kyc">KYC & Docs</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="kyc" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="guardian">Guardian Name / Parent</Label>
                <Input id="guardian" placeholder="Name from 10th Certificate" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Primary Phone</Label>
                  <Input id="phone" type="tel" placeholder="10-digit mobile" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tc_num">TC Number</Label>
                  <Input id="tc_num" placeholder="e.g. 452/2026" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                 {/* Placeholders for Future Lookups */}
                 <div className="grid gap-2"><Label>Religion</Label><Input placeholder="Select..." disabled/></div>
                 <div className="grid gap-2"><Label>Caste</Label><Input placeholder="Select..." disabled/></div>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label>Fee Concession Category</Label>
                <Input placeholder="General / SC / ST / OEC" disabled/>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Confirm & Lock Admission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}