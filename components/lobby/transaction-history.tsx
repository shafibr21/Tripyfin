"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrendingUp, TrendingDown, Receipt, Users, Eye } from "lucide-react"
import { format } from "date-fns"
import type { Transaction } from "@/types"

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const totalDeposits = transactions.filter((t) => t.type === "deposit").reduce((sum, t) => sum + t.totalAmount, 0)

  const totalExpenses = transactions.filter((t) => t.type !== "deposit").reduce((sum, t) => sum + t.totalAmount, 0)

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "expense_equal":
        return <Users className="h-4 w-4 text-red-600" />
      case "expense_individual":
        return <Receipt className="h-4 w-4 text-red-600" />
      default:
        return <Receipt className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    return type === "deposit" ? "text-green-600" : "text-red-600"
  }

  const getTransactionSign = (type: string) => {
    return type === "deposit" ? "+" : "-"
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400">Transactions will appear here as they are added</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳{totalDeposits.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter((t) => t.type === "deposit").length} transactions
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
              {transactions.filter((t) => t.type !== "deposit").length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>All deposits and expenses in chronological order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 hover:text-black transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>by {transaction.creator.name}</span>
                      <span>•</span>
                      <span>{format(new Date(transaction.createdAt), "MMM dd, yyyy 'at' HH:mm")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {getTransactionSign(transaction.type)}৳{transaction.totalAmount.toFixed(2)}
                  </span>

                  <Badge variant={transaction.type === "deposit" ? "default" : "secondary"}>
                    {transaction.type === "deposit"
                      ? "Deposit"
                      : transaction.type === "expense_equal"
                        ? "Equal Split"
                        : "Individual"}
                  </Badge>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                        <DialogDescription>
                          {format(new Date(transaction.createdAt), "MMMM dd, yyyy 'at' HH:mm")}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-sm text-gray-600">{transaction.description}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Amount</h4>
                          <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                            {getTransactionSign(transaction.type)}৳{transaction.totalAmount.toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Type</h4>
                          <Badge variant={transaction.type === "deposit" ? "default" : "secondary"}>
                            {transaction.type === "deposit"
                              ? "Deposit"
                              : transaction.type === "expense_equal"
                                ? "Equal Split Expense"
                                : "Individual Expense"}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Created by</h4>
                          <p className="text-sm text-gray-600">{transaction.creator.name}</p>
                        </div>

                        {transaction.details && transaction.details.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Individual Breakdown</h4>
                            <div className="space-y-2">
                              {transaction.details.map((detail) => (
                                <div key={detail.id} className="flex justify-between text-sm">
                                  <span>{detail.user.name}</span>
                                  <span className="font-medium">৳{detail.amount.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
