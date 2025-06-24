"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Expense, DepositRecord } from "@/types"
import { calculateTotalExpenses, calculateTotalDeposits } from "@/utils/calculations"

interface TransactionHistoryProps {
  expenses: Expense[]
  deposits: DepositRecord[]
  onOpenTransactionDetail: (type: "expense" | "deposit", data: Expense | DepositRecord) => void
}

export function TransactionHistory({ expenses, deposits, onOpenTransactionDetail }: TransactionHistoryProps) {
  const totalExpenses = calculateTotalExpenses(expenses)
  const totalDeposits = calculateTotalDeposits(deposits)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
            <TabsTrigger value="deposits">Deposits ({deposits.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4 mt-4">
            {/* Total Expenses Summary */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-red-800">Total Expenses</span>
                <span className="text-xl font-bold text-red-600">৳{totalExpenses.toLocaleString()}</span>
              </div>
              <div className="text-sm text-red-600 mt-1">
                {expenses.filter((e) => e.type === "group").length} group •{" "}
                {expenses.filter((e) => e.type === "individual").length} individual
              </div>
            </div>

            {expenses.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No expenses recorded yet</div>
            ) : (
              <div className="space-y-3">
                {expenses
                  .slice()
                  .reverse()
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => onOpenTransactionDetail("expense", expense)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{expense.description}</span>
                        <Badge variant={expense.type === "group" ? "default" : "secondary"}>{expense.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total: ৳{expense.totalAmount.toLocaleString()}
                      </div>
                      {expense.type === "group" && (
                        <div className="text-sm text-muted-foreground">৳{expense.perPersonAmount} per person</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">{expense.timestamp.toLocaleString()}</div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="deposits" className="space-y-4 mt-4">
            {/* Total Deposits Summary */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">Total Deposits</span>
                <span className="text-xl font-bold text-green-600">৳{totalDeposits.toLocaleString()}</span>
              </div>
              <div className="text-sm text-green-600 mt-1">
                {deposits.filter((d) => d.type === "initial").length} initial •{" "}
                {deposits.filter((d) => d.type === "additional").length} additional
              </div>
            </div>

            {deposits.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No deposits recorded yet</div>
            ) : (
              <div className="space-y-3">
                {deposits
                  .slice()
                  .reverse()
                  .map((deposit) => (
                    <div
                      key={deposit.id}
                      className="p-3 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                      onClick={() => onOpenTransactionDetail("deposit", deposit)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{deposit.memberName}</span>
                        <Badge variant={deposit.type === "initial" ? "default" : "outline"}>{deposit.type}</Badge>
                      </div>
                      <div className="text-sm text-green-700">+৳{deposit.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground mt-1">{deposit.timestamp.toLocaleString()}</div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
