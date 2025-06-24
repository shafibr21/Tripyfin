"use client"

import { useState } from "react"
import type { Member, Expense, DepositRecord, TransactionDetail, DepositModal } from "@/types"

export function useTravelLobby() {
  const [lobbyName, setLobbyName] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [deposits, setDeposits] = useState<DepositRecord[]>([])
  const [newMemberName, setNewMemberName] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [isLobbyCreated, setIsLobbyCreated] = useState(false)
  const [hasDeposited, setHasDeposited] = useState(false)
  const [additionalDepositAmount, setAdditionalDepositAmount] = useState("")

  const [depositModal, setDepositModal] = useState<DepositModal>({
    isOpen: false,
    memberId: "",
    memberName: "",
  })

  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail>({
    isOpen: false,
    type: "expense",
    data: null,
  })

  // Expense form states
  const [expenseType, setExpenseType] = useState<"group" | "individual">("group")
  const [expenseDescription, setExpenseDescription] = useState("")
  const [groupExpenseAmount, setGroupExpenseAmount] = useState("")
  const [individualExpenses, setIndividualExpenses] = useState<{ [key: string]: string }>({})

  const createLobby = () => {
    if (lobbyName.trim()) {
      setIsLobbyCreated(true)
    }
  }

  const addMember = () => {
    if (newMemberName.trim()) {
      const newMember: Member = {
        id: Date.now().toString(),
        name: newMemberName,
        isLeader: members.length === 0,
        initialDeposit: 0,
        additionalDeposits: 0,
        individualExpenses: 0,
      }
      setMembers([...members, newMember])
      setNewMemberName("")
    }
  }

  const collectDeposits = () => {
    const amount = Number.parseFloat(depositAmount)
    if (amount > 0) {
      const updatedMembers = members.map((member) => ({
        ...member,
        initialDeposit: amount,
        additionalDeposits: 0,
      }))
      setMembers(updatedMembers)

      // Record initial deposits in history
      const initialDeposits = members.map((member) => ({
        id: `${member.id}-initial-${Date.now()}`,
        memberId: member.id,
        memberName: member.name,
        amount,
        type: "initial" as const,
        timestamp: new Date(),
        description: "Initial deposit",
      }))
      setDeposits(initialDeposits)

      setHasDeposited(true)
      setDepositAmount("")
    }
  }

  const addGroupExpense = () => {
    const amount = Number.parseFloat(groupExpenseAmount)
    if (amount > 0 && expenseDescription.trim()) {
      const totalAmount = amount * members.length
      const newExpense: Expense = {
        id: Date.now().toString(),
        type: "group",
        description: expenseDescription,
        totalAmount,
        perPersonAmount: amount,
        timestamp: new Date(),
      }
      setExpenses([...expenses, newExpense])
      setExpenseDescription("")
      setGroupExpenseAmount("")
    }
  }

  const addIndividualExpense = () => {
    if (expenseDescription.trim()) {
      const amounts = Object.entries(individualExpenses)
        .filter(([_, amount]) => amount.trim() !== "")
        .reduce(
          (acc, [memberId, amount]) => {
            acc[memberId] = Number.parseFloat(amount) || 0
            return acc
          },
          {} as { [key: string]: number },
        )

      const totalAmount = Object.values(amounts).reduce((sum, amount) => sum + amount, 0)

      if (totalAmount > 0) {
        const newExpense: Expense = {
          id: Date.now().toString(),
          type: "individual",
          description: expenseDescription,
          totalAmount,
          individualAmounts: amounts,
          timestamp: new Date(),
        }
        setExpenses([...expenses, newExpense])

        // Update individual expenses for members
        const updatedMembers = members.map((member) => ({
          ...member,
          individualExpenses: member.individualExpenses + (amounts[member.id] || 0),
        }))
        setMembers(updatedMembers)

        setExpenseDescription("")
        setIndividualExpenses({})
      }
    }
  }

  const openDepositModal = (memberId: string, memberName: string) => {
    setDepositModal({ isOpen: true, memberId, memberName })
    setAdditionalDepositAmount("")
  }

  const closeDepositModal = () => {
    setDepositModal({ isOpen: false, memberId: "", memberName: "" })
    setAdditionalDepositAmount("")
  }

  const addAdditionalDeposit = () => {
    const amount = Number.parseFloat(additionalDepositAmount)
    if (amount > 0 && depositModal.memberId) {
      const member = members.find((m) => m.id === depositModal.memberId)
      if (member) {
        const updatedMembers = members.map((m) =>
          m.id === depositModal.memberId ? { ...m, additionalDeposits: m.additionalDeposits + amount } : m,
        )
        setMembers(updatedMembers)

        // Record additional deposit in history
        const newDeposit: DepositRecord = {
          id: `${depositModal.memberId}-additional-${Date.now()}`,
          memberId: depositModal.memberId,
          memberName: member.name,
          amount,
          type: "additional",
          timestamp: new Date(),
          description: "Additional deposit",
        }
        setDeposits([...deposits, newDeposit])

        closeDepositModal()
      }
    }
  }

  const openTransactionDetail = (type: "expense" | "deposit", data: Expense | DepositRecord) => {
    setTransactionDetail({ isOpen: true, type, data })
  }

  const closeTransactionDetail = () => {
    setTransactionDetail({ isOpen: false, type: "expense", data: null })
  }

  return {
    // State
    lobbyName,
    setLobbyName,
    members,
    expenses,
    deposits,
    newMemberName,
    setNewMemberName,
    depositAmount,
    setDepositAmount,
    isLobbyCreated,
    hasDeposited,
    depositModal,
    additionalDepositAmount,
    setAdditionalDepositAmount,
    transactionDetail,
    expenseType,
    setExpenseType,
    expenseDescription,
    setExpenseDescription,
    groupExpenseAmount,
    setGroupExpenseAmount,
    individualExpenses,
    setIndividualExpenses,

    // Actions
    createLobby,
    addMember,
    collectDeposits,
    addGroupExpense,
    addIndividualExpense,
    openDepositModal,
    closeDepositModal,
    addAdditionalDeposit,
    openTransactionDetail,
    closeTransactionDetail,
  }
}
