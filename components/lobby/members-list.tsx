"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { DepositDialog } from "./deposit-dialog"
import { InviteMemberDialog } from "./invite-member-dialog"

interface MembersListProps {
  members: Array<{
    userId: number
    calculatedBalance: number
    totalExpenses: number
    owes: number
    totalDeposited: number
    user: { name: string }
  }>
  isLeader: boolean
  lobbyId: number
  lobbyName: string
  initialDeposit: number
}

export function MembersList({ members, isLeader, lobbyId, lobbyName, initialDeposit }: MembersListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Members ({members.length})</h3>
        {isLeader && <InviteMemberDialog lobbyId={lobbyId} lobbyName={lobbyName} initialDeposit={initialDeposit} />}
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.userId}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.user.name}</p>
                      {/* Add leader badge if needed */}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Deposited: ৳{Number(member.totalDeposited).toFixed(2)}</p>
                      <p>Expenses: ৳{member.totalExpenses.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className={`font-semibold ${member.calculatedBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ৳{member.calculatedBalance.toFixed(2)}
                    </p>
                  </div>

                  {member.owes > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Owes ৳{member.owes.toFixed(2)}
                    </Badge>
                  )}

                  <DepositDialog lobbyId={lobbyId} userId={member.userId} userName={member.user.name} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
