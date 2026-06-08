// frontend/app/scanner/[sessionId]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AlertCircle, CheckCircle2, Loader2, Check, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MobileScannerPage() {
  const { sessionId } = useParams()
  const [sessionState, setSessionState] = useState<"loading" | "valid" | "expired" | "already_completed">("loading")
  const [candidateInfo, setCandidateInfo] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [localFile, setLocalFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/scanner/status/${sessionId}`)
      .then(async (res) => {
        if (!res.ok) {
          setSessionState("expired")
          return
        }
        const data = await res.json()
        setCandidateInfo(data.candidate)
        
        if (data.status === "completed") {
          setSessionState("already_completed")
        } else {
          setSessionState("valid")
        }
      })
      .catch(() => {
        setSessionState("expired")
        setErrorMessage("Network connection timed out.")
      })
  }, [sessionId])

  const handleLocalCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLocalFile(file)
    setLocalPreview(URL.createObjectURL(file))
    setErrorMessage(null)
  }

  const handleFinalUpload = async () => {
    if (!localFile) return

    setIsUploading(true)
    setErrorMessage(null)
    
    const formData = new FormData()
    formData.append("file", localFile)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/scanner/upload/${sessionId}`, {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        setSessionState("already_completed")
      } else {
        setErrorMessage("Upload rejected. Session token may have expired.")
      }
    } catch (error) {
      setErrorMessage("Network transmission error occurred.")
    } finally {
      setIsUploading(false)
    }
  }

  const clearLocalCapture = () => {
    setLocalFile(null)
    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview(null)
  }

  if (sessionState === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-slate-900" />
      </div>
    )
  }

  if (sessionState === "expired") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-slate-200 bg-white shadow-none">
          <CardHeader className="flex flex-col items-center justify-center text-center pt-8 pb-4">
            <AlertCircle className="h-8 w-8 text-slate-900 mb-2" />
            <CardTitle className="text-lg font-bold tracking-tight text-slate-900">Session Expired</CardTitle>
          </CardHeader>
          <CardContent className="pb-8 space-y-3">
            {errorMessage && (
              <div className="rounded border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-600">
                {errorMessage}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (sessionState === "already_completed") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-slate-200 bg-white shadow-none">
          <CardHeader className="flex flex-col items-center justify-center text-center pt-8 pb-6">
            <CheckCircle2 className="h-8 w-8 text-slate-900 mb-2" />
            <CardTitle className="text-lg font-bold tracking-tight text-slate-900">Upload Complete</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm border-slate-200 overflow-hidden bg-white shadow-sm">
        
        {/* Dynamic Verification Header (Now Clean & Light) */}
        {candidateInfo && (
          <div className="bg-slate-50 text-slate-900 p-4 text-xs space-y-1 border-b border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Candidate</span>
              <span className="text-slate-600 font-mono">{candidateInfo.app_num}</span>
            </div>
            <div className="text-base font-bold text-slate-900 truncate">{candidateInfo.name}</div>
            <div className="flex justify-between pt-1 text-slate-500 font-mono">
              <span>SSLC: {candidateInfo.reg_num || "N/A"}</span>
              <span className="text-slate-900 font-sans font-semibold underline underline-offset-2">{candidateInfo.document_type_label}</span>
            </div>
          </div>
        )}

        {localPreview ? (
          <div className="flex flex-col">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
              <img src={localPreview} alt="Capture Preview" className="h-full w-full object-contain" />
            </div>

            <CardContent className="space-y-3 p-4 bg-white">
              {errorMessage && (
                <div className="rounded border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800">
                  {errorMessage}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={clearLocalCapture}
                  disabled={isUploading}
                  className="flex-1 h-12 text-sm font-semibold border-slate-300 hover:bg-slate-50 text-slate-900"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake
                </Button>

                <Button
                  onClick={handleFinalUpload}
                  disabled={isUploading}
                  className="flex-1 h-12 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Confirm
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </div>
        ) : (
          <CardContent className="p-6 bg-white">
            {errorMessage && (
              <div className="rounded border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800 mb-4">
                {errorMessage}
              </div>
            )}

            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleLocalCapture}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />

              <Button
                className="h-20 w-full rounded-xl text-base font-bold tracking-wide bg-slate-900 hover:bg-slate-800 text-white shadow-none flex items-center justify-center"
              >
                Launch Camera
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}