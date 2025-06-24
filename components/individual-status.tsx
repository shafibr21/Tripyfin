"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Wallet } from "lucide-react"
import type { Member, Expense } from "@/types"
import { calculateIndividualBalance, calculateRequiredContribution } from "@/utils/calculations"

interface IndividualStatusProps {
  members: Member[]
  expenses: Expense[]
  totalRequiredContribution: number
  onOpenDepositModal: (memberId: string, memberName: string) => void
}

export function IndividualStatus({
  members,
  expenses,
  totalRequiredContribution,
  onOpenDepositModal,
}: IndividualStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Individual Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.map((member) => {
          const balance = calculateIndividualBalance(member, expenses)
          const required = calculateRequiredContribution(member, expenses)
          return (
            <div key={member.id} className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{member.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ৳{balance.toLocaleString()}
                  </span>
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
              <div className="text-xs text-muted-foreground mb-1">
                Initial: ৳{member.initialDeposit.toLocaleString()}
                {member.additionalDeposits > 0 && (
                  <span> + Additional: ৳{member.additionalDeposits.toLocaleString()}</span>
                )}
              </div>
              {required > 0 && (
                <div className="text-sm text-red-600">Needs to contribute: ৳{required.toLocaleString()}</div>
              )}
            </div>
          )
        })}
        {totalRequiredContribution > 0 && (
          <div className="pt-2 border-t">
            <div className="text-sm font-medium text-red-600">
              Total additional contribution needed: ৳{totalRequiredContribution.toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
