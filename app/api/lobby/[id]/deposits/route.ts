import { type NextRequest, NextResponse } from "next/server"
import { createDeposit, createInitialDepositsForAllMembers } from "@/lib/db/deposit"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { type, amount, memberId, memberIds, description } = await request.json()

    if (!type || !amount || typeof amount !== "number") {
      return NextResponse.json({ error: "Type and amount are required" }, { status: 400 })
    }

    if (type === "INITIAL" && memberIds && Array.isArray(memberIds)) {
      // Create initial deposits for all members
      const deposits = await createInitialDepositsForAllMembers(id, memberIds, amount)
      return NextResponse.json(deposits)
    } else if (memberId) {
      // Create individual deposit
      const deposit = await createDeposit(id, memberId, amount, type, description)
      return NextResponse.json(deposit)
    } else {
      return NextResponse.json({ error: "Member ID is required for individual deposits" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error creating deposit:", error)
    return NextResponse.json({ error: "Failed to create deposit" }, { status: 500 })
  }
}
