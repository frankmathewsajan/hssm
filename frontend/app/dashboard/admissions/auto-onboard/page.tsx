// frontend/app/dashboard/admissions/auto-onboard/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PdfDropzone } from "@/components/features/hscap-onboarding/pdf-dropzone"
import { HscapPreviewTable } from "@/components/features/hscap-onboarding/hscap-preview-table"
import { parseHscapPdf, confirmHscapBatch } from "@/actions/student"

export default function AutoOnboardPage() {
  const router = useRouter()
  
  const [step, setStep] = useState<1 | 2>(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState<any>(null)

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const data = await parseHscapPdf(formData)
      setParsedData(data)
      setStep(2)
      toast.success("PDF parsed successfully")
    } catch (error: any) {
      toast.error("Parsing Failed", { description: error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStageBatch = async () => {
    setIsProcessing(true)
    try {
      const payload = {
        ad_date: new Date().toISOString().split('T')[0],
        students: parsedData.students,
      }
      const response = await confirmHscapBatch(payload)
      toast.success("Batch Staged", { description: response.detail })
      router.push("/dashboard/admissions/staging")
    } catch (error: any) {
      toast.error("Staging Failed", { description: error.message })
      setIsProcessing(false) 
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {step === 1 && (
        <PdfDropzone onFileSelect={handleFileSelect} isProcessing={isProcessing} />
      )}

      {step === 2 && parsedData && (
        <HscapPreviewTable 
          data={parsedData} 
          onConfirm={handleStageBatch}
          isConfirming={isProcessing}
        />
      )}
    </div>
  )
}