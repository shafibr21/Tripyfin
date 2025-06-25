"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface DepositDialogProps {
  lobbyId: number
  userId?: number
  userName?: string
  trigger?: React.ReactNode
}

export function DepositDialog({ lobbyId, userId, userName, trigger }: DepositDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()

  const targetUserId = userId || Number.parseInt(session?.user?.id || "0")
  const targetUserName = userName || session?.user?.name || "You"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/lobbies/${lobbyId}/deposits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          description: description || "Deposit",
          userId: targetUserId,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Deposit added successfully",
        })
        setOpen(false)
        setAmount("")
        setDescription("")
        router.refresh()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.message || "Failed to add deposit",
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
        {trigger || (
          <Button size="sm" variant="outline">
            Deposit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make Deposit</DialogTitle>
          <DialogDescription>Add money to the lobby for {targetUserName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (৳)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional deposit"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Add Deposit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
