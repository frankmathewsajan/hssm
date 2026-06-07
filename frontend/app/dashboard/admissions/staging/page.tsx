// frontend/app/dashboard/admissions/staging/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus, Banknote, Calendar, GraduationCap } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStagedCandidates } from "@/actions/student"
import { AdmissionDialog } from "@/components/features/admissions/admission-dialog"

export default function StagingQueuePage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const queueData = await getStagedCandidates()
    setCandidates(queueData || [])
  }

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.app_num.includes(searchTerm)
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admission Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {candidates.length} candidates awaiting physical verification.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search App No or Name..." 
            className="pl-9 bg-background" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="p-12 text-center border rounded-xl border-dashed bg-muted/10">
          <p className="text-muted-foreground">Queue is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => {
            // Determine subtle border color based on gender (inverted mapping, light shades)
            const isFemale = candidate.gender_text?.toLowerCase().includes("f")
            const stripeColor = isFemale ? "bg-blue-300/80" : "bg-rose-300/80"

            return (
              <Card key={candidate.id} className="relative flex flex-col hover:border-primary/50 transition-colors overflow-hidden">
                {/* Ultra-thin, subtle Gender Border */}
                <div className={`absolute top-0 left-0 w-[2px] h-full ${stripeColor}`}></div>
                
                <CardHeader className="pb-2 pt-4 pl-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{candidate.name}</CardTitle>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">App No: {candidate.app_num}</p>
                    </div>
                    {/* Mild indicator that state token fee is paid */}
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-0">
                      <Banknote className="w-3 h-3 mr-1" />
                      Paid
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-grow flex flex-col justify-end pl-5">
                  {/* Richer Information Grid */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-2">
                    <div className="flex items-center text-muted-foreground">
                      <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                      <span>10th Reg: <span className="text-foreground font-medium">{candidate.reg_num}</span></span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      <span>DOB: <span className="text-foreground font-medium">{candidate.dob || "N/A"}</span></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t mt-2">
                    <Button 
                      variant="outline"
                      className="w-full bg-background" 
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      Process Admission
                      <UserPlus className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Abstracted Complex Dialog */}
      <AdmissionDialog 
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onSuccess={loadData}
      />
    </div>
  )
}