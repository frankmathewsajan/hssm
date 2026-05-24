import type { ColumnDef } from "@tanstack/react-table"

export interface StudentRow {
  id: number
  ad_num: number
  name: string
  gender_name: string
  class_name: string
}

export const studentColumns: ColumnDef<StudentRow>[] = [
  {
    accessorKey: "ad_num",
    header: "Admission No.",
    cell: ({ row }) => row.getValue("ad_num"),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "gender_name",
    header: "Gender",
    cell: ({ row }) => row.getValue("gender_name"),
  },
  {
    accessorKey: "class_name",
    header: "Class",
    cell: ({ row }) => row.getValue("class_name"),
  },
]