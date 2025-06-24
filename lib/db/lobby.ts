import { prisma } from "@/lib/prisma"
import type { Lobby, Member, Expense, Deposit } from "@prisma/client"

export type LobbyWithDetails = Lobby & {
  members: Member[]
  expenses: (Expense & {
    individualExpenses: {
      id: string
      amount: number
      memberId: string
    }[]
  })[]
  deposits: Deposit[]
}

export async function createLobby(name: string): Promise<Lobby> {
  return await prisma.lobby.create({
    data: {
      name,
    },
  })
}

export async function getLobbyById(id: string): Promise<LobbyWithDetails | null> {
  return await prisma.lobby.findUnique({
    where: { id },
    include: {
      members: true,
      expenses: {
        include: {
          individualExpenses: true,
        },
        orderBy: {
          timestamp: "desc",
        },
      },
      deposits: {
        orderBy: {
          timestamp: "desc",
        },
      },
    },
  })
}

export async function addMemberToLobby(lobbyId: string, name: string, isLeader = false): Promise<Member> {
  return await prisma.member.create({
    data: {
      name,
      isLeader,
      lobbyId,
    },
  })
}

export async function updateMemberDeposits(
  memberId: string,
  initialDeposit?: number,
  additionalDeposits?: number,
): Promise<Member> {
  const updateData: Partial<Pick<Member, "initialDeposit" | "additionalDeposits">> = {}

  if (initialDeposit !== undefined) updateData.initialDeposit = initialDeposit
  if (additionalDeposits !== undefined) updateData.additionalDeposits = additionalDeposits

  return await prisma.member.update({
    where: { id: memberId },
    data: updateData,
  })
}

export async function updateMemberIndividualExpenses(memberId: string, amount: number): Promise<Member> {
  const member = await prisma.member.findUnique({ where: { id: memberId } })
  if (!member) throw new Error("Member not found")

  return await prisma.member.update({
    where: { id: memberId },
    data: {
      individualExpenses: member.individualExpenses + amount,
    },
  })
}
