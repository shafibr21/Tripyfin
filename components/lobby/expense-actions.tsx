"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Receipt, Users } from "lucide-react"
import { AddExpenseDialog } from "./add-expense-dialog"
import { DepositDialog } from "./deposit-dialog"
import type { LobbyMember } from "@/types"

interface ExpenseActionsProps {
  lobbyId: number
  isLeader: boolean
  members: LobbyMember[]
}

export function ExpenseActions({ lobbyId, isLeader, members }: ExpenseActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLeader && (
          <>
            <AddExpenseDialog
              lobbyId={lobbyId}
              members={members}
              type="equal"
              trigger={
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Add Equal Expense
                </Button>
              }
            />

            <AddExpenseDialog
              lobbyId={lobbyId}
              members={members}
              type="individual"
              trigger={
                <Button className="w-full justify-start" variant="outline">
                  <Receipt className="h-4 w-4 mr-2" />
                  Add Individual Expense
                </Button>
              }
            />
          </>
        )}

        <DepositDialog
          lobbyId={lobbyId}
          trigger={
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Make Deposit
            </Button>
          }
        />
      </CardContent>
    </Card>
  )
}
