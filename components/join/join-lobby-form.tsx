"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Users, Crown, User, DollarSign } from "lucide-react"
import type { LobbyWithMembers } from "@/types"

interface JoinLobbyFormProps {
  lobby: LobbyWithMembers
  user: {
    name?: string | null
    email?: string | null
  }
}

export function JoinLobbyForm({ lobby, user }: JoinLobbyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleJoin = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/lobbies/${lobby.id}/join`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "You've joined the lobby successfully!",
        })
        router.push(`/lobby/${lobby.id}`)
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.message || "Failed to join lobby",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Join Travel Lobby</CardTitle>
        <CardDescription>You've been invited to join a travel expense group</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lobby Info */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">{lobby.name}</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-1">
              <Crown className="h-4 w-4" />
              <span>Led by {lobby.leader.name}</span>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Members</span>
              </div>
              <Badge variant="secondary">{lobby.members?.length || 0}</Badge>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Current Balance</span>
              </div>
              <span className={`font-semibold ${lobby.totalBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                ৳{lobby.totalBalance.toFixed(2)}
              </span>
            </div>

            {lobby.initialDeposit > 0 && (
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Required Deposit</span>
                </div>
                <span className="font-semibold text-blue-600">৳{lobby.initialDeposit.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Members Preview */}
        {lobby.members && lobby.members.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Current Members</h4>
            <div className="space-y-2">
              {lobby.members.slice(0, 3).map((member) => (
                <div key={member.userId} className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      <User className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.user.name}</span>
                  {member.userId === lobby.leaderId && (
                    <Badge variant="secondary" className="text-xs">
                      Leader
                    </Badge>
                  )}
                </div>
              ))}
              {lobby.members.length > 3 && (
                <p className="text-xs text-gray-500">+{lobby.members.length - 3} more members</p>
              )}
            </div>
          </div>
        )}

        {/* Join Button */}
        <div className="space-y-3">
          {lobby.initialDeposit > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You'll need to deposit ৳{lobby.initialDeposit.toFixed(2)} after joining to
                participate in the lobby.
              </p>
            </div>
          )}

          <Button onClick={handleJoin} disabled={isLoading} className="w-full">
            {isLoading ? "Joining..." : "Join Lobby"}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Joining as <strong>{user.name}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
