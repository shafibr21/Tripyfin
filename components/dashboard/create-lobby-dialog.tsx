"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

export function CreateLobbyDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [initialDeposit, setInitialDeposit] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/lobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          initialDeposit: Number.parseFloat(initialDeposit) || 0,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: "Lobby created successfully",
        })
        setOpen(false)
        setName("")
        setInitialDeposit("")
        router.push(`/lobby/${data.lobbyId}`)
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.message || "Failed to create lobby",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Lobby
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Travel Lobby</DialogTitle>
          <DialogDescription>Create a new lobby to track expenses with your friends during travel.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Lobby Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cox's Bazar Trip 2024"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialDeposit">Initial Deposit Amount (৳)</Label>
            <Input
              id="initialDeposit"
              type="number"
              step="0.01"
              min="0"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              placeholder="1000"
            />
            <p className="text-xs text-gray-500">Each member will need to deposit this amount to join</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Lobby"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
