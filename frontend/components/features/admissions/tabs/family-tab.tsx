"use client"

import { ToWords } from "to-words"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Initialize ToWords with explicit Indian numbering system settings
const toWordsConverter = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: true,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paise",
        plural: "Paise",
        symbol: "",
      },
    },
  },
})

export function FamilyTab({ formData, setFormData }: any) {
  const currentGuardianName = formData?.guardian_name || ""
  const currentRelationship = formData?.relationship || "father"
  const currentPmtPhone = formData?.pmt_phone || ""
  const currentAnnualIncome = formData?.annual_income || ""

  const getIncomeInIndianWords = (amountStr: string): string => {
    const value = parseInt(amountStr, 10)
    if (isNaN(value) || value < 0) return ""
    if (value === 0) return "Zero Rupees Only"
    
    try {
      // Returns proper Indian formatting (e.g., "One Lakh Fifty Thousand Rupees Only")
      return toWordsConverter.convert(value)
    } catch (e) {
      return ""
    }
  }

  const incomeWordsPreview = getIncomeInIndianWords(currentAnnualIncome)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
      <div className="grid gap-2">
        <Label htmlFor="guardian" className="text-sm font-semibold text-slate-900">
          Guardian Name <span className="text-red-500">*</span>
        </Label>
        <Input 
          id="guardian" 
          value={currentGuardianName} 
          onChange={(e) => setFormData((prev: any) => ({ ...prev, guardian_name: e.target.value }))}
          className="h-11 border-slate-200"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="relation" className="text-sm font-semibold text-slate-900">
          Relationship to Student <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={currentRelationship} 
          onValueChange={(val) => setFormData((prev: any) => ({ ...prev, relationship: val }))}
        >
          <SelectTrigger className="h-11 border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="father">Father</SelectItem>
            <SelectItem value="mother">Mother</SelectItem>
            <SelectItem value="relative">Other Relative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone" className="text-sm font-semibold text-slate-900">
          Contact Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input 
          id="phone" 
          type="tel" 
          maxLength={10} 
          value={currentPmtPhone} 
          onChange={(e) => setFormData((prev: any) => ({ ...prev, pmt_phone: e.target.value }))}
          className="h-11 font-mono tracking-widest border-slate-200" 
          placeholder="10-digit mobile"
        />
      </div>

      <div className="grid gap-2 relative">
        <Label htmlFor="income" className="text-sm font-semibold text-slate-900">
          Annual Family Income (₹) <span className="text-red-500">*</span>
        </Label>
        <Input 
          id="income" 
          type="number" 
          value={currentAnnualIncome} 
          onChange={(e) => setFormData((prev: any) => ({ ...prev, annual_income: e.target.value }))}
          className="h-11 font-mono border-slate-200"
          placeholder="e.g. 150000"
        />
        
        {incomeWordsPreview && (
          <div className="absolute -bottom-5 left-0.5 text-[10px] font-bold text-slate-500 max-w-full truncate uppercase tracking-wide animate-in fade-in duration-300">
            {incomeWordsPreview}
          </div>
        )}
      </div>
    </div>
  )
}