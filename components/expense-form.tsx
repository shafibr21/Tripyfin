"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Receipt } from "lucide-react"
import type { Member } from "@/types"

interface ExpenseFormProps {
  expenseType: "group" | "individual"
  setExpenseType: (type: "group" | "individual") => void
  expenseDescription: string
  setExpenseDescription: (description: string) => void
  groupExpenseAmount: string
  setGroupExpenseAmount: (amount: string) => void
  individualExpenses: { [key: string]: string }
  setIndividualExpenses: (expenses: { [key: string]: string }) => void
  members: Member[]
  onAddGroupExpense: () => void
  onAddIndividualExpense: () => void
}

export function ExpenseForm({
  expenseType,
  setExpenseType,
  expenseDescription,
  setExpenseDescription,
  groupExpenseAmount,
  setGroupExpenseAmount,
  individualExpenses,
  setIndividualExpenses,
  members,
  onAddGroupExpense,
  onAddIndividualExpense,
}: ExpenseFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Add Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={expenseType} onValueChange={(value) => setExpenseType(value as "group" | "individual")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="group">Group Expense</TabsTrigger>
            <TabsTrigger value="individual">Individual Expense</TabsTrigger>
          </TabsList>

          <TabsContent value="group" className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g., Bus fare, Hotel booking"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount per person (৳)</Label>
              <Input
                type="number"
                placeholder="0"
                value={groupExpenseAmount}
                onChange={(e) => setGroupExpenseAmount(e.target.value)}
              />
            </div>
            <Button onClick={onAddGroupExpense} className="w-full">
              Add Group Expense
            </Button>
            {groupExpenseAmount && (
              <div className="text-sm text-muted-foreground">
                Total: ৳{(Number.parseFloat(groupExpenseAmount) * members.length).toLocaleString()}
              </div>
            )}
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g., Lunch, Shopping"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label>Individual amounts</Label>
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <span className="text-sm w-20 truncate">{member.name}</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={individualExpenses[member.id] || ""}
                    onChange={(e) =>
                      setIndividualExpenses({
                        ...individualExpenses,
                        [member.id]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <Button onClick={onAddIndividualExpense} className="w-full">
              Add Individual Expense
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
