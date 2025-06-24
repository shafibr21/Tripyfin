import { Badge } from "@/components/ui/badge"
import type { Member } from "@/types"

interface MemberListItemProps {
  member: Member
}

export function MemberListItem({ member }: MemberListItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">{member.name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <span className="font-medium">{member.name}</span>
          {member.isLeader && (
            <Badge variant="secondary" className="ml-2">
              Leader
            </Badge>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">৳{member.initialDeposit.toLocaleString()}</div>
        {member.additionalDeposits > 0 && (
          <div className="text-xs text-muted-foreground">+৳{member.additionalDeposits.toLocaleString()} extra</div>
        )}
      </div>
    </div>
  )
}
