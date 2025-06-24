"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { useState } from "react"

interface LobbyHeaderProps {
  lobbyName: string
  totalBalance: number
  lobbyId?: string
}

export function LobbyHeader({ lobbyName, totalBalance, lobbyId }: LobbyHeaderProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (!lobbyId) return

    const url = `${window.location.origin}?lobby=${lobbyId}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy URL:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-2xl">{lobbyName}</CardTitle>
              {lobbyId && (
                <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
                  {copied ? (
                    <>
                      <Copy className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Share
                    </>
                  )}
                </Button>
              )}
            </div>
            <CardDescription>Travel Expense Tracker</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-green-600">৳{totalBalance.toLocaleString()}</span>
              <Badge variant={totalBalance >= 0 ? "default" : "destructive"}>
                {totalBalance >= 0 ? "Positive" : "Negative"}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">Total Balance</div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
