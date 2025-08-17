import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LobbyList } from "@/components/dashboard/lobby-list";
import { CreateLobbyDialog } from "@/components/dashboard/create-lobby-dialog";
import type { LobbyWithMembers } from "@/types";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const userId = Number.parseInt(session.user.id);

  // Get user's lobbies (both as leader and member)
  const lobbiesData = await prisma.lobby.findMany({
    where: {
      OR: [{ leaderId: userId }, { members: { some: { userId } } }],
    },
    include: {
      leader: true,
      members: {
        include: {
          user: true,
        },
      },
      _count: {
        select: { members: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Convert Prisma Decimal fields to numbers
  const lobbies = lobbiesData.map((lobby) => ({
    ...lobby,
    totalBalance: Number(lobby.totalBalance),
    initialDeposit: Number(lobby.initialDeposit),
    members: lobby.members.map((member) => ({
      ...member,
      individualBalance: Number(member.individualBalance),
      totalDeposited: Number(member.totalDeposited),
    })),
  })) as any[];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Width */}
      <section className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl">
            <h1 className="font-noto text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome Back,{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {session.user.name?.split(" ")[0] || "Traveler"}
              </span>
            </h1>
            <p className="font-quick text-xl md:text-2xl font-light opacity-90 mb-8 max-w-2xl">
              Manage your travel finances effortlessly. Track expenses, split
              costs, and keep everyone in sync during your adventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CreateLobbyDialog />
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-1 border border-white/20">
                <span className="font-quick text-sm opacity-75">
                  Total Active Lobbies
                </span>
                <span className="font-noto text-xl font-bold">
                  {" "}
                  {lobbies.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Full Width */}
      <section className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="font-noto text-4xl font-bold mb-2">
                $
                {lobbies
                  .reduce((sum, lobby) => sum + lobby.totalBalance, 0)
                  .toLocaleString()}
              </div>
              <div className="font-quick text-lg opacity-90">Total Managed</div>
            </div>
            <div className="text-center">
              <div className="font-noto text-4xl font-bold mb-2">
                {lobbies.filter((lobby) => lobby.leaderId === userId).length}
              </div>
              <div className="font-quick text-lg opacity-90">Lobbies Led</div>
            </div>
            <div className="text-center">
              <div className="font-noto text-4xl font-bold mb-2">
                {lobbies.reduce((sum, lobby) => sum + lobby._count.members, 0)}
              </div>
              <div className="font-quick text-lg opacity-90">Total Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="font-noto text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Your Travel Lobbies
            </h2>
            <p className="font-quick text-lg text-gray-600 max-w-2xl mx-auto">
              Keep track of all your group expenses and make sure everyone stays
              on the same page throughout your journey.
            </p>
          </div>

          {lobbies.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-orange-400 to-pink-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="font-noto text-3xl font-bold text-gray-800 mb-4">
                Ready for Your First Adventure?
              </h3>
              <p className="font-quick text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Create your first lobby to start managing expenses with your
                travel companions.
              </p>
              <CreateLobbyDialog />
            </div>
          ) : (
            <LobbyList lobbies={lobbies} currentUserId={userId} />
          )}
        </div>
      </section>
    </div>
  );
}
