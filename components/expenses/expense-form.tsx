"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Receipt } from "lucide-react"
import { GroupExpenseForm } from "./group-expense-form"
import { IndividualExpenseForm } from "./individual-expense-form"
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
  loading?: boolean
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
  loading,
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

          <TabsContent value="group" className="mt-4">
            <GroupExpenseForm
              expenseDescription={expenseDescription}
              setExpenseDescription={setExpenseDescription}
              groupExpenseAmount={groupExpenseAmount}
              setGroupExpenseAmount={setGroupExpenseAmount}
              onAddGroupExpense={onAddGroupExpense}
              memberCount={members.length}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="individual" className="mt-4">
            <IndividualExpenseForm
              expenseDescription={expenseDescription}
              setExpenseDescription={setExpenseDescription}
              individualExpenses={individualExpenses}
              setIndividualExpenses={setIndividualExpenses}
              onAddIndividualExpense={onAddIndividualExpense}
              members={members}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
