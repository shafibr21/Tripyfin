import { type NextRequest, NextResponse } from "next/server"
import { getLobbyById } from "@/lib/db/lobby"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const lobby = await getLobbyById(id)

    if (!lobby) {
      return NextResponse.json({ error: "Lobby not found" }, { status: 404 })
    }

    return NextResponse.json(lobby)
  } catch (error) {
    console.error("Error fetching lobby:", error)
    return NextResponse.json({ error: "Failed to fetch lobby" }, { status: 500 })
  }
}
