// frontend/components/forms/lookup-select.tsx
"use client"

import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { StudentAdmissionFormValues, LookupItem } from "@/lib/validations/student"

interface LookupSelectProps {
  name: keyof StudentAdmissionFormValues
  label: string
  items: LookupItem[]
  form: UseFormReturn<StudentAdmissionFormValues>
  disabled?: boolean
}

export function LookupSelect({ name, label, items, form, disabled }: LookupSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold text-slate-700">{label}</FormLabel>
          <Select 
            name={name}
            onValueChange={field.onChange} 
            value={field.value ? String(field.value) : ""} 
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={`h-11 rounded-xl ${disabled ? "bg-slate-50 opacity-70" : "bg-white"}`}>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-xs font-medium" />
        </FormItem>
      )}
    />
  )
}