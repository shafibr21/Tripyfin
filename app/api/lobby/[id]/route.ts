import { type NextRequest, NextResponse } from "next/server"
import { getLobbyById } from "@/lib/db/lobby"

export async function GET(
  request: NextRequest,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  const { params } = await context // 👈 This is the critical fix

  try {
    const lobby = await getLobbyById(params.id)

    if (!lobby) {
      return NextResponse.json({ error: "Lobby not found" }, { status: 404 })
    }

    return NextResponse.json(lobby)
  } catch (error) {
    console.error("Error fetching lobby:", error)
    return NextResponse.json({ error: "Failed to fetch lobby" }, { status: 500 })
  }
}
