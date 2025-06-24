"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface InitialDepositFormProps {
  depositAmount: string
  setDepositAmount: (amount: string) => void
  onCollectDeposits: () => void
  memberCount: number
  loading?: boolean
}

export function InitialDepositForm({
  depositAmount,
  setDepositAmount,
  onCollectDeposits,
  memberCount,
  loading,
}: InitialDepositFormProps) {
  const [error, setError] = useState<string>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amount = Number.parseFloat(depositAmount)
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (amount > 1000000) {
      setError("Amount is too large")
      return
    }

    setError(undefined)
    onCollectDeposits()
  }

  const totalAmount = Number.parseFloat(depositAmount) * memberCount || 0

  return (
    <div className="space-y-4 pt-4 border-t">
      <div>
        <Label className="text-base font-medium">Initial Deposit Setup</Label>
        <p className="text-sm text-muted-foreground">Each member will deposit the same amount</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="depositAmount">Amount per person (৳)</Label>
          <Input
            id="depositAmount"
            type="number"
            placeholder="0"
            value={depositAmount}
            onChange={(e) => {
              setDepositAmount(e.target.value)
              if (error) setError(undefined)
            }}
            className={error ? "border-red-500" : ""}
            disabled={loading}
            min="1"
            step="0.01"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {totalAmount > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm">
              <div className="flex justify-between">
                <span>Members:</span>
                <span>{memberCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Per person:</span>
                <span>৳{Number.parseFloat(depositAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1 mt-1">
                <span>Total:</span>
                <span>৳{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={!depositAmount || loading}>
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Collect Deposits
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
