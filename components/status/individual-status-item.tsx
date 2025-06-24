"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, AlertTriangle } from "lucide-react"
import type { Member, Expense } from "@/types"
import { calculateIndividualBalance, calculateRequiredContribution } from "@/utils/calculations"

interface IndividualStatusItemProps {
  member: Member
  expenses: Expense[]
  onOpenDepositModal: (memberId: string, memberName: string) => void
}

export function IndividualStatusItem({ member, expenses, onOpenDepositModal }: IndividualStatusItemProps) {
  const balance = calculateIndividualBalance(member, expenses)
  const required = calculateRequiredContribution(member, expenses)

  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">{member.name.charAt(0).toUpperCase()}</span>
          </div>
          <span className="font-medium">{member.name}</span>
          {member.isLeader && (
            <Badge variant="secondary" size="sm">
              Leader
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className={`font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              ৳{balance.toLocaleString()}
            </div>
            {balance < 0 && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertTriangle className="h-3 w-3" />
                Owes money
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenDepositModal(member.id, member.name)}
            className="h-8 w-8 p-0"
          >
            <Wallet className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Initial deposit:</span>
          <span>৳{member.initialDeposit.toLocaleString()}</span>
        </div>
        {member.additionalDeposits > 0 && (
          <div className="flex justify-between">
            <span>Additional deposits:</span>
            <span>৳{member.additionalDeposits.toLocaleString()}</span>
          </div>
        )}
        {member.individualExpenses > 0 && (
          <div className="flex justify-between">
            <span>Individual expenses:</span>
            <span>৳{member.individualExpenses.toLocaleString()}</span>
          </div>
        )}
      </div>

      {required > 0 && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Needs to contribute: ৳{required.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
