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
    const currentUserId = Number.parseInt(session.user.id)
    const { amount, description, userId } = await request.json()

    const targetUserId = userId || currentUserId

    // Check if user is a member of this lobby
    const lobbyMember = await prisma.lobbyMember.findUnique({
      where: {
        lobbyId_userId: {
          lobbyId,
          userId: currentUserId,
        },
      },
    })

    if (!lobbyMember) {
      return NextResponse.json({ message: "You are not a member of this lobby" }, { status: 403 })
    }

    // Create deposit transaction
    const transaction = await prisma.transaction.create({
      data: {
        lobbyId,
        createdBy: currentUserId,
        type: "deposit",
        description: description || "Deposit",
        totalAmount: amount,
      },
    })

    // Update lobby member's total deposited and lobby total balance
    await prisma.lobbyMember.update({
      where: {
        lobbyId_userId: {
          lobbyId,
          userId: targetUserId,
        },
      },
      data: {
        totalDeposited: {
          increment: amount,
        },
        individualBalance: {
          increment: amount,
        },
      },
    })

    // Update lobby total balance
    await prisma.lobby.update({
      where: { id: lobbyId },
      data: {
        totalBalance: {
          increment: amount,
        },
      },
    })

    return NextResponse.json({ message: "Deposit added successfully", transactionId: transaction.id })
  } catch (error) {
    console.error("Add deposit error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
