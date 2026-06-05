// frontend/app/dashboard/students/auto-onboard/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FileUp, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PdfDropzone } from "@/components/dashboard/pdf-dropzone"
import { HscapPreviewTable } from "@/components/dashboard/hscap-preview-table"
import { parseHscapPdf, confirmHscapBatch } from "@/actions/student"

export default function AutoOnboardPage() {
  const router = useRouter()
  
  const [step, setStep] = useState<1 | 2>(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState<any>(null)

  // Handler: Upload and Parse PDF
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const data = await parseHscapPdf(formData)
      setParsedData(data)
      setStep(2) // Move to preview step
      toast.success("PDF parsed successfully!")
    } catch (error: any) {
      toast.error("Parsing Failed", { description: error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handler: Push Batch to Staging Area
  // Handler: Push Batch to Staging Area
  const handleStageBatch = async () => {
    setIsProcessing(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const payload = {
        ad_date: today,
        students: parsedData.students,
      }

      const response = await confirmHscapBatch(payload)
      toast.success("Batch Staged Successfully!", { description: response.detail })
      
      // Cleanly route to the staging area without causing transition collisions
      router.push("/dashboard/students/staging")
      
    } catch (error: any) {
      toast.error("Staging Failed", { description: error.message })
      // Only reset the button if there is an error so the user can try again
      setIsProcessing(false) 
    }
    // We intentionally removed the `finally` block.
    // If successful, the button will stay in the "Staging..." state while Next.js routes away. 
    // This prevents double-clicks and feels much smoother!
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Area */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileUp className="h-7 w-7 text-primary" />
            HSCAP Smart Staging
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload the official PDF allotment letter to queue students in the waiting room.
          </p>
        </div>
      </div>

      {/* Step Router */}
      {step === 1 && (
        <div className="mt-8">
          <PdfDropzone onFileSelect={handleFileSelect} isProcessing={isProcessing} />
        </div>
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