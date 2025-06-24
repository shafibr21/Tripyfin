export interface Member {
  id: string
  name: string
  isLeader: boolean
  initialDeposit: number
  additionalDeposits: number
  individualExpenses: number
}

export interface Expense {
  id: string
  type: "group" | "individual"
  description: string
  totalAmount: number
  perPersonAmount?: number
  individualAmounts?: { [memberId: string]: number }
  timestamp: Date
}

export interface DepositRecord {
  id: string
  memberId: string
  memberName: string
  amount: number
  type: "initial" | "additional"
  timestamp: Date
  description?: string
}

export interface TransactionDetail {
  isOpen: boolean
  type: "expense" | "deposit"
  data: Expense | DepositRecord | null
}

export interface DepositModal {
  isOpen: boolean
  memberId: string
  memberName: string
}
