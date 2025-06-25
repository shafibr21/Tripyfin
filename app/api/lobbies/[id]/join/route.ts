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

    // Check if lobby exists
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
    })

    if (!lobby) {
      return NextResponse.json({ message: "Lobby not found" }, { status: 404 })
    }

    // Check if user is already a member
    const existingMember = await prisma.lobbyMember.findUnique({
      where: {
        lobbyId_userId: {
          lobbyId,
          userId,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json({ message: "You are already a member of this lobby" }, { status: 400 })
    }

    // Add user as a member
    await prisma.lobbyMember.create({
      data: {
        lobbyId,
        userId,
        totalDeposited: 0,
        individualBalance: 0,
      },
    })

    return NextResponse.json({ message: "Successfully joined the lobby" })
  } catch (error) {
    console.error("Join lobby error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
