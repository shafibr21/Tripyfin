"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Plus } from "lucide-react"

export function CreateLobbyForm() {
  const [lobbyName, setLobbyName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lobbyName.trim()) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/lobby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: lobbyName }),
      })

      if (!response.ok) {
        throw new Error("Failed to create lobby")
      }

      const lobby = await response.json()
      router.push(`/lobby/${lobby.id}`)
    } catch (error) {
      setError("Failed to create lobby")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Lobby
        </CardTitle>
        <CardDescription>Start a new travel expense tracking lobby</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lobbyName">Lobby Name</Label>
            <Input
              id="lobbyName"
              placeholder="e.g., Bali Trip 2024"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={!lobbyName.trim() || loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Lobby
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
