import { prisma } from "@/lib/prisma"
import type { Deposit } from "@prisma/client"

export async function createDeposit(
  lobbyId: string,
  memberId: string,
  amount: number,
  type: "INITIAL" | "ADDITIONAL",
  description?: string,
): Promise<Deposit> {
  return await prisma.$transaction(async (tx) => {
    // Create the deposit record
    const deposit = await tx.deposit.create({
      data: {
        amount,
        type,
        description,
        lobbyId,
        memberId,
      },
    })

    // Update member's deposit amounts
    if (type === "INITIAL") {
      await tx.member.update({
        where: { id: memberId },
        data: {
          initialDeposit: amount,
        },
      })
    } else {
      await tx.member.update({
        where: { id: memberId },
        data: {
          additionalDeposits: {
            increment: amount,
          },
        },
      })
    }

    return deposit
  })
}

export async function createInitialDepositsForAllMembers(
  lobbyId: string,
  memberIds: string[],
  amount: number,
): Promise<Deposit[]> {
  return await prisma.$transaction(async (tx) => {
    const deposits: Deposit[] = []

    for (const memberId of memberIds) {
      const deposit = await tx.deposit.create({
        data: {
          amount,
          type: "INITIAL",
          description: "Initial deposit",
          lobbyId,
          memberId,
        },
      })

      await tx.member.update({
        where: { id: memberId },
        data: {
          initialDeposit: amount,
        },
      })

      deposits.push(deposit)
    }

    return deposits
  })
}
