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
import { Copy, Mail, Plus } from "lucide-react"

interface InviteMemberDialogProps {
  lobbyId: number
  lobbyName: string
  initialDeposit: number
}

export function InviteMemberDialog({ lobbyId, lobbyName, initialDeposit }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [showInviteCode, setShowInviteCode] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const generateInviteCode = async () => {
    try {
      const response = await fetch(`/api/lobbies/${lobbyId}/invite-code`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setInviteCode(data.inviteCode)
        setShowInviteCode(true)
      } else {
        toast({
          title: "Error",
          description: "Failed to generate invite code",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const inviteByEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/lobbies/${lobbyId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invitation sent successfully",
        })
        setEmail("")
        router.refresh()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.message || "Failed to send invitation",
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

  const copyInviteCode = () => {
    const inviteUrl = `${window.location.origin}/join/${inviteCode}`
    navigator.clipboard.writeText(inviteUrl)
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    })
  }

  const copyInviteCodeOnly = () => {
    navigator.clipboard.writeText(inviteCode)
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Invite friends to join "{lobbyName}"
            {initialDeposit > 0 && (
              <span className="block mt-1 text-sm">
                New members will need to deposit ৳{Number(initialDeposit).toFixed(2)} to join
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Email Invitation */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Invite by Email
            </h4>
            <form onSubmit={inviteByEmail} className="space-y-3">
              <div>
                <Label htmlFor="email">Friend's Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="friend@example.com"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Invite Code */}
          <div className="space-y-3">
            <h4 className="font-medium">Share Invite Link</h4>
            {!showInviteCode ? (
              <Button onClick={generateInviteCode} variant="outline" className="w-full">
                Generate Invite Link
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input value={inviteCode} readOnly className="font-mono text-sm" />
                  <Button size="sm" variant="outline" onClick={copyInviteCodeOnly}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={copyInviteCode} variant="outline" className="w-full">
                  Copy Full Invite Link
                </Button>
                <p className="text-xs text-gray-500">
                  Share this code or link with your friends. They can use it to join the lobby.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
