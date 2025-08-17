'"use client"';
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LobbyHeader } from "@/components/lobby/lobby-header";
import { LobbyBalance } from "@/components/lobby/lobby-balance";
import { MembersList } from "@/components/lobby/members-list";
import { TransactionHistory } from "@/components/lobby/transaction-history";
import { ExpenseActions } from "@/components/lobby/expense-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LobbyWithDetails } from "@/types";
import { use } from "react";

interface LobbyPageProps {
  params: {
    id: string;
  };
}

export default async function LobbyPage({ params }: LobbyPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const lobbyId = Number.parseInt(params.id);
  const userId = Number.parseInt(session.user.id);

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
  });

  if (!lobbyData) {
    notFound();
  }

  // Convert Prisma Decimal fields to numbers
  const lobby = {
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
  } as any;

  // Check if user is a member of this lobby
  const isMember = lobby.members.some(
    (member: any) => member.userId === userId
  );
  const isLeader = lobby.leaderId === userId;

  if (!isMember) {
    redirect("/dashboard");
  }

  // Calculate individual balances and what each person owes
  const memberBalances = lobby.members.map((member: any) => {
    const totalExpenses = lobby.transactions
      .filter((t: any) => t.type !== "deposit")
      .reduce((sum: number, transaction: any) => {
        if (transaction.type === "expense_equal") {
          return sum + transaction.totalAmount / lobby.members.length;
        } else if (transaction.type === "expense_individual") {
          const detail = transaction.details?.find(
            (d: any) => d.userId === member.userId
          );
          return sum + (detail ? detail.amount : 0);
        }
        return sum;
      }, 0);

    const balance = member.totalDeposited - totalExpenses;
    const owes = balance < 0 ? Math.abs(balance) : 0;

    return {
      ...member,
      calculatedBalance: balance,
      totalExpenses,
      owes,
    };
  });

  if (!session || !lobbyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section with Lobby Header */}
      <section className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white ">
        <div className="container mx-auto px-6 py-12 rounded-2xl">
          <LobbyHeader lobby={lobby} isLeader={isLeader} />
        </div>
      </section>

      {/* Balance Section - Full Width */}
      <section className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="container mx-auto px-6 py-8">
          <LobbyBalance lobby={lobby} memberBalances={memberBalances} />
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full py-12">
        <div className="container mx-auto px-2 md:px-6">
          {/* Mobile: Stack vertically, Desktop: Grid layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="order-2 lg:order-1 lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"></div>

                <div className="p-2 md:p-6">
                  <h2 className="font-noto text-2xl font-bold text-gray-800 mb-6">
                    Lobby Activity
                  </h2>

                  <Tabs defaultValue="transactions" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 rounded-xl">
                      <TabsTrigger
                        value="transactions"
                        className="font-quick font-medium data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-lg"
                      >
                        Transactions
                      </TabsTrigger>
                      <TabsTrigger
                        value="members"
                        className="font-quick font-medium data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-lg"
                      >
                        Members
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="transactions"
                      className="space-y-4 mt-6"
                    >
                      <TransactionHistory transactions={lobby.transactions} />
                    </TabsContent>

                    <TabsContent value="members" className="space-y-4 mt-6">
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
              </div>
            </div>

            {/* Sidebar - Shows first on mobile, last on desktop */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                <div className="p-2 md:p-6">
                  <h2 className="font-noto text-xl font-bold text-gray-800 mb-6">
                    Quick Actions
                  </h2>
                  <ExpenseActions
                    lobbyId={lobbyId}
                    isLeader={isLeader}
                    members={lobby.members}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
