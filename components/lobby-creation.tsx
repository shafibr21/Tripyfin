"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users } from "lucide-react"

interface LobbyCreationProps {
  lobbyName: string
  setLobbyName: (name: string) => void
  onCreateLobby: () => void
}

export function LobbyCreation({ lobbyName, setLobbyName, onCreateLobby }: LobbyCreationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Travel Lobby</CardTitle>
          <CardDescription>Start tracking expenses with your travel group</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lobbyName">Lobby Name</Label>
            <Input
              id="lobbyName"
              placeholder="Enter lobby name (e.g., Bali Trip 2024)"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
            />
          </div>
          <Button onClick={onCreateLobby} className="w-full" disabled={!lobbyName.trim()}>
            <Users className="mr-2 h-4 w-4" />
            Create Lobby
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
