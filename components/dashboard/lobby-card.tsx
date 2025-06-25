import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Receipt, Calendar } from "lucide-react"
import Link from "next/link"

interface LobbyCardProps {
  lobby: {
    id: string
    name: string
    createdAt: Date
    owner: {
      name: string | null
      email: string
    }
    _count: {
      members: number
      expenses: number
    }
  }
  isOwner: boolean
}

export function LobbyCard({ lobby, isOwner }: LobbyCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{lobby.name}</CardTitle>
            <CardDescription>Created by {isOwner ? "You" : lobby.owner.name || lobby.owner.email}</CardDescription>
          </div>
          {isOwner && <Badge variant="secondary">Owner</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{lobby._count.members} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Receipt className="h-4 w-4" />
            <span>{lobby._count.expenses} expenses</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Created {new Date(lobby.createdAt).toLocaleDateString()}</span>
        </div>
        <Link href={`/lobby/${lobby.id}`}>
          <Button className="w-full">Open Lobby</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
