"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, Wallet } from "lucide-react"
import type { TransactionDetail, Member, Expense, DepositRecord } from "@/types"

interface TransactionDetailModalProps {
  transactionDetail: TransactionDetail
  members: Member[]
  onCloseTransactionDetail: () => void
}

export function TransactionDetailModal({
  transactionDetail,
  members,
  onCloseTransactionDetail,
}: TransactionDetailModalProps) {
  if (!transactionDetail.isOpen || !transactionDetail.data) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                {transactionDetail.type === "expense" ? (
                  <Receipt className="h-5 w-5" />
                ) : (
                  <Wallet className="h-5 w-5" />
                )}
                {transactionDetail.type === "expense" ? "Expense Details" : "Deposit Details"}
              </CardTitle>
              <CardDescription>{transactionDetail.data.timestamp.toLocaleString()}</CardDescription>
            </div>
            <Button onClick={onCloseTransactionDetail} variant="ghost" size="sm">
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactionDetail.type === "expense"
            ? // Expense Details
              (() => {
                const expense = transactionDetail.data as Expense
                return (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Description:</span>
                        <span>{expense.description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Type:</span>
                        <Badge variant={expense.type === "group" ? "default" : "secondary"}>{expense.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold text-red-600">৳{expense.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {expense.type === "group" ? (
                      <div className="space-y-2 pt-2 border-t">
                        <h4 className="font-medium">Group Expense Breakdown:</h4>
                        <div className="flex justify-between">
                          <span>Amount per person:</span>
                          <span>৳{expense.perPersonAmount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Number of people:</span>
                          <span>{members.length}</span>
                        </div>
                        <div className="space-y-1 mt-2">
                          {members.map((member) => (
                            <div key={member.id} className="flex justify-between text-sm">
                              <span>{member.name}:</span>
                              <span>৳{expense.perPersonAmount?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2 border-t">
                        <h4 className="font-medium">Individual Expense Breakdown:</h4>
                        <div className="space-y-1">
                          {members.map((member) => {
                            const amount = expense.individualAmounts?.[member.id] || 0
                            return (
                              <div key={member.id} className="flex justify-between text-sm">
                                <span>{member.name}:</span>
                                <span className={amount > 0 ? "font-medium" : "text-muted-foreground"}>
                                  ৳{amount.toLocaleString()}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )
              })()
            : // Deposit Details
              (() => {
                const deposit = transactionDetail.data as DepositRecord
                return (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Member:</span>
                        <span>{deposit.memberName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Type:</span>
                        <Badge variant={deposit.type === "initial" ? "default" : "outline"}>{deposit.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Amount:</span>
                        <span className="font-bold text-green-600">+৳{deposit.amount.toLocaleString()}</span>
                      </div>
                      {deposit.description && (
                        <div className="flex justify-between">
                          <span className="font-medium">Description:</span>
                          <span>{deposit.description}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t">
                      <h4 className="font-medium mb-2">Impact on Balance:</h4>
                      <div className="text-sm text-muted-foreground">
                        This deposit increased the total lobby balance by ৳{deposit.amount.toLocaleString()}
                      </div>
                    </div>
                  </>
                )
              })()}
        </CardContent>
      </Card>
    </div>
  )
}
