import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { LobbyList } from "@/components/dashboard/lobby-list"
import { CreateLobbyDialog } from "@/components/dashboard/create-lobby-dialog"
import type { LobbyWithMembers } from "@/types"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = Number.parseInt(session.user.id)

  // Get user's lobbies (both as leader and member)
  const lobbiesData = await prisma.lobby.findMany({
    where: {
      OR: [{ leaderId: userId }, { members: { some: { userId } } }],
    },
    include: {
      leader: true,
      members: {
        include: {
          user: true,
        },
      },
      _count: {
        select: { members: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Convert Prisma Decimal fields to numbers
  const lobbies: LobbyWithMembers[] = lobbiesData.map((lobby) => ({
    ...lobby,
    totalBalance: Number(lobby.totalBalance),
    initialDeposit: Number(lobby.initialDeposit),
    members: lobby.members.map((member) => ({
      ...member,
      individualBalance: Number(member.individualBalance),
      totalDeposited: Number(member.totalDeposited),
    })),
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Your Travel Lobbies</h1>
          <CreateLobbyDialog />
        </div>
        {lobbies.length === 0 && (
          <div className="text-gray-500 mb-6">Loading your lobbies...</div>
        )}
        <LobbyList lobbies={lobbies} currentUserId={userId} />
      </div>
    </div>
  )
}
