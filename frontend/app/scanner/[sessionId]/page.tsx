"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Camera, AlertCircle, CheckCircle2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MobileScannerPage() {
  const { sessionId } = useParams()
  const [isValid, setIsValid] = useState<"loading" | "valid" | "expired">("loading")
  const [isUploading, setIsUploading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/scanner/status/${sessionId}`)
      .then(res => res.ok ? setIsValid("valid") : setIsValid("expired"))
      .catch(() => setIsValid("expired"))
  }, [sessionId])

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/scanner/upload/${sessionId}`, {
        method: "POST",
        body: formData,
      })
      if (res.ok) setIsDone(true)
      else alert("Upload failed. Session may have expired.")
    } catch (error) {
      alert("Network error.")
    } finally {
      setIsUploading(false)
    }
  }

  if (isValid === "loading") return <div className="flex h-screen items-center justify-center">Loading session...</div>

  if (isValid === "expired") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-100 p-4 rounded-full mb-4"><AlertCircle className="w-10 h-10 text-red-600" /></div>
        <h1 className="text-xl font-bold text-slate-900">Session Expired</h1>
        <p className="text-slate-600 mt-2">QR session is no longer valid. Refresh your PC dashboard.</p>
      </div>
    )
  }

  if (isDone) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-green-900">Upload Complete!</h1>
        <p className="text-green-700">You can close this window now.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white p-8 rounded-3xl shadow-xl text-center space-y-6 border">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto"><Upload className="w-8 h-8" /></div>
        <h1 className="text-2xl font-bold">Document Scanner</h1>
        <div className="relative pt-4">
          <Input type="file" accept="image/*" capture="environment" onChange={handleCapture} className="absolute inset-0 opacity-0 cursor-pointer" />
          <Button size="lg" className="w-full h-16 text-lg bg-blue-600">
            {isUploading ? "Uploading..." : <><Camera className="w-6 h-6 mr-2" /> Open Camera</>}
          </Button>
        </div>
      </div>
    </div>
  )
}