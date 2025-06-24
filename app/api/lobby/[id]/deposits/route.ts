import { NextRequest, NextResponse } from "next/server"
import { createDeposit, createInitialDepositsForAllMembers } from "@/lib/db/deposit"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { type, amount, memberId, memberIds, description } = await request.json()

    if (!type || !amount || typeof amount !== "number") {
      return NextResponse.json({ error: "Type and amount are required" }, { status: 400 })
    }

    if (type === "INITIAL" && memberIds && Array.isArray(memberIds)) {
      const deposits = await createInitialDepositsForAllMembers(params.id, memberIds, amount)
      return NextResponse.json(deposits)
    } else if (memberId) {
      const deposit = await createDeposit(params.id, memberId, amount, type, description)
      return NextResponse.json(deposit)
    } else {
      return NextResponse.json({ error: "Member ID is required for individual deposits" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error creating deposit:", error)
    return NextResponse.json({ error: "Failed to create deposit" }, { status: 500 })
  }
}
