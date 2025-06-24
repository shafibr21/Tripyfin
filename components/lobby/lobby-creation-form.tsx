"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LobbyCreationFormProps {
  lobbyName: string
  setLobbyName: (name: string) => void
  onCreateLobby: () => void
  loading?: boolean
}

export function LobbyCreationForm({ lobbyName, setLobbyName, onCreateLobby, loading }: LobbyCreationFormProps) {
  const [errors, setErrors] = useState<{ name?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: { name?: string } = {}
    if (!lobbyName.trim()) {
      newErrors.name = "Lobby name is required"
    } else if (lobbyName.trim().length < 3) {
      newErrors.name = "Lobby name must be at least 3 characters"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onCreateLobby()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lobbyName">Lobby Name</Label>
        <Input
          id="lobbyName"
          placeholder="Enter lobby name (e.g., Bali Trip 2024)"
          value={lobbyName}
          onChange={(e) => {
            setLobbyName(e.target.value)
            if (errors.name) setErrors({ ...errors, name: undefined })
          }}
          className={errors.name ? "border-red-500" : ""}
          disabled={loading}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={!lobbyName.trim() || loading}>
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Creating...
          </>
        ) : (
          <>
            <Users className="mr-2 h-4 w-4" />
            Create Lobby
          </>
        )}
      </Button>
    </form>
  )
}
