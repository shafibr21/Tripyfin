export interface ApiLobby {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  members: ApiMember[]
  expenses: ApiExpense[]
  deposits: ApiDeposit[]
}

export interface ApiMember {
  id: string
  name: string
  isLeader: boolean
  initialDeposit: number
  additionalDeposits: number
  individualExpenses: number
  lobbyId: string
  createdAt: string
  updatedAt: string
}

export interface ApiExpense {
  id: string
  type: "GROUP" | "INDIVIDUAL"
  description: string
  totalAmount: number
  perPersonAmount?: number
  timestamp: string
  lobbyId: string
  individualExpenses: {
    id: string
    amount: number
    memberId: string
  }[]
}

export interface ApiDeposit {
  id: string
  amount: number
  type: "INITIAL" | "ADDITIONAL"
  description?: string
  timestamp: string
  lobbyId: string
  memberId: string
}
