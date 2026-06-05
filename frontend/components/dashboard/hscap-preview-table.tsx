// frontend/components/dashboard/hscap-preview-table.tsx
"use client"

import { useState, useMemo } from "react"
import { CheckCircle2, Users, Search, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PreviewTableProps {
  data: any
  onConfirm: () => void
  isConfirming: boolean
}

export function HscapPreviewTable({ data, onConfirm, isConfirming }: PreviewTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  // 1. Clean the Option string
  const cleanOption = (optStr: string) => optStr?.replace(/Opt\s?/i, '').replace(/\(Perm\)/i, '').trim() || "0"

  // 2. Handle Column Sorting Logic
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
  }

  // 3. Process Data: Filter -> Sort (Memoized for extreme performance)
  const processedStudents = useMemo(() => {
    let students = [...data.students]

    // Search Filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      students = students.filter(s => 
        s.name?.toLowerCase().includes(lowerSearch) || 
        s.app_num?.includes(lowerSearch)
      )
    }

    // Universal Sort Engine
    if (sortConfig) {
      students.sort((a, b) => {
        let aVal = a[sortConfig.key] || ""
        let bVal = b[sortConfig.key] || ""

        // Extract raw numbers for Rank/Option
        if (sortConfig.key === 'rank' || sortConfig.key === 'option') {
          aVal = parseInt(String(aVal).replace(/\D/g, '')) || 0
          bVal = parseInt(String(bVal).replace(/\D/g, '')) || 0
        } else {
          // Safe string comparison
          aVal = String(aVal).toLowerCase()
          bVal = String(bVal).toLowerCase()
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return students
  }, [data.students, searchTerm, sortConfig])

  // Helper for sortable headers
  const SortableHead = ({ label, sortKey }: { label: string, sortKey: string }) => (
    <TableHead>
      <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[active=true]:bg-muted hover:bg-muted/50" onClick={() => handleSort(sortKey)}>
        {label}
        <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground" />
      </Button>
    </TableHead>
  )

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Control Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-primary/20 bg-primary/5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold text-primary">Extraction Successful</h3>
            <p className="text-sm text-muted-foreground">
              {data.students.length} candidates extracted for {data.course_info}
            </p>
          </div>
        </div>
        <Button onClick={onConfirm} disabled={isConfirming} className="w-full md:w-auto">
          <Users className="h-4 w-4 mr-2" />
          {isConfirming ? "Staging Candidates..." : "Push to Staging Queue"}
        </Button>
      </Card>

      {/* Filter and Table Card */}
      <div className="border rounded-xl bg-background shadow-sm overflow-hidden flex flex-col">
        
        {/* Simple Search Filter */}
        <div className="p-4 border-b bg-muted/20 flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by Name or App No..." 
              className="pl-9 bg-background" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground ml-auto pr-2">
            Showing {processedStudents.length} of {data.students.length}
          </div>
        </div>

        {/* Data Review Table */}
        <div className="overflow-x-auto">
          <Table className="whitespace-nowrap">
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <SortableHead label="App No." sortKey="app_num" />
                <SortableHead label="Rank" sortKey="rank" />
                <SortableHead label="Option" sortKey="option" />
                <SortableHead label="Student Name" sortKey="name" />
                <SortableHead label="10th Reg No" sortKey="reg_num" />
                <SortableHead label="DOB" sortKey="dob" />
                <SortableHead label="Gender" sortKey="gender" />
                <SortableHead label="2nd Lang" sortKey="second_language" />
                <SortableHead label="Fee Status" sortKey="fee_status" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No candidates found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                processedStudents.map((student: any, i: number) => {
                  const optionNum = cleanOption(student.option)
                  const isPerm = optionNum === "1"

                  return (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {student.app_num}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-background">
                          {student.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={isPerm ? "default" : "secondary"}
                          className={isPerm ? "bg-green-600/10 text-green-700 hover:bg-green-600/20 border-green-600/20" : "bg-muted text-muted-foreground"}
                        >
                          {optionNum}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold tracking-tight">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{student.reg_num}</TableCell>
                      <TableCell>{student.dob}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.second_language}</TableCell>
                      <TableCell>
                        <Badge variant={student.fee_status?.toLowerCase().includes("paid") ? "default" : "outline"}>
                          {student.fee_status || "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}