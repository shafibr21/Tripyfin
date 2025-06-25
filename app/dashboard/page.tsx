import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserLobbies } from "@/lib/db/lobby"
import { LobbyCard } from "@/components/dashboard/lobby-card"
import { CreateLobbyForm } from "@/components/dashboard/create-lobby-form"
import { UserMenu } from "@/components/dashboard/user-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Users } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const lobbies = await getUserLobbies(session.user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.user.name || session.user.email}</p>
          </div>
          <UserMenu />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Lobby Form */}
          <div className="lg:col-span-1">
            <CreateLobbyForm />
          </div>

          {/* Lobbies List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Lobbies</CardTitle>
                <CardDescription>Manage your travel expense lobbies</CardDescription>
              </CardHeader>
              <CardContent>
                {lobbies.length === 0 ? (
                  <EmptyState
                    icon={<Users className="h-8 w-8" />}
                    title="No lobbies yet"
                    description="Create your first lobby to start tracking travel expenses"
                  />
                ) : (
                  <div className="grid gap-4">
                    {lobbies.map((lobby) => (
                      <LobbyCard key={lobby.id} lobby={lobby} isOwner={lobby.ownerId === session.user.id} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
