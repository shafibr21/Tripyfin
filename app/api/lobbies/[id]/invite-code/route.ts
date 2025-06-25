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

    // Check if user is the lobby leader
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
    })

    if (!lobby || lobby.leaderId !== userId) {
      return NextResponse.json({ message: "Only lobby leader can generate invite codes" }, { status: 403 })
    }

    // Generate a unique invite code
    const inviteCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Update lobby with invite code
    await prisma.lobby.update({
      where: { id: lobbyId },
      data: { inviteCode },
    })

    return NextResponse.json({ inviteCode })
  } catch (error) {
    console.error("Generate invite code error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
