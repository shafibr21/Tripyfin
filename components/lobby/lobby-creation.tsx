"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LobbyCreationForm } from "./lobby-creation-form"

interface LobbyCreationProps {
  lobbyName: string
  setLobbyName: (name: string) => void
  onCreateLobby: () => void
  loading?: boolean
}

export function LobbyCreation({ lobbyName, setLobbyName, onCreateLobby, loading }: LobbyCreationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Travel Lobby</CardTitle>
          <CardDescription>Start tracking expenses with your travel group</CardDescription>
        </CardHeader>
        <CardContent>
          <LobbyCreationForm
            lobbyName={lobbyName}
            setLobbyName={setLobbyName}
            onCreateLobby={onCreateLobby}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
