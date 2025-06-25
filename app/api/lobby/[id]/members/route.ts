import { type NextRequest, NextResponse } from "next/server"
import { addMemberToLobby } from "@/lib/db/lobby"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { name, isLeader } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Member name is required" }, { status: 400 })
    }

    const member = await addMemberToLobby(id, name, isLeader || false)
    return NextResponse.json(member)
  } catch (error) {
    console.error("Error adding member:", error)
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 })
  }
}
