"use client"

import { Suspense } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { LoadingLayout } from "@/components/layout/loading-layout"
import { LobbyCreation } from "@/components/lobby/lobby-creation"
import { LobbyHeader } from "@/components/lobby/lobby-header"
import { MemberManagement } from "@/components/members/member-management"
import { IndividualStatus } from "@/components/status/individual-status"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { TransactionHistory } from "@/components/transaction-history"
import { DepositModalComponent } from "@/components/deposit-modal"
import { TransactionDetailModal } from "@/components/transaction-detail-modal"
import { useTravelLobbyDb } from "@/hooks/use-travel-lobby-db"
import { calculateTotalBalance, calculateTotalRequiredContribution } from "@/utils/calculations"

function TravelExpenseTrackerContent() {
  const {
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
  } = useTravelLobbyDb()

  const totalBalance = calculateTotalBalance(members, expenses)
  const totalRequiredContribution = calculateTotalRequiredContribution(members, expenses)

  if (loading && !isLobbyCreated) {
    return <LoadingLayout message="Setting up your lobby..." />
  }

  if (!isLobbyCreated) {
    return (
      <LobbyCreation lobbyName={lobbyName} setLobbyName={setLobbyName} onCreateLobby={createLobby} loading={loading} />
    )
  }

  return (
    <PageLayout>
      <LobbyHeader lobbyName={lobbyName} totalBalance={totalBalance} lobbyId={currentLobbyId ?? undefined} />

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
      />

      <TransactionDetailModal
        transactionDetail={transactionDetail}
        members={members}
        onCloseTransactionDetail={closeTransactionDetail}
      />
    </PageLayout>
  )
}

export default function TravelExpenseTracker() {
  return (
    <Suspense fallback={<LoadingLayout />}>
      <TravelExpenseTrackerContent />
    </Suspense>
  )
}
