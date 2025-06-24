import { type NextRequest, NextResponse } from "next/server"
import { createLobby } from "@/lib/db/lobby"

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Lobby name is required" }, { status: 400 })
    }

    const lobby = await createLobby(name)
    return NextResponse.json(lobby)
  } catch (error) {
    console.error("Error creating lobby:", error)
    return NextResponse.json({ error: "Failed to create lobby" }, { status: 500 })
  }
}