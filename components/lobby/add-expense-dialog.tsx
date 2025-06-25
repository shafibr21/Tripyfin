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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { LobbyMember } from "@/types"

interface AddExpenseDialogProps {
  lobbyId: number
  members: LobbyMember[]
  type: "equal" | "individual"
  trigger: React.ReactNode
}

export function AddExpenseDialog({ lobbyId, members, type, trigger }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [individualAmounts, setIndividualAmounts] = useState<Record<number, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        description,
        type: type === "equal" ? "expense_equal" : "expense_individual",
        totalAmount: type === "equal" ? Number.parseFloat(totalAmount) : undefined,
        individualAmounts:
          type === "individual"
            ? members.map((member) => ({
                userId: member.userId,
                amount: Number.parseFloat(individualAmounts[member.userId] || "0"),
              }))
            : undefined,
      }

      const response = await fetch(`/api/lobbies/${lobbyId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Expense added successfully",
        })
        setOpen(false)
        setDescription("")
        setTotalAmount("")
        setIndividualAmounts({})
        router.refresh()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.message || "Failed to add expense",
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

  const handleIndividualAmountChange = (userId: number, amount: string) => {
    setIndividualAmounts((prev) => ({
      ...prev,
      [userId]: amount,
    }))
  }

  const totalIndividualAmount = Object.values(individualAmounts).reduce(
    (sum, amount) => sum + (Number.parseFloat(amount) || 0),
    0,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add {type === "equal" ? "Equal Split" : "Individual"} Expense</DialogTitle>
          <DialogDescription>
            {type === "equal"
              ? "This expense will be split equally among all members"
              : "Enter individual amounts for each member"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === "equal" ? "e.g., Bus fare" : "e.g., Lunch at restaurant"}
              required
            />
          </div>

          {type === "equal" ? (
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount (৳)</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                min="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="600"
                required
              />
              <p className="text-xs text-gray-500">
                ৳{(Number.parseFloat(totalAmount) / members.length || 0).toFixed(2)} per person
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Label>Individual Amounts (৳)</Label>
              {members.map((member) => (
                <div key={member.userId} className="flex items-center space-x-2">
                  <Label className="flex-1 text-sm">{member.user.name}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={individualAmounts[member.userId] || ""}
                    onChange={(e) => handleIndividualAmountChange(member.userId, e.target.value)}
                    placeholder="0"
                    className="w-24"
                  />
                </div>
              ))}
              <p className="text-xs text-gray-500">Total: ৳{totalIndividualAmount.toFixed(2)}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
