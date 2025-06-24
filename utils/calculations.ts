import type { Member, Expense } from "@/types"

export const calculateTotalBalance = (members: Member[], expenses: Expense[]): number => {
  return (
    members.reduce((sum, member) => sum + member.initialDeposit + member.additionalDeposits, 0) -
    expenses.reduce((sum, expense) => sum + expense.totalAmount, 0)
  )
}

export const calculateIndividualBalance = (member: Member, expenses: Expense[]): number => {
  const groupExpenseShare = expenses
    .filter((exp) => exp.type === "group")
    .reduce((sum, exp) => sum + (exp.perPersonAmount || 0), 0)

  return member.initialDeposit + member.additionalDeposits - groupExpenseShare - member.individualExpenses
}

export const calculateRequiredContribution = (member: Member, expenses: Expense[]): number => {
  const balance = calculateIndividualBalance(member, expenses)
  return balance < 0 ? Math.abs(balance) : 0
}

export const calculateTotalRequiredContribution = (members: Member[], expenses: Expense[]): number => {
  return members.reduce((sum, member) => sum + calculateRequiredContribution(member, expenses), 0)
}

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.totalAmount, 0)
}

export const calculateTotalDeposits = (deposits: any[]): number => {
  return deposits.reduce((sum, deposit) => sum + deposit.amount, 0)
}
