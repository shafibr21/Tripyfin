"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LobbyHeaderProps {
  lobbyName: string
  totalBalance: number
}

export function LobbyHeader({ lobbyName, totalBalance }: LobbyHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{lobbyName}</CardTitle>
            <CardDescription>Travel Expense Tracker</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">৳{totalBalance.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Balance</div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
