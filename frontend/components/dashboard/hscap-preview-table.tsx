// frontend/components/dashboard/hscap-preview-table.tsx
"use client"

import { useState } from "react"
import { CheckCircle2, UserPlus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PreviewTableProps {
  data: any
  classes: { id: number; name: string }[]
  onConfirm: (classId: number) => void
  isConfirming: boolean
}

export function HscapPreviewTable({ data, classes, onConfirm, isConfirming }: PreviewTableProps) {
  const [selectedClass, setSelectedClass] = useState<string>("")

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Control Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-primary/20 bg-primary/5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold text-primary">Extraction Successful</h3>
            <p className="text-sm text-muted-foreground">
              Found {data.students.length} students for {data.course_info}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Assign to Class..." />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id.toString()}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={() => onConfirm(Number(selectedClass))} 
            disabled={!selectedClass || isConfirming}
            className="w-full sm:w-auto"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isConfirming ? "Importing..." : "Confirm & Import"}
          </Button>
        </div>
      </Card>

      {/* Data Review Table */}
      <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">App No.</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>10th Reg No</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>2nd Language</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.students.map((student: any, i: number) => (
              <TableRow key={i}>
                <TableCell className="font-mono text-xs">{student.app_num}</TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-muted-foreground">{student.reg_num}</TableCell>
                <TableCell>{student.dob}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.second_language}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}