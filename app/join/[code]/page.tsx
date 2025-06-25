import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { JoinLobbyForm } from "@/components/join/join-lobby-form"
import type { LobbyWithMembers } from "@/types"

interface JoinPageProps {
  params: {
    code: string
  }
}

export default async function JoinPage({ params }: JoinPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/auth/signin?callbackUrl=/join/${params.code}`)
  }

  const userId = Number.parseInt(session.user.id)

  // Find the lobby by invite code
  const lobbyData = await prisma.lobby.findFirst({
    where: { inviteCode: params.code },
    include: {
      leader: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!lobbyData) {
    notFound()
  }

  // Convert Prisma Decimal fields to numbers
  const lobby: LobbyWithMembers = {
    ...lobbyData,
    totalBalance: Number(lobbyData.totalBalance),
    initialDeposit: Number(lobbyData.initialDeposit),
    members: lobbyData.members.map((member) => ({
      ...member,
      individualBalance: Number(member.individualBalance),
      totalDeposited: Number(member.totalDeposited),
    })),
    _count: { members: lobbyData.members.length },
  }

  // Check if user is already a member
  const existingMember = lobby.members.find((member) => member.userId === userId)

  if (existingMember) {
    redirect(`/lobby/${lobby.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <JoinLobbyForm lobby={lobby} user={session.user} />
    </div>
  )
}
