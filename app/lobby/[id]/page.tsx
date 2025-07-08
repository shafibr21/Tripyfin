import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { LobbyHeader } from "@/components/lobby/lobby-header"
import { LobbyBalance } from "@/components/lobby/lobby-balance"
import { MembersList } from "@/components/lobby/members-list"
import { TransactionHistory } from "@/components/lobby/transaction-history"
import { ExpenseActions } from "@/components/lobby/expense-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { LobbyWithDetails } from "@/types"

interface LobbyPageProps {
  params: {
    id: string
  }
}

export default async function LobbyPage({ params }: LobbyPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const lobbyId = Number.parseInt(params.id)
  const userId = Number.parseInt(session.user.id)

  // Get lobby with all related data
  const lobbyData = await prisma.lobby.findUnique({
    where: { id: lobbyId },
    include: {
      leader: true,
      members: {
        include: {
          user: true,
        },
        orderBy: { joinedAt: "asc" },
      },
      transactions: {
        include: {
          creator: true,
          details: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!lobbyData) {
    notFound()
  }

  // Convert Prisma Decimal fields to numbers
  const lobby: LobbyWithDetails = {
    ...lobbyData,
    totalBalance: Number(lobbyData.totalBalance),
    initialDeposit: Number(lobbyData.initialDeposit),
    members: lobbyData.members.map((member) => ({
      ...member,
      individualBalance: Number(member.individualBalance),
      totalDeposited: Number(member.totalDeposited),
    })),
    transactions: lobbyData.transactions.map((transaction) => ({
      ...transaction,
      totalAmount: Number(transaction.totalAmount),
      details:
        transaction.details?.map((detail) => ({
          ...detail,
          amount: Number(detail.amount),
        })) || [],
    })),
  }

  // Check if user is a member of this lobby
  const isMember = lobby.members.some((member) => member.userId === userId)
  const isLeader = lobby.leaderId === userId

  if (!isMember) {
    redirect("/dashboard")
  }

  // Calculate individual balances and what each person owes
  const memberBalances = lobby.members.map((member) => {
    const totalExpenses = lobby.transactions
      .filter((t) => t.type !== "deposit")
      .reduce((sum, transaction) => {
        if (transaction.type === "expense_equal") {
          return sum + transaction.totalAmount / lobby.members.length
        } else if (transaction.type === "expense_individual") {
          const detail = transaction.details?.find((d) => d.userId === member.userId)
          return sum + (detail ? detail.amount : 0)
        }
        return sum
      }, 0)

    const balance = member.totalDeposited - totalExpenses
    const owes = balance < 0 ? Math.abs(balance) : 0

    return {
      ...member,
      calculatedBalance: balance,
      totalExpenses,
      owes,
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <LobbyHeader lobby={lobby} isLeader={isLeader} />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Mobile: Stack vertically, Desktop: Grid layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Main Content */}
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-4 sm:space-y-6">
            <LobbyBalance lobby={lobby} memberBalances={memberBalances} />

            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-10 sm:h-11">
                <TabsTrigger value="transactions" className="text-xs sm:text-sm">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="members" className="text-xs sm:text-sm">
                  Members
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <TransactionHistory transactions={lobby.transactions} />
              </TabsContent>

              <TabsContent value="members" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <MembersList
                  members={memberBalances}
                  isLeader={isLeader}
                  lobbyId={lobbyId}
                  lobbyName={lobby.name}
                  initialDeposit={lobby.initialDeposit}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Shows first on mobile, last on desktop */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            <ExpenseActions lobbyId={lobbyId} isLeader={isLeader} members={lobby.members} />
          </div>

        </div>
      </div>
    </div>
  )
}