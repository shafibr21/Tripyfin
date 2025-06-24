"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import type { Member, Expense, DepositRecord, TransactionDetail, DepositModal } from "@/types"
import type { ApiMember, ApiExpense, ApiDeposit } from "@/types/api"

// Transform API data to frontend types
function transformApiMember(apiMember: ApiMember): Member {
  return {
    id: apiMember.id,
    name: apiMember.name,
    isLeader: apiMember.isLeader,
    initialDeposit: apiMember.initialDeposit,
    additionalDeposits: apiMember.additionalDeposits,
    individualExpenses: apiMember.individualExpenses,
  }
}

function transformApiExpense(apiExpense: ApiExpense): Expense {
  const individualAmounts: { [memberId: string]: number } = {}
  apiExpense.individualExpenses.forEach((ie) => {
    individualAmounts[ie.memberId] = ie.amount
  })

  return {
    id: apiExpense.id,
    type: apiExpense.type.toLowerCase() as "group" | "individual",
    description: apiExpense.description,
    totalAmount: apiExpense.totalAmount,
    perPersonAmount: apiExpense.perPersonAmount,
    individualAmounts: Object.keys(individualAmounts).length > 0 ? individualAmounts : undefined,
    timestamp: new Date(apiExpense.timestamp),
  }
}

function transformApiDeposit(apiDeposit: ApiDeposit, members: Member[]): DepositRecord {
  const member = members.find((m) => m.id === apiDeposit.memberId)
  return {
    id: apiDeposit.id,
    memberId: apiDeposit.memberId,
    memberName: member?.name || "Unknown",
    amount: apiDeposit.amount,
    type: apiDeposit.type.toLowerCase() as "initial" | "additional",
    timestamp: new Date(apiDeposit.timestamp),
    description: apiDeposit.description,
  }
}

export function useTravelLobbyDb() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lobbyId = searchParams.get("lobby")

  const [lobbyName, setLobbyName] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [deposits, setDeposits] = useState<DepositRecord[]>([])
  const [newMemberName, setNewMemberName] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [isLobbyCreated, setIsLobbyCreated] = useState(false)
  const [hasDeposited, setHasDeposited] = useState(false)
  const [additionalDepositAmount, setAdditionalDepositAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentLobbyId, setCurrentLobbyId] = useState<string | null>(null)

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

  // Load lobby data if lobbyId exists in URL
  useEffect(() => {
    if (lobbyId) {
      loadLobby(lobbyId)
    }
  }, [lobbyId])

  const loadLobby = async (id: string) => {
    try {
      setLoading(true)
      const lobby = await apiClient.getLobby(id)

      setLobbyName(lobby.name)
      setCurrentLobbyId(lobby.id)
      setIsLobbyCreated(true)

      const transformedMembers = lobby.members.map(transformApiMember)
      setMembers(transformedMembers)

      const transformedExpenses = lobby.expenses.map(transformApiExpense)
      setExpenses(transformedExpenses)

      const transformedDeposits = lobby.deposits.map((d) => transformApiDeposit(d, transformedMembers))
      setDeposits(transformedDeposits)

      setHasDeposited(transformedMembers.some((m) => m.initialDeposit > 0))
    } catch (error) {
      console.error("Failed to load lobby:", error)
    } finally {
      setLoading(false)
    }
  }

  const createLobby = async () => {
    if (!lobbyName.trim()) return

    try {
      setLoading(true)
      const lobby = await apiClient.createLobby(lobbyName)
      setCurrentLobbyId(lobby.id)
      setIsLobbyCreated(true)

      // Update URL with lobby ID
      router.push(`?lobby=${lobby.id}`)
    } catch (error) {
      console.error("Failed to create lobby:", error)
    } finally {
      setLoading(false)
    }
  }

  const addMember = async () => {
    if (!newMemberName.trim() || !currentLobbyId) return

    try {
      setLoading(true)
      const isLeader = members.length === 0
      const apiMember = await apiClient.addMember(currentLobbyId, newMemberName, isLeader)
      const member = transformApiMember(apiMember)

      setMembers([...members, member])
      setNewMemberName("")
    } catch (error) {
      console.error("Failed to add member:", error)
    } finally {
      setLoading(false)
    }
  }

  const collectDeposits = async () => {
    const amount = Number.parseFloat(depositAmount)
    if (amount <= 0 || !currentLobbyId) return

    try {
      setLoading(true)
      const memberIds = members.map((m) => m.id)
      const apiDeposits = await apiClient.createInitialDeposits(currentLobbyId, memberIds, amount)

      // Update members with initial deposits
      const updatedMembers = members.map((member) => ({
        ...member,
        initialDeposit: amount,
      }))
      setMembers(updatedMembers)

      // Add deposits to history
      const newDeposits = apiDeposits.map((d) => transformApiDeposit(d, updatedMembers))
      setDeposits(newDeposits)

      setHasDeposited(true)
      setDepositAmount("")
    } catch (error) {
      console.error("Failed to collect deposits:", error)
    } finally {
      setLoading(false)
    }
  }

  const addGroupExpense = async () => {
    const amount = Number.parseFloat(groupExpenseAmount)
    if (amount <= 0 || !expenseDescription.trim() || !currentLobbyId) return

    try {
      setLoading(true)
      const apiExpense = await apiClient.createGroupExpense(currentLobbyId, expenseDescription, amount, members.length)

      const expense = transformApiExpense(apiExpense)
      setExpenses([...expenses, expense])
      setExpenseDescription("")
      setGroupExpenseAmount("")
    } catch (error) {
      console.error("Failed to add group expense:", error)
    } finally {
      setLoading(false)
    }
  }

  const addIndividualExpense = async () => {
    if (!expenseDescription.trim() || !currentLobbyId) return

    const amounts = Object.entries(individualExpenses)
      .filter(([_, amount]) => amount.trim() !== "")
      .map(([memberId, amount]) => ({
        memberId,
        amount: Number.parseFloat(amount) || 0,
      }))
      .filter((item) => item.amount > 0)

    if (amounts.length === 0) return

    try {
      setLoading(true)
      const apiExpense = await apiClient.createIndividualExpense(currentLobbyId, expenseDescription, amounts)

      const expense = transformApiExpense(apiExpense)
      setExpenses([...expenses, expense])

      // Update members' individual expenses
      const updatedMembers = members.map((member) => {
        const memberAmount = amounts.find((a) => a.memberId === member.id)?.amount || 0
        return {
          ...member,
          individualExpenses: member.individualExpenses + memberAmount,
        }
      })
      setMembers(updatedMembers)

      setExpenseDescription("")
      setIndividualExpenses({})
    } catch (error) {
      console.error("Failed to add individual expense:", error)
    } finally {
      setLoading(false)
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

  const addAdditionalDeposit = async () => {
    const amount = Number.parseFloat(additionalDepositAmount)
    if (amount <= 0 || !depositModal.memberId || !currentLobbyId) return

    try {
      setLoading(true)
      const apiDeposit = await apiClient.createAdditionalDeposit(
        currentLobbyId,
        depositModal.memberId,
        amount,
        "Additional deposit",
      )

      // Update member's additional deposits
      const updatedMembers = members.map((m) =>
        m.id === depositModal.memberId ? { ...m, additionalDeposits: m.additionalDeposits + amount } : m,
      )
      setMembers(updatedMembers)

      // Add deposit to history
      const newDeposit = transformApiDeposit(apiDeposit, updatedMembers)
      setDeposits([...deposits, newDeposit])

      closeDepositModal()
    } catch (error) {
      console.error("Failed to add additional deposit:", error)
    } finally {
      setLoading(false)
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
    loading,
    currentLobbyId,

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
    loadLobby,
  }
}
