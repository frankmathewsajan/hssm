"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { studentColumns, type StudentRow } from "./columns";
import { AdmissionDialog } from "@/components/dashboard/admission-dialog";

type DataTableProps = {
  data: StudentRow[];
  columns?: ColumnDef<StudentRow>[];
  title?: string;
  description?: string;
};

export function StudentDataTable({
  data,
  columns = studentColumns,
  title = "Students",
  description = "Browse, search, and paginate the active roster.",
}: DataTableProps) {
  const rows = data;
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter },
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).trim().toLowerCase();
      if (!query) return true;
      return (
        row.original.name.toLowerCase().includes(query) ||
        String(row.original.ad_num).includes(query)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-6">
      {/* Header with Add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 font-geist-sans">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {description}
          </p>
        </div>
        <AdmissionDialog />
      </div>

      {/* Search box */}
      <Input
        value={globalFilter}
        onChange={(e) => {
          setGlobalFilter(e.target.value);
          table.setPageIndex(0);
        }}
        placeholder="Search students..."
        className="h-10 sm:max-w-70 bg-white shadow-xs rounded-lg border-slate-200"
      />

      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 text-slate-600 font-bold tracking-tight"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group transition-colors hover:bg-slate-50/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground font-medium italic"
                >
                  No matches found for your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
        <p className="text-sm text-slate-500 font-semibold tracking-tight">
          {table.getFilteredRowModel().rows.length
            ? `SHOWING ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - ${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} OF ${table.getFilteredRowModel().rows.length} ENTRIES`
            : "0 ENTRIES FOUND"}
        </p>
        <Pagination className="justify-start sm:justify-end">
          <PaginationContent className="gap-2">
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-9 px-4 rounded-lg border-slate-200 font-bold text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
              >
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-9 px-4 rounded-lg border-slate-200 font-bold text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}