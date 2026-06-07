// frontend/components/features/admissions/admission-dialog.tsx
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { admitStagedCandidate } from "@/actions/student"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import our newly abstracted tabs
import { KycTab } from "./tabs/kyc-tab"
import { DemographicsTab } from "./tabs/demographics-tab"
import { FamilyTab } from "./tabs/family-tab"
import { AcademicTab } from "./tabs/academic-tab"
import { FinancialTab } from "./tabs/financial-tab"

interface AdmissionDialogProps {
  candidate: any | null
  onClose: () => void
  onSuccess: () => void
}

export function AdmissionDialog({ candidate, onClose, onSuccess }: AdmissionDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("kyc")
  
  // 👈 RESTORED: This state is required so the final submit button knows what to do
  const [admissionType, setAdmissionType] = useState("permanent")

  useEffect(() => {
    if (candidate) {
      setActiveTab("kyc")
      setAdmissionType("permanent") // Reset on new student
    }
  }, [candidate])

  const tabs = ["kyc", "demographics", "family", "academic", "financial"]
  
  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1])
  }

  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1])
  }

  const handleSubmit = async () => {
    if (!candidate) return
    setIsProcessing(true)
    try {
      const isPerm = admissionType === "permanent"
      const response = await admitStagedCandidate(candidate.id, isPerm)
      toast.success("Admission Confirmed & Locked", { description: response.detail })
      onSuccess() 
      onClose()
    } catch (error: any) {
      toast.error("Admission Error", { description: error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={!!candidate} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-full md:max-w-[800px] lg:max-w-[1000px] max-h-[95vh] flex flex-col p-0 overflow-hidden">
        
        <div className="px-6 py-5 border-b bg-muted/10">
          <DialogTitle className="text-2xl">Admit Candidate: {candidate?.name}</DialogTitle>
          <DialogDescription className="mt-1.5 text-base">
            Application Number: <span className="font-mono text-foreground font-medium">{candidate?.app_num}</span>
          </DialogDescription>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="w-full overflow-x-auto pb-2 mb-6 hide-scrollbar">
              <TabsList className="flex w-max min-w-full h-auto p-1 md:justify-center">
                <TabsTrigger value="kyc" className="py-2.5 px-4 text-sm">KYC & Documents</TabsTrigger>
                <TabsTrigger value="demographics" className="py-2.5 px-4 text-sm">Demographics</TabsTrigger>
                <TabsTrigger value="family" className="py-2.5 px-4 text-sm">Family & Contact</TabsTrigger>
                <TabsTrigger value="academic" className="py-2.5 px-4 text-sm">Previous Academics</TabsTrigger>
                <TabsTrigger value="financial" className="py-2.5 px-4 text-sm">Financials</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="kyc" className="focus:outline-none"><KycTab candidate={candidate} /></TabsContent>
            <TabsContent value="demographics" className="focus:outline-none"><DemographicsTab candidate={candidate} /></TabsContent>
            <TabsContent value="family" className="focus:outline-none"><FamilyTab candidate={candidate} /></TabsContent>
            <TabsContent value="academic" className="focus:outline-none"><AcademicTab candidate={candidate} /></TabsContent>
            
            {/* 👈 RESTORED: Passed the props down to the Financial Tab */}
            <TabsContent value="financial" className="focus:outline-none">
              <FinancialTab 
                candidate={candidate} 
                admissionType={admissionType} 
                setAdmissionType={setAdmissionType} 
              />
            </TabsContent>

          </Tabs>
        </div>
        
        <div className="px-6 py-5 border-t bg-background flex justify-between items-center w-full">
          <Button variant="outline" size="lg" onClick={activeTab === "kyc" ? onClose : handleBack} disabled={isProcessing}>
            {activeTab === "kyc" ? "Cancel Admission" : "Previous Section"}
          </Button>
          
          {activeTab !== "financial" ? (
            <Button size="lg" onClick={handleNext}>Next Section</Button>
          ) : (
            <Button size="lg" onClick={handleSubmit} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm">
              {isProcessing ? "Writing to Database..." : "Confirm & Lock Admission"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}