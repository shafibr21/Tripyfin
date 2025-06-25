import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import type { LobbyWithDetails } from "@/types"

interface LobbyBalanceProps {
  lobby: LobbyWithDetails
  memberBalances: Array<{
    userId: number
    calculatedBalance: number
    totalExpenses: number
    owes: number
    user: { name: string }
  }>
}

export function LobbyBalance({ lobby, memberBalances }: LobbyBalanceProps) {
  const totalDeposits = memberBalances.reduce((sum, member) => sum + member.calculatedBalance + member.totalExpenses, 0)
  const totalExpenses = memberBalances.reduce((sum, member) => sum + member.totalExpenses, 0)
  const currentBalance = lobby.totalBalance

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={currentBalance >= 0 ? "text-green-600" : "text-red-600"}>
              ৳{Math.abs(currentBalance).toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{currentBalance >= 0 ? "Available funds" : "Deficit amount"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">৳{totalDeposits.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            ৳{(totalDeposits / memberBalances.length).toFixed(2)} per person avg
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">৳{totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            ৳{(totalExpenses / memberBalances.length).toFixed(2)} per person avg
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
