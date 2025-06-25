import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, initialDeposit } = await request.json()
    const userId = Number.parseInt(session.user.id)

    // Create lobby
    const lobby = await prisma.lobby.create({
      data: {
        name,
        leaderId: userId,
        initialDeposit: initialDeposit || 0,
      },
    })

    // Add leader as first member
    await prisma.lobbyMember.create({
      data: {
        lobbyId: lobby.id,
        userId: userId,
        totalDeposited: initialDeposit || 0,
        individualBalance: initialDeposit || 0,
      },
    })

    // Update lobby total balance
    await prisma.lobby.update({
      where: { id: lobby.id },
      data: { totalBalance: initialDeposit || 0 },
    })

    // Create initial deposit transaction if there's an initial deposit
    if (initialDeposit > 0) {
      await prisma.transaction.create({
        data: {
          lobbyId: lobby.id,
          createdBy: userId,
          type: "deposit",
          description: "Initial deposit",
          totalAmount: initialDeposit,
        },
      })
    }

    return NextResponse.json({
      message: "Lobby created successfully",
      lobbyId: lobby.id,
    })
  } catch (error) {
    console.error("Create lobby error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
