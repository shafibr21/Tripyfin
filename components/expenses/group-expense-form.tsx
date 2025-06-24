"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface GroupExpenseFormProps {
  expenseDescription: string
  setExpenseDescription: (description: string) => void
  groupExpenseAmount: string
  setGroupExpenseAmount: (amount: string) => void
  onAddGroupExpense: () => void
  memberCount: number
  loading?: boolean
}

export function GroupExpenseForm({
  expenseDescription,
  setExpenseDescription,
  groupExpenseAmount,
  setGroupExpenseAmount,
  onAddGroupExpense,
  memberCount,
  loading,
}: GroupExpenseFormProps) {
  const [errors, setErrors] = useState<{ description?: string; amount?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { description?: string; amount?: string } = {}

    if (!expenseDescription.trim()) {
      newErrors.description = "Description is required"
    }

    const amount = Number.parseFloat(groupExpenseAmount)
    if (!amount || amount <= 0) {
      newErrors.amount = "Please enter a valid amount"
    } else if (amount > 100000) {
      newErrors.amount = "Amount is too large"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onAddGroupExpense()
    }
  }

  const totalAmount = Number.parseFloat(groupExpenseAmount) * memberCount || 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="groupDescription">Description</Label>
        <Input
          id="groupDescription"
          placeholder="e.g., Bus fare, Hotel booking"
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

      <div className="space-y-2">
        <Label htmlFor="groupAmount">Amount per person (৳)</Label>
        <Input
          id="groupAmount"
          type="number"
          placeholder="0"
          value={groupExpenseAmount}
          onChange={(e) => {
            setGroupExpenseAmount(e.target.value)
            if (errors.amount) setErrors({ ...errors, amount: undefined })
          }}
          className={errors.amount ? "border-red-500" : ""}
          disabled={loading}
          min="0.01"
          step="0.01"
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
      </div>

      {totalAmount > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-sm">
            <div className="flex justify-between">
              <span>Per person:</span>
              <span>৳{Number.parseFloat(groupExpenseAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Members:</span>
              <span>{memberCount}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-1 mt-1">
              <span>Total:</span>
              <span>৳{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Adding...
          </>
        ) : (
          "Add Group Expense"
        )}
      </Button>
    </form>
  )
}
