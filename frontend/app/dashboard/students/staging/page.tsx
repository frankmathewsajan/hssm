"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, UserCheck, Clock } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStagedCandidates, admitStagedCandidate, getAdmissionLookups } from "@/actions/student"

export default function StagingQueuePage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<any[]>([])
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isProcessing, setIsProcessing] = useState<number | null>(null)
  
  // Track selected class for each candidate card independently
  const [selectedClasses, setSelectedClasses] = useState<Record<number, string>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [queueData, metaData] = await Promise.all([
      getStagedCandidates(),
      getAdmissionLookups()
    ])
    setCandidates(queueData || [])
    if (metaData?.classes) setClasses(metaData.classes)
  }

  const handleClassSelect = (candidateId: number, classIdStr: string) => {
    setSelectedClasses(prev => ({ ...prev, [candidateId]: classIdStr }))
  }

  const handleAdmit = async (candidateId: number, isPermanent: boolean) => {
    const classId = Number(selectedClasses[candidateId])
    if (!classId) {
      toast.error("Please select a class first.")
      return
    }

    setIsProcessing(candidateId)
    try {
      const response = await admitStagedCandidate(candidateId, classId, isPermanent)
      toast.success("Admission Complete!", { description: response.detail })
      await loadData() // Refresh the queue
    } catch (error: any) {
      toast.error("Admission Error", { description: error.message })
    } finally {
      setIsProcessing(null)
    }
  }

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.app_num.includes(searchTerm)
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbound Waiting Room</h1>
          <p className="text-muted-foreground mt-1">
            {candidates.length} candidates staged from HSCAP awaiting physical admission.
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
          <p className="text-muted-foreground">Queue is empty. Upload an HSCAP allotment to populate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => {
            const hasClassSelected = !!selectedClasses[candidate.id]
            
            return (
              <Card key={candidate.id} className="relative overflow-hidden hover:border-primary/50 transition-colors flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50"></div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{candidate.name}</CardTitle>
                      <p className="text-sm font-mono text-muted-foreground mt-1">App: {candidate.app_num}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-grow flex flex-col justify-end">
                  <div className="grid grid-cols-2 gap-2 text-sm bg-muted/20 p-3 rounded-md">
                    <div><span className="text-muted-foreground">10th Reg:</span> {candidate.reg_num}</div>
                    <div><span className="text-muted-foreground">Gender:</span> {candidate.gender_text}</div>
                    <div className="col-span-2"><span className="text-muted-foreground">Lang:</span> {candidate.second_language_text}</div>
                  </div>
                  
                  {/* The New Class Selector */}
                  <div className="pt-2">
                    <Select onValueChange={(val) => handleClassSelect(candidate.id, val)}>
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Assign physical classroom..." />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white" 
                      size="sm"
                      disabled={isProcessing !== null || !hasClassSelected}
                      onClick={() => handleAdmit(candidate.id, true)}
                    >
                      {isProcessing === candidate.id ? "Admitting..." : "Admit Student"}
                      <UserCheck className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="sm"
                      disabled={isProcessing !== null || !hasClassSelected}
                      onClick={() => handleAdmit(candidate.id, false)}
                    >
                      Temp Admit
                      <Clock className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}