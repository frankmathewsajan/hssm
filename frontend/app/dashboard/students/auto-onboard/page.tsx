// frontend/app/dashboard/students/auto-onboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FileUp, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PdfDropzone } from "@/components/dashboard/pdf-dropzone"
import { HscapPreviewTable } from "@/components/dashboard/hscap-preview-table"
import { parseHscapPdf, confirmHscapBatch, getAdmissionLookups } from "@/actions/student"

export default function AutoOnboardPage() {
  const router = useRouter()
  
  const [step, setStep] = useState<1 | 2>(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState<any>(null)
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([])

  // Fetch classes for the dropdown on mount
  useEffect(() => {
    async function loadMeta() {
      const meta = await getAdmissionLookups()
      if (meta?.classes) {
        setClasses(meta.classes)
      }
    }
    loadMeta()
  }, [])

  // Handler: Upload and Parse PDF
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const data = await parseHscapPdf(formData)
      setParsedData(data)
      setStep(2) // Move to confirmation step
      toast.success("PDF parsed successfully!")
    } catch (error: any) {
      toast.error("Parsing Failed", { description: error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handler: Commit Batch to Database
  const handleConfirmBatch = async (classId: number) => {
    setIsProcessing(true)
    try {
      const today = new Date().toISOString().split('T')[0] // Default admission date
      
      const payload = {
        class_id: classId,
        ad_date: today,
        students: parsedData.students,
      }

      const response = await confirmHscapBatch(payload)
      toast.success("Batch Imported Successfully!", { description: response.detail })
      
      // Redirect back to the main student roster
      router.push("/dashboard/students")
      router.refresh()
      
    } catch (error: any) {
      toast.error("Import Failed", { description: error.message })
    } finally {
      setIsProcessing(false)
    }
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
            HSCAP Smart Onboarding
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload the official PDF allotment letter to instantly populate student records.
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
          classes={classes} 
          onConfirm={handleConfirmBatch}
          isConfirming={isProcessing}
        />
      )}
    </div>
  )
}