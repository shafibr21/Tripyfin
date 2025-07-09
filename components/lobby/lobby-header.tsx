"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Crown, Users, Settings } from "lucide-react"
import Link from "next/link"
import type { LobbyWithDetails } from "@/types"

interface LobbyHeaderProps {
  lobby: LobbyWithDetails
  isLeader: boolean
}

export function LobbyHeader({ lobby, isLeader }: LobbyHeaderProps) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-black font-semibold">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-black border-black rounded">{lobby.name}</h1>
                {isLeader && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Leader
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <Users className="h-4 w-4" />
                {lobby.members?.length || 0} members • Created by {lobby.leader.name}
              </p>
            </div>
          </div>

          {/* {isLeader && (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          )} */}
        </div>
      </div>
    </header>
  )
}
