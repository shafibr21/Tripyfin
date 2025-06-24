import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // make sure this points to your initialized Prisma client
import { getLobbyById } from "@/lib/db/lobby"

// POST /api/lobby → create a new lobby
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Lobby name is required" }, { status: 400 })
    }

    const lobby = await prisma.lobby.create({
      data: { name }
    })

    return NextResponse.json(lobby, { status: 201 })
  } catch (error) {
    console.error("Error creating lobby:", error)
    return NextResponse.json({ error: "Failed to create lobby" }, { status: 500 })
  }
}

// GET /api/lobby/[id] → fetch a lobby by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
