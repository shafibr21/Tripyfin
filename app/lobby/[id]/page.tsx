import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getLobbyById } from "@/lib/db/lobby"
import { TravelExpenseTracker } from "@/components/lobby/travel-expense-tracker"

interface LobbyPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function LobbyPage({ params }: LobbyPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const { id } = await params
  const lobby = await getLobbyById(id)

  if (!lobby) {
    notFound()
  }

  // Check if user has access to this lobby
  const hasAccess =
    lobby.ownerId === session.user.id || lobby.members.some((member) => member.userId === session.user.id)

  if (!hasAccess) {
    redirect("/dashboard")
  }

  return <TravelExpenseTracker lobbyId={id} userId={session.user.id} />
}
