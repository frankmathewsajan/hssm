// frontend/app/dashboard/admissions/staging/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Search, UserCheck, Clock } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getStagedCandidates } from "@/actions/student"
import { AdmissionDialog } from "@/components/features/admissions/admission-dialog"

export default function StagingQueuePage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Dialog visibility state
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [isPermanent, setIsPermanent] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const queueData = await getStagedCandidates()
    setCandidates(queueData || [])
  }

  const openDialog = (candidate: any, perm: boolean) => {
    setSelectedCandidate(candidate)
    setIsPermanent(perm)
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
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="relative flex flex-col hover:border-primary/50 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/50"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{candidate.name}</CardTitle>
                <p className="text-sm font-mono text-muted-foreground mt-1">App: {candidate.app_num}</p>
              </CardHeader>
              
              <CardContent className="space-y-4 flex-grow flex flex-col justify-end">
                <div className="grid grid-cols-2 gap-2 text-sm bg-muted/20 p-3 rounded-md">
                  <div><span className="text-muted-foreground">10th Reg:</span> {candidate.reg_num}</div>
                  <div><span className="text-muted-foreground">Gender:</span> {candidate.gender_text}</div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                    size="sm"
                    onClick={() => openDialog(candidate, true)}
                  >
                    Admit
                    <UserCheck className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={() => openDialog(candidate, false)}
                  >
                    Temp Admit
                    <Clock className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Abstracted Complex Dialog */}
      <AdmissionDialog 
        candidate={selectedCandidate}
        isPermanent={isPermanent}
        onClose={() => setSelectedCandidate(null)}
        onSuccess={loadData}
      />
    </div>
  )
}