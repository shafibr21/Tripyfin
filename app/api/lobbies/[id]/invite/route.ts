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
    const { email } = await request.json()

    // Check if user is the lobby leader
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
    })

    if (!lobby || lobby.leaderId !== userId) {
      return NextResponse.json({ message: "Only lobby leader can send invitations" }, { status: 403 })
    }

    // Check if the user exists
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!invitedUser) {
      return NextResponse.json(
        { message: "User with this email doesn't exist. Ask them to sign up first." },
        { status: 404 },
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.lobbyMember.findUnique({
      where: {
        lobbyId_userId: {
          lobbyId,
          userId: invitedUser.id,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json({ message: "User is already a member of this lobby" }, { status: 400 })
    }

    // Generate invite code if not exists
    let inviteCode = lobby.inviteCode
    if (!inviteCode) {
      inviteCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      await prisma.lobby.update({
        where: { id: lobbyId },
        data: { inviteCode },
      })
    }

    // In a real app, you would send an email here
    // For now, we'll just return success
    // You can integrate with services like SendGrid, Resend, etc.

    return NextResponse.json({
      message: "Invitation sent successfully",
      inviteCode, // In production, don't return this, send via email instead
    })
  } catch (error) {
    console.error("Send invitation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
