import { prisma } from "@/lib/prisma"
import type { Expense } from "@prisma/client"

export async function createGroupExpense(
  lobbyId: string,
  description: string,
  perPersonAmount: number,
  memberCount: number,
): Promise<Expense> {
  const totalAmount = perPersonAmount * memberCount

  return await prisma.expense.create({
    data: {
      type: "GROUP",
      description,
      totalAmount,
      perPersonAmount,
      lobbyId,
    },
  })
}

export async function createIndividualExpense(
  lobbyId: string,
  description: string,
  individualAmounts: { memberId: string; amount: number }[],
): Promise<Expense> {
  const totalAmount = individualAmounts.reduce((sum, item) => sum + item.amount, 0)

  return await prisma.$transaction(async (tx) => {
    // Create the expense
    const expense = await tx.expense.create({
      data: {
        type: "INDIVIDUAL",
        description,
        totalAmount,
        lobbyId,
      },
    })

    // Create individual expense records
    await tx.expenseIndividual.createMany({
      data: individualAmounts.map((item) => ({
        expenseId: expense.id,
        memberId: item.memberId,
        amount: item.amount,
      })),
    })

    // Update member individual expenses
    for (const item of individualAmounts) {
      await tx.member.update({
        where: { id: item.memberId },
        data: {
          individualExpenses: {
            increment: item.amount,
          },
        },
      })
    }

    return expense
  })
}
