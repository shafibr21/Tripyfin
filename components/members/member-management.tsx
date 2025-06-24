"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { MemberListItem } from "./member-list-item"
import { AddMemberForm } from "./add-member-form"
import { InitialDepositForm } from "./initial-deposit-form"
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
  loading?: boolean
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
  loading,
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
        <AddMemberForm
          newMemberName={newMemberName}
          setNewMemberName={setNewMemberName}
          onAddMember={onAddMember}
          loading={loading}
        />

        <div className="space-y-2">
          {members.length === 0 ? (
            <EmptyState
              icon={<Users className="h-8 w-8" />}
              title="No members yet"
              description="Add members to start tracking expenses"
              className="py-8"
            />
          ) : (
            members.map((member) => <MemberListItem key={member.id} member={member} />)
          )}
        </div>

        {!hasDeposited && members.length > 0 && (
          <InitialDepositForm
            depositAmount={depositAmount}
            setDepositAmount={setDepositAmount}
            onCollectDeposits={onCollectDeposits}
            memberCount={members.length}
            loading={loading}
          />
        )}
      </CardContent>
    </Card>
  )
}
