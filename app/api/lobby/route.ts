import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createLobby, getUserLobbies } from "@/lib/db/lobby"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Lobby name is required" }, { status: 400 })
    }

    const lobby = await createLobby(name, session.user.id)
    return NextResponse.json(lobby)
  } catch (error) {
    console.error("Error creating lobby:", error)
    return NextResponse.json({ error: "Failed to create lobby" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lobbies = await getUserLobbies(session.user.id)
    return NextResponse.json(lobbies)
  } catch (error) {
    console.error("Error fetching lobbies:", error)
    return NextResponse.json({ error: "Failed to fetch lobbies" }, { status: 500 })
  }
}
