import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const lobbyId = Number.parseInt(params.id)
    const userId = Number.parseInt(session.user.id)
    const { description, type, totalAmount, individualAmounts } = await request.json()

    // Check if user is the lobby leader
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
      include: { members: true },
    })

    if (!lobby || lobby.leaderId !== userId) {
      return NextResponse.json({ message: "Only lobby leader can add expenses" }, { status: 403 })
    }

    let finalTotalAmount = 0
    let transactionDetails: Array<{ userId: number; amount: number }> = []

    if (type === "expense_equal") {
      finalTotalAmount = totalAmount
      // Create equal split for all members
      transactionDetails = lobby.members.map((member) => ({
        userId: member.userId,
        amount: totalAmount / lobby.members.length,
      }))
    } else if (type === "expense_individual") {
      finalTotalAmount = individualAmounts.reduce((sum: number, item: any) => sum + item.amount, 0)
      transactionDetails = individualAmounts.filter((item: any) => item.amount > 0)
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        lobbyId,
        createdBy: userId,
        type,
        description,
        totalAmount: finalTotalAmount,
        details: {
          create: transactionDetails,
        },
      },
    })

    // Update lobby total balance
    await prisma.lobby.update({
      where: { id: lobbyId },
      data: {
        totalBalance: {
          decrement: finalTotalAmount,
        },
      },
    })

    return NextResponse.json({ message: "Expense added successfully", transactionId: transaction.id })
  } catch (error) {
    console.error("Add expense error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
