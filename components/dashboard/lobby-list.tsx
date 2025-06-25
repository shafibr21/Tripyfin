import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Crown, Calendar } from "lucide-react"
import Link from "next/link"
import type { LobbyWithMembers } from "@/types"

interface LobbyListProps {
  lobbies: LobbyWithMembers[]
  currentUserId: number
}

export function LobbyList({ lobbies, currentUserId }: LobbyListProps) {
  if (lobbies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No lobbies yet</p>
          <p className="text-sm">Create your first travel lobby to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lobbies.map((lobby) => (
        <Card key={lobby.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{lobby.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(lobby.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              {lobby.leaderId === currentUserId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Leader
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Balance:</span>
                <span className={`font-semibold ${lobby.totalBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ৳{lobby.totalBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Members:</span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {lobby._count?.members || 0}
                </span>
              </div>
              <Button asChild className="w-full">
                <Link href={`/lobby/${lobby.id}`}>View Lobby</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
