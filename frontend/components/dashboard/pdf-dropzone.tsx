// frontend/components/dashboard/pdf-dropzone.tsx
"use client"

import { useState, useCallback } from "react"
import { UploadCloud, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PdfDropzoneProps {
  onFileSelect: (file: File) => void
  isProcessing: boolean
}

export function PdfDropzone({ onFileSelect, isProcessing }: PdfDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-200 bg-muted/20",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
        isProcessing && "opacity-75 pointer-events-none"
      )}
    >
      <input
        type="file"
        accept="application/pdf"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => {
          if (e.target.files?.[0]) onFileSelect(e.target.files[0])
        }}
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center space-y-4 text-center p-6">
        {isProcessing ? (
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        ) : (
          <div className="p-4 bg-background rounded-full shadow-sm ring-1 ring-border">
            <UploadCloud className="h-8 w-8 text-primary" />
          </div>
        )}
        <div>
          <p className="text-lg font-semibold tracking-tight">
            {isProcessing ? "Extracting Data..." : "Drop your HSCAP Allotment PDF here"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {isProcessing ? "Reading tables and formatting text natively." : "Or click to browse your files. Only .pdf files are supported."}
          </p>
        </div>
      </div>
    </div>
  )
}