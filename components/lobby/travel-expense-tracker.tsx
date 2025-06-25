"use client"

import { useEffect } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { LoadingLayout } from "@/components/layout/loading-layout"
import { LobbyHeader } from "@/components/lobby/lobby-header"
import { MemberManagement } from "@/components/members/member-management"
import { IndividualStatus } from "@/components/status/individual-status"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { TransactionHistory } from "@/components/transaction-history"
import { DepositModalComponent } from "@/components/deposit-modal"
import { TransactionDetailModal } from "@/components/transaction-detail-modal"
import { useTravelLobbyDb } from "@/hooks/use-travel-lobby-db"
import { calculateTotalBalance, calculateTotalRequiredContribution } from "@/utils/calculations"

interface TravelExpenseTrackerProps {
  lobbyId: string
  userId: string
}

export function TravelExpenseTracker({ lobbyId, userId }: TravelExpenseTrackerProps) {
  const {
    // State
    lobbyName,
    members,
    expenses,
    deposits,
    newMemberName,
    setNewMemberName,
    depositAmount,
    setDepositAmount,
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

    // Actions
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
  } = useTravelLobbyDb()

  // Load lobby data on mount
  useEffect(() => {
    if (lobbyId) {
      loadLobby(lobbyId)
    }
  }, [lobbyId, loadLobby])

  const totalBalance = calculateTotalBalance(members, expenses)
  const totalRequiredContribution = calculateTotalRequiredContribution(members, expenses)

  if (loading && !lobbyName) {
    return <LoadingLayout message="Loading lobby..." />
  }

  return (
    <PageLayout>
      <LobbyHeader lobbyName={lobbyName} totalBalance={totalBalance} lobbyId={lobbyId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Members & Individual Status */}
        <div className="space-y-6">
          <MemberManagement
            members={members}
            newMemberName={newMemberName}
            setNewMemberName={setNewMemberName}
            onAddMember={addMember}
            hasDeposited={hasDeposited}
            depositAmount={depositAmount}
            setDepositAmount={setDepositAmount}
            onCollectDeposits={collectDeposits}
            loading={loading}
          />

          {hasDeposited && (
            <IndividualStatus
              members={members}
              expenses={expenses}
              totalRequiredContribution={totalRequiredContribution}
              onOpenDepositModal={openDepositModal}
            />
          )}
        </div>

        {/* Middle Column - Add Expenses */}
        <div className="space-y-6">
          {hasDeposited && (
            <ExpenseForm
              expenseType={expenseType}
              setExpenseType={setExpenseType}
              expenseDescription={expenseDescription}
              setExpenseDescription={setExpenseDescription}
              groupExpenseAmount={groupExpenseAmount}
              setGroupExpenseAmount={setGroupExpenseAmount}
              individualExpenses={individualExpenses}
              setIndividualExpenses={setIndividualExpenses}
              members={members}
              onAddGroupExpense={addGroupExpense}
              onAddIndividualExpense={addIndividualExpense}
              loading={loading}
            />
          )}
        </div>

        {/* Right Column - Transaction History */}
        <div className="space-y-6">
          {(expenses.length > 0 || deposits.length > 0) && (
            <TransactionHistory
              expenses={expenses}
              deposits={deposits}
              onOpenTransactionDetail={openTransactionDetail}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <DepositModalComponent
        depositModal={depositModal}
        additionalDepositAmount={additionalDepositAmount}
        setAdditionalDepositAmount={setAdditionalDepositAmount}
        onAddAdditionalDeposit={addAdditionalDeposit}
        onCloseDepositModal={closeDepositModal}
        loading={loading}
      />

      <TransactionDetailModal
        transactionDetail={transactionDetail}
        members={members}
        onCloseTransactionDetail={closeTransactionDetail}
      />
    </PageLayout>
  )
}
