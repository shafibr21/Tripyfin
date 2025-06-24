"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet } from "lucide-react"
import type { DepositModal } from "@/types"

interface DepositModalProps {
  depositModal: DepositModal
  additionalDepositAmount: string
  setAdditionalDepositAmount: (amount: string) => void
  onAddAdditionalDeposit: () => void
  onCloseDepositModal: () => void
}

export function DepositModalComponent({
  depositModal,
  additionalDepositAmount,
  setAdditionalDepositAmount,
  onAddAdditionalDeposit,
  onCloseDepositModal,
}: DepositModalProps) {
  if (!depositModal.isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Deposit</CardTitle>
          <CardDescription>Add additional deposit for {depositModal.memberName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="additionalDeposit">Deposit Amount (৳)</Label>
            <Input
              id="additionalDeposit"
              type="number"
              placeholder="Enter amount"
              value={additionalDepositAmount}
              onChange={(e) => setAdditionalDepositAmount(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddAdditionalDeposit} className="flex-1" disabled={!additionalDepositAmount}>
              <Wallet className="mr-2 h-4 w-4" />
              Add Deposit
            </Button>
            <Button onClick={onCloseDepositModal} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
