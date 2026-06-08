"use client"

import { useState, useEffect, useRef } from "react"
import { UploadCloud, Smartphone, X, Loader2, FileText } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SmartUploadProps {
  id: string
  label: string
  candidateId: number
  docType: "tc" | "conduct"
  value?: string // Tells the component if a file already exists
  onUploadSuccess: (fileUrl: string) => void
}

export function SmartUpload({ id, label, candidateId, docType, value, onUploadSuccess }: SmartUploadProps) {
  const { data: session } = useSession()
  const [showQR, setShowQR] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  // Initialize state based on whether 'value' already exists in the parent formData
  const [status, setStatus] = useState<"idle" | "polling" | "success">(value ? "success" : "idle")
  const [preview, setPreview] = useState<string | null>(value ? "Document Secured" : null)
  
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => { if (pollingInterval.current) clearInterval(pollingInterval.current) }
  }, [])

  // If the parent explicitly resets the value (e.g. closing the dialog), reset local state
  useEffect(() => {
    if (!value) {
      setStatus("idle")
      setPreview(null)
    }
  }, [value])

  const handleStartScanner = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/scanner/init?candidate_id=${candidateId}&doc_type=${docType}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${session?.user?.token}` }
      })
      if (!res.ok) throw new Error("Failed to initialize scanner")
      const data = await res.json()
      setSessionId(data.session_id)
      setShowQR(true)
      setStatus("polling")
      startPolling(data.session_id)
    } catch (error) {
      toast.error("Scanner Error", { description: "Could not link to phone." })
    }
  }

  const startPolling = (sid: string) => {
    pollingInterval.current = setInterval(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/scanner/status/${sid}`, {
          headers: { "Authorization": `Bearer ${session?.user?.token}` }
        })
        const data = await res.json()
        if (data.status === "completed") {
          if (pollingInterval.current) clearInterval(pollingInterval.current)
          setStatus("success")
          setShowQR(false)
          setPreview("Uploaded via Phone")
          onUploadSuccess(data.file_url)
          toast.success(`${label} scanned successfully!`)
        }
      } catch (error) {}
    }, 2000)
  }

  const handleDesktopFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(file.name)
      setStatus("success")
      // Normally you'd upload this directly to Django here, but for now we spoof success
      onUploadSuccess("local_upload_pending") 
      toast.success(`${label} attached.`)
    }
  }

  return (
    <div className="grid gap-2 mt-2">
      <Label htmlFor={id}>{label}</Label>
      
      {status === "success" ? (
        <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border rounded-lg animate-in fade-in">
          <div className="w-10 h-10 bg-background border rounded flex items-center justify-center">
             <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{preview || "Document Attached"}</span>
            <span className="text-[10px] text-muted-foreground uppercase">Verified</span>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => {
            setStatus("idle");
            onUploadSuccess(""); // Clear it in parent too
          }}>
             <X className="w-4 h-4" />
          </Button>
        </div>
      ) : showQR && sessionId ? (
        <div className="p-4 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-lg flex flex-col items-center justify-center relative animate-in fade-in zoom-in-95">
          <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => {setShowQR(false); setStatus("idle");}}>
            <X className="h-4 w-4" />
          </Button>
          <div className="p-2 bg-white rounded-lg shadow-sm mb-3">
            <QRCodeSVG value={`${window.location.origin}/scanner/${sessionId}`} size={120} />
          </div>
          <div className="flex items-center gap-2 text-blue-800">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm font-medium">Waiting for scan...</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input id={id} type="file" accept="image/*,.pdf" onChange={handleDesktopFile} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <Button variant="outline" className="w-full bg-background"><UploadCloud className="w-4 h-4 mr-2" /> Upload</Button>
          </div>
          <Button variant="outline" onClick={handleStartScanner} className="flex-1">
            <Smartphone className="w-4 h-4 mr-2" /> Scan
          </Button>
        </div>
      )}
    </div>
  )
}