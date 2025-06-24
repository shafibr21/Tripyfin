"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, AlertTriangle } from "lucide-react"
import { IndividualStatusItem } from "./individual-status-item"
import type { Member, Expense } from "@/types"

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
        {members.map((member) => (
          <IndividualStatusItem
            key={member.id}
            member={member}
            expenses={expenses}
            onOpenDepositModal={onOpenDepositModal}
          />
        ))}

        {totalRequiredContribution > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-medium text-red-800">Additional Contribution Needed</div>
                <div className="text-sm text-red-600">Total: ৳{totalRequiredContribution.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
