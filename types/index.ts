import type { Prisma } from "@prisma/client"

// Base types from Prisma
export type User = {
  id: number
  email: string
  name: string
  createdAt: Date
}

export type LobbyMember = {
  id: number
  lobbyId: number
  userId: number
  individualBalance: number
  totalDeposited: number
  joinedAt: Date
  user: User
}

export type Transaction = {
  id: number
  lobbyId: number
  createdBy: number
  type: "deposit" | "expense_equal" | "expense_individual"
  description: string
  totalAmount: number
  createdAt: Date
  creator: User
  details?: TransactionDetail[]
}

export type TransactionDetail = {
  id: number
  transactionId: number
  userId: number
  amount: number
  user: User
}

export type Lobby = {
  id: number
  name: string
  leaderId: number
  totalBalance: number
  initialDeposit: number
  status: string
  inviteCode?: string | null
  createdAt: Date
  leader: User
  members: LobbyMember[]
  transactions?: Transaction[]
  _count?: {
    members: number
  }
}

// Prisma query result types
export type LobbyWithDetails = Prisma.LobbyGetPayload<{
  include: {
    leader: true
    members: {
      include: {
        user: true
      }
    }
    transactions: {
      include: {
        creator: true
        details: {
          include: {
            user: true
          }
        }
      }
    }
  }
}>

export type LobbyWithMembers = Prisma.LobbyGetPayload<{
  include: {
    leader: true
    members: {
      include: {
        user: true
      }
    }
    _count: {
      select: {
        members: true
      }
    }
  }
}>

export interface ExpenseFormData {
  description: string
  type: "equal" | "individual"
  totalAmount?: number
  individualAmounts?: { userId: number; amount: number }[]
}

export interface DepositFormData {
  amount: number
  description?: string
}

// Helper function to convert Prisma Decimal to number
export function convertDecimalFields<T extends Record<string, any>>(obj: T): T {
  const converted = { ...obj }
  for (const key in converted) {
    if (converted[key] && typeof converted[key] === "object" && "toNumber" in converted[key]) {
      converted[key] = converted[key].toNumber()
    } else if (Array.isArray(converted[key])) {
      converted[key] = converted[key].map((item: any) => (typeof item === "object" ? convertDecimalFields(item) : item))
    } else if (converted[key] && typeof converted[key] === "object") {
      converted[key] = convertDecimalFields(converted[key])
    }
  }
  return converted
}
