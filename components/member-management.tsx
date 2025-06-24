"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Wallet } from "lucide-react"
import type { Member } from "@/types"

interface MemberManagementProps {
  members: Member[]
  newMemberName: string
  setNewMemberName: (name: string) => void
  onAddMember: () => void
  hasDeposited: boolean
  depositAmount: string
  setDepositAmount: (amount: string) => void
  onCollectDeposits: () => void
}

export function MemberManagement({
  members,
  newMemberName,
  setNewMemberName,
  onAddMember,
  hasDeposited,
  depositAmount,
  setDepositAmount,
  onCollectDeposits,
}: MemberManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Member name" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} />
          <Button onClick={onAddMember} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium">{member.name}</span>
                {member.isLeader && <Badge variant="secondary">Leader</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">৳{member.initialDeposit.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {!hasDeposited && members.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <Label>Initial Deposit (per person)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <Button onClick={onCollectDeposits} size="sm">
                <Wallet className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
