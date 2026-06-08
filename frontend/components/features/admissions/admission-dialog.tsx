"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { admitStagedCandidate, getAdmissionLookups } from "@/actions/student"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [lookups, setLookups] = useState<any>(null)
  const [isLoadingLookups, setIsLoadingLookups] = useState(false)

  // Centralized, unified pipeline form state map matching database expectations
  const [formData, setFormData] = useState({
    // KYC
    tc_num: "",
    tc_date: "",
    tc_file_url: "",
    conduct_status: "good",
    conduct_file_url: "",
    aadhaar_number: "",
    // Demographics
    religion_id: "",
    caste_id: "",
    community_id: "",
    blood_group: "",
    // Family
    guardian_name: "",
    relationship: "father",
    pmt_phone: "",
    annual_income: "",
    // Academic
    prev_board: "kerala",
    prev_school: "",
    // Financial
    admission_type: "permanent",
    quota_id: "",
  })

  // Load lookup parameters exactly once when student file opens
  useEffect(() => {
    if (candidate) {
      setActiveTab("kyc")
      setIsLoadingLookups(true)
      
      // Reset state for new processing pipeline iteration
      setFormData({
        tc_num: "",
        tc_date: "",
        tc_file_url: "",
        conduct_status: "good",
        conduct_file_url: "",
        aadhaar_number: "",
        religion_id: "",
        caste_id: "",
        community_id: "",
        blood_group: "",
        guardian_name: candidate.name ? `Father of ${candidate.name}` : "",
        relationship: "father",
        pmt_phone: "",
        annual_income: "",
        prev_board: "kerala",
        prev_school: "",
        admission_type: "permanent",
        quota_id: "",
      })

      getAdmissionLookups()
        .then((data) => {
          if (data) setLookups(data)
        })
        .finally(() => setIsLoadingLookups(false))
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
      const isPerm = formData.admission_type === "permanent"
      
      // Submit structure mapped cleanly against target view rules
      const response = await admitStagedCandidate(candidate.id, isPerm)
      toast.success("Admission Confirmed & Locked", { description: response.detail })
      onSuccess() 
      onClose()
    } catch (error: any) {
      toast.error("Admission Error", { description: error.message || "Pipeline write crash." })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={!!candidate} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-full md:max-w-[800px] lg:max-w-[1000px] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-background">
        
        <div className="px-6 py-5 border-b border-border bg-muted/10">
          <DialogTitle className="text-2xl font-bold tracking-tight">Admit Candidate: {candidate?.name}</DialogTitle>
          <DialogDescription className="mt-1 text-sm">
            Application Number: <span className="font-mono text-foreground font-medium">{candidate?.app_num}</span>
          </DialogDescription>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoadingLookups ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-slate-900" />
              <p className="text-xs text-muted-foreground font-medium">Resolving system lookups context...</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="w-full overflow-x-auto pb-2 mb-6 hide-scrollbar">
                <TabsList className="flex w-max min-w-full h-auto p-1 border rounded-lg bg-muted/40 md:justify-center">
                  <TabsTrigger value="kyc" className="py-2 px-4 text-xs font-semibold">KYC & Documents</TabsTrigger>
                  <TabsTrigger value="demographics" className="py-2 px-4 text-xs font-semibold">Demographics</TabsTrigger>
                  <TabsTrigger value="family" className="py-2 px-4 text-xs font-semibold">Family & Contact</TabsTrigger>
                  <TabsTrigger value="academic" className="py-2 px-4 text-xs font-semibold">Previous Academics</TabsTrigger>
                  <TabsTrigger value="financial" className="py-2 px-4 text-xs font-semibold">Financials</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="kyc" className="focus:outline-none">
                <KycTab candidate={candidate} formData={formData} setFormData={setFormData} />
              </TabsContent>
              
              <TabsContent value="demographics" className="focus:outline-none">
                <DemographicsTab formData={formData} setFormData={setFormData} lookups={lookups} />
              </TabsContent>
              
              <TabsContent value="family" className="focus:outline-none">
                <FamilyTab formData={formData} setFormData={setFormData} />
              </TabsContent>
              
              <TabsContent value="academic" className="focus:outline-none">
                <AcademicTab candidate={candidate} formData={formData} setFormData={setFormData} />
              </TabsContent>
              
              <TabsContent value="financial" className="focus:outline-none">
                <FinancialTab formData={formData} setFormData={setFormData} lookups={lookups} />
              </TabsContent>
            </Tabs>
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-border bg-background flex justify-between items-center w-full">
          <Button variant="outline" size="lg" onClick={activeTab === "kyc" ? onClose : handleBack} disabled={isProcessing} className="h-11 text-sm font-semibold border-slate-300 text-slate-900">
            {activeTab === "kyc" ? "Cancel" : "Back"}
          </Button>
          
          {activeTab !== "financial" ? (
            <Button size="lg" onClick={handleNext} disabled={isLoadingLookups} className="h-11 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800">
              Next Section
            </Button>
          ) : (
            <Button size="lg" onClick={handleSubmit} disabled={isProcessing} className="h-11 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
              {isProcessing ? "Processing..." : "Confirm & Lock Admission"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}