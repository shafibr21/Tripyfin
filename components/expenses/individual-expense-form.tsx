"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Member } from "@/types"

interface IndividualExpenseFormProps {
  expenseDescription: string
  setExpenseDescription: (description: string) => void
  individualExpenses: { [key: string]: string }
  setIndividualExpenses: (expenses: { [key: string]: string }) => void
  onAddIndividualExpense: () => void
  members: Member[]
  loading?: boolean
}

export function IndividualExpenseForm({
  expenseDescription,
  setExpenseDescription,
  individualExpenses,
  setIndividualExpenses,
  onAddIndividualExpense,
  members,
  loading,
}: IndividualExpenseFormProps) {
  const [errors, setErrors] = useState<{ description?: string; amounts?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { description?: string; amounts?: string } = {}

    if (!expenseDescription.trim()) {
      newErrors.description = "Description is required"
    }

    const hasValidAmounts = Object.values(individualExpenses).some(
      (amount) => amount.trim() !== "" && Number.parseFloat(amount) > 0,
    )

    if (!hasValidAmounts) {
      newErrors.amounts = "At least one member must have an expense amount"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onAddIndividualExpense()
    }
  }

  const totalAmount = Object.values(individualExpenses)
    .filter((amount) => amount.trim() !== "")
    .reduce((sum, amount) => sum + (Number.parseFloat(amount) || 0), 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="individualDescription">Description</Label>
        <Input
          id="individualDescription"
          placeholder="e.g., Lunch, Shopping"
          value={expenseDescription}
          onChange={(e) => {
            setExpenseDescription(e.target.value)
            if (errors.description) setErrors({ ...errors, description: undefined })
          }}
          className={errors.description ? "border-red-500" : ""}
          disabled={loading}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="space-y-3">
        <Label>Individual amounts</Label>
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-blue-600">{member.name.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm w-20 truncate flex-shrink-0">{member.name}</span>
              <Input
                type="number"
                placeholder="0"
                value={individualExpenses[member.id] || ""}
                onChange={(e) => {
                  setIndividualExpenses({
                    ...individualExpenses,
                    [member.id]: e.target.value,
                  })
                  if (errors.amounts) setErrors({ ...errors, amounts: undefined })
                }}
                disabled={loading}
                min="0"
                step="0.01"
                className="flex-1"
              />
            </div>
          ))}
        </div>
        {errors.amounts && <p className="text-sm text-red-500">{errors.amounts}</p>}
      </div>

      {totalAmount > 0 && (
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm font-medium">Total expense: ৳{totalAmount.toLocaleString()}</div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Adding...
          </>
        ) : (
          "Add Individual Expense"
        )}
      </Button>
    </form>
  )
}
